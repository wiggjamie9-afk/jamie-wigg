import { pool } from '../db/index.js';
import { authService } from './auth.js';

interface User {
  id: string;
  email: string;
  display_name?: string;
  subscription_status: string;
  created_at: Date;
  updated_at: Date;
  last_active_at?: Date;
}

interface CreateUserInput {
  email: string;
  password: string;
  displayName?: string;
}

class UserService {
  async createUser(input: CreateUserInput): Promise<User> {
    const passwordHash = await authService.hashPassword(input.password);

    const result = await pool.query(
      `INSERT INTO users (email, password_hash, display_name, subscription_status)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, display_name, subscription_status, created_at, updated_at, last_active_at`,
      [input.email, passwordHash, input.displayName || input.email.split('@')[0], 'free']
    );

    return result.rows[0];
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, display_name, subscription_status, created_at, updated_at, last_active_at FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  async getUserById(id: string): Promise<User | null> {
    const result = await pool.query(
      'SELECT id, email, display_name, subscription_status, created_at, updated_at, last_active_at FROM users WHERE id = $1',
      [id]
    );

    return result.rows[0] || null;
  }

  async getUserWithPassword(email: string): Promise<(User & { password_hash: string }) | null> {
    const result = await pool.query(
      'SELECT id, email, password_hash, display_name, subscription_status, created_at, updated_at, last_active_at FROM users WHERE email = $1',
      [email]
    );

    return result.rows[0] || null;
  }

  async updateLastActive(userId: string): Promise<void> {
    await pool.query(
      'UPDATE users SET last_active_at = CURRENT_TIMESTAMP WHERE id = $1',
      [userId]
    );
  }

  async storeVoiceFingerprint(userId: string, fingerprint: Buffer): Promise<void> {
    await pool.query(
      'UPDATE users SET voice_fingerprint = $1 WHERE id = $2',
      [fingerprint, userId]
    );
  }

  async getVoiceFingerprint(userId: string): Promise<Buffer | null> {
    const result = await pool.query(
      'SELECT voice_fingerprint FROM users WHERE id = $1',
      [userId]
    );

    return result.rows[0]?.voice_fingerprint || null;
  }

  async updateSubscriptionStatus(userId: string, status: string, expiresAt?: Date): Promise<void> {
    await pool.query(
      'UPDATE users SET subscription_status = $1, subscription_expires_at = $2 WHERE id = $3',
      [status, expiresAt || null, userId]
    );
  }
}

export const userService = new UserService();
