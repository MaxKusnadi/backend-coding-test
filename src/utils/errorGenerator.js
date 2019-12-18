'use strict';

const constant = require('../constants');

/**
 * Generate error response for validation error
 *
 * @param {string} message
 * @return {{error_code: string, message: *}}
 */
const returnValidationErrorResponse = (message) => {
  return {
    error_code: constant.ERROR_CODE.VALIDATION_ERROR,
    message,
  };
};

/**
 * Generate error response for server error
 * @return {{error_code: string, message: string}}
 */
const returnServerErrorResponse = () => {
  return {
    error_code: constant.ERROR_CODE.SERVER_ERROR,
    message: 'Server failed',
  };
};

/**
 * Generate error response for resource not found error
 * @return {{error_code: string, message: string}}
 */
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
