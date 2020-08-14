const bookmarksRouter = require('express').Router();
const bodyParser = require('express').json();
const { v4: uuid } = require('uuid');
const logger = require('./logger');
const { bookmarks}  = require('./bookStore');

bookmarksRouter
  .route('/')
  .get((req,res) => {
    res.json(bookmarks);
  })
  .post(bodyParser, (req,res) => {
    const { title, url, description, rating} = req.body;
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
  
module.exports = bookmarksRouter;