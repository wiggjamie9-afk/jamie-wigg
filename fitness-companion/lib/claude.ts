import { getProfile, updateProfileHistory } from './db';

interface CoachingContext {
  currentExercise: string;
  repsCompleted?: number;
  howYouFeel: string;
  workoutType: 'strength' | 'cardio' | 'yoga' | 'wellness';
  pastWorkouts: any[];
}

export async function getCoachingFeedback(context: CoachingContext): Promise<string> {
  const profile = await getProfile();
  if (!profile?.apiKey) {
    return "I need your Claude API key to give personalized coaching. Add it in settings!";
  }

  const pastContext = profile.history.slice(-20).join('\n');
  const coachPersonality = getPersonalityPrompt(profile.preferences.personality);

  const systemPrompt = `You are ${profile.preferences.coachName}, a fitness coach.
${coachPersonality}
You know this person's history and goals:
Goals: ${profile.goals.join(', ')}
Recent activity: ${pastContext || 'New user, first workout'}

Your response should be:
- Concise (1-2 sentences max for real-time coaching)
- Warm and encouraging
- Specific to their current exercise
- Include any form cues if relevant`;

  const userMessage = `
Exercise: ${context.currentExercise}
Reps done: ${context.repsCompleted || 'just started'}
How they feel: ${context.howYouFeel}
Workout type: ${context.workoutType}

Give me real-time coaching feedback.`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': profile.apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 150,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error?.message || `API ${response.status}`);
    }

    const data = await response.json();
    const feedback = data.content?.[0]?.text?.trim() || 'Keep going!';

    // Track interaction
    await updateProfileHistory(`${context.currentExercise}: ${context.howYouFeel}`);

    return feedback;
  } catch (error) {
    console.error('Claude coaching error:', error);
    return 'Keep pushing! You\'ve got this! 💪';
  }
}

function getPersonalityPrompt(personality: 'encouraging' | 'tough' | 'funny'): string {
  switch (personality) {
    case 'tough':
      return 'Be direct, push hard, celebrate grit. No excuses.';
    case 'funny':
      return 'Use light humor and witty banter to keep things fun.';
    default:
      return 'Be warm, celebrate effort, meet them where they are.';
  }
}
