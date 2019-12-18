'use strict';

const healthComponent = require('../../src/components/health');
const constant = require('../../src/constants');
const assert = require('chai').assert;
const mockResponse = require('../helpers/mockRequestResponse').mockResponse;
const mockRequest = require('../helpers/mockRequestResponse').mockRequest;

describe('test health component', () => {
  it('should return valid GET response', () => {
    const res = mockResponse();
    const req = mockRequest(null);
    const response = healthComponent.get(req, res);
    assert.isNotNull(response);
    assert.strictEqual(response.status, constant.HTTP_CODE.SUCCESSFUL);
    assert.strictEqual(response.send, 'Healthy');
  });
});
