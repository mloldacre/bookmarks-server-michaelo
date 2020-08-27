const bookmarksRouter = require('express').Router();
const bodyParser = require('express').json();
const logger = require('./logger');
const bookmarksService = require('./bookmarksService');
const xss = require('xss');

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db');
    bookmarksService.getAllBookmarks(knexInstance)
      .then(bookmark => {
        res.json(bookmark);
      })
      .catch(next);
  })
  .post(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const newBookmark = { title, url, description, rating };

    //Validation
    for (const [key, value] of Object.entries(newBookmark)) {
      // eslint-disable-next-line eqeqeq
      if (value == null) {
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        });
      }
    }

    if (rating > 5 || rating < 1) {
      logger.error('Rating should be between 1 and 5');
      return res
        .status(400)
        .send('Invalid data');
    }

    //Create bookmark
    bookmarksService.insertBookmark(
      req.app.get('db'), newBookmark
    )
      .then(bookmark => {
        res
          .status(201)
          .location(`/${bookmark.id}`)
          .json(bookmark);
      })
      .catch(next);
  });

bookmarksRouter
  .route('/:id')
  .all((req, res, next) => {
    const knexInstance = req.app.get('db');
    const { id } = req.params;
    bookmarksService.getById(knexInstance, id)
      .then(bookmark => {
        if (!bookmark) {
          return res.status(404).json({
            error: { message: 'Bookmark doesn\'t exist' }
          });
        }
        res.bookmark = bookmark;
        next();
      })
      .catch(next);
  })
  .get((req, res, next) => {
    res.json({
      id: res.bookmark.id,
      title: res.bookmark.title,
      url: res.bookmark.url,
      description: res.bookmark.description,
      rating: res.bookmark.rating
    });
  })
  .delete((req, res, next) => {
    bookmarksService.deleteBookmark(
      req.app.get('db'),
      req.params.id
    )
      .then(() => {
        res.status(204).end();
      }).catch(next);

    logger.info(`Log: Bookmark with id ${req.params.id} deleted.`);
  })
  .patch(bodyParser, (req, res, next) => {
    const { title, url, description, rating } = req.body;
    const updatedBookmark = { title, url, description, rating };

    const numberOfValues = Object.values(updatedBookmark).filter(Boolean).length;
    if (numberOfValues === 0) {
      return res.status(400).json({
        error: {
          message: 'Request body must contain either \'title\', \'url\' , \'content\' or \'rating\''
        }
      });
    }

    bookmarksService.updateBookmark(
      req.app.get('db'),
      req.params.id,
      updatedBookmark)
      .then(numOfRowsAffected => {
        res.status(204).end();
      })
      .catch(next);

  });

module.exports = bookmarksRouter;