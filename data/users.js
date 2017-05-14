'use strict';

const Ajv = require('ajv');
const userValidator = require('./user-validator');
const validate = require('../lib/validate').validate;

const ajv = new Ajv();
const isPositiveInteger = ajv.compile({
  type: 'integer',
  minimum: 1
});
const isPositiveIntegerOrZero = ajv.compile({
  type: 'integer',
  minimum: 0
});
const isString = ajv.compile({
  type: 'string'
});

const users = [];
let userId = 0;

const repository = {
  async all() {
    return users;
  },
  async get(id) {
    validate(id, isPositiveIntegerOrZero);
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      return users[index];
    } else {
      return null;
    }
  },
  async search(text) {
    validate(text, isString);
    let pattern = new RegExp('.*' + text + '.*', 'i');
    let filteredUsers = users.filter((user) => {
      return pattern.test(user.forename) ||
        pattern.test(user.surname) ||
        pattern.test(user.email);
    });
    return filteredUsers;
  },
  async add(user) {
    validate(user, userValidator);
    user.id = userId;
    userId += 1;
    user.created = user.updated = Date.now();
    users.push(user);
    return user;
  },
  async update(id, user) {
    validate(id, isPositiveIntegerOrZero);
    validate(user, userValidator);
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      let storedUser = users[index];
      user.id = storedUser.id;
      user.created = storedUser.created;
      user.updated = Date.now();
      Object.assign(storedUser, user);
    } else {
      throw new Error('Not found');
    }
  },
  async delete(id) {
    validate(id, isPositiveIntegerOrZero);
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      users.splice(index, 1);
    } else {
      throw new Error('Not found');
    }
  },
  async populate(count) {
    validate(count, isPositiveInteger);
    while (count--) {
      await this.add(randomUser());
    }
  },
  async clear() {
    users.length = 0;
  },
};

const forenames = `Tosho Gosho Racho Tzonko Petko Tzvetko Risto Kozma
Penko Pencho Velyo Mityo Simo Nedko Mancho Haralampi`.split(/\s/);
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

module.exports = repository;