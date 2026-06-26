import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { getAnthropic, CLAUDE_MODEL } from '../lib/anthropic';

const router: Router = express.Router();

interface TwinInteractionRequest {
  twinType: string;
  userMessage: string;
  metacognitivePhase?: string;
  contextData?: Record<string, any>;
}

// Get appropriate Twin response using Claude
async function getTwinResponse(
  twinType: string,
  userMessage: string,
  metacognitivePhase?: string,
  contextData?: Record<string, any>
): Promise<string> {
  const twinPersonalities: Record<string, string> = {
    task: 'You are Task Twin, a productivity and workflow optimization specialist. You help users organize priorities, break down complex projects, and maintain momentum. Be direct and action-oriented.',
    coach: 'You are Coach Twin, a real-time guidance and metacognitive coaching specialist. Help users think about their thinking. If they mention a decision, ask about their planning clarity, monitoring awareness, and reflection. Use the 4-pillar metacognitive framework (planning, monitoring, evaluating, reflecting).',
    growth: 'You are Growth Twin, a learning and development specialist. You help users identify learning opportunities, optimize their growth trajectory, and celebrate progress.',
    health: 'You are Health Twin, a wellness and biometric optimization coach. You provide insights on physical and mental coherence based on health data.',
    relationship: 'You are Relationship Twin, a social coherence and connection specialist. You help strengthen relationships and social patterns.',
    financial: 'You are Financial Twin, a money psychology and financial life transformation expert. You help users understand their financial beliefs and patterns.',
    creative: 'You are Creative Twin, a flow and creative expression specialist. You help users unlock their creative potential and maintain inspiration.',
    research: 'You are Research Twin, a knowledge synthesis and learning accelerator. You help consolidate information and extract insights.',
    metacognition: 'You are Metacognition Twin, a thinking specialist. You help users understand their own cognitive processes, develop metacognitive awareness, and improve how they think about problems.'
  };

  const systemPrompt = twinPersonalities[twinType] || twinPersonalities.coach;

  let userPrompt = userMessage;
  if (metacognitivePhase && twinType === 'coach') {
    userPrompt += `\n\nFocus on the ${metacognitivePhase} phase of metacognitive processing. Help them deepen their awareness in this specific area.`;
  }

  if (contextData) {
    if (contextData.decisionTitle) {
      userPrompt += `\n\nThey're working on a decision: "${contextData.decisionTitle}"`;
    }
    if (contextData.emotionalState) {
      userPrompt += `\n\nTheir current emotional state: ${contextData.emotionalState}`;
    }
  }

  try {
    const response = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: userPrompt
        }
      ],
      system: systemPrompt
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Twin response error:', error);
    return 'I experienced an issue processing your message. Please try again.';
  }
}

// POST /api/twins/interaction - Chat with a Twin
router.post('/interaction', async (req: Request, res: Response) => {
  try {
    const {
      twinType,
      userMessage,
      metacognitivePhase,
      contextData
    } = req.body as TwinInteractionRequest;
    const userId = req.userId!;

    if (!twinType || !userMessage) {
      return res.status(400).json({
        error: 'Missing required fields: twinType, userMessage'
      });
    }

    // Get Twin response
    const twinResponse = await getTwinResponse(
      twinType,
      userMessage,
      metacognitivePhase,
      contextData
    );

    // Store interaction
    const interaction = await prisma.twinInteraction.create({
      data: {
        userId,
        twinType,
        userMessage,
        twinResponse,
        contextData: contextData || {},
        metacognitivePhase: metacognitivePhase || null,
        coachingFocus: metacognitivePhase ? `Metacognitive ${metacognitivePhase}` : null
      }
    });

    res.json({
      success: true,
      interactionId: interaction.id,
      response: twinResponse,
      phase: metacognitivePhase
    });
  } catch (error) {
    console.error('Twin interaction error:', error);
    res.status(500).json({ error: 'Failed to process Twin interaction' });
  }
});

// GET /api/twins - Get user's Twins
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const twins = [
      { type: 'task', emoji: '✅', name: 'Task Twin', subtitle: 'Productivity', status: 'active' },
      { type: 'coach', emoji: '🏆', name: 'Coach Twin', subtitle: 'Guidance', status: 'active' },
      { type: 'growth', emoji: '📈', name: 'Growth Twin', subtitle: 'Learning', status: 'active' },
      { type: 'health', emoji: '💪', name: 'Health Twin', subtitle: 'Wellness', status: 'active' },
      { type: 'relationship', emoji: '❤️', name: 'Relationship Twin', subtitle: 'Connection', status: 'active' },
      { type: 'financial', emoji: '💰', name: 'Financial Twin', subtitle: 'Money', status: 'active' },
      { type: 'creative', emoji: '🎨', name: 'Creative Twin', subtitle: 'Expression', status: 'active' },
      { type: 'research', emoji: '🔬', name: 'Research Twin', subtitle: 'Knowledge', status: 'active' },
      { type: 'metacognition', emoji: '🪞', name: 'Metacognition Twin', subtitle: 'Thinking', status: 'active' }
    ];

    // Get interaction counts for each Twin
    const interactionCounts = await Promise.all(
      twins.map(async (twin) => {
        const count = await prisma.twinInteraction.count({
          where: { userId, twinType: twin.type }
        });
        return { ...twin, interactionCount: count };
      })
    );

    res.json({
      success: true,
      twins: interactionCounts
    });
  } catch (error) {
    console.error('Twins fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch Twins' });
  }
});

// POST /api/twins/interaction/stream - Stream Twin response in real-time via Server-Sent Events
router.post('/interaction/stream', async (req: Request, res: Response) => {
  try {
    const {
      twinType,
      userMessage,
      metacognitivePhase,
      contextData
    } = req.body as TwinInteractionRequest;
    const userId = req.userId!;

    if (!twinType || !userMessage) {
      return res.status(400).json({
        error: 'Missing required fields: twinType, userMessage'
      });
    }

    // Set up SSE headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');

    const twinPersonalities: Record<string, string> = {
      task: 'You are Task Twin, a productivity and workflow optimization specialist. You help users organize priorities, break down complex projects, and maintain momentum. Be direct and action-oriented.',
      coach: 'You are Coach Twin, a real-time guidance and metacognitive coaching specialist. Help users think about their thinking. If they mention a decision, ask about their planning clarity, monitoring awareness, and reflection. Use the 4-pillar metacognitive framework (planning, monitoring, evaluating, reflecting).',
      growth: 'You are Growth Twin, a learning and development specialist. You help users identify learning opportunities, optimize their growth trajectory, and celebrate progress.',
      health: 'You are Health Twin, a wellness and biometric optimization coach. You provide insights on physical and mental coherence based on health data.',
      relationship: 'You are Relationship Twin, a social coherence and connection specialist. You help strengthen relationships and social patterns.',
      financial: 'You are Financial Twin, a money psychology and financial life transformation expert. You help users understand their financial beliefs and patterns.',
      creative: 'You are Creative Twin, a flow and creative expression specialist. You help users unlock their creative potential and maintain inspiration.',
      research: 'You are Research Twin, a knowledge synthesis and learning accelerator. You help consolidate information and extract insights.',
      metacognition: 'You are Metacognition Twin, a thinking specialist. You help users understand their own cognitive processes, develop metacognitive awareness, and improve how they think about problems.'
    };

    const systemPrompt = twinPersonalities[twinType] || twinPersonalities.coach;
    let userPrompt = userMessage;

    if (metacognitivePhase && twinType === 'coach') {
      userPrompt += `\n\nFocus on the ${metacognitivePhase} phase of metacognitive processing. Help them deepen their awareness in this specific area.`;
    }

    if (contextData) {
      if (contextData.decisionTitle) {
        userPrompt += `\n\nThey're working on a decision: "${contextData.decisionTitle}"`;
      }
      if (contextData.emotionalState) {
        userPrompt += `\n\nTheir current emotional state: ${contextData.emotionalState}`;
      }
    }

    try {
      const stream = await getAnthropic().messages.stream({
        model: CLAUDE_MODEL,
        max_tokens: 500,
        messages: [
          {
            role: 'user',
            content: userPrompt
          }
        ],
        system: systemPrompt
      });

      let fullResponse = '';

      stream.on('text', (text) => {
        fullResponse += text;
        res.write(`data: ${JSON.stringify({ content: text })}\n\n`);
      });

      stream.on('end', async () => {
        // Store interaction after streaming completes
        await prisma.twinInteraction.create({
          data: {
            userId,
            twinType,
            userMessage,
            twinResponse: fullResponse,
            contextData: contextData || {},
            metacognitivePhase: metacognitivePhase || null,
            coachingFocus: metacognitivePhase ? `Metacognitive ${metacognitivePhase}` : null
          }
        });

        res.write('data: [DONE]\n\n');
        res.end();
      });

      stream.on('error', (error) => {
        console.error('Stream error:', error);
        res.write(`data: ${JSON.stringify({ error: 'Stream processing error' })}\n\n`);
        res.end();
      });
    } catch (streamError) {
      console.error('Streaming setup error:', streamError);
      res.write(`data: ${JSON.stringify({ error: 'Failed to establish stream' })}\n\n`);
      res.end();
    }
  } catch (error) {
    console.error('Twin stream error:', error);
    res.status(500).json({ error: 'Failed to stream Twin response' });
  }
});

// GET /api/twins/:type/history - Get Twin interaction history
router.get('/:type/history', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;
    const { type } = req.params;

    const interactions = await prisma.twinInteraction.findMany({
      where: { userId, twinType: type },
      orderBy: { createdAt: 'desc' },
      take: 30
    });

    res.json({
      success: true,
      interactions: interactions.map(i => ({
        id: i.id,
        userMessage: i.userMessage,
        twinResponse: i.twinResponse,
        phase: i.metacognitivePhase,
        createdAt: i.createdAt
      }))
    });
  } catch (error) {
    console.error('Twin history fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch Twin history' });
  }
});

export default router;
