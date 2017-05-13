'use strict';

const Router = require('koa-router');
const usersData = require('../data/users');

const router = new Router();

router.get('/', async (ctx) => {
  ctx.body = await usersData.all();
});

router.post('/', async (ctx) => {
  let user = ctx.request.body;
  ctx.body = await usersData.add(user);
});

router.get('/:id', async (ctx) => {
  let id = parseInt(ctx.params.id, 10);
  let user = await usersData.get(id);
  if (user !== null) {
    ctx.body = user;
  } else {
    // ctx throw error 404
  }
});

router.put('/:id', async (ctx) => {
  let id = parseInt(ctx.params.id, 10);
  let user = ctx.request.body;
  let updated = await usersData.update(id, user);
  if (updated) {
    ctx.body = true;
  } else {
    // ctx throw error 404
  }
});

router.delete('/:id', async (ctx) => {
  let id = parseInt(ctx.params.id, 10);
  let removed = await usersData.remove(id);
  if (removed) {
    ctx.body = true;
  } else {
    // ctx throw error 404
  }
});

router.post('/populate', async (ctx) => {
  ctx.body = await usersData.populate();
});


module.exports = router;