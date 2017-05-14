'use strict';

const Ajv = require('ajv');
const userSchema = require('./user-schema');

const ajv = new Ajv({ jsonPointers: true, verbose: false, allErrors: true });
const validate = ajv.compile(userSchema);

module.exports = validate;