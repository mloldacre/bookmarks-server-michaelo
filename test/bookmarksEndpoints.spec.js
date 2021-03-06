/* eslint-disable quotes */
const app = require('../src/app');
const supertest = require('supertest');
const knex = require('knex');
const apiToken = process.env.API_TOKEN;
const { makeBookmarks, testParam, badTestParam, updateBookmark } = require('./bookmarks.fixtures');
const { expect } = require('chai');


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
  describe('GET /api/bookmarks', () => {
    context('Given no bookmarks', () => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/bookmarks')
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

      it('GET /api/bookmarks responds with 200 containing bookmarks', () => {
        return supertest(app)
          .get('/api/bookmarks')
          .auth(apiToken, { type: 'bearer' })
          .expect(200, testBookmarks);
      });

      it('GET /api/bookmarks responds with 401 when api token isn\'t sent', () => {
        return supertest(app)
          .get('/api/bookmarks')
          .expect(401)
          .expect('Content-Type', /json/)
          .then(res => {
            expect(res.body).to.be.an('object')
              .that.deep.include({ error: 'Unauthorized request' });
          });
      });
    });

  });

  describe('GET /api/bookmarks/:id', () => {
    context('Given no bookmarks', () => {
      it('responds with 404', () => {
        return supertest(app)
          .get(`/api/bookmarks/${badTestParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testBookmarks = makeBookmarks();

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testBookmarks);
      });

      it('GET /api/bookmarks/:id responds with 404 if bookmark not found', () => {
        return supertest(app)
          .get(`/api/bookmarks/${badTestParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
      });

      it('GET /api/bookmarks/:id responds with 200 if bookmark found', () => {
        return supertest(app)
          .get(`/api/bookmarks/${testParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(200);
      });
    });
  });

  describe.only('POST /api/bookmarks', () => {
    it.only('POST /api/bookmarks/ responds with 201 and bookmark if created', () => {

      return supertest(app)
        .post('/api/bookmarks')
        .auth(apiToken, { type: 'bearer' })
        .send(testParam)
        .expect(201)
        .expect('Content-Type', /json/)
        .expect(res => {
          expect(res.body).to.have.all.keys('description', 'id', 'rating', 'title', 'url');
          expect(res.body.title).to.eql(testParam.title);
          expect(res.body.description).to.eql(testParam.description);
          expect(res.body.url).to.eql(testParam.url);
          expect(res.body.rating).to.eql(testParam.rating);
          expect(res.headers.location).to.eql(`/${res.body.id}`);
        })
        .then(postRes =>
          supertest(app)
            .get(`/api/bookmarks/${postRes.body.id}`)
            .auth(apiToken, { type: 'bearer' })
            .expect(postRes.body)
        );
    });

    const requiredFields = ['title', 'url', 'description', 'rating'];
    requiredFields.forEach(field => {
      const { title, url, description, rating } = testParam;
      const newBookmark = { title, url, description, rating };

      it(`POST /api/bookmarks/ responds with 400 and message when missing ${field} `, () => {
        delete newBookmark[field];

        return supertest(app)
          .post('/api/bookmarks')
          .auth(apiToken, { type: 'bearer' })
          .send(newBookmark)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          });
      });

    });
  });


  describe('DELETE /api/bookmarks', () => {
    context('Given no bookmarks', () => {
      it('DELETE /api/bookmarks/:id responds with 404 and message if bookmark is not found', () => {
        return supertest(app)
          .delete(`/api/bookmarks/${badTestParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
      });
    });
    context('Given bookmarks are in database', () => {
      const testDatabase = makeBookmarks();

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testDatabase);
      });

      it('DELETE /api/bookmarks/:id responds with 204 if bookmark successfully deleted', () => {
        const expectedBookmarks = testDatabase.filter(bookmark => bookmark.id !== testParam.id);
        return supertest(app)
          .delete(`/api/bookmarks/${testParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(204)
          .then(res => supertest(app)
            .get('/api/bookmarks')
            .auth(apiToken, { type: 'bearer' })
            .expect(expectedBookmarks)
          );
      });
      it('DELETE /api/bookmarks/:id responds with 404 and message if bookmark is not found', () => {
        return supertest(app)
          .delete(`/api/bookmarks/${badTestParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
      });
    });
  });

  describe('PATCH /api/bookmarks/:id', () => {
    context('Given no bookmarks', () => {
      it('responds with 404', () => {

        return supertest(app)
          .patch(`/api/bookmarks/${badTestParam.id}`)
          .auth(apiToken, { type: 'bearer' })
          .expect(404, { error: { message: 'Bookmark doesn\'t exist' } });
      });
    });

    context('Given there are bookmarks in the database', () => {
      const testDatabase = makeBookmarks();

      beforeEach('insert bookmarks', () => {
        return db
          .into('bookmarks')
          .insert(testDatabase);
      });

      it('responds with 204 and updates the bookmark', () => {
        const idToUpdate = 6;

        const expectedBookmark = {
          ...testDatabase[idToUpdate - 1],
          ...updateBookmark
        }
        return supertest(app)
          .patch(`/api/bookmarks/${idToUpdate}`)
          .auth(apiToken, { type: 'bearer' })
          .send(updateBookmark)
          .expect(204)
          .then(res => supertest(app)
            .get(`/api/bookmarks/${idToUpdate}`)
            .auth(apiToken, { type: 'bearer' })
            .expect(expectedBookmark));
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/bookmarks/${idToUpdate}`)
          .auth(apiToken, { type: 'bearer' })
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: 'Request body must contain either \'title\', \'url\' , \'content\' or \'rating\''
            }
          })
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2

        const expectedBookmark = {
          ...testDatabase[idToUpdate - 1],
          ...updateBookmark
        }

        return supertest(app)
          .patch(`/api/bookmarks/${idToUpdate}`)
          .auth(apiToken, { type: 'bearer' })
          .send({
            ...updateBookmark,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/bookmarks/${idToUpdate}`)
              .auth(apiToken, { type: 'bearer' })
              .expect(expectedBookmark)
          )
      })
    });
  });
});

