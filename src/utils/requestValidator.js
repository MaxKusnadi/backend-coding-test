'use strict';

/**
 * Check if the request for GET /rides is invalid
 *
 * @param {Object} req
 * @return {{result: boolean, message: string}}
 */
const isGetAllRidesRequestInvalid = (req) => {
  const pageNo = req.query.page;
  const size = req.query.size;

  const isParameterExist = pageNo && size;
  const isParameterNotNumber = (!Number.isInteger(Number(pageNo)) ||
    !Number.isInteger(Number(size)));
  const isParameterNegative = (Number(pageNo) <= 0 || Number(size) <=0);
  return {
    result: isParameterExist && (isParameterNotNumber || isParameterNegative),
    message: 'page and size must be integer > 0',
  };
};

/**
 * Check if the request for GET /rides/{id} is invalid
 *
 * @param {Object} req
 * @return {{result: boolean, message: string}}
 */
const isGetRideByIdRequestInvalid = (req) => {
  const id = req.params.id;
  return {
    result: id.length <= 0,
    message: 'rideID must be a non empty alphanumeric',
  };
};

/**
 * Check if the request for POST /rides is invalid
 *
 * @param {Object} req
 * @return {{result: boolean, message: string}}
 */
const isPostRidesRequestInvalid = (req) => {
  const startLatitude = req.body.start_lat;
  const startLongitude = req.body.start_long;
  const endLatitude = req.body.end_lat;
  const endLongitude = req.body.end_long;
  const riderName = req.body.rider_name;
  const driverName = req.body.driver_name;
  const driverVehicle = req.body.driver_vehicle;

  let result = false;
  let message = '';

  const isLatitudeInvalid = (!startLatitude || !endLatitude ||
        !Number.isInteger(startLatitude) || !Number.isInteger(endLatitude) ||
        Number(startLatitude) < -90 || Number(startLatitude) > 90 ||
        Number(endLatitude) < -90 || Number(endLatitude) > 90);

  const isLongitudeInvalid = (!startLongitude || !endLongitude ||
        !Number.isInteger(startLongitude) || !Number.isInteger(endLongitude) ||
        Number(startLongitude) < -180 || Number(startLongitude) > 180 ||
        Number(endLongitude) < -180 || Number(endLongitude) > 180);

  const isStringInputInvalid = (!riderName || !driverName || !driverVehicle ||
        riderName instanceof String || driverName instanceof String ||
    driverVehicle instanceof String || riderName.length < 1 ||
    driverName.length < 1 || driverVehicle.length <1);

  if (isLatitudeInvalid) {
    result = true;
    message = 'Start latitude and end latitude ' +
      'must be between -90 - 90 degrees';
  } else if ( isLongitudeInvalid) {
    result = true;
    message = 'Start longitude and end longitude ' +
      'must be between -180 - 180 degrees';
  } else if (isStringInputInvalid) {
    result = true;
    message = 'riderName, driverName, driverVehicle ' +
      'must be String with length > 0';
  }

  return {
    result,
    message,
  };
};

module.exports = {
  isGetAllRidesRequestInvalid,
  isGetRideByIdRequestInvalid,
  isPostRidesRequestInvalid,
};
