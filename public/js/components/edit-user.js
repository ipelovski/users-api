'use strict';

const Data = require('../data');
const usersRepository = require('../users-repository');
const userForm = require('./user-form');

const editUser = {
  oninit() {
    this.userId = parseInt(m.route.param('id'), 10);
    this.user = usersRepository.get(this.userId);
  },
  view(vnode) {
    if (this.user().isPending()) {
      return m('h3', 'Loading...');
    } else {
      if (this.user().hasError() && this.user().error.message === 'Not found') {
        return m('h3', 'Not found');
      }
      return m(userForm, Object.assign(vnode.attrs, {
        user: this.user,
        onSubmit: (userVM) => {
          m.route.set(m.route.get(), null, { replace: true });
          usersRepository.update(userVM.toData())
            .then(() => m.route.set('/'),
              (error) => this.user(Data.withError(error, this.user().value)));
        },
        buttons: [
          m('button', 'Update')
        ]
      }), vnode.children);
    }
  }
};

module.exports = editUser;