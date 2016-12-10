'use strict';
const DEBUG_MODE = true; //TODO: default to false and set through cmd/env

//NPM modules
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

//Custom modules
const config = require('./config.js');
const SYS_relay = require('./relay.js');

class HVAC_method {
  constructor(SYS_relay, channel, name){
    super();

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

const HVAC = object.freeze({
  heat: new HVAC_method(SYS_relay, 0, 'heat'),
  cool: new HVAC_method(SYS_relay, 1, 'cool')
});



//TODO: need safety check in case this script keeps rebooting
//maybe force a two minute wait on boot, or, track on/off in file or
//simple database and if there are multiple on's in the last few minutes,
//just disable and alert user.

let currentTempRead;  //Global to hold the current termperature read from
                      //the device file

function getAndSetTemperature(){
  fs.readFileAsync(config.thermometerFilePath, 'utf8').then(content => {
    currentTempRead = content.substr(content.lastIndexOf('t=') + 2) / 1000;
    DEBUG_MODE && console.log(`currentTempRead set to ${currentTempRead}`);
  }).catch(err => {
    console.error("Error reading thermometer file path");
    DEBUG_MODE && console.error(err);
    clearInterval(tempFileReadInterval);
  });
}
//Continuously poll
const tempFileReadInterval = setInterval(getAndSetTemperature, config.filePollRate);

let tempTarget = 21;
let HVACMode = 'heat';

function monitorTempForAction(){
  if (HVACMode === 'heat'){
    /*We divide cycleTempChange by 2 because we let the temp fall half that from
    the target and then raise it fully so that we're half above the target*/
    const currentTempDiff = currentTempRead - tempTarget;
    if (currentTempDiff > (config.cycleTempChange / 2)){
      if (heatIsOn()){

      }
    }
  }
}
const monitorTempInterval = setInterval(monitorTempForAction, config.filePollRate);

/*Was thinking about storing system status in a variable but there's always a
chance it could get out of sync, instead, just check the array directly*/
//class or object?
