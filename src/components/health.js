'use strict';

const constant = require('../constants');

const get = (req, res) => {
  return res.status(constant.HTTP_CODE.SUCCESSFUL).send('Healthy');
};

module.exports = {
  get,
};
