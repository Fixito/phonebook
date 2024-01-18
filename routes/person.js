import { Router } from 'express';
const router = Router();

import {
  createPerson,
  deletePerson,
  getAllPeople,
  getPerson,
  updatePerson,
} from '../controllers/persons.js';

router.route('/').post(createPerson).get(getAllPeople);
router.route('/:id').get(getPerson).put(updatePerson).delete(deletePerson);

export default router;
