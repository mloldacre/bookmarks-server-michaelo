/* eslint-disable quotes */
const app = require('../src/app');
const supertest = require('supertest');
const apiToken = process.env.API_TOKEN;



describe.skip('App', () => {
  it.skip('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .auth(apiToken, { type: 'bearer' })
      .expect(200, 'Hello, world!');
  });

});