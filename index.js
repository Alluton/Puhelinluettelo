require('dotenv').config()
const mongoose = require('mongoose')
const Person = require('./models/person')
if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}
const password = process.argv[2]
const url =
`mongodb+srv://fullstack:${password}@cluster0-hlvte.mongodb.net/person-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
name: String,
number: String,
date: Date
})
//koodinlisäys testi
//koodinlisäys testi
//koodinlisäystesti2
const express = require('express')
var morgan= require('morgan')
const app = express()
const cors = require('cors')

app.use(express.static('build'))
app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())

app.get('/api/persons', (request, response,next) => {
  Person.find({}).then(people => {
    response.json(people.map(person => person.toJSON()))
  })
  .catch(error=>next(error))
})

app.get('/api/info',(reg, res)=>{
    Person.countDocuments({},function(err,count){
      console.log('number of people: ' +count)
      res.send('<p>'+'Phonebook has info for: ' + count +' people.'+'</p>'+ '<p>'+new Date()+'</p>')
    })
})

const generateId = () => {
  const maxId = Math.floor(Math.random()*1000)
  return maxId
}
app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (!body.name||!body.number) {
    return response.status(400).json({ error: 'name or number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
    date: new Date(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson.toJSON())
  })
  .catch(error =>next(error))
})

app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end() 
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/delete/:id', (request, response,next) => {
  Person.findByIdAndRemove(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error =>next(error))
})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)



