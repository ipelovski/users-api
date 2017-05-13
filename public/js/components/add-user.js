'use strict';

const Data = require('../data');
const usersRepository = require('../users-repository');
const userForm = require('./user-form');

const addUser = {
  oninit() {
    this.user = Data.withValue({});
  },
  view(vnode) {
    return m(userForm, Object.assign(vnode.attrs, {
      user: this.user,
      onSubmit: (userVM) => {
        usersRepository.add(userVM.toData())
          .then(() => m.route.set('/'));
      },
      buttons: [
        m('button', 'Add')
      ]
    }), vnode.children);
  }
};

module.exports = addUser;