import 'express';

/**
 * Augment Express' Request with the authenticated user fields populated by the
 * requireAuth middleware (see src/middleware/auth.ts).
 */
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      userEmail?: string;
    }
  }
}

export {};
