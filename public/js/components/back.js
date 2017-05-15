'use strict';

const back = {
  view() {
    return m('a.btn.btn-default[href=#]', { onclick: this.back.bind(this) }, 'Back');
  },
  back(e) {
    window.history.back();
  },
};

module.exports = back;