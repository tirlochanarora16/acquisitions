import express, { Request, Response } from 'express';
import logger from '#config/logger';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from '#routes/auth.routes.js';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: { write: (message: string) => logger.info(message.trim()) },
  })
);

app.get('/', (_req: Request, res: Response) => {
  logger.info('GET / - Hello from acquisitions API');
  res.status(200).send('Hello from acquisitions API');
});

app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Requestion API is running!',
  });
});

app.use('/api/auth', authRoutes);

export default app;
