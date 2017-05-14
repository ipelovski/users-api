'use strict';

const Data = require('../data');
const usersRepository = require('../users-repository');
const usersList = require('./users-list');
const searchBox = require('./search-box');

const searchUsers = {
  oninit() {
    this.searchText = m.route.param('key') || '';
    this.users = Data.pending();
    usersRepository.search(this.searchText)
      .then((users) => this.users = users);
  },
  view() {
    let users = this.users;
    if (users.isPending()) {
      return m('h3', 'Loading...');
    } else if (users.hasValue()) {
      return [
        m(searchBox, {
          onSearch: this.search.bind(this),
          searchText: this.searchText
        }),
        (users.value.size > 0
          ? m(usersList, {
            users,
            onSelectUser: this.selectUser,
            onRemoveUser: this.removeUser.bind(this)
          })
          : m('div', 'No users found')
        ),
        m('a[href=/]', { oncreate: m.route.link }, 'Back to list'),
      ];
    } else if (users.hasError()) {
      return m('h3', 'Error: ' + users.error.message);
    }
  },
  search(text) {
    m.route.set('/search/' + text);
  },
  selectUser(user) {
    m.route.set('/edit/' + user.id);
  },
  removeUser(user) {
    usersRepository.remove(user.id)
      .then(() => {
        usersRepository.search(this.searchText)
          .then((users) => this.users = users);
      });
  },
  populateUsers(e) {
    e.preventDefault();
    usersRepository.populate(5);
  },
};

module.exports = searchUsers;