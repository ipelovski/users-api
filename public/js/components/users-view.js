'use strict';

const usersRepository = require('../users-repository');
const usersList = require('./users-list');

const userList = {
  view() {
    let users = usersRepository.all();
    if (users.isPending()) {
      return m('h3', 'Loading...');
    } else if (users.hasValue()) {
      return [
        m(usersList, { users, onSelectUser: this.selectUser, onRemoveUser: this.removeUser }),
        m('a[href=/add]', { oncreate: m.route.link }, 'Add'),
        m('br'),
        m('a[href=#]', { onclick: this.populateUsers.bind(this) }, 'Populate')
      ];
    } else if (users.hasError()) {
      return m('h3', 'Error: ' + users.error);
    }
  },
  selectUser(user) {
    m.route.set('/edit/' + user.id);
  },
  removeUser(user) {
    usersRepository.remove(user.id);
  },
  populateUsers(e) {
    e.preventDefault();
    usersRepository.populate();
  }
};

module.exports = userList;