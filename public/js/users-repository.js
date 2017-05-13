'use strict';

const Data = require('./data');

const config = UsersApp.config;
const apiAddress = config.apiAddress;

const usersRepository = {
  users: new Data(),
  tempUsers: new Map(),
  listToMap(list) {
    return list.reduce((m, v) => m.set(v.id, v), new Map());
  },
  all() {
    if (this.users.value === null) {
        m.request({
            method: 'get',
            url: apiAddress + '/users'
          })
          .then(
            (value) => this.users = Data.withValue(this.listToMap(value)),
            (error) => this.users = Data.withError(error));
    }
    return this.users;
  },
  reload() {
    this.users = new Data();
    return this.all();
  },
  add(user) {
    return m.request({
      method: 'post',
      url: apiAddress + '/users',
      data: user.value
    }).then(() => this.reload());
  },
  get(id) {
    if (this.users.hasValue()) {
      if (this.users.value.has(id)) {
        return Data.withValue(this.users.value.get(id));
      } else {
        return Data.withError('Not found');
      }
    } else if (this.tempUsers.has(id)) {
      return this.tempUsers.get(id);
    } else {
      m.request({
          method: 'get',
          url: apiAddress + '/users/' + id
        })
        .then((value) => {
          this.tempUsers.set(value.id, Data.withValue(value));
        });

      return Data.pending();
    }
  },
  update(user) {
    return m.request({
      method: 'put',
      url: apiAddress + '/users/' + user.value.id,
      data: user.value
    }).then(() => this.reload())
  },
  remove(id) {
    return m.request({
      method: 'delete',
      url: apiAddress + '/users/' + id
    }).then(() => this.reload())
  },
  populate() {
    return m.request({
      method: 'post',
      url: apiAddress + '/users/populate'
    }).then(() => this.reload())
  }
};

module.exports = usersRepository;