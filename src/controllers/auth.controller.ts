import logger from '#config/logger.js';
import { authenticateUser, createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationErrors } from '#utils/foramt.js';
import { jwtToken } from '#utils/jwt.js';
import { signInSchema, signUpSchema } from '#validation/auth.validation.js';
import { NextFunction, Request, Response } from 'express';

export const signUp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = signUpSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed!',
        details: formatValidationErrors(validation.error),
      });
    }

    const { name, email, password, role } = validation.data;

    const user = await createUser(name, email, password, role);

    const token = jwtToken.sign({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    cookies.set(res, 'token', token);

    logger.info('Signing up user', { email });

    return res.status(201).json({
      message: 'User signed up successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    logger.error('Failed to sign up', { cause: error });

    if (error.message.includes('user with this email already exists')) {
      return res
        .status(409)
        .json({ error: 'User with this email already exists' });
    }

    next(error);
  }
};

export const signIn = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validation = signInSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        error: 'Validation failed!',
        details: formatValidationErrors(validation.error),
      });
    }

    const { email, password } = validation.data;

    const user = await authenticateUser(email, password);

    const token = jwtToken.sign({
      id: user.id,
      role: user.role,
      email: user.email,
    });

    cookies.set(res, 'token', token);

    logger.info('Signing in user', { email });

    return res.status(200).json({
      message: 'User signed in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    logger.error('Failed to sign in', { cause: error });

    if (error.message.includes('Invalid email or password')) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    next(error);
  }
};

export const signOut = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    cookies.clear(res, 'token');

    logger.info('Signing out user');

    return res.status(200).json({
      message: 'User signed out successfully',
    });
  } catch (error) {
    logger.error('Failed to sign out', { cause: error });
    next(error);
  }
};
