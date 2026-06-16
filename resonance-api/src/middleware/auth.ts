import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    iat: number;
    exp: number;
  };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  next();
}

export function optionalAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const decoded = authService.verifyAccessToken(token);

    if (decoded) {
      req.user = decoded;
    }
  }

  next();
}

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error('Error:', err);

  if (err.status === 401) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (err.status === 403) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
}
