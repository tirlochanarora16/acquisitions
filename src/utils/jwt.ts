import logger from '#config/logger.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET =
  process.env.JWT_SECRET || 'your-secret-key-please-change-in-production';

const JWT_EXPIRES_IN = '1d';

export const jwtToken = {
  sign: (payload: object) => {
    try {
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (error) {
      logger.error('Failed to sign JWT token', { cause: error });
      throw new Error('Failed to sign JWT token', { cause: error });
    }
  },
  verify: (token: string) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Failed to verify JWT token', { cause: error });
      throw new Error('Failed to verify JWT token');
    }
  },
};
