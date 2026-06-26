/**
 * Voice Route Tests
 * Tests for voice recording upload, emotion analysis, and retrieval
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import voiceRouter from '../../routes/voice';
import { prisma } from '../../index';
import { requireAuth } from '../../middleware/auth';

vi.mocked(prisma);

const app: Express = express();
app.use(express.json());

// Mock requireAuth middleware
app.use((req, res, next) => {
  req.userId = 'test-user-id';
  req.userEmail = 'test@example.com';
  next();
});

app.use('/api/voice', voiceRouter);

describe('Voice Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/voice - Upload voice recording', () => {
    it('should successfully upload a voice recording with emotion analysis', async () => {
      const audioData = {
        audioBase64: 'SGVsbG8gV29ybGQhIFRoaXMgaXMgYW4gYXVkaW8gYmFzZTY0IHRleHQ=',
        context: 'morning_reflection',
        location: 'home',
        decisionTitle: 'Career change decision',
        planningClarity: 7,
      };

      const mockRecording = {
        id: 'recording-1',
        userId: 'test-user-id',
        transcript: 'I am thinking about making a career change.',
        emotionState: 'thoughtful',
        primaryEmotion: 'neutral',
        emotionConfidence: 0.75,
        acousticFeatures: {
          pitch: 125.5,
          speech_rate: 115,
          jitter: 0.01,
        },
        context: audioData.context,
        location: audioData.location,
        decisionTitle: audioData.decisionTitle,
        planningClarity: audioData.planningClarity,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.voiceRecording).create.mockResolvedValueOnce(mockRecording);

      const response = await request(app)
        .post('/api/voice')
        .send(audioData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('recordingId');
      expect(response.body).toHaveProperty('transcript');
      expect(response.body).toHaveProperty('emotionAnalysis');
      expect(response.body.emotionAnalysis).toHaveProperty('primaryEmotion');
      expect(response.body.emotionAnalysis).toHaveProperty('confidence');
    });

    it('should reject upload without audioBase64', async () => {
      const invalidData = {
        context: 'morning_reflection',
      };

      const response = await request(app)
        .post('/api/voice')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'Missing audioBase64' });
    });

    it('should handle emotion detection with various emotional cues', async () => {
      const audioDataHappy = {
        audioBase64: 'SGVsbG8hIEkgYW0gc28gaGFwcHkgYW5kIGZlZWxpbmcgZ3JlYXQh',
        context: 'celebration',
      };

      const mockRecording = {
        id: 'recording-happy',
        userId: 'test-user-id',
        transcript: 'I am so happy and feeling great!',
        emotionState: 'joyful',
        primaryEmotion: 'happy',
        emotionConfidence: 0.9,
        acousticFeatures: {},
        context: audioDataHappy.context,
        location: null,
        decisionTitle: null,
        planningClarity: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.voiceRecording).create.mockResolvedValueOnce(mockRecording);

      const response = await request(app)
        .post('/api/voice')
        .send(audioDataHappy);

      expect(response.status).toBe(201);
      expect(response.body.emotionAnalysis.primaryEmotion).toBe('happy');
    });

    it('should extract acoustic features from audio', async () => {
      const audioData = {
        audioBase64: 'VmFsaWQgQmFzZTY0IEF1ZGlvIERhdGE=',
      };

      const mockRecording = {
        id: 'recording-2',
        userId: 'test-user-id',
        transcript: 'Test transcript',
        emotionState: 'neutral',
        primaryEmotion: 'neutral',
        emotionConfidence: 0.65,
        acousticFeatures: {
          pitch: 145.3,
          speech_rate: 125,
          jitter: 0.015,
          formants: [800, 1500, 2500],
          mfcc: Array(13).fill(0.5),
          prosody: {
            intonation: 0.2,
            rhythm: 0.7,
            stress_patterns: 0.5,
          },
        },
        context: null,
        location: null,
        decisionTitle: null,
        planningClarity: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.voiceRecording).create.mockResolvedValueOnce(mockRecording);

      const response = await request(app)
        .post('/api/voice')
        .send(audioData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('acousticFeatures');
    });
  });

  describe('GET /api/voice - List user recordings', () => {
    it('should list all voice recordings for authenticated user', async () => {
      const mockRecordings = [
        {
          id: 'recording-1',
          userId: 'test-user-id',
          transcript: 'First recording',
          emotionState: 'neutral',
          primaryEmotion: 'neutral',
          emotionConfidence: 0.7,
          context: 'morning',
          createdAt: new Date(),
        },
        {
          id: 'recording-2',
          userId: 'test-user-id',
          transcript: 'Second recording',
          emotionState: 'positive',
          primaryEmotion: 'happy',
          emotionConfidence: 0.85,
          context: 'evening',
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.voiceRecording).findMany.mockResolvedValueOnce(mockRecordings);

      const response = await request(app).get('/api/voice');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('recordings');
      expect(Array.isArray(response.body.recordings)).toBe(true);
      expect(response.body.recordings.length).toBe(2);
    });

    it('should return empty array when no recordings exist', async () => {
      vi.mocked(prisma.voiceRecording).findMany.mockResolvedValueOnce([]);

      const response = await request(app).get('/api/voice');

      expect(response.status).toBe(200);
      expect(response.body.recordings).toEqual([]);
    });

    it('should filter recordings by context', async () => {
      const mockRecordings = [
        {
          id: 'recording-1',
          userId: 'test-user-id',
          transcript: 'Morning reflection',
          context: 'morning_reflection',
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.voiceRecording).findMany.mockResolvedValueOnce(mockRecordings);

      const response = await request(app)
        .get('/api/voice')
        .query({ context: 'morning_reflection' });

      expect(response.status).toBe(200);
      expect(response.body.recordings).toHaveLength(1);
    });
  });

  describe('GET /api/voice/:recordingId - Get recording detail', () => {
    it('should retrieve detailed information about a specific recording', async () => {
      const mockRecording = {
        id: 'recording-1',
        userId: 'test-user-id',
        transcript: 'Detailed recording content',
        emotionState: 'thoughtful',
        primaryEmotion: 'neutral',
        emotionConfidence: 0.78,
        acousticFeatures: {
          pitch: 120,
          speech_rate: 110,
          jitter: 0.012,
        },
        context: 'decision_making',
        location: 'office',
        decisionTitle: 'Team restructuring',
        planningClarity: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.voiceRecording).findUnique.mockResolvedValueOnce(mockRecording);

      const response = await request(app).get('/api/voice/recording-1');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockRecording);
    });

    it('should return 404 for non-existent recording', async () => {
      vi.mocked(prisma.voiceRecording).findUnique.mockResolvedValueOnce(null);

      const response = await request(app).get('/api/voice/non-existent-id');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Recording not found' });
    });

    it('should verify user ownership of recording', async () => {
      const mockRecording = {
        id: 'recording-1',
        userId: 'different-user-id',
        transcript: 'Someone else recording',
        createdAt: new Date(),
      };

      vi.mocked(prisma.voiceRecording).findUnique.mockResolvedValueOnce(mockRecording);

      const response = await request(app).get('/api/voice/recording-1');

      // Should return 403 Forbidden or 404 (depending on implementation)
      expect([403, 404]).toContain(response.status);
    });
  });

  describe('Voice emotion analysis edge cases', () => {
    it('should handle neutral emotion when no indicators present', async () => {
      const neutralAudio = {
        audioBase64: 'TmV1dHJhbCBhdWRpbyBkYXRh',
      };

      const mockRecording = {
        id: 'recording-neutral',
        userId: 'test-user-id',
        transcript: 'This is a neutral statement.',
        emotionState: 'neutral',
        primaryEmotion: 'neutral',
        emotionConfidence: 0.65,
        acousticFeatures: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.voiceRecording).create.mockResolvedValueOnce(mockRecording);

      const response = await request(app)
        .post('/api/voice')
        .send(neutralAudio);

      expect(response.status).toBe(201);
      expect(response.body.emotionAnalysis.primaryEmotion).toBe('neutral');
    });

    it('should detect mixed emotions', async () => {
      const mixedAudio = {
        audioBase64: 'VGhpcyBpcyBib3RoIHNhZCBhbmQgYW5ncnkgYXQgdGhlIHNhbWUgdGltZQ==',
      };

      const mockRecording = {
        id: 'recording-mixed',
        userId: 'test-user-id',
        transcript: 'This is both sad and angry at the same time',
        emotionState: 'conflicted',
        primaryEmotion: 'sad',
        emotionConfidence: 0.72,
        acousticFeatures: {},
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.voiceRecording).create.mockResolvedValueOnce(mockRecording);

      const response = await request(app)
        .post('/api/voice')
        .send(mixedAudio);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('emotionAnalysis');
    });
  });

  describe('Voice recording error handling', () => {
    it('should handle database errors gracefully', async () => {
      vi.mocked(prisma.voiceRecording).create.mockRejectedValueOnce(
        new Error('Database connection failed')
      );

      const audioData = {
        audioBase64: 'VmFsaWQgQmFzZTY0IEF1ZGlvIERhdGE=',
      };

      const response = await request(app)
        .post('/api/voice')
        .send(audioData);

      expect(response.status).toBeGreaterThanOrEqual(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle Anthropic API errors when processing transcript', async () => {
      // This would require mocking the Anthropic client in a way that causes an error
      const audioData = {
        audioBase64: 'VmFsaWQgQmFzZTY0IEF1ZGlvIERhdGE=',
      };

      // Mock Anthropic to reject
      vi.mocked(getAnthropic).mockRejectedValueOnce(
        new Error('API rate limit exceeded')
      );

      const response = await request(app)
        .post('/api/voice')
        .send(audioData);

      expect([500, 503]).toContain(response.status);
    });
  });
});
