import { Router, Request, Response } from 'express';
import { ttsService, voiceboxService } from '../services/tts.js';

const router = Router();

// POST /api/v1/voice/:userId/command
router.post('/:userId/command', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { transcript, audioBuffer } = req.body;

    if (!transcript && !audioBuffer) {
      return res.status(400).json({ error: 'Transcript or audio buffer required' });
    }

    // Simple intent detection
    const intentMap: Record<string, string> = {
      breathing: /breathe|breath|relax/i,
      humming: /hum|tone|vibrate/i,
      lesson: /lesson|teach|learn/i,
      chat: /ask|tell|help/i,
      emergency: /help|emergency|crisis/i,
    };

    let intent = 'unknown';
    for (const [key, regex] of Object.entries(intentMap)) {
      if (regex.test(transcript || '')) {
        intent = key;
        break;
      }
    }

    const command = {
      id: `cmd_${Date.now()}`,
      userId,
      transcript,
      intent,
      confidence: Math.random() * 0.4 + 0.6, // 0.6-1.0
      emotionalTone: 'neutral',
      processedAt: new Date(),
    };

    // Route based on intent
    const actionMap: Record<string, any> = {
      breathing: { action: 'start_breathing', duration: 300 },
      humming: { action: 'start_humming', frequency: 396 },
      lesson: { action: 'suggest_lesson' },
      chat: { action: 'open_chat' },
      emergency: { action: 'show_crisis_resources', hotline: '988' },
      unknown: { action: 'open_assistant' },
    };

    res.json({
      command,
      action: actionMap[intent],
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process voice command' });
  }
});

// POST /api/v1/voice/:userId/transcribe
router.post('/:userId/transcribe', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { audioBuffer } = req.body;

    if (!audioBuffer) {
      return res.status(400).json({ error: 'Audio buffer required' });
    }

    // TODO: Implement speech-to-text
    // For now, return mock transcription
    const transcription = 'Mock transcription of audio content';

    res.json({
      transcript: transcription,
      confidence: 0.92,
      language: 'en',
      processedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to transcribe audio' });
  }
});

// POST /api/v1/voice/:userId/tts
router.post('/:userId/tts', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { text, voiceId = 'default', emotionalTone = 'calm', service = 'elevenlabs' } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text required' });
    }

    let audioUrl: string;

    if (service === 'voicebox') {
      // Use Voicebox for voice-cloned output
      try {
        const audioBuffer = await voiceboxService.generateSpeechFromVoiceprint(text, voiceId);
        // In production, upload to S3 and return signed URL
        audioUrl = `https://resonance-audio.s3.amazonaws.com/voicebox/${Date.now()}.wav`;
      } catch (error) {
        // Fallback to ElevenLabs
        const response = await ttsService.generateSpeech({ text, voiceId, emotionalTone: emotionalTone as any });
        audioUrl = response.audioUrl;
      }
    } else {
      // Use ElevenLabs
      const response = await ttsService.generateSpeech({ text, voiceId, emotionalTone: emotionalTone as any });
      audioUrl = response.audioUrl;
    }

    res.status(201).json({
      audioUrl,
      textLength: text.length,
      estimatedDuration: Math.ceil(text.split(' ').length / 140 * 60),
      service,
      voiceId,
      emotionalTone,
    });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// POST /api/v1/voice/:userId/capture-voice-sample
router.post('/:userId/capture-voice-sample', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { audioBuffer, label } = req.body;

    if (!audioBuffer) {
      return res.status(400).json({ error: 'Audio buffer required' });
    }

    // Capture voice sample for Voicebox
    try {
      const voiceId = await voiceboxService.captureVoiceSample(Buffer.from(audioBuffer), label);

      res.status(201).json({
        voiceId,
        label: label || 'Default',
        captured: true,
        ready: true,
      });
    } catch (error) {
      res.status(500).json({
        error: 'Failed to capture voice sample. Make sure Voicebox is running.',
      });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to capture voice sample' });
  }
});

// GET /api/v1/voice/:userId/voices
router.get('/:userId/voices', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;

    const voices = [
      { id: 'default', name: 'Standard', service: 'elevenlabs' },
      { id: 'jamie', name: 'Jamie (Your Voice)', service: 'voicebox', isCloned: true },
      { id: 'calm_guide', name: 'Calm Guide', service: 'elevenlabs' },
      { id: 'energized', name: 'Energized Coach', service: 'elevenlabs' },
    ];

    res.json({
      voices,
      activeVoice: 'jamie',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch voices' });
  }
});

// POST /api/v1/voice/:userId/set-active-voice
router.post('/:userId/set-active-voice', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { voiceId } = req.body;

    if (!voiceId) {
      return res.status(400).json({ error: 'Voice ID required' });
    }

    // TODO: Save to database
    res.json({
      success: true,
      activeVoice: voiceId,
      message: `Switched to ${voiceId}`,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to set active voice' });
  }
});

export default router;
