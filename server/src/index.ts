import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import connectDB from './db';

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World from UML2Code API!');
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000/');
});

connectDB();
