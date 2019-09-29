const express = require('express')
const bookmarksRouter = express.Router()
const bodyParser = express.json()
const bookmarks = require('../store')
const uuid = require('uuid/v4')
const logger = require('../logger')
const BookmarksService = require('../bookmarks-service')

const serializeBookmark = bookmark => ({
  id: bookmark.id,
  title: bookmark.title,
  url: bookmark.url,
  description: bookmark.description,
  rating: Number(bookmark.rating),
})

bookmarksRouter
    .route('/bookmarks')
    .get((req, res, next) => {
        BookmarksService.getAllBookmarks(req.app.get('db'))
          .then(bookmarks => {
            res.json(bookmarks.map(serializeBookmark))
          })
          .catch(next)
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
    .get((req, res, next) => {
      
      BookmarksService.getById(req.app.get('db'), Number(req.params.id))
      .then(bookmark => {
        if (!bookmark) {
          logger.error(`Bookmark with id ${req.params.id} not found.`)
          return res.status(404).json({
            error: { message: `Bookmark Not Found` }
          })
        }
        res.json(serializeBookmark(bookmark))
      })
      .catch(next => console.log(next))
    })
    .delete((req, res) => {
 
        const bookmarkID = bookmarks.findIndex(bm => bm.req.params.id == req.params.id);
      
        if (!bookmarkID) {
          logger.error(`Bookmark with id ${req.params.id} not found.`);
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