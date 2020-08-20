/* eslint-disable quotes */
const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const apiToken = process.env.API_TOKEN;
const { makeBookmarks, testParam, badTestParam } = require('./bookmarks.fixtures');


describe.only('Bookmarks Endpoints', () => {
  //Create and set test DB
  let db;
  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });
  before('clean the table', () => db('bookmarks').truncate());
  afterEach('cleanup', () => db('bookmarks').truncate());

  //Start tests
  describe('GET /bookmarks', () => {
    context('Given no bookmarks', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/bookmarks')
          .auth(apiToken, { type: 'bearer' })
          .expect(200, []);
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarks();

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks);
      });

      it('GET /bookmarks responds with 200 containing bookmarks', () => {
        return supertest(app)
          .get('/bookmarks')
          .auth(apiToken, { type: 'bearer' })
          .expect(200, testBookmarks);
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
    });

  });
  
  describe('GET /bookmarks/:id', () => {
    context('Given no bookmarks', () => {
      it('responds with 404', () => {
        return supertest(app)
          .get(`/bookmarks/${badTestParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(404, {  error: { message: 'Bookmark doesn\'t exist' } });
      });
    });
    
    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarks();

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks);
      });
      
      it('GET /bookmarks/:id responds with 404 if bookmark not found', () => {
        return supertest(app)
          .get(`/bookmarks/${badTestParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
      });
      
      it('GET /bookmarks/:id responds with 200 if bookmark found', () => {
        return supertest(app)
          .get(`/bookmarks/${testParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(200);
      }); 
    });  
  });






  /*  
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
    }); */
});
