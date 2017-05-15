'use strict';

const path = require('path');

module.exports = {
  entry: './public/js/index.js',
  output: {
    path: path.resolve(__dirname, 'public', 'js'),
    filename: 'app.bundle.js'
  }
};