'use strict';
const constant = require('../constants');

const returnValidationErrorResponse = (message) => {
  return {
    error_code: constant.ERROR_CODE.VALIDATION_ERROR,
    message,
  };
};

const returnServerErrorResponse = () => {
  return {
    error_code: constant.ERROR_CODE.SERVER_ERROR,
    message: 'Server failed',
  };
};

const returnResourceNotFoundResponse = () => {
  return {
    error_code: constant.ERROR_CODE.NOT_FOUND,
    message: 'Given resource is not found',
  };
};

module.exports = {
  returnResourceNotFoundResponse,
  returnServerErrorResponse,
  returnValidationErrorResponse,
};
