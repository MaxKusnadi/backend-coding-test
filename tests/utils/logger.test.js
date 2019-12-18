'use strict';

const logger = require('../../src/utils/logger');
const assert = require('chai').assert;

describe('Logger test', () => {
  it('should not be null', () => {
    assert.notStrictEqual(logger, null);
  });
});
