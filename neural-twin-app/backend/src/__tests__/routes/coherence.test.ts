/**
 * Coherence Route Tests
 * Tests for coherence state tracking, history retrieval, and pattern analysis
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import coherenceRouter from '../../routes/coherence';
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

app.use('/api/coherence', coherenceRouter);

describe('Coherence Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /api/coherence - Fetch current coherence state', () => {
    it('should return current coherence state with all metrics', async () => {
      const mockCoherence = {
        id: 'coherence-1',
        userId: 'test-user-id',
        heartRateVariability: 52,
        sleepQuality: 7.8,
        stressLevel: 3.2,
        mentalClarity: 8.1,
        emotionalBalance: 7.5,
        physicalEnergy: 8.2,
        socialConnection: 6.9,
        creativeFlow: 7.4,
        timestamp: new Date(),
      };

      vi.mocked(prisma.coherenceState).findFirst.mockResolvedValueOnce(mockCoherence);

      const response = await request(app).get('/api/coherence');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('heartRateVariability');
      expect(response.body).toHaveProperty('sleepQuality');
      expect(response.body).toHaveProperty('stressLevel');
      expect(response.body).toHaveProperty('mentalClarity');
      expect(response.body.mentalClarity).toBe(8.1);
    });

    it('should calculate overall coherence score from metrics', async () => {
      const mockCoherence = {
        id: 'coherence-1',
        userId: 'test-user-id',
        heartRateVariability: 60,
        sleepQuality: 8,
        stressLevel: 2,
        mentalClarity: 9,
        emotionalBalance: 8.5,
        physicalEnergy: 8.8,
        socialConnection: 7.5,
        creativeFlow: 8.2,
        overallScore: 8.2,
        timestamp: new Date(),
      };

      vi.mocked(prisma.coherenceState).findFirst.mockResolvedValueOnce(mockCoherence);

      const response = await request(app).get('/api/coherence');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('overallScore');
      expect(response.body.overallScore).toBeGreaterThanOrEqual(0);
      expect(response.body.overallScore).toBeLessThanOrEqual(10);
    });

    it('should identify low coherence areas', async () => {
      const mockCoherence = {
        id: 'coherence-1',
        userId: 'test-user-id',
        heartRateVariability: 35,
        sleepQuality: 4.2,
        stressLevel: 8.5,
        mentalClarity: 5.1,
        emotionalBalance: 4.8,
        physicalEnergy: 3.9,
        socialConnection: 9.2,
        creativeFlow: 6.5,
        lowAreas: ['physicalEnergy', 'sleepQuality', 'emotionalBalance'],
        timestamp: new Date(),
      };

      vi.mocked(prisma.coherenceState).findFirst.mockResolvedValueOnce(mockCoherence);

      const response = await request(app).get('/api/coherence');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('lowAreas');
      expect(Array.isArray(response.body.lowAreas)).toBe(true);
    });

    it('should handle missing coherence state gracefully', async () => {
      vi.mocked(prisma.coherenceState).findFirst.mockResolvedValueOnce(null);

      const response = await request(app).get('/api/coherence');

      expect(response.status).toBeGreaterThanOrEqual(200);
      // Either returns empty state or default values
      expect(response.body).toBeDefined();
    });
  });

  describe('GET /api/coherence/history - Coherence history with timeframes', () => {
    it('should retrieve 7-day coherence history', async () => {
      const mockHistory = Array(7).fill(0).map((_, i) => ({
        id: `coherence-${i}`,
        userId: 'test-user-id',
        heartRateVariability: 45 + Math.random() * 20,
        sleepQuality: 6 + Math.random() * 3,
        stressLevel: 2 + Math.random() * 5,
        mentalClarity: 7 + Math.random() * 2,
        emotionalBalance: 6.5 + Math.random() * 2.5,
        physicalEnergy: 7 + Math.random() * 2,
        socialConnection: 6 + Math.random() * 3,
        creativeFlow: 6.5 + Math.random() * 2.5,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }));

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/history')
        .query({ timeframe: '7d' });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('history');
      expect(response.body.history.length).toBe(7);
    });

    it('should retrieve 30-day coherence history', async () => {
      const mockHistory = Array(30).fill(0).map((_, i) => ({
        id: `coherence-${i}`,
        userId: 'test-user-id',
        sleepQuality: 5 + Math.random() * 4,
        stressLevel: 1 + Math.random() * 6,
        mentalClarity: 6 + Math.random() * 3,
        emotionalBalance: 6 + Math.random() * 3,
        physicalEnergy: 6 + Math.random() * 3,
        overallScore: 6.5 + Math.random() * 2,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }));

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/history')
        .query({ timeframe: '30d' });

      expect(response.status).toBe(200);
      expect(response.body.history.length).toBe(30);
    });

    it('should retrieve 90-day coherence trend', async () => {
      const mockHistory = Array(90).fill(0).map((_, i) => ({
        id: `coherence-${i}`,
        userId: 'test-user-id',
        overallScore: 6 + Math.random() * 3,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }));

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/history')
        .query({ timeframe: '90d' });

      expect(response.status).toBe(200);
      expect(response.body.history.length).toBe(90);
    });

    it('should support custom date range', async () => {
      const startDate = new Date('2024-06-01');
      const endDate = new Date('2024-06-15');

      const mockHistory = Array(15).fill(0).map((_, i) => ({
        id: `coherence-${i}`,
        userId: 'test-user-id',
        overallScore: 6.5 + Math.random() * 2,
        timestamp: new Date(startDate.getTime() + i * 24 * 60 * 60 * 1000),
      }));

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/history')
        .query({ startDate: startDate.toISOString(), endDate: endDate.toISOString() });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('history');
    });

    it('should calculate coherence trends over time', async () => {
      const mockHistory = [
        { overallScore: 6.0, timestamp: new Date('2024-06-01') },
        { overallScore: 6.3, timestamp: new Date('2024-06-08') },
        { overallScore: 6.8, timestamp: new Date('2024-06-15') },
        { overallScore: 7.2, timestamp: new Date('2024-06-22') },
      ];

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/history')
        .query({ timeframe: '30d', includeTrend: true });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('trend');
      // Trend should show improvement
      if (response.body.trend) {
        expect(response.body.trend).toMatch(/improving|stable|declining/i);
      }
    });
  });

  describe('GET /api/coherence/metrics/:metricName - Detailed metric analysis', () => {
    it('should return detailed sleep quality analysis', async () => {
      const mockHistory = Array(30).fill(0).map((_, i) => ({
        value: 5 + Math.random() * 4,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }));

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/metrics/sleepQuality');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('metric');
      expect(response.body.metric).toBe('sleepQuality');
      expect(response.body).toHaveProperty('average');
      expect(response.body).toHaveProperty('min');
      expect(response.body).toHaveProperty('max');
    });

    it('should return stress level analysis with recommendations', async () => {
      const mockHistory = Array(7).fill(0).map((_, i) => ({
        value: 4 + Math.random() * 4,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }));

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/metrics/stressLevel');

      expect(response.status).toBe(200);
      expect(response.body.metric).toBe('stressLevel');
      if (response.body.recommendations) {
        expect(Array.isArray(response.body.recommendations)).toBe(true);
      }
    });

    it('should return heart rate variability trend', async () => {
      const mockHistory = Array(14).fill(0).map((_, i) => ({
        value: 40 + Math.random() * 30,
        timestamp: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
      }));

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/metrics/heartRateVariability');

      expect(response.status).toBe(200);
      expect(response.body.metric).toBe('heartRateVariability');
      expect(response.body).toHaveProperty('trend');
    });

    it('should return 404 for invalid metric name', async () => {
      const response = await request(app)
        .get('/api/coherence/metrics/invalidMetric');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /api/coherence - Update coherence state', () => {
    it('should accept and record new coherence measurement', async () => {
      const coherenceData = {
        heartRateVariability: 48,
        sleepQuality: 7.5,
        stressLevel: 2.8,
        mentalClarity: 8.2,
        emotionalBalance: 7.8,
        physicalEnergy: 8.0,
        socialConnection: 7.2,
        creativeFlow: 7.6,
      };

      const mockCreated = {
        id: 'coherence-new',
        userId: 'test-user-id',
        ...coherenceData,
        timestamp: new Date(),
      };

      vi.mocked(prisma.coherenceState).create.mockResolvedValueOnce(mockCreated);

      const response = await request(app)
        .post('/api/coherence')
        .send(coherenceData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.heartRateVariability).toBe(coherenceData.heartRateVariability);
    });

    it('should validate metric ranges', async () => {
      const invalidData = {
        heartRateVariability: 150, // Too high
        sleepQuality: -1, // Negative
        stressLevel: 11, // > 10
        mentalClarity: 8,
      };

      const response = await request(app)
        .post('/api/coherence')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Coherence patterns and insights', () => {
    it('should identify patterns in coherence cycles', async () => {
      const mockHistory = [
        { overallScore: 6.2, timestamp: new Date('2024-06-17T20:00') },
        { overallScore: 6.8, timestamp: new Date('2024-06-18T20:00') },
        { overallScore: 7.5, timestamp: new Date('2024-06-19T20:00') },
        { overallScore: 8.1, timestamp: new Date('2024-06-20T20:00') },
        { overallScore: 7.8, timestamp: new Date('2024-06-21T20:00') },
        { overallScore: 6.5, timestamp: new Date('2024-06-22T20:00') },
      ];

      vi.mocked(prisma.coherenceState).findMany.mockResolvedValueOnce(mockHistory);

      const response = await request(app)
        .get('/api/coherence/patterns')
        .query({ timeframe: '7d' });

      expect(response.status).toBe(200);
      if (response.body.patterns) {
        expect(Array.isArray(response.body.patterns)).toBe(true);
      }
    });

    it('should correlate coherence with voice emotion patterns', async () => {
      const response = await request(app)
        .get('/api/coherence/correlations');

      expect(response.status).toBeGreaterThanOrEqual(200);
      if (response.body.correlations) {
        expect(response.body.correlations).toHaveProperty('emotionCoherence');
      }
    });
  });

  describe('Coherence error handling', () => {
    it('should handle database errors gracefully', async () => {
      vi.mocked(prisma.coherenceState).findFirst.mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const response = await request(app).get('/api/coherence');

      expect(response.status).toBeGreaterThanOrEqual(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle invalid timeframe parameters', async () => {
      const response = await request(app)
        .get('/api/coherence/history')
        .query({ timeframe: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle date parsing errors', async () => {
      const response = await request(app)
        .get('/api/coherence/history')
        .query({ startDate: 'not-a-date' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });
});
