/**
 * Free LLM API Client (Pekpik)
 *
 * Usage:
 *   const { chat, generateImage } = require('./free-llm-client');
 *
 *   // Chat with Claude Opus
 *   const response = await chat("Write a script for a 60s promo", { model: 'claude-opus-4-7' });
 *
 *   // Generate image with DALL-E 3
 *   const image = await generateImage("A vinyl album cover for electronic music");
 */

const OpenAI = require('openai').default;

const PEKPIK_BASE = process.env.PEKPIK_BASE_URL || 'https://aiapiv2.pekpik.com/v1';
const PEKPIK_KEY = process.env.PEKPIK_API_KEY;

const MODELS = {
  CLAUDE_OPUS: 'claude-opus-4-7',
  GPT_5_5: 'openai/gpt-5.5',
  GEMINI: 'gemini-2.5-flash',
  DEEPSEEK: 'deepseek-v4-flash',
};

// Initialize client
const client = new OpenAI({
  baseURL: PEKPIK_BASE,
  apiKey: PEKPIK_KEY || 'sk-placeholder',
});

/**
 * Chat completion
 */
async function chat(prompt, options = {}) {
  const {
    model = MODELS.CLAUDE_OPUS,
    temperature = 0.7,
    maxTokens = 2000,
  } = options;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [{ role: 'user', content: prompt }],
      temperature,
      max_tokens: maxTokens,
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error(`[Pekpik] Chat failed (${model}):`, error.message);
    throw error;
  }
}

/**
 * Generate image with DALL-E 3
 */
async function generateImage(prompt, options = {}) {
  const { size = '1024x1024', quality = 'standard' } = options;

  try {
    const response = await client.images.generate({
      model: 'dall-e-3',
      prompt,
      size,
      quality,
      n: 1,
    });

    return response.data[0].url;
  } catch (error) {
    console.error('[Pekpik] Image generation failed:', error.message);
    throw error;
  }
}

/**
 * Text-to-speech with TTS-1-HD
 */
async function textToSpeech(text, options = {}) {
  const { voice = 'alloy' } = options;

  try {
    const response = await client.audio.speech.create({
      model: 'tts-1-hd',
      voice,
      input: text,
    });

    return response;
  } catch (error) {
    console.error('[Pekpik] TTS failed:', error.message);
    throw error;
  }
}

/**
 * Embeddings with text-embedding-3-small
 */
async function embed(texts, options = {}) {
  const input = Array.isArray(texts) ? texts : [texts];

  try {
    const response = await client.embeddings.create({
      model: 'text-embedding-3-small',
      input,
    });

    return response.data;
  } catch (error) {
    console.error('[Pekpik] Embeddings failed:', error.message);
    throw error;
  }
}

/**
 * List available models
 */
function listModels() {
  return Object.entries(MODELS).reduce((acc, [key, value]) => {
    acc[key] = value;
    return acc;
  }, {});
}

module.exports = {
  chat,
  generateImage,
  textToSpeech,
  embed,
  listModels,
  MODELS,
  PEKPIK_BASE,
};
