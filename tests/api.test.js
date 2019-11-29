'use strict';

const request = require('supertest');
const assert = require('assert');
const _ = require('lodash');

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

const app = require('../src/app')(db);
const buildSchemas = require('../src/schemas');

const prepareData = async function() {
  const data = {
    'start_long': 100,
    'start_lat': 70,
    'end_long': 110,
    'end_lat': 75,
    'rider_name': 'Max',
    'driver_name': 'John',
    'driver_vehicle': 'Car',
  };
  const values = [data.start_lat, data.start_long,
    data.end_lat, data.end_long, data.rider_name,
    data.driver_name, data.driver_vehicle];
  _.times(15, () => {
    db.run('INSERT INTO Rides(startLat, startLong,' +
            'endLat, endLong, riderName, driverName, driverVehicle) VALUES' +
            '(?, ?, ?, ?, ?, ?, ?)', values, function(err) {
      if (err) {
        logger.error(err);
        return res.send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }
    });
  });
};


describe('API tests', () => {
  before((done) => {
    db.serialize((err) => {
      if (err) {
        return done(err);
      }

      buildSchemas(db);

      done();
    });
  });

  describe('GET /health', () => {
    it('should return health', (done) => {
      request(app)
          .get('/health')
          .expect('Content-Type', /text/)
          .expect(200, done);
    });
  });

  describe('GET /rides', () => {
    it('should return not found', (done) => {
      request(app)
          .get('/rides')
          .expect(200)
          .expect((res) => {
            assert(res.body.error_code === 'RIDES_NOT_FOUND_ERROR');
          })
          .end(done);
    });

    it('should return fine', (done) => {
      request(app)
          .post('/rides')
          .send({
            'start_long': 100,
            'start_lat': 70,
            'end_long': 110,
            'end_lat': 75,
            'rider_name': 'Max',
            'driver_name': 'John',
            'driver_vehicle': 'Car',
          })
          .set('Content-Type', 'application/json')
          .expect(200)
          .then((res) => {
            request(app)
                .get(`/rides`)
                .expect(200)
                .expect((getResponse) => {
                  assert(getResponse.body.data[0].rideID === res.body.rideID);
                })
                .end(done);
          });
    });
  });

  describe('GET /rides pagination', () => {
    it('should fail with invalid page and size', (done) => {
      request(app)
          .get('/rides')
          .query({
            'page': 'abc',
            'size': 'abc',
          })
          .expect(200)
          .expect((res) => {
            assert(res.body.error_code === 'VALIDATION_ERROR');
          })
          .end(done);
    });

    it('should fail with negative page and size', (done) => {
      request(app)
          .get('/rides')
          .query({
            'page': 0,
            'size': -1,
          })
          .expect(200)
          .expect((res) => {
            assert(res.body.error_code === 'VALIDATION_ERROR');
          })
          .end(done);
    });

    it('should use default value if not given', (done) => {
      prepareData();
      request(app)
          .get('/rides')
          .expect(200)
          .expect((res) => {
            assert(res.body.page === 1);
            assert(res.body.size === 10);
            assert(res.body.data.length <= res.body.size);
          })
          .end(done);
    });

    it('should use default total page ' +
        'value if page number is bigger', (done) => {
      prepareData();
      request(app)
          .get('/rides')
          .expect(200)
          .query({
            'page': 99,
          })
          .expect((res) => {
            assert(res.body.page === res.body.totalPages);
            assert(res.body.size === 10);
            assert(res.body.data.length <= res.body.size);
          })
          .end(done);
    });

    it('should test large size', (done) => {
      prepareData();
      request(app)
          .get('/rides')
          .expect(200)
          .query({
            'size': 200,
            'page': 1,
          })
          .expect((res) => {
            assert(res.body.page === res.body.totalPages);
            assert(res.body.size === res.body.data.length);
          })
          .end(done);
    });
  });

  describe('GET /rides/{id}', () => {
    it('should return not found', (done) => {
      request(app)
          .get('/rides/99')
          .expect(200)
          .expect((res) => {
            assert(res.body.error_code === 'RIDES_NOT_FOUND_ERROR');
          })
          .end(done);
    });

    it('should return fine', (done) => {
      request(app)
          .post('/rides')
          .send({
            'start_long': 100,
            'start_lat': 70,
            'end_long': 110,
            'end_lat': 75,
            'rider_name': 'Max',
            'driver_name': 'John',
            'driver_vehicle': 'Car',
          })
          .set('Content-Type', 'application/json')
          .expect(200)
          .then((res) => {
            request(app)
                .get(`/rides/${res.body.rideID}`)
                .expect(200)
                .expect((getResponse) => {
                  // console.log(getResponse);
                  assert(getResponse.body.rideID === res.body.rideID);
                })
                .end(done);
          });
    });
  });

  describe('POST /rides', () => {
    it('should create ride successfully', (done) => {
      request(app)
          .post('/rides')
          .send({
            'start_long': 100,
            'start_lat': 70,
            'end_long': 110,
            'end_lat': 75,
            'rider_name': 'Max',
            'driver_name': 'John',
            'driver_vehicle': 'Car',
          })
          .set('Content-Type', 'application/json')
          .expect(200)
          .expect((res) => {
            assert(res.body.rideID != null);
          })
          .end(done);
    });

    it('should fail with invalid initial position', (done) => {
      request(app)
          .post('/rides')
          .send({
            'start_long': 200,
            'start_lat': 200,
            'end_long': 110,
            'end_lat': 75,
            'rider_name': 'Max',
            'driver_name': 'John',
            'driver_vehicle': 'Car',
          })
          .set('Content-Type', 'application/json')
          .expect((res) => {
            assert(res.body.error_code === 'VALIDATION_ERROR');
          })
          .end(done);
    });

    it('should fail with invalid final position', (done) => {
      request(app)
          .post('/rides')
          .send({
            'start_long': 100,
            'start_lat': 70,
            'end_long': 200,
            'end_lat': 200,
            'rider_name': 'Max',
            'driver_name': 'John',
            'driver_vehicle': 'Car',
          })
          .set('Content-Type', 'application/json')
          .expect((res) => {
            assert(res.body.error_code === 'VALIDATION_ERROR');
          })
          .end(done);
    });

    it('should fail with invalid rider\'s name', (done) => {
      request(app)
          .post('/rides')
          .send({
            'start_long': 100,
            'start_lat': 70,
            'end_long': 110,
            'end_lat': 75,
            'rider_name': 123,
            'driver_name': 'John',
            'driver_vehicle': 'Car',
          })
          .set('Content-Type', 'application/json')
          .expect((res) => {
            assert(res.body.error_code === 'VALIDATION_ERROR');
          })
          .end(done);
    });

    it('should fail with invalid driver\'s name', (done) => {
      request(app)
          .post('/rides')
          .send({
            'start_long': 100,
            'start_lat': 70,
            'end_long': 110,
            'end_lat': 75,
            'rider_name': 'Max',
            'driver_name': 123,
            'driver_vehicle': 'Car',
          })
          .set('Content-Type', 'application/json')
          .expect((res) => {
            assert(res.body.error_code === 'VALIDATION_ERROR');
          })
          .end(done);
    });

    it('should fail with invalid driver\'s name', (done) => {
      request(app)
          .post('/rides')
          .send({
            'start_long': 100,
            'start_lat': 70,
            'end_long': 110,
            'end_lat': 75,
            'rider_name': 'Max',
            'driver_name': 'John',
            'driver_vehicle': 123,
          })
          .set('Content-Type', 'application/json')
          .expect((res) => {
            assert(res.body.error_code === 'VALIDATION_ERROR');
          })
          .end(done);
    });
  });
});
