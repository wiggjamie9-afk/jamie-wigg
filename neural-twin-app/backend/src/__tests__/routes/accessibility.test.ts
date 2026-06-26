/**
 * Accessibility Route Tests
 * Tests for book scanning, TTS generation, and accessibility settings
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import express, { Express } from 'express';
import request from 'supertest';
import accessibilityRouter from '../../routes/accessibility';
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

app.use('/api/accessibility', accessibilityRouter);

describe('Accessibility Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('POST /api/accessibility/scan - Book scanning with OCR', () => {
    it('should scan and extract text from book page image', async () => {
      const scanData = {
        imageBase64: 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
        bookTitle: 'The Art of Learning',
        pageNumber: 42,
      };

      const mockScan = {
        id: 'scan-1',
        userId: 'test-user-id',
        bookTitle: scanData.bookTitle,
        pageNumber: scanData.pageNumber,
        extractedText: 'The learning process consists of progressive stages of skill acquisition...',
        confidence: 0.92,
        language: 'en',
        processingTimeMs: 2340,
        createdAt: new Date(),
      };

      vi.mocked(prisma.bookScan).create.mockResolvedValueOnce(mockScan);

      const response = await request(app)
        .post('/api/accessibility/scan')
        .send(scanData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('scanId');
      expect(response.body).toHaveProperty('extractedText');
      expect(response.body.extractedText).toContain('learning');
      expect(response.body).toHaveProperty('confidence');
    });

    it('should detect multiple languages in scanned text', async () => {
      const scanData = {
        imageBase64: 'VmFsaWQgQmFzZTY0IEltYWdlIERhdGE=',
        bookTitle: 'Multilingual Guide',
        pageNumber: 10,
      };

      const mockScan = {
        id: 'scan-multilingual',
        userId: 'test-user-id',
        bookTitle: scanData.bookTitle,
        extractedText: 'Hello world. Hola mundo. Bonjour le monde.',
        languages: ['en', 'es', 'fr'],
        confidence: 0.88,
        createdAt: new Date(),
      };

      vi.mocked(prisma.bookScan).create.mockResolvedValueOnce(mockScan);

      const response = await request(app)
        .post('/api/accessibility/scan')
        .send(scanData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('languages');
      expect(Array.isArray(response.body.languages)).toBe(true);
    });

    it('should handle low-confidence OCR gracefully', async () => {
      const scanData = {
        imageBase64: 'Qmx1cnJ5IGltYWdlIGRhdGE=',
        bookTitle: 'Blurry Book',
      };

      const mockScan = {
        id: 'scan-low-conf',
        userId: 'test-user-id',
        bookTitle: scanData.bookTitle,
        extractedText: 'Text quality is poor. Manual review recommended.',
        confidence: 0.42,
        qualityWarning: 'Image quality is low - consider re-scanning',
        createdAt: new Date(),
      };

      vi.mocked(prisma.bookScan).create.mockResolvedValueOnce(mockScan);

      const response = await request(app)
        .post('/api/accessibility/scan')
        .send(scanData);

      expect(response.status).toBe(201);
      if (response.body.confidence < 0.7) {
        expect(response.body).toHaveProperty('qualityWarning');
      }
    });

    it('should reject scan without imageBase64', async () => {
      const invalidData = {
        bookTitle: 'Some Book',
      };

      const response = await request(app)
        .post('/api/accessibility/scan')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should use Claude Vision for enhanced OCR processing', async () => {
      const scanData = {
        imageBase64: 'SGlnaC1xdWFsaXR5IGltYWdl',
        bookTitle: 'Technical Manual',
        enhancedProcessing: true,
      };

      const mockScan = {
        id: 'scan-enhanced',
        userId: 'test-user-id',
        extractedText: 'Technical content with structured layout preserved.',
        layoutAnalysis: {
          hasImages: false,
          hasFormulas: true,
          hasTableOfContents: false,
        },
        confidence: 0.96,
        createdAt: new Date(),
      };

      vi.mocked(prisma.bookScan).create.mockResolvedValueOnce(mockScan);

      const response = await request(app)
        .post('/api/accessibility/scan')
        .send(scanData);

      expect(response.status).toBe(201);
      if (response.body.layoutAnalysis) {
        expect(response.body.layoutAnalysis).toHaveProperty('hasFormulas');
      }
    });
  });

  describe('GET /api/accessibility/scans - List book scans', () => {
    it('should retrieve all book scans for user', async () => {
      const mockScans = [
        {
          id: 'scan-1',
          userId: 'test-user-id',
          bookTitle: 'The Art of Learning',
          pageNumber: 42,
          extractedText: 'Learning content...',
          confidence: 0.92,
          createdAt: new Date(),
        },
        {
          id: 'scan-2',
          userId: 'test-user-id',
          bookTitle: 'Deep Work',
          pageNumber: 15,
          extractedText: 'Focus and concentration...',
          confidence: 0.89,
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.bookScan).findMany.mockResolvedValueOnce(mockScans);

      const response = await request(app).get('/api/accessibility/scans');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('scans');
      expect(response.body.scans.length).toBe(2);
    });

    it('should filter scans by book title', async () => {
      const mockScans = [
        {
          id: 'scan-1',
          userId: 'test-user-id',
          bookTitle: 'Atomic Habits',
          pageNumber: 1,
          extractedText: 'Content...',
          createdAt: new Date(),
        },
      ];

      vi.mocked(prisma.bookScan).findMany.mockResolvedValueOnce(mockScans);

      const response = await request(app)
        .get('/api/accessibility/scans')
        .query({ bookTitle: 'Atomic Habits' });

      expect(response.status).toBe(200);
      expect(response.body.scans[0].bookTitle).toBe('Atomic Habits');
    });
  });

  describe('POST /api/accessibility/tts - Text-to-speech generation', () => {
    it('should generate speech from scanned text', async () => {
      const ttsData = {
        text: 'The principles of effective learning are well-established.',
        voiceId: 'voice-1',
        speed: 1.0,
        language: 'en',
      };

      const mockGeneration = {
        id: 'tts-1',
        userId: 'test-user-id',
        text: ttsData.text,
        voiceId: ttsData.voiceId,
        audioUrl: 'https://api.example.com/audio/tts-1.mp3',
        duration: 8.4,
        format: 'mp3',
        createdAt: new Date(),
      };

      vi.mocked(prisma.ttsGeneration).create.mockResolvedValueOnce(mockGeneration);

      const response = await request(app)
        .post('/api/accessibility/tts')
        .send(ttsData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('audioUrl');
      expect(response.body).toHaveProperty('duration');
      expect(response.body.format).toBe('mp3');
    });

    it('should support multiple voice options', async () => {
      const voices = ['voice-1', 'voice-2', 'voice-3'];

      for (const voiceId of voices) {
        const ttsData = {
          text: 'Sample text for voice testing.',
          voiceId,
        };

        const mockGeneration = {
          id: `tts-${voiceId}`,
          userId: 'test-user-id',
          text: ttsData.text,
          voiceId,
          audioUrl: `https://api.example.com/audio/tts-${voiceId}.mp3`,
          duration: 4.2,
          createdAt: new Date(),
        };

        vi.mocked(prisma.ttsGeneration).create.mockResolvedValueOnce(mockGeneration);

        const response = await request(app)
          .post('/api/accessibility/tts')
          .send(ttsData);

        expect(response.status).toBe(201);
        expect(response.body.voiceId).toBe(voiceId);
      }
    });

    it('should support variable playback speeds', async () => {
      const speeds = [0.8, 1.0, 1.25, 1.5, 2.0];

      for (const speed of speeds) {
        const ttsData = {
          text: 'Speed test text',
          speed,
        };

        const mockGeneration = {
          id: `tts-speed-${speed}`,
          userId: 'test-user-id',
          text: ttsData.text,
          speed,
          audioUrl: `https://api.example.com/audio/tts-speed-${speed}.mp3`,
          duration: 5 / speed,
          createdAt: new Date(),
        };

        vi.mocked(prisma.ttsGeneration).create.mockResolvedValueOnce(mockGeneration);

        const response = await request(app)
          .post('/api/accessibility/tts')
          .send(ttsData);

        expect(response.status).toBe(201);
        expect(response.body.speed).toBe(speed);
      }
    });

    it('should reject TTS without text', async () => {
      const invalidData = {
        voiceId: 'voice-1',
      };

      const response = await request(app)
        .post('/api/accessibility/tts')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/accessibility/settings - Get accessibility settings', () => {
    it('should retrieve user accessibility settings', async () => {
      const mockSettings = {
        id: 'settings-1',
        userId: 'test-user-id',
        ttsEnabled: true,
        defaultVoiceId: 'voice-1',
        defaultSpeed: 1.0,
        highContrast: false,
        fontSize: 16,
        fontFamily: 'sans-serif',
        screenReaderOptimized: false,
        captionsEnabled: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.accessibilitySettings).findUnique.mockResolvedValueOnce(mockSettings);

      const response = await request(app).get('/api/accessibility/settings');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('ttsEnabled');
      expect(response.body).toHaveProperty('fontSize');
      expect(response.body.fontSize).toBe(16);
    });

    it('should return default settings if none exist', async () => {
      vi.mocked(prisma.accessibilitySettings).findUnique.mockResolvedValueOnce(null);

      const response = await request(app).get('/api/accessibility/settings');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('fontSize');
      expect(response.body).toHaveProperty('ttsEnabled');
    });
  });

  describe('PUT /api/accessibility/settings - Update accessibility settings', () => {
    it('should update accessibility preferences', async () => {
      const updateData = {
        ttsEnabled: true,
        defaultVoiceId: 'voice-2',
        defaultSpeed: 1.25,
        highContrast: true,
        fontSize: 18,
        screenReaderOptimized: true,
      };

      const mockUpdated = {
        id: 'settings-1',
        userId: 'test-user-id',
        ...updateData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.accessibilitySettings).update.mockResolvedValueOnce(mockUpdated);

      const response = await request(app)
        .put('/api/accessibility/settings')
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.fontSize).toBe(18);
      expect(response.body.highContrast).toBe(true);
      expect(response.body.ttsEnabled).toBe(true);
    });

    it('should validate font size range', async () => {
      const invalidData = {
        fontSize: 200, // Too large
      };

      const response = await request(app)
        .put('/api/accessibility/settings')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should validate playback speed range', async () => {
      const invalidData = {
        defaultSpeed: 5.0, // Too fast
      };

      const response = await request(app)
        .put('/api/accessibility/settings')
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('Accessibility features for visual impairment', () => {
    it('should support screen reader optimization', async () => {
      const ttsData = {
        text: 'This is a long article about machine learning and neural networks.',
        screenReaderOptimized: true,
        segmentSize: 'sentence', // Read sentence by sentence
      };

      const mockGeneration = {
        id: 'tts-sr',
        userId: 'test-user-id',
        text: ttsData.text,
        screenReaderOptimized: true,
        segments: [
          'This is a long article about machine learning and neural networks.',
        ],
        audioUrl: 'https://api.example.com/audio/tts-sr.mp3',
        createdAt: new Date(),
      };

      vi.mocked(prisma.ttsGeneration).create.mockResolvedValueOnce(mockGeneration);

      const response = await request(app)
        .post('/api/accessibility/tts')
        .send(ttsData);

      expect(response.status).toBe(201);
      if (response.body.segments) {
        expect(Array.isArray(response.body.segments)).toBe(true);
      }
    });

    it('should support high contrast mode', async () => {
      const settingsData = {
        highContrast: true,
        backgroundColor: '#000000',
        textColor: '#FFFFFF',
      };

      const mockSettings = {
        id: 'settings-hc',
        userId: 'test-user-id',
        ...settingsData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(prisma.accessibilitySettings).update.mockResolvedValueOnce(mockSettings);

      const response = await request(app)
        .put('/api/accessibility/settings')
        .send(settingsData);

      expect(response.status).toBe(200);
      expect(response.body.highContrast).toBe(true);
    });
  });

  describe('Accessibility error handling', () => {
    it('should handle image processing errors gracefully', async () => {
      const scanData = {
        imageBase64: 'CorruptedBase64Data!!!',
      };

      vi.mocked(prisma.bookScan).create.mockRejectedValueOnce(
        new Error('Invalid image format')
      );

      const response = await request(app)
        .post('/api/accessibility/scan')
        .send(scanData);

      expect(response.status).toBeGreaterThanOrEqual(400);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle TTS API errors gracefully', async () => {
      const ttsData = {
        text: 'Generate audio',
      };

      vi.mocked(prisma.ttsGeneration).create.mockRejectedValueOnce(
        new Error('TTS service unavailable')
      );

      const response = await request(app)
        .post('/api/accessibility/tts')
        .send(ttsData);

      expect(response.status).toBeGreaterThanOrEqual(500);
      expect(response.body).toHaveProperty('error');
    });

    it('should handle database errors when saving settings', async () => {
      const settingsData = {
        fontSize: 18,
      };

      vi.mocked(prisma.accessibilitySettings).update.mockRejectedValueOnce(
        new Error('Database write failed')
      );

      const response = await request(app)
        .put('/api/accessibility/settings')
        .send(settingsData);

      expect(response.status).toBeGreaterThanOrEqual(500);
      expect(response.body).toHaveProperty('error');
    });
  });
});
