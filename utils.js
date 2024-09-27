"use strict";
class Utils {
  constructor() {
    this.getDomainName = this.getDomainName.bind(this);
  }
  getDomainName(t) {
    let e = /^http(s)?:\/\/([^/:]+)/i.exec(t);
    return e && e.length >= 3 ? e[2] : null;
  }
}
