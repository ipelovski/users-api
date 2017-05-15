'use strict';

const ViewModel = require('../view-model');

const searchBox = {
  oninit(vnode) {
    let searchText = vnode.attrs.searchText || '';
    this.searchVM = new ViewModel({ searchText });
    this.onSearch = vnode.attrs.onSearch;
  },
  view(vnode) {
    return m('div', vnode.attrs,
      m('form.form-inline', { onsubmit: this.search.bind(this) }, [
        m('input#searchText.form-control[type=text]', Object.assign({
          placeholder: 'Search...',
          value: this.searchVM.searchText,
        }, this.searchVM.bindings())),
        m('button.btn.btn-default', 'Search'),
      ])
    );
  },
  search(e) {
    e.preventDefault();
    this.onSearch(this.searchVM.searchText);
  },
};

module.exports = searchBox;