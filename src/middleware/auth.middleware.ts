import logger from '#config/logger.js';
import { jwtToken } from '#utils/jwt.js';
import { NextFunction, Request, Response } from 'express';

type AuthenticatedRequest = Request & {
  cookies?: Record<string, string>;
};

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const reqWithCookies = req as AuthenticatedRequest;

    const cookieToken = reqWithCookies.cookies?.token;
    const authHeader = req.headers.authorization;
    const headerToken = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : undefined;

    const token = cookieToken || headerToken;

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwtToken.verify(token) as {
      id: number;
      email: string;
      role: string;
      [key: string]: unknown;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    logger.info('User authenticated from token', {
      id: req.user.id,
      role: req.user.role,
    });

    next();
  } catch (error) {
    logger.error('Authentication failed', { cause: error });
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireRole =
  (roles: Array<'admin' | 'user'>) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role as 'admin' | 'user')) {
      return res.status(403).json({ error: 'Forbidden' });
    }

    next();
  };

