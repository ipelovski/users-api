'use strict';

const Data = require('../data');
const usersRepository = require('../users-repository');
const userForm = require('./user-form');

const addUser = {
  oninit() {
    this.user = stream(Data.withValue(usersRepository.emptyUser()));
  },
  view(vnode) {
    return m(userForm, Object.assign(vnode.attrs, {
      user: this.user,
      onSubmit: (userVM) => {
        m.route.set(m.route.get(), null, { replace: true });
        usersRepository.add(userVM.toData())
          .then(() => m.route.set('/'),
            (error) => this.user(Data.withError(error, this.user().value)));
      },
      buttons: [
        m('button', 'Add')
      ]
    }), vnode.children);
  }
};

module.exports = addUser;