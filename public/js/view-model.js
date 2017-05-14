'use strict';

const Data = require('./data');

function ViewModel(value = {}) {
  Object.assign(this, value);
}

ViewModel.prototype.bindings = function () {
  return {
    onchange: (e) => {
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