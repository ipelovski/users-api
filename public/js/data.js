'use strict';

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

Data.withError = function (error) {
  return new Data(State.error, null, error);
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

module.exports = Data;