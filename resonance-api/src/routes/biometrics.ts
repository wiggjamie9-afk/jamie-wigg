import { Router, Request, Response } from 'express';
import { biometricsService } from '../services/biometrics.js';

const router = Router();

// POST /api/v1/biometrics/:userId/submit
router.post('/:userId/submit', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { heartRate, hrv, breathingRate, stressLevel, emotionalState, source } = req.body;

    if (!userId || !source) {
      return res.status(400).json({ error: 'User ID and source required' });
    }

    const biometric = await biometricsService.submitData(userId, {
      heartRate,
      hrv,
      breathingRate,
      stressLevel,
      emotionalState,
      source,
    });

    res.status(201).json({ success: true, biometric });
  } catch (error) {
    console.error('Biometrics submit error:', error);
    res.status(500).json({ error: 'Failed to submit biometrics' });
  }
});

// GET /api/v1/biometrics/:userId/latest
router.get('/:userId/latest', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const latest = await biometricsService.getLatest(userId);

    if (!latest) {
      return res.json({
        heartRate: 72,
        hrv: 45,
        breathingRate: 14,
        stressLevel: 35,
        emotionalState: 'calm',
      });
    }

    res.json(latest);
  } catch (error) {
    console.error('Latest biometrics fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch latest biometrics' });
  }
});

// GET /api/v1/biometrics/:userId/trend
router.get('/:userId/trend', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { range = '24' } = req.query;

    const hours = range === '7d' ? 168 : range === '30d' ? 720 : 24;
    const readings = await biometricsService.getTrends(userId, hours);

    if (readings.length === 0) {
      return res.json({
        range,
        heartRate: { current: 72, average: 72, trend: 'stable' },
        hrv: { current: 45, average: 45, trend: 'stable' },
        stressLevel: { current: 35, average: 35, trend: 'stable' },
      });
    }

    const avgData = await biometricsService.getAverages(userId, hours);

    const trend = {
      range,
      heartRate: {
        current: readings[0]?.heart_rate || 72,
        average: avgData.avg_heart_rate || 72,
        trend: readings.length > 1
          ? readings[0].heart_rate > readings[readings.length - 1].heart_rate
            ? 'up'
            : 'down'
          : 'stable',
      },
      hrv: {
        current: readings[0]?.hrv || 45,
        average: avgData.avg_hrv || 45,
        trend: readings.length > 1
          ? readings[0].hrv > readings[readings.length - 1].hrv
            ? 'up'
            : 'down'
          : 'stable',
      },
      stressLevel: {
        current: readings[0]?.stress_level || 35,
        average: avgData.avg_stress_level || 35,
        trend: readings.length > 1
          ? readings[0].stress_level < readings[readings.length - 1].stress_level
            ? 'down'
            : 'up'
          : 'stable',
      },
    };

    res.json(trend);
  } catch (error) {
    console.error('Biometrics trend error:', error);
    res.status(500).json({ error: 'Failed to fetch biometric trends' });
  }
});

// GET /api/v1/biometrics/:userId/history
router.get('/:userId/history', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = '50' } = req.query;

    const limitNum = Math.min(parseInt(limit as string, 10) || 50, 100);
    const readings = await biometricsService.getHistory(userId, limitNum);

    res.json({
      total: readings.length,
      readings,
    });
  } catch (error) {
    console.error('Biometrics history error:', error);
    res.status(500).json({ error: 'Failed to fetch biometric history' });
  }
});

// POST /api/v1/biometrics/:userId/link-apple-health
router.post('/:userId/link-apple-health', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    await biometricsService.linkHealthKit(userId, token);

    res.json({
      success: true,
      message: 'Apple HealthKit linked',
      syncing: true,
      lastSync: new Date(),
    });
  } catch (error) {
    console.error('HealthKit link error:', error);
    res.status(500).json({ error: 'Failed to link Apple HealthKit' });
  }
});

// POST /api/v1/biometrics/:userId/link-google-fit
router.post('/:userId/link-google-fit', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token required' });
    }

    await biometricsService.linkGoogleFit(userId, token);

    res.json({
      success: true,
      message: 'Google Fit linked',
      syncing: true,
      lastSync: new Date(),
    });
  } catch (error) {
    console.error('Google Fit link error:', error);
    res.status(500).json({ error: 'Failed to link Google Fit' });
  }
});

export default router;
