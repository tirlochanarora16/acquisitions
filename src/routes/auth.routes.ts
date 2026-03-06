import { signUp } from '#controllers/auth.controller.js';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/sign-up', signUp);

router.post('/sign-in', (_: Request, res: Response): void => {
  res.send('POST /api/auth/sign-in');
});

router.post('/sign-out', (_: Request, res: Response): void => {
  res.send('POST /api/auth/sign-out');
});

export default router;
