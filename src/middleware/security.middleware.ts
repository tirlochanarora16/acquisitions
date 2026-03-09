import aj from '#config/arcjet.js';
import logger from '#config/logger.js';
import { slidingWindow } from '@arcjet/node';
import { NextFunction, Request, Response } from 'express';

export const securityMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role = req.user?.role || 'guest';

    let limit: number;
    let message: string;

    switch (role) {
      case 'admin':
        limit = 20;
        message = 'Admin requests are limited to 20 per minute';
        break;
      case 'user':
        limit = 10;
        message = 'User requests are limited to 10 per minute';
        break;
      case 'guest':
      default:
        limit = 5;
        message = 'Guest requests are limited to 5 per minute';
        break;
    }

    const ruleMode = process.env.NODE_ENV === 'production' ? 'LIVE' as const : 'DRY_RUN' as const;

    const client = aj.withRule(
      slidingWindow({
        mode: ruleMode,
        max: limit,
        interval: '1m',
      })
    );

    const decision = await client.protect(req);

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        logger.warn('Bot detected', {
          ip: req.ip,
          userAgent: req.headers['user-agent'],
          path: req.path,
          method: req.method,
        });
        return res.status(403).json({ error: 'No bots allowed' });
      } else if (decision.reason.isRateLimit()) {
        logger.info('Rate limit exceeded', { ip: req.ip, path: req.path });
        return res.status(429).json({ error: message });
      } else if (decision.reason.isShield()) {
        logger.warn('Shield detected', {
          ip: req.ip,
          path: req.path,
          userAgent: req.headers['user-agent'],
          method: req.method,
        });
        return res.status(403).json({ error: 'Shield detected' });
      }
    }

    logger.info('Request allowed', { ip: req.ip, path: req.path });
    next();
  } catch (error) {
    logger.error('Failed to protect request', { cause: error });
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
