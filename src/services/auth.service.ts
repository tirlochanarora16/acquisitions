import bcrypt from 'bcrypt';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import database from '#config/database.js';
import { eq } from 'drizzle-orm';

export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    logger.error('Failed to hash password', { cause: error });
    throw new Error('Failed to hash password', { cause: error });
  }
};

export const createUser = async (
  name: string,
  email: string,
  password: string,
  role: 'admin' | 'user' = 'user'
) => {
  try {
    const existingUser = await database.db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    const hashedPassword = await hashPassword(password);

    const [newUser] = await database.db
      .insert(users)
      .values({
        name,
        email,
        password: hashedPassword,
        role,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        createdAt: users.createdAt,
      });

    logger.info('User created successfully', { email });

    return newUser;
  } catch (error) {
    logger.error('Failed to create user', { cause: error });
    throw new Error('Failed to create user', { cause: error });
  }
};
