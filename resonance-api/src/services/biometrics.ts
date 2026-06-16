import { pool } from '../db/index.js';

interface BiometricData {
  id: string;
  user_id: string;
  heart_rate?: number;
  hrv?: number;
  breathing_rate?: number;
  stress_level?: number;
  emotional_state?: string;
  source: string;
  detected_at: Date;
  created_at: Date;
}

class BiometricsService {
  async submitData(
    userId: string,
    data: {
      heartRate?: number;
      hrv?: number;
      breathingRate?: number;
      stressLevel?: number;
      emotionalState?: string;
      source: string;
    }
  ): Promise<BiometricData> {
    const result = await pool.query(
      `INSERT INTO biometrics (user_id, heart_rate, hrv, breathing_rate, stress_level, emotional_state, source, detected_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, CURRENT_TIMESTAMP)
       RETURNING id, user_id, heart_rate, hrv, breathing_rate, stress_level, emotional_state, source, detected_at, created_at`,
      [
        userId,
        data.heartRate || null,
        data.hrv || null,
        data.breathingRate || null,
        data.stressLevel || null,
        data.emotionalState || null,
        data.source,
      ]
    );

    return result.rows[0];
  }

  async getLatest(userId: string): Promise<BiometricData | null> {
    const result = await pool.query(
      `SELECT id, user_id, heart_rate, hrv, breathing_rate, stress_level, emotional_state, source, detected_at, created_at
       FROM biometrics
       WHERE user_id = $1
       ORDER BY detected_at DESC
       LIMIT 1`,
      [userId]
    );

    return result.rows[0] || null;
  }

  async getTrends(userId: string, hours: number = 24): Promise<BiometricData[]> {
    const result = await pool.query(
      `SELECT id, user_id, heart_rate, hrv, breathing_rate, stress_level, emotional_state, source, detected_at, created_at
       FROM biometrics
       WHERE user_id = $1 AND detected_at > CURRENT_TIMESTAMP - INTERVAL '1 hour' * $2
       ORDER BY detected_at DESC`,
      [userId, hours]
    );

    return result.rows;
  }

  async getHistory(userId: string, limit: number = 100): Promise<BiometricData[]> {
    const result = await pool.query(
      `SELECT id, user_id, heart_rate, hrv, breathing_rate, stress_level, emotional_state, source, detected_at, created_at
       FROM biometrics
       WHERE user_id = $1
       ORDER BY detected_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  }

  async getAverages(userId: string, hours: number = 24) {
    const result = await pool.query(
      `SELECT
        COALESCE(ROUND(AVG(heart_rate::numeric), 1), 0) as avg_heart_rate,
        COALESCE(ROUND(AVG(hrv::numeric), 1), 0) as avg_hrv,
        COALESCE(ROUND(AVG(breathing_rate::numeric), 1), 0) as avg_breathing_rate,
        COALESCE(ROUND(AVG(stress_level::numeric), 1), 0) as avg_stress_level,
        MIN(detected_at) as first_reading,
        MAX(detected_at) as last_reading
       FROM biometrics
       WHERE user_id = $1 AND detected_at > CURRENT_TIMESTAMP - INTERVAL '1 hour' * $2`,
      [userId, hours]
    );

    return result.rows[0];
  }

  async linkHealthKit(userId: string, token: string): Promise<void> {
    await pool.query(
      'UPDATE users SET apple_healthkit_token = $1 WHERE id = $2',
      [token, userId]
    );
  }

  async linkGoogleFit(userId: string, token: string): Promise<void> {
    await pool.query(
      'UPDATE users SET google_fit_token = $1 WHERE id = $2',
      [token, userId]
    );
  }
}

export const biometricsService = new BiometricsService();
