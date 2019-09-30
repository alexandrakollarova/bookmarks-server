require('dotenv').config() // need access to all sensitive data
const express = require('express') // add express framework
const morgan = require('morgan') // add morgan for logging
const cors = require('cors') // handle cors
const helmet = require('helmet') // hides info to prevent attacks againt known vulnerabilities of express
const { NODE_ENV } = require('./config') // get node environment
const validateBearerToken = require('./validate-bearer-token')
const errorHandler = require('./error-handler')
const bookmarksRouter = require('./bookmarks/bookmarks-route') // all routes

const app = express() 

const morganOption = (NODE_ENV === 'production') ? 'tiny': 'common'; // for production move keep it concise

app.use(morgan(morganOption)) 
app.use(helmet()) // helmet always before cors
app.use(cors())

app.use(validateBearerToken)

app.use(bookmarksRouter) 

app.use(errorHandler)

module.exports = app