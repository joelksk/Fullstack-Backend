import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import 'dotenv/config'
import Person from './models/personModel.js'
const app = express()
app.use(express.json(), cors(), express.static('dist'))
morgan.token('body', (req) => { return JSON.stringify(req.body) })
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const getDate = () => {
  const options = {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  }
  const date = new Date()
  return date.toLocaleString('en-US', options)
}

//  GET ALL PERSONS
app.get('/api/persons', (req, res, next) => {
  Person.find({}).then(persons => {
    res.json(persons)
  }).catch(err => next(err))
})

//  FIND A PERSON BY ID
app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id).then(person => {
    if (person) {
      res.status(200).json(person)
    } else {
      res.status(404).json({ Error: 'Not Found' })
    }
  }).catch(err => next(err))
})

//  ADD NEW PERSON TO PHONEBOOK
app.post('/api/persons', (req, res, next) => {
  if (!req.body.name || !req.body.number) {
    return res.status(400).json({
      Error: 'Name and Number must not be void'
    })
  }

  Person.find({ name: req.body.name })
    .then(result => {
      if (result.length > 0) {
        const newPerson = {
          name: req.body.name,
          number: req.body.number
        }
        const id = result[0].id
        Person.findByIdAndUpdate(
          id,
          newPerson,
          { new: true, runValidators: true, context: 'query' })
          .then(updatedPerson => {
            res.json(updatedPerson)
          }).catch(err => next(err))
      } else {
        const person = new Person({
          name: req.body.name,
          number: req.body.number
        })
        person.save().then(savedPerson => {
          res.status(201).json(savedPerson)
        }).catch(err => next(err))
      }
    }).catch(err => next(err))
})

//  DELETE A PERSON BY ID
app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(personDeleted => {
      if (personDeleted) {
        res.status(204).end()
      } else {
        res.status(404).json({ Error: 'not found' })
      }
    }).catch(err => next(err))
})

//  GET INFO
app.get('/info', (req, res, next) => {
  Person.countDocuments()
    .then(personDocuments => {
      res.send(
        `<p>
          Phonebook has info for ${personDocuments} people
          <br/>
          ${getDate()}
        </p>`
      )
    }).catch(err => next(err))
})

//  HANDLE RERROR MANAGER
const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if (err.name === 'CastError') {
    return res.status(400).send({ Error: 'malformatted id' })
  } else if (err.name === 'ValidationError') {
    return res.status(400).json({ Error: err.message })
  }
  next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
