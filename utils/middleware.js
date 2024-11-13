const logger = require('./logger')
const morgan = require('morgan')

const requestLogger = morgan(function(tokens,req,res){
  return [
    tokens.method(req,res),
    tokens.url(req,res),
    tokens.status(req,res),
    tokens.res(req,res,'content-length'), '-',
    tokens['response-time'](req,res), 'ms',
    tokens.body(req,res)
  ].join(' ')
})

morgan.token('body',function(req,res){return JSON.stringify(req.body)})

const errorHandler = (error,req,res,next) => {
  console.log(error.message)
  if(error.name==='CastError'){
    return res.status(400).json({ error:'malformed ID' })
  }
  else if (error.name==='ValidationError'){
    return res.status(400).json({ error:error.message })
  }
  next(error)
}

const unknownEndPoint = (req,res,next) => {
  res.status(404).send('unknow endpoint')
}


module.exports = {
  requestLogger,
  errorHandler,
  unknownEndPoint
}