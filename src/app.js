'use strict';

const express = require('express');
const app = express();

const logger = require('./logger');

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

module.exports = (db) => {
  app.get('/health', (req, res) => res.send('Healthy'));

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

    const result = db.run('INSERT INTO Rides(startLat, startLong,' +
        'endLat, endLong, riderName, driverName, driverVehicle) VALUES' +
        '(?, ?, ?, ?, ?, ?, ?)', values, function(err) {
      if (err) {
        logger.error(err);
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      db.all('SELECT * FROM Rides WHERE' +
          'rideID = ?', result.id, function(err, rows) {
        if (err) {
          logger.error(err);
          return res.send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        res.send(rows);
      });
    });
  });

  app.get('/rides', (req, res) => {
    logger.info('[GET] /rides is hit');
    db.all('SELECT * FROM Rides', function(err, rows) {
      if (err) {
        logger.error(err);
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        logger.error('Rides not found');
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  app.get('/rides/:id', (req, res) => {
    logger.info('[GET] /rides/:id is hit');
    db.all(`SELECT * FROM Rides
    WHERE rideID='${req.params.id}'`, function(err, rows) {
      if (err) {
        logger.error(err);
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (rows.length === 0) {
        logger.error('Rides not found');
        return res.send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      res.send(rows);
    });
  });

  return app;
};
