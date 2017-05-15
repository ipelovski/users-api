'use strict';

const validationMessage = require('./validation-message');

const validatedFormGroup = {
  view(vnode) {
    let errors = vnode.attrs.errors;
    let path = vnode.attrs.path;
    let hasError = errors != null &&
      errors.some((error) => error.dataPath === path);

    return m('.form-group', {
      class: hasError ? 'has-error' : null
    }, [
      vnode.children,
      m('.col-sm-4.text-left.text-danger', [m(validationMessage, { errors, path })])
    ]);
  }
};

module.exports = validatedFormGroup;