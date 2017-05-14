'use strict';

const ViewModel = require('../view-model');
const back = require('./back');
const validationMessage = require('./validation-message');

const userForm = {
  oninit(vnode) {
    this.user = vnode.attrs.user;
    this.userVM = ViewModel.fromData(this.user());
    this.onSubmit = vnode.attrs.onSubmit;
  },
  view(vnode) {

    let user = this.user();
    let userVM = ViewModel.fromData(this.user());
    this.userVM = Object.assign(userVM, this.userVM);

    let isPersisted = 'id' in this.userVM;
    let errors = null;
    if (this.user().hasError()) {
      errors = this.user().error.errors
    }
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
            m('td', [
              m('input#forename[type=text]', {
                value: this.userVM.forename
              })
            ]),
            m('td', [m(validationMessage, { errors, path: '/forename' })])
          ]),
          m('tr', [
            m('td', [m('label[for=surname]', 'Surname:')]),
            m('td', [m('input#surname[type=text]', {
              value: this.userVM.surname
            })]),
            m('td', [m(validationMessage, { errors, path: '/surname' })])
          ]),
          m('tr', [
            m('td', [m('label[for=email]', 'Email:')]),
            m('td', [m('input#email[type=text]', {
              value: this.userVM.email
            })]),
            m('td', [m(validationMessage, { errors, path: '/email' })])
          ]),
          (isPersisted ?
            m('tr', [
              m('td', [m('label', 'Created at:')]),
              m('td', [m('span', this.getDate(this.userVM.created))])
            ]) : null
          ),
          (isPersisted ?
            m('tr', [
              m('td', [m('label', 'Last updated at:')]),
              m('td', [m('span', this.getDate(this.userVM.updated))])
            ]) : null
          ),
        ])),
        vnode.attrs.buttons
      ]),
      m(back),
    ];
  },
  submit(e) {
    e.preventDefault();
    this.onSubmit(this.userVM);
  },
  padDatePart(v) {
    return v.toString().padStart(2, '0');
  },
  getDate(ms) {
    let date = new Date(ms);
    let day = this.padDatePart(date.getDate());
    let month = this.padDatePart(date.getMonth() + 1);
    let year = date.getFullYear();
    let hours = this.padDatePart(date.getHours());
    let minutes = this.padDatePart(date.getMinutes());
    return `${day}.${month}.${year} ${hours}:${minutes}`;
  },
};

module.exports = userForm;