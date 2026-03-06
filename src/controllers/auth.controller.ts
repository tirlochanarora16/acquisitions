import logger from '#config/logger.js';
import { createUser } from '#services/auth.service.js';
import { cookies } from '#utils/cookies.js';
import { formatValidationErrors } from '#utils/foramt.js';
import { jwtToken } from '#utils/jwt.js';
import { signUpSchema } from '#validation/auth.validation.js';
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
