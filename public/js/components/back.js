'use strict';

const back = {
  view() {
    return m('a[href=#]', { onclick: this.back.bind(this) }, 'Back');
  },
  back(e) {
    window.history.back();
  },
};

module.exports = back;