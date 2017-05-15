'use strict';

const fs = require('fs');
const path = require('path');
const Router = require('koa-router');
const apiRouter = require('./api');
const ask = require('../lib/ask');
const config = require('config');

const indexFilePath = path.resolve(__dirname, '..', 'views', 'index.html');
const router = new Router();
const apiAddress = config.port ?
  `//${config.path}:${config.port}/api` : `//${config.path}/api`;

router.use('/api', apiRouter.routes(), apiRouter.allowedMethods());
router.get('/*', index);

const appScripts = getStartScripts();
let indexFileContents = null;
async function index (ctx) {
  if (indexFileContents === null) {
    let indexFile = await ask(fs, 'readFile', indexFilePath);
    indexFileContents = new Function ('state', `return \`${indexFile}\``)({
      apiAddress,
      appScripts
    });
  }
  ctx.body = indexFileContents;
}

function getStartScripts() {
  if (process.env.NODE_ENV === 'production') {
    return `<script type="text/javascript" src="/js/app.bundle.js"></script>`;
  } else {
    return `<script type="text/javascript" src="/js/simple-require.js"></script>
<script type="text/javascript" src="/js/index.js"></script>`;
  }
}

module.exports = router;