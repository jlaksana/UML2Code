import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { limiter, loggerMiddleware } from './middleware/utilMiddleware';
import classRouter from './routes/classes';
import diagramRouter from './routes/diagrams';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(limiter);
app.use(loggerMiddleware);

// Routes
app.use('/api/diagram', diagramRouter);
app.use('/api/class', classRouter);

app.get('/', (req, res) => {
  res.send('Hello World from UML2Code API!');
});

export default app;
