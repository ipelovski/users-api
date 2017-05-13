'use strict';

module.exports = function ask(object, method, ...args) {
  return new Promise((resolve, reject) => {
    object[method](...args, (err, r) => {
      if (err) {
        reject(err);
      } else {
        resolve(r);
      }
    });
  });
};