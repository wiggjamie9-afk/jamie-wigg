import { pool } from '../db/index.js';

interface ProgressEntry {
  id: string;
  user_id: string;
  app_id: string;
  track_id: string;
  lesson_index: number;
  completed_at: Date;
  time_spent?: number;
  emotional_rating?: number;
  streak_days: number;
  last_completed_day?: Date;
}

class ProgressService {
  async recordCompletion(
    userId: string,
    appId: string,
    trackId: string,
    lessonIndex: number,
    timeSpent?: number,
    emotionalRating?: number
  ): Promise<ProgressEntry> {
    const today = new Date().toISOString().split('T')[0];

    // Check if lesson already completed today
    const existingResult = await pool.query(
      `SELECT id FROM progress
       WHERE user_id = $1 AND app_id = $2 AND track_id = $3 AND lesson_index = $4
       AND DATE(completed_at) = $5`,
      [userId, appId, trackId, lessonIndex, today]
    );

    if (existingResult.rows.length > 0) {
      // Already completed today, just update
      const result = await pool.query(
        `UPDATE progress
         SET time_spent = $1, emotional_rating = $2
         WHERE user_id = $3 AND app_id = $4 AND track_id = $5 AND lesson_index = $6
         AND DATE(completed_at) = $7
         RETURNING id, user_id, app_id, track_id, lesson_index, completed_at, time_spent, emotional_rating, streak_days, last_completed_day`,
        [timeSpent, emotionalRating, userId, appId, trackId, lessonIndex, today]
      );
      return result.rows[0];
    }

    // Check streak continuity
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const streakResult = await pool.query(
      `SELECT MAX(streak_days) as max_streak, last_completed_day
       FROM progress
       WHERE user_id = $1 AND app_id = $2
       GROUP BY user_id, app_id`,
      [userId, appId]
    );

    let newStreak = 1;
    if (streakResult.rows.length > 0) {
      const lastDay = streakResult.rows[0].last_completed_day;
      if (lastDay && new Date(lastDay).toISOString().split('T')[0] === yesterday) {
        newStreak = (streakResult.rows[0].max_streak || 0) + 1;
      }
    }

    const result = await pool.query(
      `INSERT INTO progress (user_id, app_id, track_id, lesson_index, completed_at, time_spent, emotional_rating, streak_days, last_completed_day)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, $5, $6, $7, CURRENT_DATE)
       RETURNING id, user_id, app_id, track_id, lesson_index, completed_at, time_spent, emotional_rating, streak_days, last_completed_day`,
      [userId, appId, trackId, lessonIndex, timeSpent, emotionalRating, newStreak]
    );

    return result.rows[0];
  }

  async getUserProgress(userId: string, appId?: string): Promise<ProgressEntry[]> {
    let query = `SELECT id, user_id, app_id, track_id, lesson_index, completed_at, time_spent, emotional_rating, streak_days, last_completed_day
                 FROM progress WHERE user_id = $1`;
    const params: any[] = [userId];

    if (appId) {
      query += ' AND app_id = $2';
      params.push(appId);
    }

    query += ' ORDER BY completed_at DESC';

    const result = await pool.query(query, params);
    return result.rows;
  }

  async getAppStats(userId: string, appId: string) {
    const result = await pool.query(
      `SELECT
        COUNT(DISTINCT track_id) as tracks_started,
        COUNT(*) as total_lessons_completed,
        COALESCE(MAX(streak_days), 0) as current_streak,
        COALESCE(AVG(emotional_rating), 0) as avg_emotional_rating,
        COALESCE(SUM(time_spent), 0) as total_time_spent
       FROM progress
       WHERE user_id = $1 AND app_id = $2`,
      [userId, appId]
    );

    return result.rows[0];
  }

  async getUserStreaks(userId: string) {
    const result = await pool.query(
      `SELECT
        app_id,
        MAX(streak_days) as current_streak,
        MAX(last_completed_day) as last_completed
       FROM progress
       WHERE user_id = $1
       GROUP BY app_id
       ORDER BY current_streak DESC`,
      [userId]
    );

    return result.rows;
  }

  async getTimeline(userId: string, limit: number = 50) {
    const result = await pool.query(
      `SELECT
        id, app_id, track_id, lesson_index, completed_at, emotional_rating, time_spent
       FROM progress
       WHERE user_id = $1
       ORDER BY completed_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  }
}

export const progressService = new ProgressService();
