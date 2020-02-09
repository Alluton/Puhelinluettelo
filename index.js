const express = require('express')
var morgan= require('morgan')
const app = express()
app.use(express.static('build'))


app.use(express.json())
app.use(morgan('tiny'))
const cors = require('cors')
app.use(cors())
let persons = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1
  },
  {
    name: 'Ada Lovelace',
    number: '39-44-5235',
    id: 2,
  },
  {
    name: 'Dan Abramov',
    number: '44-123456789',
    id: 3,
  },
  {
      name: 'Mary Poppendieck',
      number:'56-45-122345',
      id: 4
  }
]

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/info',(reg, res)=>{
    const length = persons.length;
res.send('<p>'+'Phonebook has info for: ' + length +' people.'+'</p>'+ '<p>'+new Date()+'</p>')
})

const generateId = () => {
  const maxId = Math.floor(Math.random()*1000)
  return maxId
}

app.post('/api/persons', (request, response) => {
  const body = request.body
  console.log(request.headers)
  console.log(request.body)
  if (!body.name || !body.number) {
    return response.status(400).json({ 
      error: 'name or number missing' 
    })
  }
  if(persons.find(person => person.name==body.name)){
    return response.status(400).json({
        error: 'name must be unique'
    })
  }  
  if(persons.find(person => person.number==body.number)){
    return response.status(400).json({
        error: 'number must be unique'
    })
  } 

  const person = {
    name: body.name,
    number: body.number,
    date: new Date(),
    id: generateId(),
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => person.id === id)
  if (person) {
    response.json(person)
  } else {
    response.status(404).end()
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})