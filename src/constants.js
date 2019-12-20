'use strict';

/**
 * Possible error given by the app
 * @type {{SERVER_ERROR: string, NOT_FOUND: string, VALIDATION_ERROR: string}}
 */
const ERROR_CODE = {
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  NOT_FOUND: 'RESOURCE_NOT_FOUND',
};

/**
 * Possible HTTP code responses given by the app
 *
 * @type {{CREATED: number, SERVER_ERROR: number,
 * SUCCESSFUL: number, NOT_FOUND: number, VALIDATION_ERROR: number}}
 */
const HTTP_CODE = {
  VALIDATION_ERROR: 400,
  SERVER_ERROR: 500,
  NOT_FOUND: 404,
  SUCCESSFUL: 200,
  CREATED: 201,
};

/**
 * Collection of various DB scripts used in the app
 *
 * @type {{createTable: (function(*, *): string),
 * getRideById: (function(*): string), getAllRides: (function(): string),
 * createRide: (function(): string)}}
 */
const DB_SCRIPTS = {
  createTable: (tableName, tableContent) => `CREATE TABLE ${tableName}`+
        `(${tableContent})`,
  getAllRides: () => 'SELECT * FROM Rides',
  getRideById: () => 'SELECT * FROM Rides WHERE rideID=?',
  createRide: () => 'INSERT INTO Rides(startLat, startLong,' +
        'endLat, endLong, riderName, driverName, driverVehicle) VALUES' +
        '(?, ?, ?, ?, ?, ?, ?)',
};

module.exports = {
  DB_SCRIPTS,
  HTTP_CODE,
  ERROR_CODE,
};
