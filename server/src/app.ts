import compression from 'compression';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import {
  errorHandlerMiddleware,
  limiter,
  loggerMiddleware,
} from './middleware/utilMiddleware';
import diagramRouter from './routes/diagrams';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(limiter);
app.use(loggerMiddleware);
app.use(errorHandlerMiddleware);

// Routes
app.use('/api/diagram', diagramRouter);

app.get('/', (req, res) => {
  res.send('Hello World from UML2Code API!');
});

export default app;
