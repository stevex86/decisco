"use strict";
!function (e, t, s) {
  new class {
    constructor(e, t, s) {
      const o = new Cache;
      this._utils = e, this._onBeforeRequest = this._onBeforeRequest.bind(this), this._onBeforeSendHeaders = this._onBeforeSendHeaders.bind(this), this._parseResponse = this._parseResponse.bind(this), this._prepareResponse = this._prepareResponse.bind(this), this._validateUrl = this._validateUrl.bind(this), this._isLocalhostDebug = this._isLocalhostDebug.bind(this), this._isLocalhost = this._isLocalhost.bind(this), this._handleBlockpageResponse = this._handleBlockpageResponse.bind(this), this._handleDebugPageResponse = this._handleDebugPageResponse.bind(this), this._resolve = this._resolve.bind(this), this._start = this._start.bind(this), this._stop = this._stop.bind(this), this._config = s, s.deviceSerialNumber.then(e => {
        this.serialNo = e;
      }), this._getData = e => this._prepareResponse(this._parseResponse(this._resolve(e.domainName)), e.url), this._getData = this._getData.bind(this), this._cache = o.get(this._getData), this._evictCache = o.evictCache, this.appId = t.ids[chrome.runtime.id], chrome.runtime.getPlatformInfo(e => {
        "cros" === e.os ? (this.init(), this.start_google_analytics("UA-129271400-1")) : this._updateExtensionIcon(false, () => Logger.info(`Umbrella Chromebook client is not supported for '${e.os}'. DNS protection shall be disabled.`));
      });
    }
    init() {
      Logger.info("Waiting to start the extension."), chrome.alarms.onAlarm.addListener(e => {
        "evictCache" === e.name && this._evictCache();
      }), window.addEventListener("online", e => {
        Logger.info("Connected to internet once again."), this._start(), this._updateExtensionIcon(true);
      }), window.addEventListener("offline", e => {
        Logger.info("Lost internet connection."), this._stop(), this._updateExtensionIcon(false);
      }), this.appId ? chrome.runtime.sendMessage(this.appId, {enabled: true}) : Logger.info("App id is undefined"), chrome.alarms.create("evictCache", {delayInMinutes: 60, periodInMinutes: 60}), chrome.runtime.onMessageExternal.addListener((e, t, s) => {
        t.id === this.appId ? e && e.askSerialNo ? (Logger.info("Responding to app serialNo " + this.serialNo), s({success: true, serialNo: this.serialNo})) : ((e.start && this._start || this._stop)(), this._updateExtensionIcon(e.start), s({success: true}, () => Logger.info(`Extension started: ${e.start}`))) : Logger.info("Message sender is unknown. Ignoring the message.");
      });
    }
    start_google_analytics(e) {
      var t, s, o, n, i, r;
      t = window, s = document, o = "script", n = "ga", t.GoogleAnalyticsObject = n, t.ga = t.ga || function () {
        (t.ga.q = t.ga.q || []).push(arguments);
      }, t.ga.l = 1 * new Date, i = s.createElement(o), r = s.getElementsByTagName(o)[0], i.async = 1, i.src = "https://www.google-analytics.com/analytics.js", r.parentNode.insertBefore(i, r), ga("create", e, "auto"), ga("set", "checkProtocolTask", function () {}), ga("require", "displayfeatures"), ga("send", "event", {eventCategory: "Extension Initiation"});
    }
    _start() {
      this._stop(), chrome.webRequest.onBeforeRequest.addListener(this._onBeforeRequest, {urls: ["<all_urls>"]}, ["blocking"]);
    }
    _stop() {
      chrome.webRequest.onBeforeRequest.removeListener(this._onBeforeRequest);
    }
    _updateExtensionIcon(e) {
      this.browserActionIcon = e ? "images/ucc-19.png" : "images/ucc-19-bw.png";
    }
    set browserActionIcon (e) {
      chrome.browserAction.setIcon({path: {19: e}});
    }
    _prepareResponse(e, t) {
      return (e.debug ? this._handleDebugPageResponse : this._handleBlockpageResponse)(e, t);
    }
    _handleBlockpageResponse(e, t) {
      const s = e.resolvedIPs;
      if (Logger.info(`Resolved ${e.resolvedIPs}`), !s || 0 === s.length) throw new Error("Unsuccessful resolution");
      const o = s ? {"146.112.61.107": "malware", "146.112.61.108": "phish", "146.112.61.104": "block", "146.112.61.105": "block", "146.112.61.106": "block", "146.112.61.109": "block", "146.112.61.110": "block", "204.194.237.164": "block", "107.23.255.195": "block"}[s[0]] : null;
      return {redirect: Boolean(o), redirectUrl: chrome.runtime.getURL(`blocked.html?url=${t}&type=${o}`)};
    }
    _handleDebugPageResponse(e) {
      const {os: t, osVersion: s, status: o, userEmail: n, localIP: i, policyUrl: r, error: a} = e;
      Logger.info(`Debug info received: os=${t} osVersion=${s} status=${o} userEmail=${n} localIP=${i} policyUrl=${r}`);
      let l = null;
      return l = a ? `debug.html?error=${encodeURIComponent(e.error)}` : `debug.html?os=${t}&osVersion=${s}&status=${o}&userEmail=${n}&localIP=${i}&policyUrl=${encodeURIComponent(r)}`, {redirect: true, redirectUrl: chrome.runtime.getURL(l)};
    }
    _parseResponse(e) {
      if (!e) throw new Error("App response should not be null");
      return JSON.parse(e);
    }
    _resolve(e) {
      try {
        if (e) {
          const t = "http://localhost:8029/" + ("debug" === e ? e : ""), s = new XMLHttpRequest;
          return s.open("get", t, false), "debug" !== e && s.setRequestHeader("Domain-Name", e), s.send(), s.responseText;
        }
      } catch (t) {
        Logger.error(`Failed to resolve ${e}. Please check if UCC App is installed and that it is enabled.`), Logger.error(`${t.stack}`);
      }
      return null;
    }
    _onBeforeSendHeaders(e) {
      let t = e.requestHeaders, s = this._utils.getDomainName(e.url);
      if ("localhost:8029" === s) return {requestHeaders: t};
      if (/((block|phish|malware)\.opendns\.com)(.*)/.exec(e.url)) {
        const e = "http://localhost:8029/", o = new XMLHttpRequest;
        o.open("get", e, false), o.setRequestHeader("Cookie-Name", s), o.send();
        let n = o.responseText;
        if (n) {
          let e = (n = JSON.parse(n))[s];
          if (e) {
            let o = t.find(e => "Cookie" === e.name);
            o ? o.value = e : t.push({name: "Cookie", value: e, url: s});
          }
          t.push({name: "Referer", value: s});
        }
      }
      return {requestHeaders: t};
    }
    _isLocalhostDebug(e) {
      const t = /http:\/\/localhost:8029\/debug$/.exec(e);
      return t && t.length >= 1;
    }
    _isLocalhost(e) {
      const t = /[s]?:\/\/localhost:8029.*$/.exec(e);
      return t && t.length >= 1;
    }
    _validateUrl(e) {
      const t = this._isLocalhostDebug(e), s = this._isLocalhost(e);
      if (!t && s) return Logger.info(`Access to the '${e}' is denied.`), {cancel: true};
      const o = t ? "debug" : this._utils.getDomainName(e);
      if (o) {
        Logger.time(`Resolved ${o} in`);
        let t = this._cache({domainName: o, url: e});
        return Logger.timeEnd(`Resolved ${o} in`), t;
      }
      return {cancel: false};
    }
    _onBeforeRequest(e) {
      const {url: t} = e, {redirect: s, redirectUrl: o, cancel: n} = this._validateUrl(t);
      return s ? (Logger.info(`Redirecting '${t}' to '${o}'`), {redirectUrl: o}) : {cancel: Boolean(n)};
    }
  }(e, t, s);
}(new Utils, new IdInfo, new Config);
