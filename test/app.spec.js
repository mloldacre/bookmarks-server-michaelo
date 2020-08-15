const app = require('../src/app');
const apiToken = process.env.API_TOKEN;

const testData = {
  'title': 'TestOne',
  'url': 'www.test.com',
  'description': 'Test',
  'rating': 1
};

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
        .expect(200)
        .auth(apiToken, { type: 'bearer' })
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
    it('GET /bookmarks/:id responds with 200 if bookmark found');
    it('GET /bookmarks/:id responds with 404 if bookmark not found');
    it('POST /bookmarks/ responds with 201 if bookmark created');
    it('POST /bookmarks/ responds with 400 if invalid data sent');
    it('DELETE /bookmarks/:id responds with 204 if bookmark successfully deleted');
    it('DELETE /bookmarks/:id responds with 404 and "Not Found" if bookmark is not found');
  });
});