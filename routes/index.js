'use strict';

const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const apiRouter = require('./api');
const ask = require('../lib/ask');
const config = require('../config');

const indexFilePath = path.resolve(__dirname, '..', 'views', 'index.html');
const router = new Router();

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
router.get('/*', index);

let indexFileContents = null;
async function index (ctx) {
  if (indexFileContents === null) {
    let indexFile = await ask(fs, 'readFile', indexFilePath);
    indexFileContents = new Function ('state', `return \`${indexFile}\``)({
      apiAddress: config.apiAddress
    });
  }
  ctx.body = indexFileContents;
}

module.exports = router;