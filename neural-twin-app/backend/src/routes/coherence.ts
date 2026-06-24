import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { Anthropic } from '@anthropic-ai/sdk';

const router: Router = express.Router();
const anthropic = new Anthropic();

// Calculate 8th layer: Metacognitive coherence
async function calculateMetacognitiveCoherence(userId: string): Promise<number> {
  const metrics = await prisma.metacognitiveMetric.findMany({
    where: { userId },
    orderBy: { timestamp: 'desc' },
    take: 10
  });

  if (metrics.length === 0) return 0.5;

  const latest = metrics[0];
  const planning = (latest.planningScore || 0.5) * 0.25;
  const monitoring = (latest.monitoringScore || 0.5) * 0.25;
  const evaluating = (latest.evaluatingScore || 0.5) * 0.25;
  const reflecting = (latest.reflectingScore || 0.5) * 0.25;

  return (planning + monitoring + evaluating + reflecting) * 100;
}

// Get coherence recommendations from Claude
async function getCoherenceRecommendations(coherenceState: string) {
  try {
    const prompt = `The user's coherence state is: ${coherenceState}

Provide 2-3 specific, actionable recommendations to improve or maintain coherence:
- If coherent: actions to deepen coherence
- If transitioning: specific things to do to stabilize
- If stressed: immediate grounding/regulation techniques
- If shutdown: gentle re-engagement practices

Keep each recommendation to 1-2 sentences.`;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Coherence recommendation error:', error);
    return '';
  }
}

// GET /api/coherence - Get current 8-layer coherence
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const coherenceMetric = await prisma.coherenceMetric.findFirst({
      where: { userId },
      orderBy: { timestamp: 'desc' }
    });

    const metacognitiveScore = await calculateMetacognitiveCoherence(userId);

    const layers = {
      '1': {
        name: 'Heart-Brain Coherence',
        value: coherenceMetric?.heartBrainCoh || 0.5,
        description: 'Heart and brain synchronized at 0.1 Hz'
      },
      '2': {
        name: 'Breathing Coherence',
        value: coherenceMetric?.breathCoh || 0.5,
        description: 'Breath synchronized with heart rate variability'
      },
      '3': {
        name: 'Brain Coherence',
        value: coherenceMetric?.brainCoh || 0.5,
        description: 'Alpha/theta brain wave synchronization'
      },
      '4': {
        name: 'Vagal Tone',
        value: coherenceMetric?.vagalTone || 0.5,
        description: 'Parasympathetic nervous system strength'
      },
      '5': {
        name: 'Circadian Alignment',
        value: coherenceMetric?.circadianAlign || 0.5,
        description: 'Sleep/wake cycle alignment'
      },
      '6': {
        name: 'Biofield Coherence',
        value: coherenceMetric?.biofieldCoh || 0.5,
        description: 'Electromagnetic coherence (Tesla principle)'
      },
      '7': {
        name: 'Decision-Value Alignment',
        value: coherenceMetric?.decisionCoh || 0.5,
        description: 'Choices aligned with core values'
      },
      '8': {
        name: 'Metacognitive Coherence',
        value: metacognitiveScore / 100,
        description: 'Quality of thinking about thinking (4-pillar framework)'
      }
    };

    const overallCoherence = (coherenceMetric?.overallCoherence || 50) * 0.875 + (metacognitiveScore * 0.125);

    const recommendations = await getCoherenceRecommendations(coherenceMetric?.coherenceState || 'transitioning');

    res.json({
      success: true,
      coherenceState: coherenceMetric?.coherenceState || 'transitioning',
      overallCoherence: overallCoherence.toFixed(1),
      layers: Object.entries(layers).map(([num, layer]) => ({
        layer: parseInt(num),
        name: layer.name,
        value: (layer.value * 100).toFixed(1),
        description: layer.description
      })),
      recommendations,
      timestamp: coherenceMetric?.timestamp || new Date()
    });
  } catch (error) {
    console.error('Coherence fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch coherence data' });
  }
});

// GET /api/coherence/history - Get coherence progression
router.get('/history', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const timeframe = (req.query.timeframe as string) || '7d'; // 24h, 7d, 30d, all

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    let startDate = new Date();
    switch (timeframe) {
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case 'all':
        startDate = new Date('2000-01-01');
        break;
      case '24h':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7d':
      default:
        startDate.setDate(startDate.getDate() - 7);
    }

    const coherenceMetrics = await prisma.coherenceMetric.findMany({
      where: {
        userId,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'asc' },
      take: 100
    });

    const metacognitiveMetrics = await prisma.metacognitiveMetric.findMany({
      where: {
        userId,
        timestamp: { gte: startDate }
      },
      orderBy: { timestamp: 'asc' },
      take: 100
    });

    const avgCoherence = coherenceMetrics.length > 0
      ? coherenceMetrics.reduce((sum, m) => sum + (m.overallCoherence || 0), 0) / coherenceMetrics.length
      : 0;

    const avgMetacognitive = metacognitiveMetrics.length > 0
      ? metacognitiveMetrics.reduce((sum, m) => sum + (m.metacognitiveCoherence || 0), 0) / metacognitiveMetrics.length
      : 0;

    const trend = coherenceMetrics.length > 1
      ? coherenceMetrics[coherenceMetrics.length - 1].overallCoherence > coherenceMetrics[0].overallCoherence
        ? 'improving'
        : 'declining'
      : 'stable';

    res.json({
      success: true,
      timeframe,
      physicalCoherence: {
        average: avgCoherence.toFixed(1),
        dataPoints: coherenceMetrics.length,
        trend
      },
      metacognitiveCoherence: {
        average: avgMetacognitive.toFixed(1),
        dataPoints: metacognitiveMetrics.length
      },
      history: coherenceMetrics.map(m => ({
        timestamp: m.timestamp,
        overall: m.overallCoherence,
        state: m.coherenceState
      }))
    });
  } catch (error) {
    console.error('Coherence history fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch coherence history' });
  }
});

// GET /api/coherence/:id - Get specific coherence metric
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const metric = await prisma.coherenceMetric.findUnique({
      where: { id }
    });

    if (!metric) {
      return res.status(404).json({ error: 'Coherence metric not found' });
    }

    res.json({
      success: true,
      metric: {
        id: metric.id,
        heartBrainCoh: metric.heartBrainCoh,
        breathCoh: metric.breathCoh,
        brainCoh: metric.brainCoh,
        vagalTone: metric.vagalTone,
        circadianAlign: metric.circadianAlign,
        biofieldCoh: metric.biofieldCoh,
        decisionCoh: metric.decisionCoh,
        overallCoherence: metric.overallCoherence,
        coherenceState: metric.coherenceState,
        timestamp: metric.timestamp
      }
    });
  } catch (error) {
    console.error('Coherence fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch coherence metric' });
  }
});

export default router;
