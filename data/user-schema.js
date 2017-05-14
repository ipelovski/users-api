'use strict';

const schema = {
  $schema: 'http://json-schema.org/schema#',
  id: '/schemas/user',
  properties: {
    forename: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    surname: {
      type: 'string',
      minLength: 1,
      maxLength: 100,
    },
    email: {
      type: 'string',
      format: 'email',
      maxLength: 100,
    },
  },
  required: ['forename', 'surname', 'email'],
};

module.exports = schema;