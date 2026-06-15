import { Router, Request, Response } from 'express';
import type { Biometric } from '../types/index.js';

const router = Router();

// Mock biometric data
const biometricsData: Record<string, Biometric[]> = {};

// POST /api/v1/biometrics/:userId/submit
router.post('/:userId/submit', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { heartRate, hrv, breathingRate, stressLevel, emotionalState, source } = req.body;

    if (!userId) {
      return res.status(400).json({ error: 'User ID required' });
    }

    const biometric: Biometric = {
      id: `bio_${Date.now()}`,
      userId,
      heartRate: heartRate || Math.floor(Math.random() * 100 + 60),
      hrv: hrv || Math.floor(Math.random() * 200),
      breathingRate: breathingRate || Math.floor(Math.random() * 10 + 12),
      stressLevel: stressLevel || Math.floor(Math.random() * 100),
      emotionalState: emotionalState || 'calm',
      source: source || 'manual',
      detectedAt: new Date(),
    };

    if (!biometricsData[userId]) {
      biometricsData[userId] = [];
    }

    biometricsData[userId].push(biometric);

    // Keep only last 100 readings
    if (biometricsData[userId].length > 100) {
      biometricsData[userId] = biometricsData[userId].slice(-100);
    }

    res.status(201).json({ success: true, biometric });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit biometrics' });
  }
});

// GET /api/v1/biometrics/:userId/latest
router.get('/:userId/latest', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const readings = biometricsData[userId] || [];
    const latest = readings[readings.length - 1] || {
      heartRate: 72,
      hrv: 45,
      breathingRate: 14,
      stressLevel: 35,
      emotionalState: 'calm',
    };

    res.json(latest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch latest biometrics' });
  }
});

// GET /api/v1/biometrics/:userId/trend
router.get('/:userId/trend', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { range = '7d' } = req.query;

    const readings = biometricsData[userId] || [];

    const trend = {
      range,
      heartRate: {
        current: readings.length ? readings[readings.length - 1].heartRate : 72,
        average: readings.length
          ? Math.round(readings.reduce((sum, r) => sum + r.heartRate, 0) / readings.length)
          : 72,
        trend: readings.length > 1 ? (readings[readings.length - 1].heartRate > readings[0].heartRate ? 'up' : 'down') : 'stable',
      },
      hrv: {
        current: readings.length ? readings[readings.length - 1].hrv : 45,
        average: readings.length ? Math.round(readings.reduce((sum, r) => sum + r.hrv, 0) / readings.length) : 45,
        trend: readings.length > 1 ? (readings[readings.length - 1].hrv > readings[0].hrv ? 'up' : 'down') : 'stable',
      },
      stressLevel: {
        current: readings.length ? readings[readings.length - 1].stressLevel : 35,
        average: readings.length ? Math.round(readings.reduce((sum, r) => sum + r.stressLevel, 0) / readings.length) : 35,
        trend: readings.length > 1 ? (readings[readings.length - 1].stressLevel < readings[0].stressLevel ? 'down' : 'up') : 'stable',
      },
    };

    res.json(trend);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch biometric trends' });
  }
});

// GET /api/v1/biometrics/:userId/history
router.get('/:userId/history', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = 50 } = req.query;

    const readings = biometricsData[userId] || [];
    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);

    res.json({
      total: readings.length,
      readings: readings.slice(-limitNum),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch biometric history' });
  }
});

// WebSocket endpoint (placeholder for real-time updates)
// In production, implement with ws library
router.get('/:userId/stream', (req: Request, res: Response) => {
  res.status(501).json({ error: 'WebSocket stream not yet implemented' });
});

// POST /api/v1/biometrics/:userId/link-apple-health
router.post('/:userId/link-apple-health', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { token } = req.body;

    // TODO: Exchange token for HealthKit access
    // For now, mock response
    res.json({
      success: true,
      message: 'Apple HealthKit linked',
      syncing: true,
      lastSync: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to link Apple HealthKit' });
  }
});

// POST /api/v1/biometrics/:userId/link-google-fit
router.post('/:userId/link-google-fit', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { token } = req.body;

    // TODO: Exchange token for Google Fit access
    // For now, mock response
    res.json({
      success: true,
      message: 'Google Fit linked',
      syncing: true,
      lastSync: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to link Google Fit' });
  }
});

export default router;
