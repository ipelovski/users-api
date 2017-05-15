'use strict';

const Data = require('../data');
const usersRepository = require('../users-repository');
const userForm = require('./user-form');

const addUser = {
  oninit() {
    this.user = stream(Data.withValue(usersRepository.emptyUser()));
  },
  view(vnode) {
    return m('.panel.panel-default.text-center', [
      m('.panel-heading', m('h4', 'Add New User')),
      m('.panel-body',
        m(userForm, Object.assign(vnode.attrs, {
          user: this.user,
          onSubmit: (userVM) => {
            m.route.set(m.route.get(), null, { replace: true });
            usersRepository.add(userVM.toData())
              .then(() => m.route.set('/'),
                (error) => this.user(Data.withError(error, this.user().value)));
          },
          buttons: [
            m('button.btn.btn-default', 'Add')
          ]
        }))
      )
    ]);
  }
};

module.exports = addUser;