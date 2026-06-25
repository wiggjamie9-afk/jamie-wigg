import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';

const router: Router = express.Router();

interface BiometricDataRequest {
  userId: string;
  heartRate?: number;
  hrv?: number;
  breathingRate?: number;
  sleepDuration?: number;
  sleepQuality?: number;
  steps?: number;
  activeMinutes?: number;
  temperature?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  posture?: string;
  source?: string;
  timeOfDay?: string;
}

function calculateCoherence(biometrics: any): {
  heartBrainCoh: number;
  breathCoh: number;
  vagalTone: number;
  circadianAlign: number;
  overallCoherence: number;
} {
  const hr = biometrics.heartRate || 70;
  const hrv = biometrics.hrv || 50;
  const breathing = biometrics.breathingRate || 16;
  const sleepQuality = (biometrics.sleepQuality || 70) / 100;

  const heartBrainCoh = Math.min(hrv / 100, 1);
  const breathCoh = breathing > 10 && breathing < 20 ? Math.min((20 - Math.abs(breathing - 15.5)) / 10, 1) : 0.5;
  const vagalTone = Math.min((100 - hr) / 100, 1);
  const circadianAlign = sleepQuality * 0.8 + (biometrics.timeOfDay ? 0.2 : 0);

  const overallCoherence = (heartBrainCoh + breathCoh + vagalTone + circadianAlign) / 4 * 100;

  return {
    heartBrainCoh,
    breathCoh,
    vagalTone,
    circadianAlign,
    overallCoherence
  };
}

// POST /api/biometrics - Log biometric data
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      heartRate,
      hrv,
      breathingRate,
      sleepDuration,
      sleepQuality,
      steps,
      activeMinutes,
      temperature,
      bloodPressure,
      posture,
      source,
      timeOfDay
    } = req.body as BiometricDataRequest;

    const userId = req.userId!;

    const coherence = calculateCoherence({
      heartRate,
      hrv,
      breathingRate,
      sleepQuality,
      timeOfDay
    });

    const biometricData = await prisma.biometricData.create({
      data: {
        userId,
        heartRate: heartRate || null,
        hrv: hrv || null,
        breathingRate: breathingRate || null,
        sleepDuration: sleepDuration || null,
        sleepQuality: sleepQuality || null,
        steps: steps || null,
        activeMinutes: activeMinutes || null,
        temperature: temperature || null,
        bloodPressure: bloodPressure || null,
        posture: posture || null,
        source: source || 'manual',
        timeOfDay: timeOfDay || null,
        timestamp: new Date()
      }
    });

    const coherenceMetric = await prisma.coherenceMetric.create({
      data: {
        userId,
        heartBrainCoh: coherence.heartBrainCoh,
        breathCoh: coherence.breathCoh,
        vagalTone: coherence.vagalTone,
        circadianAlign: coherence.circadianAlign,
        overallCoherence: coherence.overallCoherence,
        coherenceState: coherence.overallCoherence > 70 ? 'coherent' : coherence.overallCoherence > 50 ? 'transitioning' : 'stressed',
        timestamp: new Date()
      }
    });

    res.json({
      success: true,
      biometricId: biometricData.id,
      coherence: {
        heartBrainCoh: coherence.heartBrainCoh.toFixed(2),
        breathCoh: coherence.breathCoh.toFixed(2),
        vagalTone: coherence.vagalTone.toFixed(2),
        circadianAlign: coherence.circadianAlign.toFixed(2),
        overallCoherence: coherence.overallCoherence.toFixed(1),
        coherenceState: coherenceMetric.coherenceState
      }
    });
  } catch (error) {
    console.error('Biometric logging error:', error);
    res.status(500).json({ error: 'Failed to log biometric data' });
  }
});

// GET /api/biometrics - Get user's biometric data
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const timeframe = (req.query.timeframe as string) || '24h'; // 24h, 7d, 30d, all

    let startDate = new Date();
    switch (timeframe) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'all':
        startDate = new Date('2000-01-01');
        break;
      case '24h':
      default:
        startDate.setHours(startDate.getHours() - 24);
    }

    const biometrics = await prisma.biometricData.findMany({
      where: {
        userId,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    const coherence = await prisma.coherenceMetric.findMany({
      where: {
        userId,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'desc' },
      take: 100
    });

    const avgCoherence = coherence.length > 0
      ? coherence.reduce((sum, c) => sum + (c.overallCoherence || 0), 0) / coherence.length
      : 0;

    res.json({
      success: true,
      biometrics: biometrics.map(b => ({
        id: b.id,
        heartRate: b.heartRate,
        hrv: b.hrv,
        breathingRate: b.breathingRate,
        sleepQuality: b.sleepQuality,
        posture: b.posture,
        timestamp: b.timestamp
      })),
      coherence: {
        latest: coherence[0] || null,
        average: avgCoherence.toFixed(1),
        trend: coherence.length > 1 ? coherence[0].overallCoherence > coherence[Math.floor(coherence.length / 2)].overallCoherence ? 'improving' : 'declining' : 'stable'
      }
    });
  } catch (error) {
    console.error('Biometric fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch biometric data' });
  }
});

// GET /api/biometrics/:id - Get specific biometric reading
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;

    const biometric = await prisma.biometricData.findFirst({
      where: { id, userId }
    });

    if (!biometric) {
      return res.status(404).json({ error: 'Biometric data not found' });
    }

    res.json({
      success: true,
      biometric
    });
  } catch (error) {
    console.error('Biometric fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch biometric data' });
  }
});

export default router;
