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
    const currentTempDiff = currentTempRead - tempTarget;
    //config.cycleTempChange;
  }
}
const monitorTempInterval = setInterval(monitorTempForAction, config.filePollRate);
