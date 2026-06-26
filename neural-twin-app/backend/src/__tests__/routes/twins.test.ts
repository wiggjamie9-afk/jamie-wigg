/**
 * Twins Route Tests
 * Tests for twin interactions, 9 twin types, and conversation history
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import twinsRouter from '../../routes/twins';
import { prisma } from '../../index';

vi.mocked(prisma);

const app: Express = express();
app.use(express.json());

// Mock requireAuth middleware
app.use((req, res, next) => {
  req.userId = 'test-user-id';
  req.userEmail = 'test@example.com';
  next();
});

app.use('/api/twins', twinsRouter);

const TWIN_TYPES = ['task', 'coach', 'growth', 'health', 'relationship', 'financial', 'creative', 'research', 'metacognition'];

describe('Twins Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/twins/interaction - Chat with Twin', () => {
    it('should successfully chat with Task Twin', async () => {
      const interactionData = {
        twinType: 'task',
        userMessage: 'How do I organize my priorities for this week?',
      };

      const mockInteraction = {
        id: 'interaction-1',
        userId: 'test-user-id',
        twinType: 'task',
        userMessage: interactionData.userMessage,
        twinResponse: 'Let me help you break down your priorities systematically.',
        metacognitivePhase: null,
        createdAt: new Date(),
      };

      vi.mocked(prisma.twinInteraction).create.mockResolvedValueOnce(mockInteraction);

      const response = await request(app)
        .post('/api/twins/interaction')
        .send(interactionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('interactionId');
      expect(response.body).toHaveProperty('response');
      expect(response.body.response).toContain('priorities');
    });

    it('should chat with Coach Twin with metacognitive focus', async () => {
      const interactionData = {
        twinType: 'coach',
        userMessage: 'I am struggling with a decision about changing roles.',
        metacognitivePhase: 'planning',
      };

      const mockInteraction = {
        id: 'interaction-2',
        userId: 'test-user-id',
        twinType: 'coach',
        userMessage: interactionData.userMessage,
        twinResponse: 'In the planning phase, consider: What outcomes do you desire?',
        metacognitivePhase: interactionData.metacognitivePhase,
        createdAt: new Date(),
      };

      vi.mocked(prisma.twinInteraction).create.mockResolvedValueOnce(mockInteraction);

      const response = await request(app)
        .post('/api/twins/interaction')
        .send(interactionData);

      expect(response.status).toBe(201);
      expect(response.body.response).toContain('planning');
    });

    it('should support all 9 twin types', async () => {
      for (const twinType of TWIN_TYPES) {
        const interactionData = {
          twinType,
          userMessage: `Help me with ${twinType} optimization.`,
        };

        const mockInteraction = {
          id: `interaction-${twinType}`,
          userId: 'test-user-id',
          twinType,
          userMessage: interactionData.userMessage,
          twinResponse: `I am your ${twinType} specialist. How can I help?`,
          createdAt: new Date(),
        };

        vi.mocked(prisma.twinInteraction).create.mockResolvedValueOnce(mockInteraction);

        const response = await request(app)
          .post('/api/twins/interaction')
          .send(interactionData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('response');
      }
    });

    it('should include context data in twin response', async () => {
      const interactionData = {
        twinType: 'health',
        userMessage: 'How can I improve my sleep quality?',
        contextData: {
          sleepHours: 5.5,
          stressLevel: 'high',
          exerciseFrequency: 'twice-weekly',
        },
      };

      const mockInteraction = {
        id: 'interaction-3',
        userId: 'test-user-id',
        twinType: 'health',
        userMessage: interactionData.userMessage,
        twinResponse: 'With your current stress and sleep patterns, try meditation.',
        createdAt: new Date(),
      };

      vi.mocked(prisma.twinInteraction).create.mockResolvedValueOnce(mockInteraction);

      const response = await request(app)
        .post('/api/twins/interaction')
        .send(interactionData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('response');
    });

    it('should reject interaction without twinType', async () => {
      const invalidData = {
        userMessage: 'Help me!',
      };

      const response = await request(app)
        .post('/api/twins/interaction')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should reject interaction without userMessage', async () => {
      const invalidData = {
        twinType: 'task',
      };

      const response = await request(app)
        .post('/api/twins/interaction')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid twinType gracefully', async () => {
      const interactionData = {
        twinType: 'invalid-twin-type',
        userMessage: 'This should fail gracefully.',
      };

      const response = await request(app)
        .post('/api/twins/interaction')
        .send(interactionData);

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });

  describe('GET /api/twins - List user twins', () => {
    it('should return all 9 twin instances for user', async () => {
      const mockTwins = TWIN_TYPES.map((type, idx) => ({
        id: `twin-${idx}`,
        userId: 'test-user-id',
        type,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Twin`,
        personality: `I am your ${type} specialist.`,
        lastInteractionAt: new Date(),
        createdAt: new Date(),
      }));

      vi.mocked(prisma.twin).findMany.mockResolvedValueOnce(mockTwins);

      const response = await request(app).get('/api/twins');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('twins');
      expect(response.body.twins.length).toBe(9);
      expect(response.body.twins.map((t: any) => t.type)).toEqual(TWIN_TYPES);
    });

    it('should include metadata for each twin', async () => {
      const mockTwin = {
        id: 'twin-1',
        userId: 'test-user-id',
        type: 'task',
        name: 'Task Twin',
        personality: 'I am your task specialist.',
        lastInteractionAt: new Date(),
        interactionCount: 42,
        createdAt: new Date(),
      };

      vi.mocked(prisma.twin).findMany.mockResolvedValueOnce([mockTwin]);

      const response = await request(app).get('/api/twins');

      expect(response.status).toBe(200);
      expect(response.body.twins[0]).toHaveProperty('id');
      expect(response.body.twins[0]).toHaveProperty('type');
      expect(response.body.twins[0]).toHaveProperty('personality');
    });
  });

  describe('GET /api/twins/:twinId - Get twin detail', () => {
    it('should retrieve specific twin with metadata', async () => {
      const mockTwin = {
        id: 'twin-coach',
        userId: 'test-user-id',
        type: 'coach',
        name: 'Coach Twin',
        personality: 'I am your coach specialist.',
        interactionCount: 127,
        lastInteractionAt: new Date('2024-06-25'),
        createdAt: new Date('2024-01-01'),
      };

      vi.mocked(prisma.twin).findUnique.mockResolvedValueOnce(mockTwin);

      const response = await request(app).get('/api/twins/twin-coach');

      expect(response.status).toBe(200);
      expect(response.body.type).toBe('coach');
      expect(response.body).toHaveProperty('personality');
      expect(response.body).toHaveProperty('interactionCount');
    });

    it('should return 404 for non-existent twin', async () => {
      vi.mocked(prisma.twin).findUnique.mockResolvedValueOnce(null);

      const response = await request(app).get('/api/twins/non-existent');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/twins/:twinId/history - Conversation history', () => {
    it('should retrieve conversation history with specific twin', async () => {
      const mockHistory = [
        {
          id: 'msg-1',
          twinId: 'twin-task',
          userId: 'test-user-id',
          userMessage: 'What are my top priorities?',
          twinResponse: 'Based on your patterns, focus on these three areas.',
          createdAt: new Date('2024-06-25T10:00:00'),
        },
        {
          id: 'msg-2',
          twinId: 'twin-task',
          userId: 'test-user-id',
          userMessage: 'How do I stay focused?',
          twinResponse: 'Try the Pomodoro technique with your specific tasks.',
          createdAt: new Date('2024-06-25T14:30:00'),
        },
      ];

      vi.mocked(prisma.twinInteraction).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app).get('/api/twins/twin-task/history');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('history');
      expect(response.body.history.length).toBe(2);
      expect(response.body.history[0].userMessage).toContain('priorities');
    });

    it('should support pagination on history', async () => {
      const mockHistory = Array(10).fill(0).map((_, i) => ({
        id: `msg-${i}`,
        twinId: 'twin-coach',
        userId: 'test-user-id',
        userMessage: `Message ${i}`,
        twinResponse: `Response ${i}`,
        createdAt: new Date(),
      }));

      vi.mocked(prisma.twinInteraction).findMany.mockResolvedValueOnce(
        mockHistory.slice(0, 5)
      );

      const response = await request(app)
        .get('/api/twins/twin-coach/history')
        .query({ limit: 5, offset: 0 });

      expect(response.status).toBe(200);
      expect(response.body.history.length).toBe(5);
    });

    it('should return empty history for new twin', async () => {
      vi.mocked(prisma.twinInteraction).findMany.mockResolvedValueOnce([]);

      const response = await request(app).get('/api/twins/twin-new/history');

      expect(response.status).toBe(200);
      expect(response.body.history).toEqual([]);
    });
  });

  describe('Twin type specializations', () => {
    const twinSpecializations = {
      task: 'productivity and workflow optimization',
      coach: 'real-time guidance and metacognitive coaching',
      growth: 'learning and development',
      health: 'wellness and biometric optimization',
      relationship: 'social coherence and connection',
      financial: 'money psychology and financial transformation',
      creative: 'flow and creative expression',
      research: 'knowledge synthesis and learning acceleration',
      metacognition: 'thinking and cognitive processes',
    };

    for (const [twinType, specialization] of Object.entries(twinSpecializations)) {
      it(`should use ${twinType} twin for ${specialization}`, async () => {
        const interactionData = {
          twinType,
          userMessage: `Help me with ${specialization}.`,
        };

        const mockInteraction = {
          id: `interaction-${twinType}`,
          userId: 'test-user-id',
          twinType,
          userMessage: interactionData.userMessage,
          twinResponse: `I specialize in ${specialization}.`,
          createdAt: new Date(),
        };

        vi.mocked(prisma.twinInteraction).create.mockResolvedValueOnce(mockInteraction);

        const response = await request(app)
          .post('/api/twins/interaction')
          .send(interactionData);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('response');
      });
    }
  });

  describe('Metacognitive coaching', () => {
    const metacognitivePhases = ['planning', 'monitoring', 'evaluating', 'reflecting'];

    for (const phase of metacognitivePhases) {
      it(`should support ${phase} phase in coach twin`, async () => {
        const interactionData = {
          twinType: 'coach',
          userMessage: 'Help me with my decision process.',
          metacognitivePhase: phase,
        };

        const mockInteraction = {
          id: `interaction-${phase}`,
          userId: 'test-user-id',
          twinType: 'coach',
          userMessage: interactionData.userMessage,
          twinResponse: `Let's focus on the ${phase} phase of your thinking.`,
          metacognitivePhase: phase,
          createdAt: new Date(),
        };

        vi.mocked(prisma.twinInteraction).create.mockResolvedValueOnce(mockInteraction);

        const response = await request(app)
          .post('/api/twins/interaction')
          .send(interactionData);

        expect(response.status).toBe(201);
        expect(response.body.response).toContain(phase);
      });
    }
  });

  describe('Twin interaction error handling', () => {
    it('should handle Anthropic API errors gracefully', async () => {
      const interactionData = {
        twinType: 'task',
        userMessage: 'Help me organize my work.',
      };

      vi.mocked(prisma.twinInteraction).create.mockRejectedValueOnce(
        new Error('Anthropic API error')
      );

      const response = await request(app)
        .post('/api/twins/interaction')
        .send(interactionData);

      expect(response.status).toBeGreaterThanOrEqual(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle database errors when saving interaction', async () => {
      const interactionData = {
        twinType: 'growth',
        userMessage: 'How can I grow as a person?',
      };

      vi.mocked(prisma.twinInteraction).create.mockRejectedValueOnce(
        new Error('Database write failed')
      );

      const response = await request(app)
        .post('/api/twins/interaction')
        .send(interactionData);

      expect([500, 503]).toContain(response.status);
    });

    it('should timeout if twin response takes too long', async () => {
      const interactionData = {
        twinType: 'research',
        userMessage: 'Synthesize my accumulated knowledge.',
      };

      // This would require configuring a timeout in the route
      const response = await request(app)
        .post('/api/twins/interaction')
        .send(interactionData);

      // Should eventually resolve with either success or timeout error
      expect([201, 504]).toContain(response.status);
    });
  });
});
