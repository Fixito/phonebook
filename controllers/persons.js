import Person from '../models/person.js';

export const getInfo = (_req, res, next) => {
  const date = new Date();
  Person.countDocuments()
    .then((count) => {
      res.send(`
      <p>Phonebook has info por ${count} people.</p>
      <p>${date}</p>
    `);
    })
    .catch((error) => next(error));
};

export const createPerson = (req, res, next) => {
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
};

export const getAllPeople = (_req, res, next) => {
  Person.find({})
    .then((persons) => res.json(persons))
    .catch((error) => next(error));
};

export const getPerson = (req, res, next) => {
  const { id } = req.params;
  Person.findById(id)
    .then((person) => {
      if (!person) {
        res.status(404).json({ error: `No person with id ${id}` });
        return;
      }

      res.json(person);
    })
    .catch((error) => next(error));
};

export const updatePerson = (req, res, next) => {
  const { id } = req.params;
  const person = req.body;

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: 'query',
  })
    .then((upDatedPerson) => {
      if (!upDatedPerson) {
        res.status(404).json({ error: `No person with id ${id}` });
        return;
      }

      res.json(upDatedPerson);
    })
    .catch((error) => next(error));
};

export const deletePerson = (req, res, next) => {
  const { id } = req.params;
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
};
