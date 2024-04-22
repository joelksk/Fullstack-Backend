/*************DATABASE*************/
import mongoose from 'mongoose';
const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URI
  

mongoose.set('strictQuery',false)
console.log('conecting to Database...');
mongoose.connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: [true, "The name must not be empty"]
  },
  number: {
    type: String,
    minlength: 8,
    validate: {
      validator: (number) => {
        const regex = /^\d{2,3}-\d+$/;
        return regex.test(number);
      },
    required: [true, "The number must not be empty"]
  },
} 
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

export const PersonSchema = Person.schema
export default Person
/*************DATABASE*************/