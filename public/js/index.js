'use strict';

const usersView = require('./components/users-view');
const addUser = require('./components/add-user');
const editUser = require('./components/edit-user');

const config = UsersApp.config;
const root = document.getElementById('container');

m.route.prefix('');

m.route(root, config.baseUrl, {
  '/': usersView,
  '/add': addUser,
  '/edit/:id': editUser
});