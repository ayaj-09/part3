const express = require('express')
const logger = require('morgan')
const app = express()
const cors = require('cors')

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


let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/',(req,res)=>{
    res.end('<h1>Hello world</h1>')
})

app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/info',(req,res)=>{
    res.send(`<p>Phonebook has info for ${persons.length} people</p> <p>${new Date()}</p>`)
})

app.get('/api/persons/:id',(req,res)=>{
    const id = req.params.id
    const person = persons.find(p=>p.id===id)
    if(!person){
        return res.status(404).end()
    }
    res.json(person)
})

app.delete('/api/persons/:id',(req,res)=>{
    const id = req.params.id
    persons = persons.filter(p=>p.id!==id)
    res.status(204).end()
})

const generateId = () => {
  const randomId = Math.random()*100
  return String(randomId)
}

app.post('/api/persons',(req,res)=>{
  const body = req.body
  if(!(body.name&&body.number)){
    return res.status(400).json({error:'name and number must be given'})
  }
  if(persons.some(p=>p.name.toLowerCase()===body.name.toLowerCase())){
    return res.status(409).json({error:'name must be unique'})
  }

  const person = {
    name:body.name,
    number:body.number,
    id:generateId()
  }
  persons = persons.concat(person)
  console.log(person)
  res.status(201).json(person)

})

const PORT = process.env.PORT || 3001
app.listen(PORT)
console.log('server is running on port',PORT)
