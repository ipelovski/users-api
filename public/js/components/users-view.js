'use strict';

const usersRepository = require('../users-repository');
const usersList = require('./users-list');
const searchBox = require('./search-box');

const usersView = {
  view() {
    let users = usersRepository.all();
    return m('.panel.panel-default.text-center', (() => {
      if (users.isPending()) {
        return m('.panel-heading', m('.h4', 'Loading...'));
      } else if (users.hasValue()) {
        return m('.panel-body', [
          m(searchBox, {
            class: 'slightly-bottomful',
            onSearch: this.search.bind(this)
          }),
          m(usersList, {
            users,
            onSelectUser: this.selectUser,
            onRemoveUser: this.removeUser
          }),
          m('.bottomful', [
            m('a.btn.btn-default[href=/add]', {
              oncreate: m.route.link
            }, 'Add'),
            m('span.inter', ' or '),
            m('a.btn.btn-default[href=#]', {
              onclick: this.populateUsers.bind(this)
            }, 'Add random')
          ])
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
    usersRepository.remove(user.id);
  },
  populateUsers(e) {
    e.preventDefault();
    usersRepository.populate(5);
  },
};

module.exports = usersView;