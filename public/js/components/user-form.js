'use strict';

const ViewModel = require('../view-model');
const back = require('./back');
const validationMessage = require('./validation-message');
const validatedFormGroup = require('./validated-form-group');

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
      m('form.form-horizontal', Object.assign({
            onsubmit: this.submit.bind(this)
          }, this.userVM.bindings()), [
        (isPersisted ?
          m('.form-group', [
            m('label.control-label.col-sm-4', 'ID:'),
            m('.col-sm-4', this.userVM.id)
          ]) : null
        ),
        m(validatedFormGroup, { errors, path: '/forename' }, [
          m('label.control-label.col-sm-4[for=forename]', 'Forename:'),
          m('.col-sm-4',
            m('input#forename.form-control[type=text]', {
              value: this.userVM.forename
            })
          )
        ]),
        m(validatedFormGroup, { errors, path: '/surname' }, [
          m('label.control-label.col-sm-4[for=surname]', 'Surname:'),
          m('.col-sm-4',
            m('input#surname.form-control[type=text]', {
              value: this.userVM.surname
            })
          )
        ]),
        m(validatedFormGroup, { errors, path: '/email' }, [
          m('label.control-label.col-sm-4[for=email]', 'Email:'),
          m('.col-sm-4',
            m('input#email.form-control[type=text]', {
              value: this.userVM.email
            })
          )
        ]),
        (isPersisted ?
          m('.form-group', [
            m('label.control-label.col-sm-4', 'Created at:'),
            m('.col-sm-4', this.getDate(this.userVM.created))
          ]) : null
        ),
        (isPersisted ?
          m('.form-group', [
            m('label.control-label.col-sm-4', 'Last updated at:'),
            m('.col-sm-4', this.getDate(this.userVM.updated))
          ]) : null
        ), [
          vnode.attrs.buttons,
          m('span.inter'),
          m(back)
        ]
      ]),
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