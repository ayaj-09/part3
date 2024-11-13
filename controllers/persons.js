const personRouter = require('express').Router()
const Person  = require('../models/person')

personRouter.get('/',(req,res) => {
  Person.find({}).then(persons => {
    res.json(persons)
  })
})

personRouter.get('/info',(req,res) => {
  Person.find({}).then(result => {
    res.send(`<p>Phonebook has info for ${result.length} people</p> <p>${new Date()}</p>`)
  })
})

personRouter.get('/:id',(req,res,next) => {
  Person.findById(req.params.id)
    .then(person => {
      if(person){
        res.json(person)
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

personRouter.delete('/:id',(req,res,next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      if(result){
        res.status(204).end()
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


personRouter.post('/',(req,res,next) => {
  const body = req.body

  const person = new Person({
    name:body.name,
    number:body.number,
  })

  person.save()
    .then(savedPerson => {
      res.json(savedPerson)
    })
    .catch(error => next(error))
})

personRouter.put('/:id',(req,res,next) => {
  const body = req.body
  const person = {
    name: body.name,
    number:body.number
  }
  Person.findByIdAndUpdate(req.params.id,person,{ new:true,runValidators:true,context:'query' })
    .then(result => {
      if(result){
        res.json(result)
      }
      else{
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})

module.exports = personRouter