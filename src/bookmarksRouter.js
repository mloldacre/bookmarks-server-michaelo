const bookmarksRouter = require('express').Router();
const bodyParser = require('express').json();
const logger = require('./logger');
const bookmarksService = require('./bookmarksService');

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    bookmarksService.getAllBookmarks(knexInstance)
      .then(bookmark => {
        res.json(bookmark);
      })
      .catch(next);
  });

/* .post(bodyParser, (req, res) => {
  const { title, url, description, rating } = req.body;
  //Validation
  if (!title) {
    logger.error('Title is required');
    return res
      .status(400)
      .send('Invalid data');
  }

  if (!url) {
    logger.error('URL is required');
    return res
      .status(400)
      .send('Invalid data');
  }

  if (!description) {
    logger.error('Description is required');
    return res
      .status(400)
      .send('Invalid data');
  }

  if (!rating) {
    logger.error('Rating is required');
    return res
      .status(400)
      .send('Invalid data');
  }

  //Create bookmark
  const id = uuid();
  const bookmark = {
    id,
    title,
    url,
    description,
    rating
  };

  bookmarks.push(bookmark);
  logger.info(`Bookmark with id ${id} created`);

  res
    .status(201)
    .location(`http://localhost:8000/bookmarks/${id}`)
    .json(bookmark);

});
*/
bookmarksRouter
  .route('/:id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { id } = req.params;
    bookmarksService.getById(knexInstance, id)
      .then(bookmark => {
        if(!bookmark) {
          return res.status(404).json({
            error: { message: 'Bookmark doesn\'t exist'}
          });
        }
        res.json(bookmark);
      })
      .catch(next);
  });

/* .delete((req, res) => {
  const { id } = req.params;
  // eslint-disable-next-line eqeqeq
  const listIndex = bookmarks.findIndex(li => li.id == id);
  if (listIndex === -1) {
    logger.error(`Bookmark with id ${id} not found.`);
    return res
      .status(404)
      .send('Not Found');
  }

  bookmarks.splice(listIndex, 1);

  logger.info(`Bookmark with id ${id} deleted.`);
  res
    .status(204)
    .end();
}); */

module.exports = bookmarksRouter;