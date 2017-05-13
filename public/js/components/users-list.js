'use strict';

const usersList = {
  oninit(vnode) {
    this.onSelectUser = vnode.attrs.onSelectUser;
    this.onRemoveUser = vnode.attrs.onRemoveUser;
  },
  view(vnode) {
    let users = vnode.attrs.users;
    if (users.hasValue()) {
      return [
        m('h3', 'Users'),
        m('table', [
          this.tableHeader(),
          this.tableBody(this.toList(users.value))
        ]),
      ];
    }
  },
  toList(map) {
    return Array.from(map.values());
  },
  tableHeader() {
    return m('thead', m('tr', [
      m('th', 'ID'),
      m('th', 'Forename'),
      m('th', 'Surname'),
      m('th', 'Email')
    ]));
  },
  tableBody(users) {
    users.sort((a, b) => a.id - b.id);
    return m('tbody', users.map(this.tableRow, this));
  },
  tableRow(user) {
    return m('tr', { key: user.id }, [
      m('td', user.id),
      m('td', m('a[href=#]', { onclick: this.selectUser(user) }, user.forename)),
      m('td', m('a[href=#]', { onclick: this.selectUser(user) }, user.surname)),
      m('td', m('a', { href: 'mailto:' + user.email }, user.email)),
      m('td', m('a[href=#]', { onclick: this.removeUser(user) }, 'Remove')),
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