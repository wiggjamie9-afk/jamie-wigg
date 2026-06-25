import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

/**
 * Resolve the JWT signing secret.
 *
 * In production a real secret MUST be configured — we fail fast rather than
 * silently falling back to a well-known development value (which would let
 * anyone forge tokens). In non-production we allow a dev fallback so the app
 * boots without extra setup.
 */
export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable must be set in production');
    }
    return 'dev-secret';
  }
  return secret;
}

interface JwtPayload {
  userId: string;
  email?: string;
}

/**
 * Express middleware that enforces a valid Bearer JWT and attaches the
 * authenticated user's id to the request. Every data route should derive the
 * acting user from `req.userId` rather than trusting a client-supplied id in
 * the body/query — otherwise any caller can read or write another user's data.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7).trim() : undefined;

  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJwtSecret()) as JwtPayload;
    if (!decoded?.userId) {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
