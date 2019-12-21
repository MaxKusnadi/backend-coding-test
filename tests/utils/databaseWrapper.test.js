'use strict';

const shortid = require('shortid');
const assert = require('chai').assert;
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const databaseWrapper = require('../../src/utils/databaseWrapper');
const models = require('../../src/models');

/**
 * Testing declarative promise-ful db functions
 */
describe('databaseWrapper test', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }
      databaseWrapper.buildSchemas(db);
    });
    // Checking if schema created\
    const dbScript = (tableName) => `SELECT name FROM sqlite_master
    WHERE name='${tableName}'`;
    Object.keys(models).map((tableName) =>{
      db.all(dbScript(tableName), (err, rows) => {
        assert.isNull(err);
        assert.isNotEmpty(rows);
      });
    });
    done();
  });

  it('should create a new ride', async () => {
    const ridesWrapper = databaseWrapper.rides(db);
    const values = [100, 70, 110, 75, 'Max', 'John', 'Car'];
    const rideId = await ridesWrapper.createNewRide(values);
    assert.isNumber(rideId);
  });

  it('should get ride by id', async () => {
    const ridesWrapper = databaseWrapper.rides(db);
    const rideId = shortid.generate();
    const values = [100, 70, 110, 75, 'Max', 'John', 'Car', rideId];
    const rowId = await ridesWrapper.createNewRide(values);
    assert.isNumber(rowId);
    const rides = await ridesWrapper.getRideByRowId(rowId);
    assert.isNotEmpty(rides);

    const rideRows = await ridesWrapper.getRideById(rides[0].rideID);
    assert.lengthOf(rideRows, 1);
    assert.strictEqual(rideRows[0].rideID, rideId);
  });

  it('should get all rides', async () => {
    const ridesWrapper = databaseWrapper.rides(db);
    const values = [100, 70, 110, 75, 'Max', 'John', 'Car'];
    const rideId = await ridesWrapper.createNewRide(values);
    assert.isNumber(rideId);

    const rideRows = await ridesWrapper.getAllRides();
    assert.isAtLeast(rideRows.length, 1);
  });
});


