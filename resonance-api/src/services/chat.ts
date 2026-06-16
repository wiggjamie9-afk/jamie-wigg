import { pool } from '../db/index.js';
import { claudeService } from './claude.js';

interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  app_id?: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatSession {
  session_id: string;
  user_id: string;
  app_id?: string;
  message_count: number;
  last_message_at: Date;
}

class ChatService {
  async saveMessage(
    userId: string,
    sessionId: string,
    role: 'user' | 'assistant',
    content: string,
    appId?: string
  ): Promise<ChatMessage> {
    const result = await pool.query(
      `INSERT INTO chat_messages (user_id, session_id, role, content, app_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, session_id, app_id, role, content, timestamp`,
      [userId, sessionId, role, content, appId || null]
    );

    return result.rows[0];
  }

  async getSessionHistory(userId: string, sessionId: string, limit: number = 50): Promise<ChatMessage[]> {
    const result = await pool.query(
      `SELECT id, user_id, session_id, app_id, role, content, timestamp
       FROM chat_messages
       WHERE user_id = $1 AND session_id = $2
       ORDER BY timestamp ASC
       LIMIT $3`,
      [userId, sessionId, limit]
    );

    return result.rows;
  }

  async getUserSessions(userId: string, limit: number = 20): Promise<ChatSession[]> {
    const result = await pool.query(
      `SELECT
        session_id,
        user_id,
        app_id,
        COUNT(*) as message_count,
        MAX(timestamp) as last_message_at
       FROM chat_messages
       WHERE user_id = $1
       GROUP BY session_id, user_id, app_id
       ORDER BY last_message_at DESC
       LIMIT $2`,
      [userId, limit]
    );

    return result.rows;
  }

  async clearSession(userId: string, sessionId: string): Promise<void> {
    await pool.query(
      'DELETE FROM chat_messages WHERE user_id = $1 AND session_id = $2',
      [userId, sessionId]
    );
  }

  async generateAIResponse(
    userId: string,
    sessionId: string,
    userMessage: string,
    appId?: string,
    emotionalContext?: {
      heartRate?: number;
      stressLevel?: number;
      lastEmotionalRating?: number;
    }
  ): Promise<string> {
    // Get recent conversation context
    const history = await this.getSessionHistory(userId, sessionId, 10);

    // Generate response via Claude API
    const response = await claudeService.generateContextualResponse(
      userMessage,
      history.map(m => ({ role: m.role, content: m.content })),
      appId,
      emotionalContext
    );

    return response;
  }
}

export const chatService = new ChatService();
