'use strict';

const Router = require('koa-router');
const usersRouter = require('./users');

const router = new Router();

router.get('/', (ctx) => {
  ctx.body = 'the api starts here';
});
router.use('/users', usersRouter.routes(), usersRouter.allowedMethods());
router.use('/', (ctx) => {
  throw 404;
});

module.exports = router;