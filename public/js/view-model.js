'use strict';

const Data = require('./data');

function ViewModel(value = {}) {
  this.value = value;
}

ViewModel.prototype.bindings = function () {
  return {
    onchange: (e) => {
      let propertyName = e.target.name || e.target.id;
      this.value[propertyName] = e.target.value;
    }
  };
};

ViewModel.prototype.toData = function () {
  return Data.withValue(this.value);
};

module.exports = ViewModel;