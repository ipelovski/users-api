'use strict';

const usersList = {
  oninit(vnode) {
    this.onSelectUser = vnode.attrs.onSelectUser;
    this.onRemoveUser = vnode.attrs.onRemoveUser;
  },
  view(vnode) {
    let users = vnode.attrs.users;
    if (users.hasValue()) {
      return m('.panel.panel-default', [
        m('.panel-heading', m('.h4', 'Users')),
        m('.panel-body',
          m('table.table.table-striped.table-hover', [
            this.tableHeader(),
            this.tableBody(this.toList(users.value))
          ])
        ),
      ]);
    }
  },
  toList(map) {
    return Array.from(map.values());
  },
  tableHeader() {
    return m('thead', m('tr', [
      m('th', 'ID'),
      m('th', 'Full Name'),
      m('th', 'Email'),
      m('th', 'Actions'),
    ]));
  },
  tableBody(users) {
    users.sort((a, b) => a.id - b.id);
    return m('tbody', users.map(this.tableRow, this));
  },
  tableRow(user) {
    return m('tr', { key: user.id }, [
      m('td', user.id),
      m('td',
        m('a[href=#]', {
          onclick: this.selectUser(user)
        }, user.forename + ' ' + user.surname)),
      m('td', m('a', { href: 'mailto:' + user.email }, user.email)),
      m('td',
        m('a.btn.btn-sm.btn-danger.glyphicon.glyphicon-remove-sign[href=#]', {
          onclick: this.removeUser(user),
          title: 'Remove',
        })
      ),
    ]);
  },
  selectUser(user) {
    return (e) => {
      e.preventDefault();
      this.onSelectUser(user);
    };
  },
  removeUser(user) {
    return (e) => {
      e.preventDefault();
      this.onRemoveUser(user);
    };
  }
};

module.exports = usersList;