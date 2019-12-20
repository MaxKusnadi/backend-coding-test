'use strict';

/**
 * Create a mock response object
 * @return {Object} mock response
 */
const mockResponse = () => {
  const res = {};
  res.status = (status) =>{
    res.status = status;
    return res;
  };
  res.send = (message) =>{
    res.send = message;
    return res;
  };
  return res;
};

/**
 * Create a mock request with a given input
 * @param {Object} body
 * @param {Object} query
 * @param {Object} params
 * @return {{body: *, query: *, params: *}}
 */
const mockRequest= (body, query, params) => ({
  body,
  query,
  params,
});

module.exports = {
  mockResponse,
  mockRequest,
};
