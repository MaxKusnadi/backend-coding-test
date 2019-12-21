'use strict';

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');
const assert = require('chai').assert;

const ridesController = require('../../src/components/rides');
const constant = require('../../src/constants');
const buildSchemas = require('../../src/utils/databaseWrapper').buildSchemas;
const mockRequest = require('../helpers/mockRequestResponse').mockRequest;
const mockResponse = require('../helpers/mockRequestResponse').mockResponse;

const insertRides = async () => {
  const body = {
    'start_long': 115,
    'start_lat': 70,
    'end_long': 110,
    'end_lat': 75,
    'rider_name': 'Max',
    'driver_name': 'John',
    'driver_vehicle': 'Car',
  };
  const req = mockRequest(body, null, null);
  const res = mockResponse();
  const ridesComponent = ridesController(db);
  return await ridesComponent.postRides(req, res);
};

describe('ridesController test', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }
      buildSchemas(db);
      done();
    });
  });

  describe('test getRides', () => {
    it('should return resource not found', async () => {
      const req = mockRequest(null, {}, null);
      const res = mockResponse();
      const ridesComponent = ridesController(db);
      const response = await ridesComponent.getRides(req, res);
      assert.isNotNull(response);
      assert.strictEqual(constant.HTTP_CODE.NOT_FOUND, response.status);
      assert.strictEqual(constant.ERROR_CODE.NOT_FOUND,
          response.send.error_code);
    });

    it('should return validation error', async () => {
      const params = {
        page: -10,
        size: 5,
      };
      const req = mockRequest(null, params, null);
      const res = mockResponse();
      const ridesComponent = ridesController(db);
      const response = await ridesComponent.getRides(req, res);
      assert.isNotNull(response);
      assert.strictEqual(constant.HTTP_CODE.VALIDATION_ERROR, response.status);
      assert.strictEqual(constant.ERROR_CODE.VALIDATION_ERROR,
          response.send.error_code);
    });

    it('should return all rides', async () => {
      const req = mockRequest(null, {}, null);
      const res = mockResponse();
      const ridesComponent = ridesController(db);
      insertRides();
      const response = await ridesComponent.getRides(req, res);
      assert.isNotNull(response);
      assert.strictEqual(constant.HTTP_CODE.SUCCESSFUL, response.status);
    });
  });

  describe('test getRideById', () => {
    it('should return resource not found', async () => {
      const params = {
        id: 100,
      };
      const req = mockRequest(null, null, params);
      const res = mockResponse();
      const ridesComponent = ridesController(db);
      const response = await ridesComponent.getRideById(req, res);
      assert.isNotNull(response);
      assert.strictEqual(constant.HTTP_CODE.NOT_FOUND, response.status);
      assert.strictEqual(constant.ERROR_CODE.NOT_FOUND,
          response.send.error_code);
    });

    it('should return validation error', async () => {
      const params = {
        id: '',
      };
      const req = mockRequest(null, null, params);
      const res = mockResponse();
      const ridesComponent = ridesController(db);
      const response = await ridesComponent.getRideById(req, res);
      assert.isNotNull(response);
      assert.strictEqual(constant.HTTP_CODE.VALIDATION_ERROR, response.status);
      assert.strictEqual(constant.ERROR_CODE.VALIDATION_ERROR,
          response.send.error_code);
    });

    it('should return all rides', async () => {
      const res = mockResponse();
      const ridesComponent = ridesController(db);
      const addedRides = await insertRides();
      const params = {
        id: addedRides.send.rideID,
      };
      const req = mockRequest(null, null, params);
      const response = await ridesComponent.getRideById(req, res);
      assert.isNotNull(response);
      assert.strictEqual(constant.HTTP_CODE.SUCCESSFUL, response.status);
    });
  });

  describe('test postRides', () => {
    it('should return validation error', async () => {
      const body = {
        'start_long': -500,
        'start_lat': 70,
        'end_long': 110,
        'end_lat': 75,
        'rider_name': 'Max',
        'driver_name': 'John',
        'driver_vehicle': 'Car',
      };
      const req = mockRequest(body, null, null);
      const res = mockResponse();
      const ridesComponent = ridesController(db);
      const response = await ridesComponent.postRides(req, res);
      assert.isNotNull(response);
      assert.strictEqual(constant.HTTP_CODE.VALIDATION_ERROR, response.status);
      assert.strictEqual(constant.ERROR_CODE.VALIDATION_ERROR,
          response.send.error_code);
    });

    it('should create a new ride', async () => {
      const body = {
        'start_long': 115,
        'start_lat': 70,
        'end_long': 110,
        'end_lat': 75,
        'rider_name': 'Max',
        'driver_name': 'John',
        'driver_vehicle': 'Car',
      };
      const req = mockRequest(body, null, null);
      const res = mockResponse();
      const ridesComponent = ridesController(db);
      const response = await ridesComponent.postRides(req, res);
      assert.isNotNull(response);
      assert.strictEqual(constant.HTTP_CODE.CREATED, response.status);
    });
  });
});
