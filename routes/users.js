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
  ctx.status = 201;
});

router.get('/search/:text?', async (ctx) => {
  let text = ctx.params.text || '';
  ctx.body = await usersData.search(text);
});

router.get('/:id', async (ctx) => {
  let id = parseInt(ctx.params.id, 10);
  let user = await usersData.get(id);
  if (user !== null) {
    ctx.body = user;
  } else {
    ctx.throw(404, 'Not found');
  }
});

router.put('/:id', async (ctx) => {
  let id = parseInt(ctx.params.id, 10);
  let user = ctx.request.body;
  try {
    await usersData.update(id, user);
    ctx.status = 200;
  } catch (err) {
    if (err.message === 'Not found') {
      ctx.throw(404, 'Not found');
    } else {
      throw err;
    }
  }
});

router.delete('/:id', async (ctx) => {
  let id = parseInt(ctx.params.id, 10);
  try {
    await usersData.delete(id);
    ctx.status = 200;
  } catch (err) {
    if (err.message === 'Not found') {
      ctx.throw(404, 'Not found');
    } else {
      throw err;
    }
  }
});

router.post('/populate', async (ctx) => {
  let count = ctx.request.body.count;
  await usersData.populate(count);
  ctx.status = 201;
});

module.exports = router;