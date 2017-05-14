'use strict';

const Ajv = require('ajv');
const userValidator = require('./user-validator');
const validate = require('../lib/validate').validate;

const ajv = new Ajv();
const positiveInteger = ajv.compile({
  type: 'integer',
  minimum: 1
});
const positiveIntegerOrZero = ajv.compile({
  type: 'integer',
  minimum: 0
});

const users = [];

const repository = {
  async all() {
    return users;
  },
  async add(user) {
    validate(user, userValidator);
    user.id = users.length;
    users.push(user);
  },
  async get(id) {
    validate(id, positiveIntegerOrZero);
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      return users[index];
    } else {
      return null;
    }
  },
  async update(id, user) {
    validate(id, positiveIntegerOrZero);
    validate(user, userValidator);
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      userValidator
      Object.assign(users[index], user);
      return true;
    } else {
      return false;
    }
  },
  async remove(id) {
    validate(id, positiveIntegerOrZero);
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      users.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },
  async populate(count) {
    validate(count, positiveInteger);
    while (count--) {
      await this.add({
        forename: 'Toshko',
        surname: 'Goshkov',
        email: 'toshko.goshkov@gmail.com'
      });
    }
    // await this.add({
    //   forename: 'Goshko',
    //   surname: 'Toshkov',
    //   email: 'goshko.toshkov@gmail.com'
    // });
  }
};

repository.populate(5).catch(console.error.bind(null, 'Population error:'));

module.exports = repository;