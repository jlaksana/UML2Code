import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { limiter, loggerMiddleware } from './middleware/utilMiddleware';
import classRouter from './routes/classes';
import diagramRouter from './routes/diagrams';
import enumRouter from './routes/enums';
import interfaceRouter from './routes/interfaces';

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
app.use('/api/interface', interfaceRouter);
app.use('/api/enum', enumRouter);

app.get('/', (req, res) => {
  res.send('Hello World from UML2Code API!');
});

export default app;
