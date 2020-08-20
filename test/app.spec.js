/* eslint-disable quotes */
const app = require('../src/app');
const supertest = require('supertest');
const apiToken = process.env.API_TOKEN;
const { testStore, testParam, badTestParam } = require('../src/testData');


describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app)
      .get('/')
      .auth(apiToken, { type: 'bearer' })
      .expect(200, 'Hello, world!');
  });

  describe('bookmarksRouter', () => {
    it('GET /bookmarks responds with 200 containing bookmarks', () => {
      return supertest(app)
        .get('/bookmarks')
        .auth(apiToken, { type: 'bearer' })
        .expect(200)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('array');
        });
    });

    it('GET /bookmarks responds with 401 when api token isn\'t sent', () => {
      return supertest(app)
        .get('/bookmarks')
        .expect(401)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.be.an('object')
            .that.deep.include({ error: 'Unauthorized request' });
        });
    });

    //TODO Finish creating tests, follow CRUD method
    it('GET /bookmarks/:id responds with 200 if bookmark found', () => {
      return supertest(app)
        .get(`bookmarks/${testParam.id}`)
        .auth(apiToken, { type: 'bearer' })
        .expect(200);
    });
    
    it('GET /bookmarks/:id responds with 404 if bookmark not found', () => {
      return supertest(app)
        .delete(`/bookmarks/${badTestParam.id}`)
        .auth(apiToken, { type: 'bearer' })
        .expect(404, 'Not Found');
    });
    it('POST /bookmarks/ responds with 201 if bookmark created', () => {
      return supertest(app)
        .post('/bookmarks')
        .auth(apiToken, { type: 'bearer' })
        .send(testParam)
        .expect(201)
        .expect('Content-Type', /json/)
        .then(res => {
          expect(res.body).to.have.all.keys('description', 'id', 'rating', 'title', 'url');
        });
    });
    it('POST /bookmarks/ responds with 400 if "Invalid data"', () => {
      return supertest(app)
        .post('/bookmarks')
        .auth(apiToken, { type: 'bearer' })
        .send(badTestParam)
        .expect(400, 'Invalid data');
    });
    //TODO fix delete test
    it('DELETE /bookmarks/:id responds with 204 if bookmark successfully deleted', () => {
      return supertest(app)
        .delete(`/bookmarks/${testStore[testParam.id]}`)
        .auth(apiToken, { type: 'bearer' })
        .expect(204);
    });
    it('DELETE /bookmarks/:id responds with 404 and "Not Found" if bookmark is not found', () => {
      return supertest(app)
        .delete(`/bookmarks/${badTestParam.id}`)
        .auth(apiToken, { type: 'bearer' })
        .expect(404, 'Not Found');
    });
  });
});