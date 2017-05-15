'use strict';

const validationMessage = {
  view(vnode) {
    this.errors = vnode.attrs.errors;
    this.path = vnode.attrs.path;
    if (this.errors != null) {
      return this.errors.map((error) => {
        if (error.dataPath === this.path) {
          return m('span', [
            m('span.glyphicon.glyphicon-info-sign'),
            m('span', error.message)
          ]);
        }
      });
    }
  }
};

module.exports = validationMessage;