import axios from 'axios';

interface TTSRequest {
  text: string;
  voiceId: string;
  emotionalTone?: 'calm' | 'energetic' | 'compassionate';
  language?: string;
}

interface TTSResponse {
  audioUrl: string;
  duration: number; // seconds
}

export class TTSService {
  private elevenlabsApiKey = process.env.ELEVENLABS_API_KEY;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  async generateSpeech(request: TTSRequest): Promise<TTSResponse> {
    if (!this.elevenlabsApiKey) {
      throw new Error('ELEVENLABS_API_KEY not configured');
    }

    // Map emotional tones to voice settings
    const voiceSettings = this.getVoiceSettings(request.emotionalTone);

    try {
      const response = await axios.post(
        `${this.baseUrl}/text-to-speech/${request.voiceId}`,
        {
          text: request.text,
          model_id: 'eleven_multilingual_v2',
          voice_settings: voiceSettings,
        },
        {
          headers: {
            'xi-api-key': this.elevenlabsApiKey,
            'Content-Type': 'application/json',
          },
          responseType: 'arraybuffer',
        },
      );

      // For now, return a placeholder URL
      // In production, upload to S3 and return signed URL
      const duration = this.estimateDuration(request.text);

      return {
        audioUrl: 'https://resonance-audio.s3.amazonaws.com/cache/' + Date.now(),
        duration,
      };
    } catch (error) {
      console.error('TTS generation failed:', error);
      throw new Error('Failed to generate speech');
    }
  }

  async synthesizeLessonContent(
    lessonText: string,
    voiceId: string,
    emotionalTone?: string,
  ): Promise<string> {
    // Split long text into chunks (ElevenLabs has character limits)
    const chunks = this.splitText(lessonText, 1000);
    const audioUrls: string[] = [];

    for (const chunk of chunks) {
      const response = await this.generateSpeech({
        text: chunk,
        voiceId,
        emotionalTone: emotionalTone as any,
      });
      audioUrls.push(response.audioUrl);
    }

    // In production, concatenate audio chunks
    return audioUrls[0]; // For now, return first chunk
  }

  private getVoiceSettings(emotionalTone?: string): any {
    const baseSettings = {
      stability: 0.75,
      similarity_boost: 0.85,
    };

    switch (emotionalTone) {
      case 'calm':
        return { ...baseSettings, stability: 0.85 };
      case 'energetic':
        return { ...baseSettings, stability: 0.65 };
      case 'compassionate':
        return { ...baseSettings, stability: 0.80, similarity_boost: 0.90 };
      default:
        return baseSettings;
    }
  }

  private estimateDuration(text: string): number {
    // Rough estimation: 120-150 words per minute
    const wordCount = text.split(/\s+/).length;
    return Math.ceil((wordCount / 140) * 60); // seconds
  }

  private splitText(text: string, maxChars: number): string[] {
    const chunks: string[] = [];
    let current = '';

    const sentences = text.split(/(?<=[.!?])\s+/);

    for (const sentence of sentences) {
      if ((current + sentence).length > maxChars) {
        if (current) chunks.push(current);
        current = sentence;
      } else {
        current += (current ? ' ' : '') + sentence;
      }
    }

    if (current) chunks.push(current);
    return chunks;
  }
}

export const ttsService = new TTSService();

// Voicebox integration for voice cloning
export class VoiceboxService {
  private baseUrl = process.env.VOICEBOX_URL || 'http://127.0.0.1:17493';

  async generateSpeechFromVoiceprint(
    text: string,
    voiceName: string, // e.g., "Jamie"
  ): Promise<ArrayBuffer> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/generate`,
        {
          text,
          voice: voiceName,
          format: 'wav',
        },
        {
          responseType: 'arraybuffer',
        },
      );

      return response.data;
    } catch (error) {
      console.error('Voicebox generation failed:', error);
      // Fallback to ElevenLabs
      throw new Error('Voice generation unavailable');
    }
  }

  async captureVoiceSample(audioBuffer: ArrayBuffer, label?: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.baseUrl}/capture`,
        { audio: audioBuffer, label },
      );

      return response.data.voiceId;
    } catch (error) {
      console.error('Voice capture failed:', error);
      throw new Error('Failed to capture voice');
    }
  }
}

export const voiceboxService = new VoiceboxService();
