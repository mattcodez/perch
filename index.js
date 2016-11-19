'use strict';
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));

const DEBUG_MODE = true; //TODO: default to false and set through cmd/env

//consider this unchangeable during program run
//TODO import from it's own file
const config = Object.freeze({
  cycleTempChange:       1,   //degrees(C) - How much do we change the termperature
                              //before turning off. Always uses celsius
                              //otherwise changing userUnits would affect
                              //opperation time

  cycleMinIntervalDiff:  9,   //minutes - How long do we wait at minimum before
                              //turning on again

  cycleMaxRun:           60,  //minutes - Largish number, failsafe for turning
                              //off the system assuming something has gone
                              //wrong if it has run this long.
                              //NOTE: code such that program needs to be reset
                              //if this threshold and failsafe occurs

  userUnits:             'F', //'F' or 'C', units the user will see/set with

  thermometerFilePath:   '/sys/devices/w1_bus_master1/28-002720120204',
                              //file path string - location of device file
                              //for reading the temperature

  filePollRate:           1000,
                              //time(ms) - How often should we check
                              //thermometerFilePath for the temperature
});

let currentTempRead;  //Global to hold the current termperature read from
                      //the device file

function async getAndSetTemperature(){
  try{
    const content = await fs.readFile(config.thermometerFilePath);
    currentTempRead = content.substr(content.lastIndexOf('t=') + 2) / 1000;
    DEBUG_MODE && console.log(`currentTempRead set to ${currentTempRead}`);
  }
  catch(e){
    //TODO:stop everything
    console.error(e);
  }
}
//Continuously poll
const readInterval = setInterval(getAndSetTemperature, config.filePollRate);
