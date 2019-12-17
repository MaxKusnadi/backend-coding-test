'use strict';

const models = require('../models');
const logger = require('./logger');
const errorGenerator = require('./errorGenerator');

const createTable = (db, tableName, tableContent) => {
  db.run(`CREATE TABLE ${tableName} (${tableContent})`);
};

const runDBAllAsync = (db, script) => {
  return new Promise((resolve, reject) => {
    db.all(script, (err, rows) => {
      if (err) {
        reject(err);
      }
      resolve(rows);
    });
  });
};

const buildSchemas = (db) => {
  logger.info('Creating database schemas');
  Object.keys(models).map((tableName) =>{
    logger.info(`Creating ${tableName} tables`);
    createTable(db, tableName, models[tableName]);
  });
  return db;
};

const rides = (db) => {
  const getAllRides = async () => {
    logger.info('Getting all rides');
    const resp = await runDBAllAsync(db, 'SELECT * FROM Rides');
    return resp;
  };
  const getRideById = (id) => {
    logger.info(`Getting a ride by id: ${id}`);
    db.all(`SELECT * FROM Rides
    WHERE rideID='${id}'`, function(err, rows) {
      if (err) {
        throw err;
      }
      logger.info('Fetching ride by ID successful');
      return rows;
    });
  };
  const createNewRide = (values) => {
    logger.info('Creating a new ride');
    db.run('INSERT INTO Rides(startLat, startLong,' +
        'endLat, endLong, riderName, driverName, driverVehicle) VALUES' +
        '(?, ?, ?, ?, ?, ?, ?)', values, function(err) {
      if (err) {
        logger.error(err);
        return errorGenerator.returnServerErrorResponse();
      }
      logger.info('Creation successful');
      // eslint-disable-next-line no-invalid-this
      return getRideById(this.lastID);
    });
  };
  return {
    createNewRide,
    getAllRides,
    getRideById,
  };
};

module.exports = {
  buildSchemas,
  rides,
};
