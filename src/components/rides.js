'use strict';

const shortid = require('shortid');
const databaseWrapper = require('../utils/databaseWrapper');
const errorGenerator = require('../utils/errorGenerator');
const requestValidator = require('../utils/requestValidator');
const logger = require('../utils/logger');
const constant = require('../constants');


const rideController = (db) => {
  const ridesDatabase = databaseWrapper.rides(db);

  /**
   * Paginate given rows of rides. Return paginated data
   *
   * @param {Array} data - rows of rides
   * @param {Number} pageNo - page number of the result. default is 1
   * @param {Number} size - number of rides per result. default is 10
   * @return {{totalItems: *, totalPages: number, page:
   * number, size: number, data: *}}
   */
  const paginate = (data, pageNo=1, size=10) => {
    const totalPages = Math.ceil(data.length / size);

    // ensure current page isn't out of range
    if (pageNo > totalPages) {
      pageNo = totalPages;
    }

    // calculate start and end item indexes
    const startIndex = (pageNo - 1) * size;
    const endIndex = Math.min(startIndex + size, data.length);
    logger.info(`page: ${pageNo} size: ${size} \
  startIndex: ${startIndex} endIndex: ${endIndex} \
  totalPages: ${totalPages} totalItems: ${data.length}`);
    return {
      totalItems: data.length,
      totalPages: totalPages,
      page: Number(pageNo),
      size: Math.min(size, data.length),
      data: data.slice(startIndex, endIndex),
    };
  };

  /**
   * Handle GET /rides request
   * @param {Object} req - request
   * @param {Object} res - response
   * @return {Object} updated response with http status and message
   */
  const getRides = async (req, res) => {
    logger.info('[GET] /rides is hit');
    // Validating request
    const validation = requestValidator.isGetAllRidesRequestInvalid(req);
    if (validation.result) {
      logger.error('Validation error');
      return res
          .status(constant.HTTP_CODE.VALIDATION_ERROR)
          .send(errorGenerator
              .returnValidationErrorResponse(validation.message));
    }

    // Sanitizing request.
    const pageNo = req.query.page && Number(req.query.page);
    const size = req.query.size && Number(req.query.size);

    // Business logic
    try {
      const rows = await ridesDatabase.getAllRides();
      if (rows.length === 0) {
        logger.error('Rides not found');
        return res
            .status(constant.HTTP_CODE.NOT_FOUND)
            .send(errorGenerator.returnResourceNotFoundResponse());
      }
      const resp = paginate(rows, pageNo, size);
      return res
          .status(constant.HTTP_CODE.SUCCESSFUL)
          .send(resp);
    } catch (err) {
      logger.error(err);
      return res
          .status(constant.HTTP_CODE.SERVER_ERROR)
          .send(errorGenerator.returnServerErrorResponse());
    }
  };

  /**
   * Handle GET /rides/{id} request
   * @param {Object} req - request
   * @param {Object} res - response
   * @return {Object} updated response with http status and message
   */
  const getRideById = async (req, res) => {
    logger.info('[GET] /rides/:id is hit');
    // Validating request
    const validation = requestValidator.isGetRideByIdRequestInvalid(req);
    if (validation.result) {
      logger.error('Validation error');
      return res
          .status(constant.HTTP_CODE.VALIDATION_ERROR)
          .send(errorGenerator
              .returnValidationErrorResponse(validation.message));
    }

    // Sanitizing request
    const id = String(req.params.id).replace(/[^\w\s]/gi, '');

    // Business logic
    try {
      const rows = await ridesDatabase.getRideById(id);
      if (rows.length === 0) {
        logger.error(`Rides ${id} is not found`);
        return res
            .status(constant.HTTP_CODE.NOT_FOUND)
            .send(errorGenerator.returnResourceNotFoundResponse());
      }
      return res
          .status(constant.HTTP_CODE.SUCCESSFUL)
          .send(rows[0]);
    } catch (err) {
      logger.error(err);
      return res
          .status(constant.HTTP_CODE.SERVER_ERROR)
          .send(errorGenerator.returnServerErrorResponse());
    }
  };

  /**
   * Handle POST /rides request
   * @param {Object} req - request
   * @param {Object} res - response
   * @return {Object} updated response with http status and message
   */
  const postRides = async (req, res) => {
    logger.info('[POST] /rides is hit');
    // Validating request
    const validation = requestValidator.isPostRidesRequestInvalid(req);
    if (validation.result) {
      logger.error('Validation error');
      return res
          .status(constant.HTTP_CODE.VALIDATION_ERROR)
          .send(errorGenerator
              .returnValidationErrorResponse(validation.message));
    }

    // Sanitizing request
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = String(req.body.rider_name).replace(/[^\w\s]/gi, '');
    const driverName = String(req.body.driver_name).replace(/[^\w\s]/gi, '');
    const driverVehicle =
      String(req.body.driver_vehicle).replace(/[^\w\s]/gi, '');
    const rideID = shortid.generate();

    // Business logic
    const values = [startLatitude, startLongitude,
      endLatitude, endLongitude, riderName,
      driverName, driverVehicle, rideID];
    try {
      const riderId = await ridesDatabase.createNewRide(values);
      const result = await ridesDatabase.getRideByRowId(riderId);
      return res
          .status(constant.HTTP_CODE.CREATED)
          .send(result[0]);
    } catch (err) {
      logger.error(err);
      return res
          .status(constant.HTTP_CODE.SERVER_ERROR)
          .send(errorGenerator.returnServerErrorResponse());
    }
  };
  return {
    getRides,
    getRideById,
    postRides,
  };
};

module.exports = rideController;
