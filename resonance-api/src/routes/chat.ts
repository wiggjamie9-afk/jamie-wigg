import { Router, Request, Response } from 'express';
import { claudeService } from '../services/claude.js';
import type { ChatSession, ChatMessage } from '../types/index.js';

const router = Router();

// Mock chat sessions
const chatSessions: Record<string, ChatSession> = {};

// POST /api/v1/chat/:userId/send
router.post('/:userId/send', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { message, appId, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    let session = sessionId && chatSessions[sessionId];

    if (!session) {
      session = {
        id: `session_${Date.now()}`,
        userId,
        appId: appId || 'general',
        messages: [],
        context: {},
        createdAt: new Date(),
        lastMessageAt: new Date(),
      };
    }

    session.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });

    // Stream response from Claude
    const stream = await claudeService.chat(message, session, {
      appId: appId || 'general',
      userName: 'Friend',
      userMood: 'neutral',
      userHistory: [],
    });

    // Collect streamed response
    let fullResponse = '';
    for await (const chunk of stream) {
      if (chunk.event === 'content_block_delta' && chunk.content) {
        fullResponse += chunk.content;
        // In production, stream chunks to client via SSE
      }
    }

    session.messages.push({
      role: 'assistant',
      content: fullResponse,
      timestamp: new Date(),
    });

    chatSessions[session.id] = session;

    res.json({
      sessionId: session.id,
      response: fullResponse,
      conversationHistory: session.messages,
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// GET /api/v1/chat/:userId/sessions
router.get('/:userId/sessions', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const userSessions = Object.values(chatSessions).filter(s => s.userId === userId);

    const sessions = userSessions.map(s => ({
      id: s.id,
      appId: s.appId,
      messageCount: s.messages.length,
      createdAt: s.createdAt,
      lastMessageAt: s.lastMessageAt,
      preview: s.messages.length
        ? s.messages[s.messages.length - 1].content.substring(0, 50)
        : 'No messages',
    }));

    res.json(sessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

// GET /api/v1/chat/session/:sessionId
router.get('/session/:sessionId', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = chatSessions[sessionId];

    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      id: session.id,
      appId: session.appId,
      messages: session.messages,
      context: session.context,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
});

// POST /api/v1/chat/session/:sessionId/clear
router.post('/session/:sessionId/clear', (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    if (chatSessions[sessionId]) {
      delete chatSessions[sessionId];
    }

    res.json({ success: true, message: 'Session cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to clear chat session' });
  }
});

// POST /api/v1/chat/:userId/generate-affirmation
router.post('/:userId/generate-affirmation', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { appId, trackId, mood } = req.body;

    if (!appId || !trackId) {
      return res.status(400).json({ error: 'App ID and track ID required' });
    }

    const affirmation = await claudeService.generateAffirmation(appId, trackId, mood || 'neutral');

    res.json({
      affirmation,
      appId,
      trackId,
      generatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate affirmation' });
  }
});

// POST /api/v1/chat/:userId/emotional-check
router.post('/:userId/emotional-check', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    const tone = await claudeService.generateEmotionalTone(text);

    res.json({
      emotionalTone: tone,
      userId,
      analyzedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to analyze emotional tone' });
  }
});

export default router;
