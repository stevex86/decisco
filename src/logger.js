"use strict";
let enableLogging = false;
chrome.storage.sync.get("logsEnabled", e => {
  enableLogging = e && e.logsEnabled, console.info(`Logging enabled: ${enableLogging}`);
});
const enableLogs = e => {
  enableLogging = e, chrome.storage.sync.set({logsEnabled: e}, () => {
    console.info(`Logging enabled: ${enableLogging}`);
  });
}, Logger = {warn: e => {
  enableLogging && console.warn(`${new Date}: ${e}`);
}, error: e => {
  enableLogging && console.error(`${new Date}: ${e}`);
}, info: e => {
  enableLogging && console.info(`${new Date}: ${e}`);
}, time: e => {
  enableLogging && console.time(e);
}, timeEnd: e => {
  enableLogging && console.timeEnd(e);
}, trace: e => {
  enableLogging && console.trace(e);
}};
