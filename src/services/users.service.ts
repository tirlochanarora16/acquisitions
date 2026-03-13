import database from '#config/database.js';
import logger from '#config/logger.js';
import { users as usersTable } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

const userColumns = {
  id: usersTable.id,
  name: usersTable.name,
  email: usersTable.email,
  role: usersTable.role,
  created_at: usersTable.createdAt,
  updated_at: usersTable.updatedAt,
};

export const getAllUsers = async () => {
  try {
    const allUsers = await database.db
      .select(userColumns)
      .from(usersTable);

    logger.info('All users fetched successfully');

    return allUsers;
  } catch (error) {
    logger.error('Failed to get all users', { cause: error });
    throw new Error('Failed to get all users', { cause: error });
  }
};

export const getUserById = async (id: number) => {
  try {
    const [user] = await database.db
      .select(userColumns)
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!user) {
      throw new Error('User not found');
    }

    logger.info('User fetched successfully', { id });

    return user;
  } catch (error) {
    logger.error('Failed to get user by id', { cause: error });
    throw error;
  }
};

export const updateUser = async (
  id: number,
  updates: { name?: string; email?: string; role?: string }
) => {
  try {
    const [existing] = await database.db
      .select({ id: usersTable.id })
      .from(usersTable)
      .where(eq(usersTable.id, id))
      .limit(1);

    if (!existing) {
      throw new Error('User not found');
    }

    const [updatedUser] = await database.db
      .update(usersTable)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(usersTable.id, id))
      .returning(userColumns);

    logger.info('User updated successfully', { id });

    return updatedUser;
  } catch (error) {
    logger.error('Failed to update user', { cause: error });
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const [deleted] = await database.db
      .delete(usersTable)
      .where(eq(usersTable.id, id))
      .returning({ id: usersTable.id });

    if (!deleted) {
      throw new Error('User not found');
    }

    logger.info('User deleted successfully', { id });

    return deleted;
  } catch (error) {
    logger.error('Failed to delete user', { cause: error });
    throw error;
  }
};
