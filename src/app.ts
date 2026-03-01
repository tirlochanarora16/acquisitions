import express, { Request, Response } from 'express';
import logger from '#config/logger';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

export default app;
