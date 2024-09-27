"use strict";
class Cache {
  constructor() {
    let e = new Map;
    this.get = t => s => {
      const o = s.domainName;
      let r = e.has(o) && e.get(o);
      if (r && Date.now() - r.timestamp <= 3e5) Logger.info(`Cache hit for ${o}`); else {
        Logger.info(`Cache missed for ${o}`);
        try {
          const i = t(s);
          r = {response: i, timestamp: Date.now()}, i && e.size < 2500 && "debug" !== o && e.set(o, r);
        } catch (e) {
          return Logger.error(`UCC fail open for ${o} due to ${e.message}`), {cancel: false};
        }
      }
      return r.response;
    }, this.evictCache = () => {
      const t = e.size;
      for (let [t, s] of e) Date.now() - s.timestamp > 3e5 && e.delete(t);
      Logger.info(`Evicted ${t - e.size} expired cache entries.`);
    };
  }
}
