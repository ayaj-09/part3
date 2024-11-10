const express = require('express')
const logger = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())

logger.token('body',function(req,res){return JSON.stringify(req.body)})
app.use(logger(function(tokens,req,res){
  return [
    tokens.method(req,res),
    tokens.url(req,res),
    tokens.status(req,res),
    tokens.res(req,res,'content-length'), '-',
    tokens['response-time'](req,res), 'ms',
    tokens.body(req,res)
  ].join(' ')
}))

const errorHandler = (error,req,res,next)=>{
  console.log(error.message)
  if(error.name=="CastError"){
    return res.status(400).json({error:"malformed ID"})
  }
  else if (error.name=="ValidationError"){
    return res.status(400).json({error:error.message})
  }
  next(error)
}


app.get('/',(req,res)=>{
    res.end('<h1>Hello world</h1>')
})

app.get('/api/persons',(req,res)=>{
    Person.find({}).then(persons=>{
      res.json(persons)
    })
})

app.get('/info',(req,res)=>{
  Person.find({}).then(result=>{
    res.send(`<p>Phonebook has info for ${result.length} people</p> <p>${new Date()}</p>`)
  })
})

app.get('/api/persons/:id',(req,res,next)=>{
    Person.findById(req.params.id)
    .then(person=>{
      if(person){
        res.json(person)
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error=>{
      next(error)
    })
})

app.delete('/api/persons/:id',(req,res,next)=>{
    Person.findByIdAndDelete(req.params.id)
    .then(result=>{
      if(result){
        res.status(204).end()
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error=>next(error))
})


app.post('/api/persons',(req,res,next)=>{
  const body = req.body

  const person = new Person({
      name:body.name,
      number:body.number,
  })

  person.save()
  .then(savedPerson=>{
    res.json(savedPerson)
  })
  .catch(error=>next(error))
})

app.put('/api/persons/:id',(req,res,next)=>{
  const body = req.body
  const person = {
    name: body.name,
    number:body.number
  }
  Person.findByIdAndUpdate(req.params.id,person,{new:true,runValidators:true,context:'query'})
  .then(result=>{
    if(result){
      res.json(result)
    }
    else{
      res.status(404).end()
    }
  })
  .catch(error=>next(error))
})

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log('server is running on port',PORT)
