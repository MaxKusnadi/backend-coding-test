'use strict';

const assert = require('chai').assert;
const requestValidator = require('../../src/utils/requestValidator');
const mockRequest = require('../helpers/mockRequestResponse').mockRequest;

describe('requestValidator test', () => {
  it('tests valid GET /rides request', () => {
    const query = {
      page: 5,
      size: 5,
    };
    const req = mockRequest(null, query, null);
    const result = requestValidator.isGetAllRidesRequestInvalid(req);
    assert.isNotNull(result);
    assert.isFalse(result.result);
  });

  it('tests negative parameter GET /rides request', () => {
    const query = {
      page: -1,
      size: -2,
    };
    const req = mockRequest(null, query, null);
    const result = requestValidator.isGetAllRidesRequestInvalid(req);
    assert.isNotNull(result);
    assert.isTrue(result.result);
  });

  it('tests not number parameter GET /rides request', () => {
    const query = {
      page: 'abc',
      size: '1',
    };
    const req = mockRequest(null, query, null);
    const result = requestValidator.isGetAllRidesRequestInvalid(req);
    assert.isNotNull(result);
    assert.isTrue(result.result);
  });

  it('tests valid GET /rides/{id} request', () => {
    const params = {
      id: 1,
    };
    const req = mockRequest(null, null, params);
    const result = requestValidator.isGetRideByIdRequestInvalid(req);
    assert.isNotNull(result);
    assert.isFalse(result.result);
  });

  it('tests invalid id GET /rides/{id} request', () => {
    const params = {
      id: '',
    };
    const req = mockRequest(null, null, params);
    const result = requestValidator.isGetRideByIdRequestInvalid(req);
    assert.isNotNull(result);
    assert.isTrue(result.result);
  });

  it('tests valid GET /rides/{id} request', () => {
    const params = {
      id: 1,
    };
    const req = mockRequest(null, null, params);
    const result = requestValidator.isGetRideByIdRequestInvalid(req);
    assert.isNotNull(result);
    assert.isFalse(result.result);
  });

  it('tests valid id POST /rides request', () => {
    const body = {
      'start_long': 100,
      'start_lat': 70,
      'end_long': 110,
      'end_lat': 75,
      'rider_name': 'Max',
      'driver_name': 'John',
      'driver_vehicle': 'Car',
    };
    const req = mockRequest(body, null, null);
    const result = requestValidator.isPostRidesRequestInvalid(req);
    assert.isNotNull(result);
    assert.isFalse(result.result);
  });

  it('tests invalid longitude POST /rides request', () => {
    const body = {
      'start_long': -200,
      'start_lat': 70,
      'end_long': 'abc',
      'end_lat': 75,
      'rider_name': 'Max',
      'driver_name': 'John',
      'driver_vehicle': 'Car',
    };
    const req = mockRequest(body, null, null);
    const result = requestValidator.isPostRidesRequestInvalid(req);
    assert.isNotNull(result);
    assert.isTrue(result.result);
    assert.strictEqual(result.message, 'Start longitude and end longitude ' +
      'must be between -180 - 180 degrees');
  });

  it('tests invalid latitude POST /rides request', () => {
    const body = {
      'start_long': 100,
      'start_lat': 'abc',
      'end_long': 100,
      'end_lat': -500,
      'rider_name': 'Max',
      'driver_name': 'John',
      'driver_vehicle': 'Car',
    };
    const req = mockRequest(body, null, null);
    const result = requestValidator.isPostRidesRequestInvalid(req);
    assert.isNotNull(result);
    assert.isTrue(result.result);
    assert.strictEqual(result.message, 'Start latitude and end latitude ' +
      'must be between -90 - 90 degrees');
  });

  it('tests invalid string input POST /rides request', () => {
    const body = {
      'start_long': 100,
      'start_lat': 15,
      'end_long': 100,
      'end_lat': -15,
      'rider_name': '',
      'driver_name': '',
      'driver_vehicle': '',
    };
    const req = mockRequest(body, null, null);
    const result = requestValidator.isPostRidesRequestInvalid(req);
    assert.isNotNull(result);
    assert.isTrue(result.result);
    assert.strictEqual(result.message, 'riderName, driverName, driverVehicle ' +
      'must be String with length > 0');
  });
});
