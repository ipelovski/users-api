'use strict';

let users = [];

let repository = {
  async all() {
    return users;
  },
  async add(user) {
    user.id = users.length;
    users.push(user);
  },
  async get(id) {
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      return users[index];
    } else {
      return null;
    }
  },
  async update(id, user) {
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      // TODO validate user
      Object.assign(users[index], user);
      return true;
    } else {
      return false;
    }
  },
  async remove(id) {
    let index = users.findIndex((user) => user.id === id);
    if (index >= 0) {
      users.splice(index, 1);
      return true;
    } else {
      return false;
    }
  },
  async populate() {
    await this.add({
      forename: 'Toshko',
      surname: 'Goshkov',
      email: 'toshko.goshkov@gmail.com'
    });
    await this.add({
      forename: 'Goshko',
      surname: 'Toshkov',
      email: 'goshko.toshkov@gmail.com'
    });
  }
};

repository.populate();

module.exports = repository;