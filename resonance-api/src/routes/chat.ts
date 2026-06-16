import { Router, Request, Response } from 'express';
import { chatService } from '../services/chat.js';
import { claudeService } from '../services/claude.js';

const router = Router();

// POST /api/v1/chat/:userId/send
router.post('/:userId/send', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { message, appId, sessionId, emotionalContext } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const finalSessionId = sessionId || `session_${userId}_${Date.now()}`;

    // Save user message to database
    await chatService.saveMessage(userId, finalSessionId, 'user', message, appId);

    // Generate AI response with emotional context
    const aiResponse = await chatService.generateAIResponse(
      userId,
      finalSessionId,
      message,
      appId,
      emotionalContext
    );

    // Save AI response to database
    await chatService.saveMessage(userId, finalSessionId, 'assistant', aiResponse, appId);

    res.json({
      sessionId: finalSessionId,
      response: aiResponse,
      userId,
      appId: appId || 'general',
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process chat message' });
  }
});

// GET /api/v1/chat/:userId/sessions
router.get('/:userId/sessions', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const sessions = await chatService.getUserSessions(userId);

    res.json(sessions);
  } catch (error) {
    console.error('Sessions fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch chat sessions' });
  }
});

// GET /api/v1/chat/:userId/sessions/:sessionId
router.get('/:userId/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { userId, sessionId } = req.params;

    const messages = await chatService.getSessionHistory(userId, sessionId);

    if (messages.length === 0) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json({
      sessionId,
      userId,
      messages,
    });
  } catch (error) {
    console.error('Session fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch chat session' });
  }
});

// POST /api/v1/chat/:userId/sessions/:sessionId/clear
router.post('/:userId/sessions/:sessionId/clear', async (req: Request, res: Response) => {
  try {
    const { userId, sessionId } = req.params;

    await chatService.clearSession(userId, sessionId);

    res.json({ success: true, message: 'Session cleared' });
  } catch (error) {
    console.error('Session clear error:', error);
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
      userId,
      generatedAt: new Date(),
    });
  } catch (error) {
    console.error('Affirmation generation error:', error);
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
    console.error('Emotional analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze emotional tone' });
  }
});

export default router;
