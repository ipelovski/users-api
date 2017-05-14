'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const config = require('config');
const app = require('../index');
const users = require('../data/users');

const url = `${config.path}:${config.port}`;
const notFoundText = 'Not found';
const expect = chai.expect;
chai.use(chaiHttp);

function generateUser() {
  return {
    forename: 'Pesho',
    surname: 'Goshkov',
    email: 'pesho.goshkov@goshkov.com',
  };
}

describe('Users', function () {

  beforeEach(async function () {
    await users.clear();
  });

  describe('Retrieve', function () {
    
    it('should retrieve all users', async function () {

      let usersCount = 5;
      await users.populate(usersCount);

      let res = await chai.request(url)
        .get('/api/users');
      
      expect(res).to.have.status(200);
      expect(res.body).to.have.length(usersCount);
    });

    it('should retrieve a specific user', async function () {

      let usersCount = 5;
      let userId = 0;
      await users.populate(usersCount);

      let res = await chai.request(url)
        .get('/api/users/' + userId);
      
      expect(res).to.have.status(200);
      let user = res.body;
      expect(user).to.have.property('id');
      expect(user.id).to.equal(userId);
    });

    it('should find a specific user', async function () {

      let usersCount = 5;
      await users.populate(usersCount);
      let storedUser = await users.add(generateUser());

      let res = await chai.request(url)
        .get('/api/users/search/' + storedUser.email);
      
      expect(res).to.have.status(200);
      let foundUsers = res.body;
      expect(foundUsers).to.have.length(1);
      let user = foundUsers[0];
      expect(user).to.deep.equal(storedUser);
    });

    it('should find no users', async function () {

      let usersCount = 5;
      await users.populate(usersCount);

      let res = await chai.request(url)
        .get('/api/users/search/zzzz');
      
      expect(res).to.have.status(200);
      let foundUsers = res.body;
      expect(foundUsers).to.have.length(0);
    });

    it('should find all users', async function () {

      let usersCount = 5;
      await users.populate(usersCount);

      let res = await chai.request(url)
        .get('/api/users/search/');
      
      expect(res).to.have.status(200);
      let foundUsers = res.body;
      expect(foundUsers).to.have.length(usersCount);
    });

    it('should fail for non existing user', async function () {

      let usersCount = 5;
      let userId = 10;
      await users.populate(usersCount);

      let error;
      try {
        await chai.request(url)
          .get('/api/users/' + userId);
      } catch (err) {
        error = err;
      }
      
      expect(error).to.exist;
      expect(error).to.have.status(404);
      expect(error.response.text).to.equal(notFoundText);
    });

    it('should fail for invalid id', async function () {

      let usersCount = 5;
      let userId = 'invalid';
      await users.populate(usersCount);

      let error;
      try {
        await chai.request(url)
          .get('/api/users/' + userId);
      } catch (err) {
        error = err;
      }
      
      expect(error).to.exist;
      expect(error).to.have.status(400);
      let errors = error.response.body.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].keyword).to.equal('minimum');
    });
  });

  describe('Create', function () {
    
    it('should create a user', async function () {

      let res = await chai.request(url)
        .post('/api/users')
        .send(generateUser());
      
      expect(res).to.have.status(201);
      let user = res.body;
      expect(user).to.have.property('id');
      let storedUser = await users.get(user.id);
      expect(storedUser).to.deep.equal(user);
    });

    it('should create random users', async function () {

      let usersCount = 5;

      let res = await chai.request(url)
        .post('/api/users/populate')
        .send({ count: usersCount });
      
      expect(res).to.have.status(201);
      let storedUsers = await users.all();
      expect(storedUsers).to.have.length(usersCount);
    });

    it('should fail for invalid user', async function () {

      let user = generateUser();
      user.forename = '';
      let error;
      try {
        await chai.request(url)
          .post('/api/users')
          .send(user);
      } catch (err) {
        error = err;
      }
      
      expect(error).to.exist;
      expect(error).to.have.status(400);
      let errors = error.response.body.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].dataPath).to.equal('/forename');
      expect(errors[0].keyword).to.equal('minLength');
    });
  });

  describe('Update', function () {

    it('should update a user', async function () {

      let storedUser = await users.add(generateUser());

      let user = Object.assign({}, storedUser, {
        forename: 'Gosho',
        surname: 'Peshov',
        email: 'gosho.peshov@peshov.com',
      });

      let res = await chai.request(url)
        .put('/api/users/' + storedUser.id)
        .send(user);

      expect(res).to.have.status(200);
      storedUser = await users.get(storedUser.id);
      expect(storedUser).to.exist;
      user.updated = storedUser.updated;
      expect(storedUser).to.deep.equal(user);
    });

    it('should fail for non existing user', async function () {

      let error;
      try {
        await chai.request(url)
          .put('/api/users/0')
          .send(generateUser());
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(error).to.have.status(404);
      expect(error.response.text).to.equal(notFoundText);
    });

    it('should fail for invalid user', async function () {

      let storedUser = await users.add(generateUser());

      let user = Object.assign({}, storedUser, {
        forename: '',
        surname: 'Peshov',
        email: 'gosho.peshov@peshov.com',
      });

      let error;
      try {
        await chai.request(url)
          .put('/api/users/' + storedUser.id)
          .send(user);
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(error).to.have.status(400);
      let errors = error.response.body.errors;
      expect(errors).to.have.length(1);
      expect(errors[0].dataPath).to.equal('/forename');
      expect(errors[0].keyword).to.equal('minLength');
    });
  });

  describe('Delete', function () {

    it('should delete a user', async function () {

      let storedUser = await users.add(generateUser());

      let res = await chai.request(url)
        .delete('/api/users/' + storedUser.id);

      expect(res).to.have.status(200);
      storedUser = await users.get(storedUser.id);
      expect(storedUser).not.to.exist;
    });

    it('should fail for non existing user', async function () {

      let error;
      try {
        await chai.request(url)
          .delete('/api/users/0');
      } catch (err) {
        error = err;
      }

      expect(error).to.exist;
      expect(error).to.have.status(404);
      expect(error.response.text).to.equal(notFoundText);
    });
  });
});