'use strict';

const util = require('util');

function ValidationError(errors) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.errors = errors;
}

util.inherits(ValidationError, Error);

function validate(value, validator) {
  if (!validator(value)) {
    throw new ValidationError(validator.errors);
  }
}

module.exports = {
  validate,
  ValidationError,
};