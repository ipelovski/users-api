'use strict';

const ViewModel = require('../view-model');
const back = require('./back');

const userForm = {
  oninit(vnode) {
    this.user = vnode.attrs.user;
    this.userVM = ViewModel.fromData(this.user);
    this.onSubmit = vnode.attrs.onSubmit;
  },
  view(vnode) {
    let isPersisted = 'id' in this.userVM;
    return [
      m('form', Object.assign({
            onsubmit: this.submit.bind(this)
          }, this.userVM.bindings()), [
        m('table', m('tbody', [
          (isPersisted ?
            m('tr', [
              m('td', [m('label', 'ID:')]),
              m('td', [m('span', this.userVM.id)])
            ]) : null
          ),
          m('tr', [
            m('td', [m('label[for=forename]', 'Forename:')]),
            m('td', [m('input#forename[type=text]', {
              value: this.userVM.forename
            })])
          ]),
          m('tr', [
            m('td', [m('label[for=surname]', 'Surname:')]),
            m('td', [m('input#surname[type=text]', {
              value: this.userVM.surname
            })])
          ]),
          m('tr', [
            m('td', [m('label[for=email]', 'Email:')]),
            m('td', [m('input#email[type=text]', {
              value: this.userVM.email
            })])
          ]),
          (isPersisted ?
            m('tr', [
              m('td', [m('label', 'Created at:')]),
              m('td', [m('span', new Date(this.userVM.created).toString())])
            ]) : null
          ),
          (isPersisted ?
            m('tr', [
              m('td', [m('label', 'Last updated at:')]),
              m('td', [m('span', new Date(this.userVM.updated).toString())])
            ]) : null
          ),
        ])),
        // m('button', { onclick: this.submit.bind(this) }, 'Add')
        vnode.attrs.buttons
      ]),
      m(back),
    ];
  },
  submit(e) {
    e.preventDefault();
    this.onSubmit(this.userVM);
  },
};

module.exports = userForm;