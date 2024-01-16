import express from 'express';
const app = express();
import morgan from 'morgan';
import cors from 'cors';

let persons = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendieck',
    number: '39-23-6423122'
  }
];

morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(cors());
app.use(express.json());

app.get('/', (_req, res) => {
  res.send('Hello World!');
});

app.post('/api/persons', (req, res) => {
  const { name, number } = req.body;

  if (!name || !number) {
    res.status(400).json({ error: 'Please provide a name and a number' });
    return;
  }

  const person = persons.find((p) => p.name === name);

  if (person) {
    res.status(400).json({ error: 'Name must be unique' });
    return;
  }

  const newPerson = { id: Date.now(), name, number };
  persons = [...persons, newPerson];
  res.status(201).json(persons);
});

app.get('/api/persons', (_req, res) => {
  res.json(persons);
});

app.get('/info', (_req, res) => {
  const date = new Date();
  res.send(`
    <p>Phonebook has info por ${persons.length} people.</p>
    <p>${date}</p>
  `);
});

app.get('/info/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    res.status(404).send(`No person with id ${id}`);
    return;
  }

  const { name, number } = person;

  res.send(`
    <p>${name} ${number}</p>
  `);
});

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id);
  const person = persons.find((p) => p.id === id);

  if (!person) {
    res.status(404).send(`No person with id ${id}`);
    return;
  }

  persons = persons.filter((p) => p.id !== id);
  res.status(204).end();
});

app.use((err, _req, res, _next) => {
  console.log(err);
  res.status(500).json({ msg: err.message });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}...`);
});
