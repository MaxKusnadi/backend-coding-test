'use strict';

const ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'RESOURCE_NOT_FOUND',
};

const HTTP_CODE = {
  VALIDATION_ERROR: 400,
  SERVER_ERROR: 500,
  NOT_FOUND: 404,
  SUCCESSFUL: 200,
};

const DB_SCRIPTS = {
  CREATE_TABLE: (tableName, tableContent) => `CREATE TABLE ${tableName}`+
      `(${tableContent})`,
  GET_ALL_RIDES: () => 'SELECT * FROM Rides',
  GET_RIDE_BY_ID: (id) => `SELECT * FROM Rides WHERE rideID='${id}'`,
  CREATE_RIDE: () => 'INSERT INTO Rides(startLat, startLong,' +
      'endLat, endLong, riderName, driverName, driverVehicle) VALUES' +
      '(?, ?, ?, ?, ?, ?, ?)',
};

module.exports = {
  ERROR_CODE,
  HTTP_CODE,
  DB_SCRIPTS,
};
