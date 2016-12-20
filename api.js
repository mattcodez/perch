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

    this.app.get('/current_HVAC', (req, res) => res.json({
      currentTempRead: this.HVAC.currentTempRead,
      tempTarget:      this.HVAC.tempTarget
    }));

    this.app.post('/current_HVAC/tempTarget?set=:set', (req, res) => {
      req.params['set']
      try {
        HVAC.set_tempTarget()
      }
    });
  }

  startServer(){
    this.app.listen(this.PORT, () => {
      console.log(`Perch API server listening on port ${this.PORT}`);
    });
  }
};
