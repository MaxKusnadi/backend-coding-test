'use strict';

const constant = require('../constants');

/**
 * GET /health API function
 *
 * @param {object} req - incoming request
 * @param {object} res - response object
 * @return {object} res - updated response object
 */
const get = (req, res) => {
  return res.status(constant.HTTP_CODE.SUCCESSFUL).send('Healthy');
};

module.exports = {
  get,
};
