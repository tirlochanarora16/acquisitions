import { CookieOptions, Response } from 'express';

export const cookies = {
  getOptions: () => ({
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 15 * 60 * 1000, // 15 minutes
  }),
  set: (
    res: Response,
    name: string,
    value: string,
    options?: CookieOptions
  ) => {
    return res.cookie(name, value, { ...cookies.getOptions(), ...options });
  },
  clear: (res: Response, name: string, options?: CookieOptions) => {
    return res.clearCookie(name, { ...cookies.getOptions(), ...options });
  },
  get: (req: Request, name: string) => {
    return (req as Request & { cookies: Record<string, string> }).cookies[name];
  },
};
