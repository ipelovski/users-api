'use strict';

const usersRepository = require('../users-repository');
const userForm = require('./user-form');

const editUser = {
  view(vnode) {
    let id = parseInt(m.route.param('id'), 10);
    let user = usersRepository.get(id);

    if (user.isPending()) {
      return m('h3', 'Loading...');
    } else if (user.hasValue()) {
      return m(userForm, Object.assign(vnode.attrs, {
        user,
        onSubmit(userVM) {
          let user = userVM.toData();
          usersRepository.update(user)
            .then(() => m.route.set('/'));
        },
        buttons: [
          m('button', 'Update')
        ]
      }), vnode.children);
    } else if (user.hasError()) {
      return m('h3', 'Error: ' + user.error.message);
    }
  }
};

module.exports = editUser;