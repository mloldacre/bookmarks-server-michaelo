const bookmarksRouter = require('express').Router();
const bodyParser = require('express').json();
const { v4: uuid } = require('uuid');
const logger = require('./logger');
const bookMarks = require('./bookStore');

bookmarksRouter
  .route('/')
  .get((req,res) => {
    res.json(bookMarks);
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
    
  });
  
module.exports = bookmarksRouter;