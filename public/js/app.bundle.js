/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 13);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const State = {
  pending: 'pending',
  ready: 'ready',
  error: 'error',
};

function Data(state = State.ready, value = null, error = null) {
  this.state = state;
  this.value = value;
  this.error = error;
}

Data.withValue = function (value) {
  return new Data(State.ready, value);
};

Data.withError = function (error, value) {
  return new Data(State.error, value, error);
};

Data.pending = function () {
  return new Data(State.pending);
};

Data.prototype.hasValue = function () {
  return this.state === State.ready && this.value !== null;
};

Data.prototype.hasError = function () {
  return this.state === State.error && this.error !== null;
};

Data.prototype.isPending = function () {
  return this.state === State.pending;
};

Data.prototype.isEmpty = function () {
  return this.state === State.ready && this.value === null;
};

module.exports = Data;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Data = __webpack_require__(0);

const config = UsersApp.config;
const apiAddress = config.apiAddress;

const usersRepository = {
  users: new Data(),
  listToMap(list) {
    return list.reduce((m, v) => m.set(v.id, v), new Map());
  },
  all() {
    if (this.users.isEmpty()) {
      this.users = Data.pending();
      m.request({
          method: 'get',
          url: apiAddress + '/users'
        })
        .then(
          (value) => this.users = Data.withValue(this.listToMap(value)),
          (error) => this.users = Data.withError(error));
    }
    return this.users;
  },
  reload() {
    this.users = new Data();
    return this.all();
  },
  get(id) {
    if (this.users.hasValue()) {
      if (this.users.value.has(id)) {
        return stream(Data.withValue(this.users.value.get(id)));
      } else {
        return stream(Data.withError('Not found'));
      }
    } else {
      let stream2 = stream(Data.pending());
      m.request({
          method: 'get',
          url: apiAddress + '/users/' + id
        })
        .then(
          (value) => stream2(Data.withValue(value)),
          (error) => stream2(Data.withError(error)));

      return stream2;
    }
  },
  emptyUser() {
    return {
      forename: '',
      surname: '',
      email: '',
    };
  },
  search(text) {
    return m.request({
      method: 'get',
      url: apiAddress + '/users/search/' + text
    }).then((value) => Data.withValue(this.listToMap(value)));
  },
  add(user) {
    return m.request({
      method: 'post',
      url: apiAddress + '/users',
      data: user.value
    }).then(() => this.reload());
  },
  update(user) {
    return m.request({
      method: 'put',
      url: apiAddress + '/users/' + user.value.id,
      data: user.value,
      extract
    }).then(() => this.reload())
  },
  remove(id) {
    return m.request({
      method: 'delete',
      url: apiAddress + '/users/' + id,
      extract
    }).then(() => this.reload());
  },
  populate(count) {
    return m.request({
      method: 'post',
      url: apiAddress + '/users/populate',
      data: { count },
      extract
    }).then(() => this.reload());
  }
};

function deserialize(data, raise) {
  try {
    return data !== '' ? JSON.parse(data) : null;
  } catch (e) {
    if (raise) {
      throw new Error(data);
    } else {
      return null;
    }
  }
}

function extract(xhr) {
  if (xhr.status >= 200 && xhr.status < 300) {
    return deserialize(xhr.responseText, false);
  } else {
    return deserialize(xhr.responseText, true);
  }
}

module.exports = usersRepository;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ViewModel = __webpack_require__(6);

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

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const ViewModel = __webpack_require__(6);
const back = __webpack_require__(11);
const validationMessage = __webpack_require__(5);
const validatedFormGroup = __webpack_require__(12);

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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


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

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Data = __webpack_require__(0);

function ViewModel(value = {}) {
  Object.assign(this, value);
}

ViewModel.prototype.bindings = function () {
  return {
    oninput: (e) => {
      let propertyName = e.target.name || e.target.id;
      this[propertyName] = e.target.value;
    }
  };
};

ViewModel.fromData = function (data) {
  return new ViewModel(Object.assign({}, data.value));
};

ViewModel.prototype.toData = function () {
  return Data.withValue(this);
};

module.exports = ViewModel;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Data = __webpack_require__(0);
const usersRepository = __webpack_require__(1);
const userForm = __webpack_require__(3);

const addUser = {
  oninit() {
    this.user = stream(Data.withValue(usersRepository.emptyUser()));
  },
  view(vnode) {
    return m('.panel.panel-default.text-center', [
      m('.panel-heading', m('h4', 'Add New User')),
      m('.panel-body',
        m(userForm, Object.assign(vnode.attrs, {
          user: this.user,
          onSubmit: (userVM) => {
            m.route.set(m.route.get(), null, { replace: true });
            usersRepository.add(userVM.toData())
              .then(() => m.route.set('/'),
                (error) => this.user(Data.withError(error, this.user().value)));
          },
          buttons: [
            m('button.btn.btn-default', 'Add')
          ]
        }))
      )
    ]);
  }
};

module.exports = addUser;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Data = __webpack_require__(0);
const usersRepository = __webpack_require__(1);
const userForm = __webpack_require__(3);

const editUser = {
  oninit() {
    this.userId = parseInt(m.route.param('id'), 10);
    this.user = usersRepository.get(this.userId);
  },
  view(vnode) {
    return m('.panel.panel-default.text-center', (() => {
      if (this.user().isPending()) {
        return m('.panel-heading', m('.h4', 'Loading...'));
      } else {
        if (this.user().hasError() && this.user().error.message === 'Not found') {
          return m('.panel-heading', m('.h4', 'Not found'));
        }
        return [
          m('.panel-heading', m('h4', 'Editing User')),
          m('.panel-body', [
            m(userForm, Object.assign(vnode.attrs, {
              user: this.user,
              onSubmit: (userVM) => {
                m.route.set(m.route.get(), null, { replace: true });
                usersRepository.update(userVM.toData())
                  .then(() => m.route.set('/'),
                    (error) => this.user(Data.withError(error, this.user().value)));
              },
              buttons: [
                m('button.btn.btn-default', 'Update')
              ]
            }))
          ])
        ];
      }
    })());
  }
};

module.exports = editUser;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const Data = __webpack_require__(0);
const usersRepository = __webpack_require__(1);
const usersList = __webpack_require__(4);
const searchBox = __webpack_require__(2);

const searchUsers = {
  oninit() {
    this.searchText = m.route.param('key') || '';
    this.users = Data.pending();
    usersRepository.search(this.searchText)
      .then((users) => this.users = users);
  },
  view() {
    let users = this.users;
    return m('.panel.panel-default.text-center', (() => {
      if (users.isPending()) {
        return m('.panel-heading', m('.h4', 'Loading...'));
      } else if (users.hasValue()) {
        return m('.panel-body', [
          m(searchBox, {
            class: 'slightly-bottomful',
            onSearch: this.search.bind(this),
            searchText: this.searchText
          }),
          (users.value.size > 0
            ? m(usersList, {
              users,
              onSelectUser: this.selectUser,
              onRemoveUser: this.removeUser.bind(this)
            })
            : m('.panel.panel-default', [
                m('.panel-body', [
                  m('.h3', 'No users found')
                ])
              ])
          ),
          m('.bottomful',
            m('a.btn.btn-default[href=/]', {
              oncreate: m.route.link
            }, 'Back to list')
          ),
        ]);
      } else if (users.hasError()) {
        return m('.panel-heading', m('.h4', 'Error: ' + users.error.message));
      }
    })());
  },
  search(text) {
    m.route.set('/search/' + text);
  },
  selectUser(user) {
    m.route.set('/edit/' + user.id);
  },
  removeUser(user) {
    usersRepository.remove(user.id)
      .then(() => {
        usersRepository.search(this.searchText)
          .then((users) => this.users = users);
      });
  },
  populateUsers(e) {
    e.preventDefault();
    usersRepository.populate(5);
  },
};

module.exports = searchUsers;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const usersRepository = __webpack_require__(1);
const usersList = __webpack_require__(4);
const searchBox = __webpack_require__(2);

const usersView = {
  view() {
    let users = usersRepository.all();
    return m('.panel.panel-default.text-center', (() => {
      if (users.isPending()) {
        return m('.panel-heading', m('.h4', 'Loading...'));
      } else if (users.hasValue()) {
        return m('.panel-body', [
          m(searchBox, {
            class: 'slightly-bottomful',
            onSearch: this.search.bind(this)
          }),
          m(usersList, {
            users,
            onSelectUser: this.selectUser,
            onRemoveUser: this.removeUser
          }),
          m('.bottomful', [
            m('a.btn.btn-default[href=/add]', {
              oncreate: m.route.link
            }, 'Add'),
            m('span.inter', ' or '),
            m('a.btn.btn-default[href=#]', {
              onclick: this.populateUsers.bind(this)
            }, 'Add random')
          ])
        ]);
      } else if (users.hasError()) {
        return m('.panel-heading', m('.h4', 'Error: ' + users.error.message));
      }
    })());
  },
  search(text) {
    m.route.set('/search/' + text);
  },
  selectUser(user) {
    m.route.set('/edit/' + user.id);
  },
  removeUser(user) {
    usersRepository.remove(user.id);
  },
  populateUsers(e) {
    e.preventDefault();
    usersRepository.populate(5);
  },
};

module.exports = usersView;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const back = {
  view() {
    return m('a.btn.btn-default[href=#]', { onclick: this.back.bind(this) }, 'Back');
  },
  back(e) {
    window.history.back();
  },
};

module.exports = back;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const validationMessage = __webpack_require__(5);

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

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


const usersView = __webpack_require__(10);
const searchUsers = __webpack_require__(9);
const addUser = __webpack_require__(7);
const editUser = __webpack_require__(8);

const config = UsersApp.config;
const root = document.getElementById('container');

m.route.prefix('');

m.route(root, config.baseUrl, {
  '/': usersView,
  // previously '/search/:text': searchUsers,
  // see problem on https://github.com/MithrilJS/mithril.js/issues/1180
  // and solution on https://mithril.js.org/route.html#key-parameter
  '/search/:key': searchUsers,
  '/search/': searchUsers,
  '/add': addUser,
  '/edit/:id': editUser
});

/***/ })
/******/ ]);