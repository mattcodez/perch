'use strict';
const DEBUG_MODE = true; //TODO: default to false and set through cmd/env

//NPM modules
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

//Custom modules
const config = require('./config.js');
const SYS_relay = require('./relay.js');
const API = require('./api.js');

//HVAC_method: for controlling relays on individual modes
class HVAC_method {
  constructor(SYS_relay, channel, name){
    if (!SYS_relay) throw 'relay must be sent to constructor';

    this._channel = channel;
    this.name = name;

    this._on = false;
    this._addr = 0;
  }

  get on(){
    return this._on;
  }

  set on(v){
    this._on = !!v;
  }

  turnOn(){
    this._on = true;
  }

  turnOff(){
    this._on = false;
  }

  relayOn(){
    SYS_relay.setChannel(this._addr, this.channel, 1);
  }

  relayOff(){
    SYS_relay.setChannel(this._addr, this.channel, 0);
  }
}

const HVAC = {
  heat:            new HVAC_method(SYS_relay, 0, 'heat'),
  cool:            new HVAC_method(SYS_relay, 1, 'cool'),
  active_mode:     'heat',
  _tempTarget:     null,
  currentTempRead: null,

  set_tempTarget(v){
    this._tempTarget = v;
  },
  get tempTarget(){
    return this._tempTarget;
  }
};
HVAC.set_tempTarget(21);

const web_api = new API({HVAC});

//TODO: need safety check in case this script keeps rebooting
//maybe force a two minute wait on boot, or, track on/off in file or
//simple database and if there are multiple on's in the last few minutes,
//just disable and alert user.

//TODO: everything below could probably go in HVAC at some point

function getAndSetTemperature(){
  fs.readFileAsync(config.thermometerFilePath, 'utf8').then(content => {
    HVAC.currentTempRead = content.substr(content.lastIndexOf('t=') + 2) / 1000;
    DEBUG_MODE && console.log(`currentTempRead set to ${HVAC.currentTempRead}`);
  }).catch(err => {
    console.error("Error reading thermometer file path");
    DEBUG_MODE && console.error(err);
    clearInterval(tempFileReadInterval);
  });
}
//Continuously poll
const tempFileReadInterval = setInterval(getAndSetTemperature, config.filePollRate);

const THERMAL_THRESHOLD = (config.cycleTempChange / 2);
//monitorTempForAction gets run intervally with no assumptions, everything
//must be checked by it or a sub function
function monitorTempForAction(){
  if (HVAC.active_mode === 'heat'){
    /*We divide cycleTempChange by 2 because we let the temp fall half that from
    the target and then raise it fully so that we're half above the target*/
    const currentTempDiff = HVAC.currentTempRead - HVAC.tempTarget;
    //currentTempDiff is positive the room is warmer than the target
    if (currentTempDiff > THERMAL_THRESHOLD){
      //if we're warmer by the threshold, time to turn off
      if (HVAC.heat.on){
        HVAC.heat.turnOff();
      }
      else {
        //room is warmer than the target but system is off, maybe spring is here
      }
    }

    if (currentTempDiff < -THERMAL_THRESHOLD){
      if (HVAC.heat.off){
        HVAC.heat.turnOn();
      }
    }
  }
}
const monitorTempInterval = setInterval(monitorTempForAction, config.filePollRate);
