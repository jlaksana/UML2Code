import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import { loggerMiddleware } from './middleware/utilMiddleware';
import classRouter from './routes/classes';
import diagramRouter from './routes/diagrams';
import entityRouter from './routes/entity';
import enumRouter from './routes/enums';
import interfaceRouter from './routes/interfaces';
import relationshipRouter from './routes/relationship';

const app = express();

// Middleware
const corsOptions = {
  origin: ['http://localhost', 'https://uml2code.vercel.app'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Access-Control-Allow-Methods',
    'Access-Control-Request-Headers',
  ],
  credentials: true,
  enablePreflight: true,
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());
app.use(compression());
app.use(cookieParser());
app.use(loggerMiddleware);

// Routes
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
