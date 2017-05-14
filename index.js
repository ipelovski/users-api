'use strict';

const path = require('path');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const config = require('config');
const router = require('./routes/index');

const publicDirPath = path.resolve(__dirname, 'public');
const app = new Koa();
const port = process.env.PORT || config.port;

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = err.message;
    ctx.app.emit('error', err, ctx);
  }
});
app.use(bodyParser({
  enableTypes: ['json'],
  jsonLimit: '1kb',
}));
app.use(serve(publicDirPath));
app.use(router.routes(), router.allowedMethods());

app.on('error', (err) => {
  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }
});

app.listen(port);

// TODO Add webpack and production env

module.exports = app;