import mongoose from 'mongoose'

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
  `mongodb+srv://kskpluss:${password}@phonebook.dcodrmz.mongodb.net/phoneApp?retryWrites=true&w=majority&appName=Phonebook`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name:  {
    type: String,
    minLength: 3,
    required: true
  },
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: name,
  number: number,
})



if(process.argv.length==3){
    console.log('Phonebook: ');
    Person.find({}).then(result => {
        result.forEach(person => {
          console.log(person.name+" "+person.number)
        })
        mongoose.connection.close()
      })
}else{
    person.save().then(result => {
        console.log(`Added ${name} number ${number} to phonebok!`)
        mongoose.connection.close()
      })
}



   


