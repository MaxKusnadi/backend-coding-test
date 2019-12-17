'use strict';

const models = require('../models');
const logger = require('./logger');
const constant = require('../constants');

const createTable = (db, tableName, tableContent) => {
  db.run(constant.DB_SCRIPTS.createTable(tableName, tableContent));
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

const runDBRunAsync = (db, values, script) => {
  return new Promise((resolve, reject) => {
    db.run(script, values, function(err) {
      if (err) {
        reject(err);
      }
      // eslint-disable-next-line no-invalid-this
      resolve(this.lastID);
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
    return await runDBAllAsync(db, constant.DB_SCRIPTS.getAllRides());
  };

  const getRideById = async (id) => {
    logger.info(`Getting a ride by id: ${id}`);
    return await runDBAllAsync(db, constant.DB_SCRIPTS.getRideById(id));
  };
  const createNewRide = async (values) => {
    logger.info('Creating a new ride');
    return await runDBRunAsync(db, values, constant.DB_SCRIPTS.createRide());
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
