import mongoose from 'mongoose';

if (process.argv.length < 3) {
  console.log('Give at least password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://thomas:${password}@nodeexpressprojects.r5ily.mongodb.net/phonebookdb?retryWrites=true&w=majority`;

mongoose.set('strictQuery', false);
mongoose
  .connect(url)
  .then('Connect to MongoDb')
  .catch((error) =>
    console.error('Error connecting to MongoDB:', error.message)
  );

const personSchema = new mongoose.Schema({
  name: String,
  number: String
});

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then((persons) => {
    console.log('Phonebook:');
    persons.forEach((person) => {
      const { name, number } = person;
      console.log(`${name} ${number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  });
  person.save().then((person) => {
    const { name, number } = person;
    console.log(`Added ${name} ${number} to phonebook.`);
    mongoose.connection.close();
  });
} else {
  mongoose.connection.close();
}
