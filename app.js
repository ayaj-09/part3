const express = require('express')
const app = express()
const cors = require('cors')
const personRouter = require('./controllers/persons')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

const URI = config.MONGODB_URI

logger.info('Connecting to MONGO DB')

mongoose.set('strictQuery',false)

mongoose.connect(URI)
  .then(result => {
    logger.info('Connected to MONGO DB')
  })
  .catch(error => {
    logger.error(error.message)
  })


app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(middleware.requestLogger)

app.use('/api/persons',personRouter)

app.use(middleware.unknownEndPoint)
app.use(middleware.errorHandler)

module.exports = app