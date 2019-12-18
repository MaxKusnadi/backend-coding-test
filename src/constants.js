'use strict';

const DB_SCRIPTS = {
  createTable: (tableName, tableContent) => `CREATE TABLE ${tableName}`+
        `(${tableContent})`,
  getAllRides: () => 'SELECT * FROM Rides',
  getRideById: (id) => `SELECT * FROM Rides WHERE rideID='${id}'`,
  createRide: () => 'INSERT INTO Rides(startLat, startLong,' +
        'endLat, endLong, riderName, driverName, driverVehicle) VALUES' +
        '(?, ?, ?, ?, ?, ?, ?)',
};

module.exports = {
  DB_SCRIPTS,
};
