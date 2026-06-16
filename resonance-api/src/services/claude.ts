import { Anthropic } from 'anthropic';
import type { ChatMessage, ChatSession, StreamingResponse, Lesson, Biometric } from '../types/index.js';

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface CompanionContext {
  currentLesson?: Lesson;
  userMood: string;
  recentBiometrics?: Biometric;
  userHistory: string[]; // Past lessons completed
  appId: string;
  userName?: string;
}

export class ClaudeService {
  private buildSystemPrompt(context: CompanionContext): string {
    const appProfiles: Record<string, string> = {
      'bright-brains': 'You are a supportive guide for children and teens with learning differences (dyslexia, ADHD, dyscalculia). Focus on strengths-based learning.',
      'steady': 'You are a compassionate companion for mental health. Never substitute for professional help. Always provide crisis resources.',
      'mum-brain': 'You are a nurturing guide for mothers/caregivers. Understand the neurobiology of parental stress and burnout.',
      'sobriety': 'You are a recovery-focused companion. Celebrate identity shifts and new sense of self. Provide hope without judgment.',
      'relationships': 'You are a guide for relationship communication. Frame advice around attachment theory and neuroscience of connection.',
      'money': 'You are a non-judgmental guide to money psychology. Use behavioral economics to explain spending and saving patterns.',
      'sleep': 'You are a calming presence for sleep issues. Suggest gentle breathing, body awareness, and gentle affirmations.',
    };

    const basePrompt = `You are JARVIS, an empathetic AI companion for the RESONANCE ecosystem of brain-building apps.

Your role:
- Provide deeply personalized responses based on the user's current lesson, mood, and health metrics
- Ground advice in neuroscience, psychology, and lived experience wisdom
- Use a warm, conversational tone that matches the user's emotional state
- Celebrate small wins and acknowledge struggles without toxic positivity

Current Context:
- App: ${appProfiles[context.appId] || 'General RESONANCE app'}
- User mood: ${context.userMood || 'not specified'}
- Current lesson: ${context.currentLesson?.title || 'None'}
- Recent heart rate variability (stress indicator): ${context.recentBiometrics?.hrv || 'N/A'}
- Lessons completed recently: ${context.userHistory.slice(-5).join(', ') || 'Just starting'}
- User name: ${context.userName || 'Friend'}

Guidelines:
1. Keep responses concise (2-3 sentences max for chat, unless user asks for more)
2. Mirror back emotion when appropriate: "I hear that you're feeling anxious..."
3. Offer specific, actionable insights tied to the current lesson
4. If mental health crisis signals: Provide crisis resources and encourage professional help
5. Use "I" sparingly—focus on "you" and "we"
6. Avoid generic AI speak—be specific to their situation`;

    if (context.appId === 'steady') {
      return basePrompt + `

CRITICAL: This user may be experiencing mental health challenges. Always:
- Validate emotions without minimizing
- Suggest professional support if needed
- Provide crisis hotlines: National Suicide Prevention Lifeline 988, Crisis Text Line text HOME to 741741`;
    }

    if (context.appId === 'sobriety') {
      return basePrompt + `

CRITICAL: This user is in recovery. Always:
- Celebrate identity shifts (recovering identity, not addict identity)
- Normalize cravings without enabling
- Connect to community and purpose
- Provide SAMHSA National Helpline: 1-800-662-4357 (free, confidential, 24/7)`;
    }

    return basePrompt;
  }

  async chat(
    userMessage: string,
    session: ChatSession,
    context: CompanionContext,
  ): Promise<AsyncIterable<StreamingResponse>> {
    const systemPrompt = this.buildSystemPrompt(context);

    // Format conversation history
    const messages = session.messages.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    messages.push({
      role: 'user',
      content: userMessage,
    });

    const stream = await client.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    });

    return this.transformStream(stream);
  }

  private async *transformStream(stream: any): AsyncIterable<StreamingResponse> {
    for await (const event of stream) {
      if (event.type === 'content_block_start') {
        yield { event: 'start' };
      } else if (event.type === 'content_block_delta') {
        yield {
          event: 'content_block_delta',
          content: event.delta.text,
        };
      } else if (event.type === 'message_stop') {
        yield { event: 'message_stop' };
      }
    }
  }

  async generateEmotionalTone(userText: string): Promise<string> {
    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 50,
      system: 'You are an emotional tone classifier. Respond with ONLY one word: calm, anxious, sad, energized, or neutral.',
      messages: [
        {
          role: 'user',
          content: `Classify the emotional tone of: "${userText}"`,
        },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text.toLowerCase() : 'neutral';
    return ['calm', 'anxious', 'sad', 'energized', 'neutral'].includes(text) ? text : 'neutral';
  }

  async generateAffirmation(appId: string, trackId: string, currentMood: string): Promise<string> {
    const appContext: Record<string, string> = {
      'mum-brain': 'A mother/caregiver',
      'sobriety': 'A person in recovery',
      'steady': 'Someone navigating mental health challenges',
    };

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 100,
      system: `You generate personalized affirmations for the RESONANCE app. Create a single, first-person affirmation that is:
- Specific to the user's context (not generic)
- Grounded in their current emotional state
- Strength-based and empowering
- 1-2 sentences max`,
      messages: [
        {
          role: 'user',
          content: `Generate an affirmation for ${appContext[appId] || 'a RESONANCE user'} currently feeling ${currentMood}. They're working on ${trackId}.`,
        },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : 'You are resilient and capable.';
  }

  async generateContextualResponse(
    userMessage: string,
    history: Array<{ role: 'user' | 'assistant'; content: string }>,
    appId?: string,
    emotionalContext?: {
      heartRate?: number;
      stressLevel?: number;
      lastEmotionalRating?: number;
    }
  ): Promise<string> {
    const appProfiles: Record<string, string> = {
      'bright-brains': 'You are a supportive guide for children and teens with learning differences.',
      'steady': 'You are a compassionate companion for mental health challenges.',
      'mum-brain': 'You are a nurturing guide for mothers and caregivers.',
      'sobriety': 'You are a recovery-focused companion celebrating identity shifts.',
      'relationships': 'You are a guide for relationship communication.',
      'money': 'You are a non-judgmental guide to money psychology.',
      'sleep': 'You are a calming presence for sleep and rest.',
    };

    const systemPrompt = `You are JARVIS, an empathetic AI companion for the RESONANCE brain-building ecosystem.
${appProfiles[appId || 'general'] || 'You are a supportive AI guide for personal growth.'}

Key guidelines:
- Keep responses concise and warm (1-3 sentences typically)
- Ground advice in neuroscience and psychology when relevant
- Be specific to the user's situation, not generic
- Celebrate progress and acknowledge struggles without toxic positivity
- If mental health crisis signals are detected, provide resources

${emotionalContext ? `User's current state: Heart rate ${emotionalContext.heartRate || 'normal'} bpm, Stress level ${emotionalContext.stressLevel || 'moderate'}/100` : ''}`;

    const response = await client.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 300,
      system: systemPrompt,
      messages: [
        ...history,
        {
          role: 'user',
          content: userMessage,
        },
      ],
    });

    return response.content[0].type === 'text' ? response.content[0].text : 'I hear you. How can I support you today?';
  }
}

export const claudeService = new ClaudeService();
