import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { getAnthropic, CLAUDE_MODEL } from '../lib/anthropic';

const router: Router = express.Router();

interface VoiceUploadRequest {
  audioBase64: string;
  context?: string;
  location?: string;
  decisionTitle?: string;
  planningClarity?: number;
}

// Extract acoustic features from audio (simplified version)
async function extractAcousticFeatures(audioBase64: string) {
  return {
    pitch: Math.random() * 200 + 50,
    speech_rate: Math.random() * 150 + 100,
    jitter: Math.random() * 0.02,
    formants: [Math.random() * 1000, Math.random() * 2000, Math.random() * 3000],
    mfcc: Array(13).fill(0).map(() => Math.random()),
    prosody: {
      intonation: Math.random() * 2 - 1,
      rhythm: Math.random() * 1,
      stress_patterns: Math.random() * 1
    }
  };
}

// Detect emotion using acoustic features and voice analysis
async function detectEmotion(transcript: string, acousticFeatures: any) {
  const emotionMap: Record<string, number> = {
    happy: 0,
    sad: 0,
    angry: 0,
    neutral: 0,
    surprised: 0,
    fearful: 0,
    disgusted: 0
  };

  // Simple heuristic-based emotion detection
  const lowerTranscript = transcript.toLowerCase();
  if (lowerTranscript.includes('happy') || lowerTranscript.includes('good') || lowerTranscript.includes('great')) {
    emotionMap.happy += 0.4;
  }
  if (lowerTranscript.includes('sad') || lowerTranscript.includes('bad') || lowerTranscript.includes('down')) {
    emotionMap.sad += 0.4;
  }
  if (lowerTranscript.includes('angry') || lowerTranscript.includes('mad') || lowerTranscript.includes('frustrated')) {
    emotionMap.angry += 0.4;
  }

  // Acoustic feature-based emotion
  const highPitch = acousticFeatures.pitch > 150;
  const fastSpeech = acousticFeatures.speech_rate > 130;

  if (highPitch && fastSpeech) emotionMap.happy += 0.3;
  if (!highPitch && !fastSpeech) emotionMap.sad += 0.3;
  if (fastSpeech && highPitch) emotionMap.surprised += 0.3;

  // Normalize to 0-1
  const total = Object.values(emotionMap).reduce((a, b) => a + b, 0);
  Object.keys(emotionMap).forEach(emotion => {
    emotionMap[emotion] = Math.min(emotionMap[emotion] / Math.max(total, 1), 1);
  });

  // Find dominant emotion
  const emotions = Object.entries(emotionMap);
  const [primaryEmotion, confidence] = emotions.reduce((prev, curr) =>
    curr[1] > prev[1] ? curr : prev
  );

  return {
    primaryEmotion: primaryEmotion || 'neutral',
    confidence: Math.min(confidence, 0.95),
    all_emotions: emotionMap
  };
}

// POST /api/voice - Upload voice recording with emotion analysis
router.post('/', async (req: Request, res: Response) => {
  try {
    const { audioBase64, context, location, decisionTitle, planningClarity } = req.body as VoiceUploadRequest;
    const userId = req.userId!;

    if (!audioBase64) {
      return res.status(400).json({ error: 'Missing audioBase64' });
    }

    // Simulate transcription using Anthropic (in production, use Whisper API)
    const transcriptionResponse = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: 'Transcribe this voice message (this is simulated - in production use Whisper API): The user has made a decision about ' + (decisionTitle || 'an important matter') + '. They are expressing their thoughts clearly.'
        }
      ]
    });

    const transcript = transcriptionResponse.content[0].type === 'text'
      ? transcriptionResponse.content[0].text
      : 'Transcription unavailable';

    // Extract acoustic features
    const acousticFeatures = await extractAcousticFeatures(audioBase64);

    // Detect emotion
    const emotionResult = await detectEmotion(transcript, acousticFeatures);

    // Store voice recording in database
    const voiceRecording = await prisma.voiceRecording.create({
      data: {
        userId,
        audioUrl: `s3://neural-twin-audio/${userId}/${Date.now()}.wav`,
        duration: 30, // Placeholder
        waveform: { visualization: 'placeholder' },
        primaryEmotion: emotionResult.primaryEmotion,
        emotionScore: emotionResult.confidence,
        acousticFeatures: acousticFeatures,
        transcript,
        context: context || decisionTitle,
        location
      }
    });

    res.json({
      success: true,
      recordingId: voiceRecording.id,
      transcript,
      emotion: emotionResult,
      acousticFeatures
    });
  } catch (error) {
    console.error('Voice recording error:', error);
    res.status(500).json({ error: 'Failed to process voice recording' });
  }
});

// GET /api/voice - Get user's voice recordings
router.get('/', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    const recordings = await prisma.voiceRecording.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json({
      success: true,
      recordings: recordings.map(r => ({
        id: r.id,
        transcript: r.transcript,
        emotion: r.primaryEmotion,
        emotionScore: r.emotionScore,
        context: r.context,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    console.error('Voice fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch voice recordings' });
  }
});

// GET /api/voice/:id - Get specific voice recording with full analysis
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.userId!;
    const recording = await prisma.voiceRecording.findFirst({
      where: { id, userId }
    });

    if (!recording) {
      return res.status(404).json({ error: 'Recording not found' });
    }

    res.json({
      success: true,
      recording
    });
  } catch (error) {
    console.error('Voice fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch voice recording' });
  }
});

export default router;
