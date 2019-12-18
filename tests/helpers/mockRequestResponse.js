'use strict';

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

const mockRequest= (body) => ({
  body,
});

module.exports = {
  mockResponse,
  mockRequest,
};
