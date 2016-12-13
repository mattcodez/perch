'use strict';
const express = require('express');

module.exports = class API {
  constructor({HVAC}){
    super();
    this.HVAC = HVAC;
    this.PORT = 3000;
    this.setRoutes();
    this.startServer();
  }

  init(){
    this.app = this.express();
  }

  setRoutes(){
    app.get('/', function (req, res) {
      res.send('Hello World!')
    });

    app.get('/current_HVAC', (req, res) => res.json({}));  
  }

  startServer(){
    app.listen(this.PORT, function () {
      console.log(`Perch API server listening on port ${this.PORT}`);
    });
  }
};
