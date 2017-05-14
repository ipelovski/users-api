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
    return user;
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
      Object.assign(users[index], user);
    } else {
      throw new Error('Not found');
    }
  },
  async delete(id) {
    validate(id, positiveIntegerOrZero);
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      users.splice(index, 1);
    } else {
      throw new Error('Not found');
    }
  },
  async populate(count) {
    validate(count, positiveInteger);
    while (count--) {
      await this.add(randomUser());
    }
  },
  async clear() {
    users.length = 0;
  },
};

const forenames = `Tosho Gosho Racho Tzonko Petko Tzvetko Risto Kozma
Penko Pencho Velyo Mityo Simo Nedko Mancho Haralampiy`.split(/\s/);
const surnames = `Toshev Goshev Rachev Tzonkov Petkov Tzvetkov Ristov Kozmov
Penkov Penchev Velyov Mitev Simov Nedkov Manchov Haralampiev`.split(/\s/);
function randomUser() {
  let forename = forenames[getRandomInt(forenames.length)];
  let surname = surnames[getRandomInt(surnames.length)];
  let email = `${forename.toLowerCase()}.${surname.toLowerCase()}@users.com`;
  return {
    forename,
    surname,
    email,
  };
}

function getRandomInt(min, max) {
  if (typeof max !== 'undefined') {
    min = Math.ceil(min);
    max = Math.floor(max);
  } else {
    max = Math.floor(min);
    min = 0;
  }
  return Math.floor(Math.random() * (max - min)) + min;
}

// repository.populate(5).catch(console.error.bind(null, 'Population error:'));

module.exports = repository;