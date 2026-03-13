import logger from '#config/logger.js';
import {
  getAllUsers,
  getUserById as getUserByIdService,
  updateUser as updateUserService,
  deleteUser as deleteUserService,
} from '#services/users.service.js';
import { formatValidationErrors } from '#utils/foramt.js';
import {
  userIdSchema,
  updateUserSchema,
} from '#validation/users.validation.js';
import { NextFunction, Request, Response } from 'express';

export const fetchAllUsers = async (_req: Request, res: Response) => {
  try {
    logger.info('Getting users...');
    const users = await getAllUsers();
    return res.status(200).json({
      message: 'Users fetched successfully',
      count: users.length,
      users,
    });
  } catch (error) {
    logger.error('Failed to get all users', { cause: error });
    throw new Error('Failed to get all users', { cause: error });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramValidation = userIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed!',
        details: formatValidationErrors(paramValidation.error),
      });
    }

    const { id } = paramValidation.data;

    logger.info('Getting user by id...', { id });
    const user = await getUserByIdService(id);

    return res.status(200).json({
      message: 'User fetched successfully',
      user,
    });
  } catch (error: any) {
    logger.error('Failed to get user by id', { cause: error });

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramValidation = userIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed!',
        details: formatValidationErrors(paramValidation.error),
      });
    }

    const bodyValidation = updateUserSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      return res.status(400).json({
        error: 'Validation failed!',
        details: formatValidationErrors(bodyValidation.error),
      });
    }

    const { id } = paramValidation.data;
    const updates = bodyValidation.data;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'You can only update your own information',
      });
    }

    if (updates.role && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Only admins can change user roles',
      });
    }

    logger.info('Updating user...', { id });
    const updatedUser = await updateUserService(id, updates);

    return res.status(200).json({
      message: 'User updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    logger.error('Failed to update user', { cause: error });

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const paramValidation = userIdSchema.safeParse(req.params);

    if (!paramValidation.success) {
      return res.status(400).json({
        error: 'Validation failed!',
        details: formatValidationErrors(paramValidation.error),
      });
    }

    const { id } = paramValidation.data;

    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.user.id !== id && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'You can only delete your own account',
      });
    }

    logger.info('Deleting user...', { id });
    await deleteUserService(id);

    return res.status(200).json({
      message: 'User deleted successfully',
    });
  } catch (error: any) {
    logger.error('Failed to delete user', { cause: error });

    if (error.message === 'User not found') {
      return res.status(404).json({ error: 'User not found' });
    }

    next(error);
  }
};
