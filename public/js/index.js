'use strict';

const usersView = require('./components/users-view');
const searchUsers = require('./components/search-users');
const addUser = require('./components/add-user');
const editUser = require('./components/edit-user');

const config = UsersApp.config;
const root = document.getElementById('container');

m.route.prefix('');

m.route(root, config.baseUrl, {
  '/': usersView,
  // previously '/search/:text': searchUsers,
  // see problem on https://github.com/MithrilJS/mithril.js/issues/1180
  // and solution on https://mithril.js.org/route.html#key-parameter
  '/search/:key': searchUsers,
  '/search/': searchUsers,
  '/add': addUser,
  '/edit/:id': editUser
});