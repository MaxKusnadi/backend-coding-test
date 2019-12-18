'use strict';

const errorGenerator = require('../../src/utils/errorGenerator');
const constant = require('../../src/constants');
const assert = require('chai').assert;

/**
 * Testing imperative error generator class
 */
describe('errorGenerator test', () => {
  it('should return validation error', () => {
    const message = 'validation error 123';
    const result = errorGenerator.returnValidationErrorResponse(message);
    assert.isNotNull(result);
    assert.strictEqual(result.error_code, constant.ERROR_CODE.VALIDATION_ERROR);
    assert.strictEqual(result.message, message);
  });

  it('should return server error', () => {
    const result = errorGenerator.returnServerErrorResponse();
    assert.isNotNull(result);
    assert.strictEqual(result.error_code, constant.ERROR_CODE.SERVER_ERROR);
    assert.strictEqual(result.message, 'Server failed');
  });

  it('should return resource not found error', () => {
    const result = errorGenerator.returnResourceNotFoundResponse();
    assert.isNotNull(result);
    assert.strictEqual(result.error_code, constant.ERROR_CODE.NOT_FOUND);
    assert.strictEqual(result.message, 'Given resource is not found');
  });
});
