'use strict';

const usersRepository = require('../js/users-repository');

describe('bau', () => {
  it('should bau', async () => {
    let users = await usersResource.all().promise;
    expect(users).to.have.length(2);
  });
});