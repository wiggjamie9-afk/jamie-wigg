import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { Anthropic } from '@anthropic-ai/sdk';

const router: Router = express.Router();
const anthropic = new Anthropic();

interface KnowledgeEntryRequest {
  userId: string;
  topic: string;
  insight: string;
  source?: string;
  evidence?: string;
  applicability?: string[];
  relatedTopics?: string[];
}

interface LearningLoopRequest {
  userId: string;
  cycle: number;
  cycleType: string; // weekly, monthly
  keyInsights: string[];
}

// Analyze learning patterns using Claude
async function analyzeLearningPatterns(userId: string) {
  try {
    const recentEntries = await prisma.knowledgeEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const recentDecisions = await prisma.decision.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Analyze the learning patterns from these recent insights and decisions:

Recent Knowledge Insights:
${recentEntries.map(e => `- ${e.topic}: ${e.insight}`).join('\n')}

Recent Decision Patterns:
${recentDecisions.map(d => `- ${d.title}: ${d.reasoning}`).join('\n')}

Provide:
1. Emergent themes and patterns in how this person thinks and learns
2. Key metacognitive insights (how they think about their thinking)
3. Recommendations for deepening understanding in top 3 areas
4. How their decisions reflect their learned insights

Keep response concise and actionable.`
        }
      ]
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Learning analysis error:', error);
    return '';
  }
}

// POST /api/knowledge - Log a knowledge entry
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      topic,
      insight,
      source,
      evidence,
      applicability,
      relatedTopics
    } = req.body as KnowledgeEntryRequest;

    if (!userId || !topic || !insight) {
      return res.status(400).json({
        error: 'Missing required fields: userId, topic, insight'
      });
    }

    const entry = await prisma.knowledgeEntry.create({
      data: {
        userId,
        topic,
        insight,
        source: source || 'experience',
        evidence: evidence || null,
        applicability: applicability || [],
        relatedTopics: relatedTopics || []
      }
    });

    res.json({
      success: true,
      entryId: entry.id,
      topic: entry.topic,
      insight: entry.insight,
      source: entry.source,
      createdAt: entry.createdAt
    });
  } catch (error) {
    console.error('Knowledge entry error:', error);
    res.status(500).json({ error: 'Failed to log knowledge entry' });
  }
});

// GET /api/knowledge - Get user's knowledge base
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const topic = req.query.topic as string;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const entries = await prisma.knowledgeEntry.findMany({
      where: {
        userId,
        ...(topic && { topic: { contains: topic, mode: 'insensitive' } })
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    const topicClusters = entries.reduce((acc, entry) => {
      if (!acc[entry.topic]) {
        acc[entry.topic] = [];
      }
      acc[entry.topic].push(entry);
      return acc;
    }, {} as Record<string, typeof entries>);

    res.json({
      success: true,
      entries: entries.map(e => ({
        id: e.id,
        topic: e.topic,
        insight: e.insight,
        source: e.source,
        applicability: e.applicability,
        createdAt: e.createdAt
      })),
      topicClusters: Object.keys(topicClusters),
      count: entries.length
    });
  } catch (error) {
    console.error('Knowledge fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge entries' });
  }
});

// GET /api/knowledge/:id - Get specific knowledge entry
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const entry = await prisma.knowledgeEntry.findUnique({
      where: { id }
    });

    if (!entry) {
      return res.status(404).json({ error: 'Knowledge entry not found' });
    }

    res.json({
      success: true,
      entry
    });
  } catch (error) {
    console.error('Knowledge fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch knowledge entry' });
  }
});

// POST /api/knowledge/learning-loop - Create learning loop summary
router.post('/learning-loop', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      cycle,
      cycleType,
      keyInsights
    } = req.body as LearningLoopRequest;

    if (!userId || !cycle || !cycleType) {
      return res.status(400).json({
        error: 'Missing required fields: userId, cycle, cycleType'
      });
    }

    const analysis = await analyzeLearningPatterns(userId);

    const learningLoop = await prisma.learningLoop.create({
      data: {
        userId,
        cycle,
        cycleType,
        keyInsights: keyInsights || [],
        patternsDetected: { analysis_timestamp: new Date().toISOString() },
        metacognitiveInsights: analysis,
        metacognitiveCoherence: Math.random() * 40 + 60 // Placeholder: 60-100
      }
    });

    res.json({
      success: true,
      loopId: learningLoop.id,
      cycle: learningLoop.cycle,
      keyInsights: learningLoop.keyInsights,
      metacognitiveInsights: analysis,
      coherence: learningLoop.metacognitiveCoherence
    });
  } catch (error) {
    console.error('Learning loop creation error:', error);
    res.status(500).json({ error: 'Failed to create learning loop' });
  }
});

// GET /api/knowledge/loops - Get user's learning loops
router.get('/loops/history', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const loops = await prisma.learningLoop.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 12
    });

    res.json({
      success: true,
      loops: loops.map(l => ({
        id: l.id,
        cycle: l.cycle,
        cycleType: l.cycleType,
        keyInsights: l.keyInsights,
        metacognitiveCoherence: l.metacognitiveCoherence,
        createdAt: l.createdAt
      })),
      count: loops.length
    });
  } catch (error) {
    console.error('Learning loops fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch learning loops' });
  }
});

export default router;
