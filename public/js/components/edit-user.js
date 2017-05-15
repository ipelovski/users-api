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
    return m('.panel.panel-default.text-center', (() => {
      if (this.user().isPending()) {
        return m('.panel-heading', m('.h4', 'Loading...'));
      } else {
        if (this.user().hasError() && this.user().error.message === 'Not found') {
          return m('.panel-heading', m('.h4', 'Not found'));
        }
        return [
          m('.panel-heading', m('h4', 'Editing User')),
          m('.panel-body', [
            m(userForm, Object.assign(vnode.attrs, {
              user: this.user,
              onSubmit: (userVM) => {
                m.route.set(m.route.get(), null, { replace: true });
                usersRepository.update(userVM.toData())
                  .then(() => m.route.set('/'),
                    (error) => this.user(Data.withError(error, this.user().value)));
              },
              buttons: [
                m('button.btn.btn-default', 'Update')
              ]
            }))
          ])
        ];
      }
    })());
  }
};

module.exports = editUser;