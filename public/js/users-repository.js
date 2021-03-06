'use strict';

const Data = require('./data');

const config = UsersApp.config;
const apiAddress = config.apiAddress;

const usersRepository = {
  users: new Data(),
  listToMap(list) {
    return list.reduce((m, v) => m.set(v.id, v), new Map());
  },
  all() {
    if (this.users.isEmpty()) {
      this.users = Data.pending();
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
  get(id) {
    if (this.users.hasValue()) {
      if (this.users.value.has(id)) {
        return stream(Data.withValue(this.users.value.get(id)));
      } else {
        return stream(Data.withError('Not found'));
      }
    } else {
      let stream2 = stream(Data.pending());
      m.request({
          method: 'get',
          url: apiAddress + '/users/' + id
        })
        .then(
          (value) => stream2(Data.withValue(value)),
          (error) => stream2(Data.withError(error)));

      return stream2;
    }
  },
  emptyUser() {
    return {
      forename: '',
      surname: '',
      email: '',
    };
  },
  search(text) {
    return m.request({
      method: 'get',
      url: apiAddress + '/users/search/' + text
    }).then((value) => Data.withValue(this.listToMap(value)));
  },
  add(user) {
    return m.request({
      method: 'post',
      url: apiAddress + '/users',
      data: user.value
    }).then(() => this.reload());
  },
  update(user) {
    return m.request({
      method: 'put',
      url: apiAddress + '/users/' + user.value.id,
      data: user.value,
      extract
    }).then(() => this.reload())
  },
  remove(id) {
    return m.request({
      method: 'delete',
      url: apiAddress + '/users/' + id,
      extract
    }).then(() => this.reload());
  },
  populate(count) {
    return m.request({
      method: 'post',
      url: apiAddress + '/users/populate',
      data: { count },
      extract
    }).then(() => this.reload());
  }
};

function deserialize(data, raise) {
  try {
    return data !== '' ? JSON.parse(data) : null;
  } catch (e) {
    if (raise) {
      throw new Error(data);
    } else {
      return null;
    }
  }
}

function extract(xhr) {
  if (xhr.status >= 200 && xhr.status < 300) {
    return deserialize(xhr.responseText, false);
  } else {
    return deserialize(xhr.responseText, true);
  }
}

module.exports = usersRepository;