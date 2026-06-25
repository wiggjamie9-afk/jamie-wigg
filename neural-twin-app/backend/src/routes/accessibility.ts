import express, { Router, Request, Response } from 'express';
import { prisma } from '../index';
import { getAnthropic, CLAUDE_MODEL } from '../lib/anthropic';

const router: Router = express.Router();

interface BookScanRequest {
  imageBase64: string;
  language?: string;
  focusArea?: string; // title, paragraph, specific_section
}

interface TextToSpeechRequest {
  text: string;
  voiceId?: string;
  speed?: number; // 0.5 to 2.0
}

// Extract text from image using Claude Vision
async function extractTextFromImage(imageBase64: string, focusArea: string = 'full'): Promise<string> {
  try {
    const response = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: 'image/jpeg',
                data: imageBase64
              }
            },
            {
              type: 'text',
              text: `Extract and transcribe the text from this image. ${
                focusArea === 'paragraph'
                  ? 'Focus on clearly identifiable paragraphs and maintain formatting.'
                  : focusArea === 'title'
                  ? 'Extract the title and main headings.'
                  : 'Extract all readable text, preserving structure and formatting.'
              }

For dyslexic/ADHD readers, ensure:
- Clear line breaks between sections
- Paragraph numbering if multiple paragraphs
- Emphasis on key points with [IMPORTANT] markers

Return ONLY the extracted text, no additional commentary.`
            }
          ]
        }
      ]
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Text extraction error:', error);
    return '';
  }
}

// Simplify and structure text for accessibility
async function simplifyForAccessibility(text: string): Promise<{
  simplified: string;
  sections: string[];
  readingTime: number;
}> {
  try {
    const response = await getAnthropic().messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Simplify and structure this text for readers with dyslexia or ADHD.

Original text:
${text}

Provide:
1. Simplified version (shorter sentences, clear structure, ~70% original length)
2. Break into 3-4 short sections with section headers
3. Highlight key concepts with [KEY CONCEPT: ...]
4. Add estimated reading time in minutes

Format your response as:
SIMPLIFIED:
[simplified text with sections and headers]

SECTIONS:
[list section headers, one per line]

READING_TIME:
[number in minutes]`
        }
      ]
    });

    const responseText = response.content[0].type === 'text' ? response.content[0].text : '';

    // Parse response
    const simplified = responseText.split('SECTIONS:')[0].replace('SIMPLIFIED:\n', '').trim();
    const sectionsMatch = responseText.match(/SECTIONS:\n([\s\S]*?)READING_TIME:/);
    const sections = sectionsMatch ? sectionsMatch[1].split('\n').filter(s => s.trim()) : [];
    const readingTimeMatch = responseText.match(/READING_TIME:\n(\d+)/);
    const readingTime = readingTimeMatch ? parseInt(readingTimeMatch[1]) : Math.ceil(text.split(' ').length / 200);

    return { simplified, sections, readingTime };
  } catch (error) {
    console.error('Accessibility simplification error:', error);
    return {
      simplified: text,
      sections: ['Content'],
      readingTime: Math.ceil(text.split(' ').length / 200)
    };
  }
}

// POST /api/accessibility/scan-book - Scan and extract text from book image
router.post('/scan-book', async (req: Request, res: Response) => {
  try {
    const { imageBase64, language = 'en', focusArea = 'full' } = req.body as BookScanRequest;
    const userId = req.userId!;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Missing imageBase64' });
    }

    // Extract text from image
    const extractedText = await extractTextFromImage(imageBase64, focusArea);

    // Simplify for accessibility
    const { simplified, sections, readingTime } = await simplifyForAccessibility(extractedText);

    // Store the scan in database (optional, for history)
    const scan = await prisma.voiceRecording.create({
      data: {
        userId,
        audioUrl: 'book-scan', // Placeholder
        duration: readingTime * 60, // Convert to seconds
        transcript: extractedText,
        context: `Book Scan - Focus: ${focusArea}`,
        location: language,
        waveform: { sections, simplified }
      }
    });

    res.json({
      success: true,
      scanId: scan.id,
      originalText: extractedText,
      simplifiedText: simplified,
      sections: sections,
      readingTime: readingTime,
      characterCount: extractedText.length,
      wordCount: extractedText.split(/\s+/).length
    });
  } catch (error) {
    console.error('Book scan error:', error);
    res.status(500).json({ error: 'Failed to scan book' });
  }
});

// POST /api/accessibility/tts - Text-to-speech for accessibility
router.post('/tts', async (req: Request, res: Response) => {
  try {
    const { text, voiceId = 'neural', speed = 1.0 } = req.body as TextToSpeechRequest;
    const userId = req.userId!;

    if (!text) {
      return res.status(400).json({ error: 'Missing text' });
    }

    // Validate speed
    const validatedSpeed = Math.max(0.5, Math.min(2.0, speed));

    // For Phase 1, simulate TTS response
    // In production, integrate with ElevenLabs, Google TTS, or AWS Polly
    const audioUrl = `https://tts.example.com/${userId}/audio_${Date.now()}.mp3`;
    const estimatedDuration = (text.length / 5) / (validatedSpeed * 2); // Very rough estimate

    res.json({
      success: true,
      audioUrl: audioUrl,
      duration: estimatedDuration,
      voice: voiceId,
      speed: validatedSpeed,
      characterCount: text.length,
      wordCount: text.split(/\s+/).length
    });
  } catch (error) {
    console.error('TTS error:', error);
    res.status(500).json({ error: 'Failed to generate speech' });
  }
});

// GET /api/accessibility/accessibility-settings - Get user accessibility preferences
router.get('/settings', async (req: Request, res: Response) => {
  try {
    const userId = req.userId!;

    // Get or create default settings
    const settings = {
      userId,
      dyslexiaMode: true,
      adhdMode: true,
      fontSize: 18,
      lineSpacing: 1.8,
      fontFamily: 'OpenDyslexic', // Dyslexia-friendly font
      backgroundColor: '#F5F5DC', // Beige background
      textColor: '#333333',
      highContrast: false,
      simplifyText: true,
      readingPane: true,
      ttsEnabled: true,
      ttsSpeed: 1.0,
      ttsVoice: 'neural',
      focusMode: true, // Hide distractions
      wordHighlight: true, // Highlight current word during TTS
      sectionBreaks: true,
      wordCount: true,
      estimatedReadingTime: true
    };

    res.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch accessibility settings' });
  }
});

// POST /api/accessibility/accessibility-settings - Update accessibility preferences
router.post('/settings', async (req: Request, res: Response) => {
  try {
    const { userId: _ignoredUserId, ...settings } = req.body;
    const userId = req.userId!;

    // In production, store these preferences to database
    res.json({
      success: true,
      message: 'Accessibility settings updated',
      settings: {
        userId,
        ...settings,
        updatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update accessibility settings' });
  }
});

export default router;
