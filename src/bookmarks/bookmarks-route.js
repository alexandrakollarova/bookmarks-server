const express = require('express')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const bookmarks = require('../store')
const uuid = require('uuid/v4')
const logger = require('../logger')

bookmarksRouter
    .route('/bookmarks')
    .get((req, res) => {
        res.json(bookmarks)
    })
    .post(bodyParser, (req, res) => {
        let {title, rating, description} = req.body;
 
   if(!title) {
     logger.error('Title is required');
     return res
       .status(400)
       .send('Invalid data')
   }
 
   const defaultRating = '1'
   if (!rating) {
     rating = defaultRating
   }
 
   if(!description) {
     logger.error('Description is required');
     return res
       .status(400)
       .send('Invalid data')
   }
   
   const id = uuid()
 
   const bookmark = {
     id,
     title,
     rating,
     description
   }
 
   bookmarks.push(bookmark)
 
   logger.info(`Bookmark with id ${id} created`);
 
   res
     .status(201)
     .location(`http://localhost:8000/bookmarks/${id}`)
     .json(bookmark);
    })

bookmarksRouter
    .route('/bookmarks/:id')
    .get((req, res) => {
        const { id } = req.params;
        const bookmark = bookmarks.find(b => b.id == id);
 
        if (!bookmark) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res
            .status(404)
            .send('Bookmark Not Found');
        }
      
        res.json(bookmark);
    })
    .delete((req, res) => {
        const { id } = req.params;
 
        const bookmarkID = bookmarks.findIndex(bm => bm.id == id);
      
        if (bookmarkID === -1) {
          logger.error(`Bookmark with id ${id} not found.`);
          return res
            .status(404)
            .send('Not Found');
        }
      
        bookmarks.splice(bookmarkID, 1);
      
        logger.info(`Bookmark with id ${id} deleted.`);
        res
          .status(204)
          .end();
    })

 module.exports = bookmarksRouter