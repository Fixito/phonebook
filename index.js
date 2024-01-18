import 'dotenv/config.js';
import express from 'express';
const app = express();
import morgan from 'morgan';
import Person from './models/person.js';

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.json());
app.use(express.static('dist'));

app.get('/info', (_req, res, next) => {
  const date = new Date();
  Person.countDocuments()
    .then((count) => {
      res.send(`
      <p>Phonebook has info por ${count} people.</p>
      <p>${date}</p>
    `);
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const { name, number } = req.body;

  Person.find({ name })
    .then((result) => {
      if (result.length) {
        res.status(400).json({ error: 'Name must be unique' });
        return;
      }

      const newPerson = new Person({ name, number });
      newPerson
        .save()
        .then((savedPerson) => {
          res.status(201).json(savedPerson);
        })
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

app.get('/api/persons', (_req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findById(id)
    .then((person) => {
      if (!person) {
        res.status(404).json({ error: `No person with id ${id}` });
        return;
      }

      res.json(person);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  const person = req.body;

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query'
  })
    .then((upDatedPerson) => {
      if (!upDatedPerson) {
        res.status(404).json({ error: `No person with id ${id}` });
        return;
      }

      res.json(upDatedPerson);
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person.findByIdAndDelete(id)
    .then((deletedPerson) => {
      if (!deletedPerson) {
        res.status(404).json({ error: `No person with id ${id}` });
        return;
      }

      res.json(deletedPerson);
    })
    .catch((error) => {
      next(error);
    });
});

app.use((_req, res, _next) =>
  res.status(404).json({ msg: "Endpoint doesn't exist." })
);

app.use((error, _req, res, _next) => {
  console.log(error);

  if (error.name === 'CastError') {
    return res.status(400).json({ error: 'Malformatted id' });
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message });
  }

  res.status(500).json({ error: error.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
