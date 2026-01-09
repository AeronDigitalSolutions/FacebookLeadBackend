import { Request, Response, NextFunction } from 'express';
import { getMetaToken } from '../utils/metaToken';

export const metaAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = getMetaToken();
  if (!token) {
    return res.status(401).json({ error: 'Meta authentication required' });
  }
  next();
};

export { default as auth } from './auth';