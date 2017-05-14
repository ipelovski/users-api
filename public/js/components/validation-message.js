'use strict';

const validationMessage = {
  oninit(vnode) {
  },
  view(vnode) {
    this.errors = vnode.attrs.errors;
    this.path = vnode.attrs.path;
    if (this.errors != null) {
      return this.errors.map((error) => {
        if (error.dataPath === this.path) {
          return m('span.error', '! ' + error.message);
        }
      });
    }
  }
};

module.exports = validationMessage;