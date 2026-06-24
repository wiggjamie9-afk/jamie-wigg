import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { Anthropic } from '@anthropic-ai/sdk';

const router: Router = express.Router();
const anthropic = new Anthropic();

interface DecisionLogRequest {
  userId: string;
  title: string;
  description: string;
  options: Record<string, string>;
  chosenOption: string;
  reasoning: string;
  category?: string;
  confidence?: number;
  planningClarity?: number;
  strategyChosen?: string;
  monitoringComprehension?: number;
  evaluationEffectiveness?: number;
  reflectionInsights?: string;
}

// Calculate metacognitive score from 4 pillars
function calculateMetacognitiveScore(
  planning: number = 5,
  monitoring: number = 5,
  evaluating: number = 5,
  reflecting: number = 5
): number {
  const planningComponent = (planning / 10) * 0.25;
  const monitoringComponent = (monitoring / 10) * 0.25;
  const evaluatingComponent = (evaluating / 10) * 0.25;
  const reflectingComponent = reflecting > 0 ? 0.25 : 0;

  return Math.min((planningComponent + monitoringComponent + evaluatingComponent + reflectingComponent), 1);
}

// Analyze decision with Claude to get insights
async function analyzeDecision(decision: DecisionLogRequest, emotionalState?: string) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Analyze this decision from a metacognitive perspective:

Title: ${decision.title}
Category: ${decision.category || 'general'}
Options considered: ${JSON.stringify(decision.options)}
Chosen option: ${decision.chosenOption}
Reasoning: ${decision.reasoning}

Planning clarity (1-10): ${decision.planningClarity || 5}
Strategy used: ${decision.strategyChosen || 'not specified'}
Monitoring comprehension (1-10): ${decision.monitoringComprehension || 5}
Evaluation effectiveness (1-10): ${decision.evaluationEffectiveness || 5}
Reflection: ${decision.reflectionInsights || 'none provided'}
${emotionalState ? `Emotional state: ${emotionalState}` : ''}

Provide:
1. Metacognitive quality assessment (1-10)
2. Key insight about this decision-making process
3. One specific suggestion to improve thinking next time
4. Pattern identification (if this is a recurring type of decision)

Keep response concise and actionable.`
        }
      ]
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Decision analysis error:', error);
    return '';
  }
}

// POST /api/decisions - Log a decision with metacognitive tracking
router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      userId,
      title,
      description,
      options,
      chosenOption,
      reasoning,
      category,
      confidence,
      planningClarity = 5,
      strategyChosen,
      monitoringComprehension = 5,
      evaluationEffectiveness = 5,
      reflectionInsights
    } = req.body as DecisionLogRequest;

    if (!userId || !title || !chosenOption || !reasoning) {
      return res.status(400).json({
        error: 'Missing required fields: userId, title, chosenOption, reasoning'
      });
    }

    // Calculate metacognitive score
    const metacognitiveScore = calculateMetacognitiveScore(
      planningClarity,
      monitoringComprehension,
      evaluationEffectiveness,
      reflectionInsights ? 8 : 3
    );

    // Analyze decision with Claude
    const analysis = await analyzeDecision(
      { userId, title, description, options, chosenOption, reasoning, category, confidence, planningClarity, strategyChosen, monitoringComprehension, evaluationEffectiveness, reflectionInsights },
      undefined
    );

    // Store decision
    const decision = await prisma.decision.create({
      data: {
        userId,
        title,
        description,
        options,
        chosenOption,
        reasoning,
        category: category || 'general',
        confidence: confidence || 0.5,
        planningClarity,
        strategyChosen: strategyChosen || '',
        monitoringComprehension,
        evaluationEffectiveness,
        reflectionInsights: reflectionInsights || '',
        metacognitiveScore
      }
    });

    // Store metacognitive metric
    const metacognitiveMetric = await prisma.metacognitiveMetric.create({
      data: {
        userId,
        planningScore: planningClarity / 10,
        monitoringScore: monitoringComprehension / 10,
        evaluatingScore: evaluationEffectiveness / 10,
        reflectingScore: reflectionInsights ? 0.8 : 0.3,
        metacognitiveCoherence: metacognitiveScore * 100,
        contextData: { decision: title, category },
        decisionCategory: category || 'general',
        timestamp: new Date()
      }
    });

    res.json({
      success: true,
      decisionId: decision.id,
      metacognitiveScore: (metacognitiveScore * 100).toFixed(1) + '%',
      analysis,
      insights: {
        planningClarity,
        monitoringComprehension,
        evaluationEffectiveness,
        hasReflection: !!reflectionInsights
      }
    });
  } catch (error) {
    console.error('Decision logging error:', error);
    res.status(500).json({ error: 'Failed to log decision' });
  }
});

// GET /api/decisions - Get user's decisions with pattern analysis
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;
    const category = req.query.category as string;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const decisions = await prisma.decision.findMany({
      where: {
        userId,
        ...(category && { category })
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json({
      success: true,
      decisions: decisions.map(d => ({
        id: d.id,
        title: d.title,
        category: d.category,
        chosenOption: d.chosenOption,
        confidence: d.confidence,
        metacognitiveScore: d.metacognitiveScore,
        createdAt: d.createdAt
      })),
      count: decisions.length
    });
  } catch (error) {
    console.error('Decision fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch decisions' });
  }
});

// GET /api/decisions/:id - Get specific decision with full analysis
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const decision = await prisma.decision.findUnique({
      where: { id }
    });

    if (!decision) {
      return res.status(404).json({ error: 'Decision not found' });
    }

    res.json({
      success: true,
      decision
    });
  } catch (error) {
    console.error('Decision fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch decision' });
  }
});

// GET /api/decisions/patterns/analysis - Analyze decision patterns
router.get('/patterns/analysis', async (req: Request, res: Response) => {
  try {
    const userId = req.query.userId as string;

    if (!userId) {
      return res.status(400).json({ error: 'Missing userId' });
    }

    const decisions = await prisma.decision.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    const metacognitiveMetrics = await prisma.metacognitiveMetric.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 30
    });

    // Analyze patterns
    const patterns = {
      totalDecisions: decisions.length,
      averageMetacognitiveScore: decisions.length > 0
        ? decisions.reduce((sum, d) => sum + (d.metacognitiveScore || 0), 0) / decisions.length
        : 0,
      averageConfidence: decisions.length > 0
        ? decisions.reduce((sum, d) => sum + (d.confidence || 0), 0) / decisions.length
        : 0,
      categoryBreakdown: decisions.reduce((acc, d) => {
        acc[d.category || 'general'] = (acc[d.category || 'general'] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      metacognitiveProgress: metacognitiveMetrics.length > 0 ? {
        avgPlanning: (metacognitiveMetrics.reduce((sum, m) => sum + (m.planningScore || 0), 0) / metacognitiveMetrics.length * 100).toFixed(1),
        avgMonitoring: (metacognitiveMetrics.reduce((sum, m) => sum + (m.monitoringScore || 0), 0) / metacognitiveMetrics.length * 100).toFixed(1),
        avgEvaluating: (metacognitiveMetrics.reduce((sum, m) => sum + (m.evaluatingScore || 0), 0) / metacognitiveMetrics.length * 100).toFixed(1),
        avgReflecting: (metacognitiveMetrics.reduce((sum, m) => sum + (m.reflectingScore || 0), 0) / metacognitiveMetrics.length * 100).toFixed(1)
      } : null
    };

    res.json({
      success: true,
      patterns
    });
  } catch (error) {
    console.error('Pattern analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze patterns' });
  }
});

export default router;
