const express = require('express')
const app = express()
const morgan = require('morgan')
const PORT = 3001

// In order to access the data easily, we need the help of the express json-parser that is taken to use with command app.use(express.json()).

app.use(express.json())
app.use(morgan('tiny :object'))

morgan.token('object', (req, res) => {
    return `${JSON.stringify(req.body)}`
})

//app.use(morgan(':method :url :status :res[content-length] - :response-time ms :object'))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const currentDate = new Date()
    res.send(`<h2>Phonebook has info for ${persons.length} people</h2> <h2>${currentDate}</h2>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const entry = persons.find(entry => entry.id == id)

    if ( entry ) {
        res.json(entry)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(entry => entry.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxID = persons.length > 0 ? Math.max(...persons.map(n => n.id)) : 0
    return maxID + 1
}

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
        return res.status(400).json({error: 'name is missing'})
    }

    if (!body.number) {
        return res.status(400).json({error: 'number is missing'})
    }

    if (persons.some(entry => entry.name === body.name)) {
        return res.status(409).json({error: 'name must be unique'})
    }

    let entry = {
        id: generateId(),
        name: body.name,
        number: body.number
    }

    persons.push(entry)
    res.json(entry)
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})