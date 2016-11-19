'use strict';

//consider this unchangeable during program run
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

  filePollRate:           10000,
                              //time(ms) - How often should we check
                              //thermometerFilePath for the temperature
});

let currentTempRead;  //Global to hold the current termperature read from
                      //the device file

function getAndSetTemperature(){
  fs.readFile(config.thermometerFilePath)
}
//Continuously poll
const readInterval = setInterval(getAndSetTemperature, config.filePollRate);
