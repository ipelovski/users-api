'use strict';

const Router = require('koa-router');
const usersRouter = require('./users');
const ValidationError = require('../lib/validate').ValidationError;

const router = new Router();

router.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof ValidationError) {
      ctx.status = 400;
      ctx.body = {
        errors: err.errors
      };
      ctx.app.emit('error', err, ctx);
    } else {
      throw err;
    }
  }
});

router.get('/', (ctx) => {
  ctx.body = 'the api starts here';
});

router.use('/users', usersRouter.routes(), usersRouter.allowedMethods());

router.use('/', (ctx) => {
  ctx.throw(404, 'Not found');
});

module.exports = router;