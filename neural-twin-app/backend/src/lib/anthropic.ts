import { Anthropic } from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

/**
 * Lazily construct a singleton Anthropic client.
 *
 * Constructing `new Anthropic()` at module load throws when ANTHROPIC_API_KEY
 * is unset, which previously crashed every AI router on import. Deferring
 * construction to first use means a missing key surfaces as a normal,
 * catchable request error (HTTP 500) instead of taking the process down.
 */
export function getAnthropic(): Anthropic {
  if (!client) {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY environment variable is not set');
    }
    client = new Anthropic({ apiKey });
  }
  return client;
}

/** Default model used across the AI routes; overridable via env. */
export const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022';
