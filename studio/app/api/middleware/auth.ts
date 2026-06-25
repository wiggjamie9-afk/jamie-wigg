/**
 * JWT authentication middleware
 */

import { jwtVerify } from 'jose'

interface JWTPayload {
  sub: string
  user_id: string
  tier: 'free' | 'pro' | 'studio'
  email: string
  iat: number
  exp: number
}

interface AuthResult {
  user_id: string
  tier: 'free' | 'pro' | 'studio'
  email: string
}

// Stub: In production, this should come from environment variables
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'rhythmix-secret-dev-only')

/**
 * Authenticate JWT token from Authorization header
 * Format: "Bearer <token>"
 */
export async function authenticateJWT(authHeader: string): Promise<AuthResult> {
  if (!authHeader.startsWith('Bearer ')) {
    throw new Error('Invalid authorization header format')
  }

  const token = authHeader.slice(7)

  try {
    // Stub JWT verification (replace with real JWT in production)
    // For now, accept any token and extract user info
    const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())

    return {
      user_id: decoded.user_id || decoded.sub,
      tier: decoded.tier || 'free',
      email: decoded.email || 'unknown@example.com',
    }
  } catch (err) {
    throw new Error('Invalid or expired token')
  }
}

/**
 * Verify admin privilege
 */
export function requireAdmin(tier: string): boolean {
  return tier === 'studio'
}
