'use strict';

const databaseWrapper = require('../utils/databaseWrapper');
const errorGenerator = require('../utils/errorGenerator');
const logger = require('../utils/logger');
const constant = require('../constants');

const isGetAllRidesRequestInvalid = (req) => {
  const pageNo = req.query.page;
  const size = req.query.size;

  const isParameterExist = () => {
    return pageNo && size;
  };
  const isParameterNotNumber = () => {
    return (!Number.isInteger(Number(pageNo)) ||
            !Number.isInteger(Number(size)));
  };
  const isParameterNegative = () => {
    return (Number(pageNo) <= 0 || Number(size) <=0);
  };
  return isParameterExist() &&
        (isParameterNotNumber() || isParameterNegative());
};

const isGetRideByIdRequestInvalid = (req) => {
  const id = req.params.id;
  return !Number.isInteger(Number(id)) || Number(id) <= 0;
};

const paginate = function(data, pageNo=1, size=10) {
  logger.info('data ', data);
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

const rideController = (db) => {
  const ridesDatabase = databaseWrapper.rides(db);

  const getAllRides = async (req, res) => {
    // Validating request
    if (isGetAllRidesRequestInvalid(req)) {
      logger.error('Validation error');
      return res.status(constant.HTTP_CODE.VALIDATION_ERROR)
          .send(errorGenerator.returnValidationErrorResponse('page and ' +
              'size must be integer > 0'));
    }
    // Sanitizing request
    const pageNo = Number(req.query.page);
    const size = Number(req.query.size);

    // Business logic
    try {
      const allRides = await ridesDatabase.getAllRides();
      logger.info(allRides);
      logger.error('check ', allRides.length);
      if (allRides.length === 0) {
        return res.status(constant.HTTP_CODE.SUCCESSFUL).send(allRides);
      }
      console.log('parameter: ', pageNo, size);
      const response = paginate(allRides, pageNo, size);
      return res.status(constant.HTTP_CODE.SUCCESSFUL).send(response);
    } catch (err) {
      logger.error('Server error when fetching all rides');
      return res.status(constant.HTTP_CODE.SERVER_ERROR)
          .send(errorGenerator.returnServerErrorResponse());
    }
  };

  const getRideById = (req, res) => {
    // Validating request
    if (isGetRideByIdRequestInvalid(req)) {
      logger.error('Validation error');
      return res.status(constant.HTTP_CODE.VALIDATION_ERROR)
          .send(errorGenerator.returnValidationErrorResponse('ride id must ' +
              'be positive integer'));
    }
    // Sanitizing request
    const id = Number(req.params.id);

    // Business logic
    try {
      const ride = ridesDatabase.getRideById(id);
      console.log(ride);
      if (ride.length === 0) {
        return res.status(constant.HTTP_CODE.NOT_FOUND)
            .send(errorGenerator.returnResourceNotFoundResponse());
      }
      return res.status(constant.HTTP_CODE.SUCCESSFUL).send(ride[0]);
    } catch (err) {
      logger.error('Server error when fetching ride by id');
      return res.status(constant.HTTP_CODE.SERVER_ERROR)
          .send(errorGenerator.returnServerErrorResponse());
    }
  };
  return {
    getAllRides,
    getRideById,
  };
};

module.exports = rideController;
