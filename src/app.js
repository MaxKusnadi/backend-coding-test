'use strict';

const bodyParser = require('body-parser');
const express = require('express');
const healthComponent = require('./components/health');
const ridesController = require('./components/rides');

module.exports = (db) => {
  const app = express();
  const ridesComponent = ridesController(db);

  app.get('/health', healthComponent.get);
  app.get('/rides', ridesComponent.getRides);
  app.get('/rides/:id', ridesComponent.getRideById);
  app.post('/rides', bodyParser.json(), ridesComponent.postRides);

  return app;
};
