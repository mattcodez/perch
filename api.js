'use strict';
const express = require('express');

module.exports = class API {
  constructor({HVAC}){
    this.HVAC = HVAC;
    this.PORT = 3000;
    this.app = express();
    this.setRoutes();
    this.startServer();
  }

  setRoutes(){
    this.app.get('/', function (req, res) {
      res.send('Hello World!')
    });

    this.app.get('/current_HVAC', (req, res) => res.json(this._HVACInfo()));

    this.app.post('/current_HVAC/tempTarget?set=:set', (req, res) => {
      //Force number for setting
      const tempNumber = ~~req.params.set;
      if (tempNumber != req.params.set){
        return res.send(400, 'Set value must be a number');
      }
      try {
        this.HVAC.set_tempTarget(tempNumber);
        res.send(this._HVACInfo());
      }
      catch(err){
        return res.send(500, 'Error setting tempTaret');
      }
    });
  }

  _HVACInfo(){
    const {currentTempRead, tempTarget} = this.HVAC;
    return {currentTempRead, tempTarget};
  }

  startServer(){
    this.app.listen(this.PORT, () => {
      console.log(`Perch API server listening on port ${this.PORT}`);
    });
  }
};
