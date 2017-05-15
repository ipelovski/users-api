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
    return m('.panel.panel-default.text-center', (() => {
      if (users.isPending()) {
        return m('.panel-heading', m('.h4', 'Loading...'));
      } else if (users.hasValue()) {
        return m('.panel-body', [
          m(searchBox, {
            class: 'slightly-bottomful',
            onSearch: this.search.bind(this),
            searchText: this.searchText
          }),
          (users.value.size > 0
            ? m(usersList, {
              users,
              onSelectUser: this.selectUser,
              onRemoveUser: this.removeUser.bind(this)
            })
            : m('.panel.panel-default', [
                m('.panel-body', [
                  m('.h3', 'No users found')
                ])
              ])
          ),
          m('.bottomful',
            m('a.btn.btn-default[href=/]', {
              oncreate: m.route.link
            }, 'Back to list')
          ),
        ]);
      } else if (users.hasError()) {
        return m('.panel-heading', m('.h4', 'Error: ' + users.error.message));
      }
    })());
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