'use strict';

const express = require('express');
const app = express();

const databaseWrapper = require('./utils/databaseWrapper');
const logger = require('./utils/logger');
const healthController = require('./components/health');
const rideController = require('./components/rides');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (db) => {
  const rides = rideController(db);
  const riderDb = databaseWrapper.rides(db);

  app.get('/health', (req, res) => {
    logger.info('[GET] /health is hit');
    return healthController.get(req, res);
  });

  app.post('/rides', jsonParser, (req, res) => {
    logger.info('[POST] /rides is hit');
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (startLatitude < -90 || startLatitude > 90 ||
        startLongitude < -180 || startLongitude > 180) {
      logger.error('Validation error');
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 ' +
            'and -180 to 180 degrees respectively',
      });
    }

    if (endLatitude < -90 || endLatitude > 90 ||
        endLongitude < -180 || endLongitude > 180) {
      logger.error('Validation error');
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 ' +
            'and -180 to 180 degrees respectively',
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      logger.error('Validation error');
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      logger.error('Validation error');
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      logger.error('Validation error');
      return res.send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [req.body.start_lat, req.body.start_long,
      req.body.end_lat, req.body.end_long, req.body.rider_name,
      req.body.driver_name, req.body.driver_vehicle];

    return res.send(riderDb.createNewRide(values));
  });

  app.get('/rides', (req, res) => {
    logger.info('[GET] /rides is hit');
    return rides.getAllRides(req, res);
  });

  app.get('/rides/:id', (req, res) => {
    logger.info('[GET] /rides/:id is hit');
    return rides.getRideById(req, res);
  });

  return app;
};
