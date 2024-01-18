import express from 'express';
const app = express();
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import * as middleware from './utils/middleware.js';
import personsRouter from './routes/person.js';
import { getInfo } from './controllers/persons.js';

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log('Connecting to', url);

mongoose
  .connect(url)
  .then(() => console.log('Connected to MongoDb'))
  .catch((error) =>
    console.error('Error connecting to MongoDB:', error.message)
  );

app.use(cors());
morgan.token('body', (req) => JSON.stringify(req.body));
app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :body')
);
app.use(express.static('dist'));
app.use(express.json());

app.get('/info', getInfo);
app.use('/api/persons', personsRouter);

app.use(middleware.unkownEndpoint);
app.use(middleware.errorHandler);

export default app;
