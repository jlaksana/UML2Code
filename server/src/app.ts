import compression from 'compression';
import cors from 'cors';
import express from 'express';
import { loggerMiddleware } from './middleware/utilMiddleware';
import authRouter from './routes/auth';
import classRouter from './routes/classes';
import diagramRouter from './routes/diagrams';
import entityRouter from './routes/entity';
import enumRouter from './routes/enums';
import interfaceRouter from './routes/interfaces';
import relationshipRouter from './routes/relationship';

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost:5173', 'https://uml2code.vercel.app'],
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(compression());
app.use(loggerMiddleware);

// Routes
app.use('/api/auth', authRouter);
app.use('/api/diagram', diagramRouter);
app.use('/api/class', classRouter);
app.use('/api/interface', interfaceRouter);
app.use('/api/enum', enumRouter);
app.use('/api/entity', entityRouter);
app.use('/api/relationship', relationshipRouter);

app.get('/', (req, res) => {
  res.send('Hello World from UML2Code Server!');
});

export default app;
