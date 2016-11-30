'use strict';
const DEBUG_MODE = true; //TODO: default to false and set through cmd/env

//NPM modules
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

//Custom modules
const config = require('./config.js');
const relay = require('./relay.js');

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
const HVACRelayMap = object.freeze({
  heat: 0,
  cool: 1
});

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
