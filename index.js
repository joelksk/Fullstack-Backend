import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import morgan from 'morgan';
import cors from 'cors';
const app = express();
app.use(express.json(), cors(), express.static('dist'));
morgan.token('body',(req) => { return JSON.stringify(req.body)})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
    { 
      "id": "5a9046aa-fe95-407d-aac8-54e5b8a14263",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "5a9046aa-fe95-407d-aac8-54e5b8a14262",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "5a9046aa-fe95-407d-aac8-54e5b8a14261",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "5a9046aa-fe95-407d-aac8-54e5b8a14260",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]



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
};
  const date = new Date();
  return date.toLocaleString('en-US', options);
}

const searchPerson = (name) => {
  const person = persons.filter(person => person.name.toLowerCase() === name.toLowerCase())
  if(person.length > 0) {
    return true
  }else{
    return false
  }
}

app.get("/api/persons", (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)
    
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
})

app.get("/info", (req, res) => {
    res.send(
      `<p>
        Phonebook has info for ${persons.length} people
        <br/>
        ${getDate()}
      </p>`
    )
})

app.delete('/api/persons/:id', (req, res) => {
  const personToDelete = persons.filter(person => person.id === req.params.id)
  if(personToDelete.length > 0){
    persons = persons.filter(person => person.id != req.params.id)
    res.status(204).end()
  }else{
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  if(!req.body.name || !req.body.number){
    return res.status(400).json({
      error: "Name and Number must not be void"
    }) 
  }else if(searchPerson(req.body.name)){
    return res.status(400).json({
      error: `${req.body.name} was already registered.`
    })
  } else{
    const person = {
      id: uuidv4(),
      name: req.body.name,
      number: req.body.number
    }
    persons = persons.concat(person);
    return res.status(201).json(person)
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})