"use strict;";
class Config {
  get deviceSerialNumber() {
    return new Promise(e => {
      chrome.enterprise.deviceAttributes.getDeviceSerialNumber(r => {
        Logger.info("Device Serial Number to be used : " + r), e(r);
      });
    });
  }
}
