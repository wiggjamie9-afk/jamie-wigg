import Anthropic from "@anthropic-ai/sdk";
import { config } from "../config.js";
import type { Draft, Trend } from "../types.js";

const SYSTEM_PROMPT = `You are a social-media content drafter writing posts for Reddit.

Goal: turn a trending topic into a post that drives genuine discussion. The post must be:
- Honest. Never fabricate facts or statistics. If you don't know specifics, speak generally or ask the community.
- On-topic. Match the trend exactly; don't bait-and-switch.
- ToS-compliant. No spam, no covert ads, no astroturfing, no impersonation.
- Disclosed. The author runs an automated content pipeline; never claim personal experience the author hasn't had.
- Discussion-first. End with an open question that invites real replies, not engagement bait.

Output strict JSON with this shape:
{
  "title": "post title (under 280 chars, no clickbait, no ALL CAPS, no emoji spam)",
  "body": "post body in markdown, 80-220 words. Plain prose. No fake stats. End with one open question.",
  "hook": "one-sentence summary of the angle",
  "why_it_matters": "one sentence on why this trend is worth discussing",
  "tags": ["3-6 short lowercase tags"]
}

Return ONLY the JSON object, nothing else.`;

function safeParseJson(text: string): any | null {
  const trimmed = text.trim();
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(trimmed.slice(start, end + 1));
  } catch {
    return null;
  }
}

export async function draftPost(trend: Trend): Promise<Draft> {
  if (!config.anthropicApiKey) {
    throw new Error("ANTHROPIC_API_KEY not set");
  }
  const client = new Anthropic({ apiKey: config.anthropicApiKey });

  const userBlock = [
    `Source: ${trend.source}`,
    trend.subreddit ? `Subreddit: r/${trend.subreddit}` : "",
    trend.region ? `Region: ${trend.region}` : "",
    `Trend title: ${trend.title}`,
    trend.url ? `Link: ${trend.url}` : "",
    `Score (normalized 0-1): ${trend.score.toFixed(3)}`,
  ]
    .filter(Boolean)
    .join("\n");

  const res = await client.messages.create({
    model: config.model,
    max_tokens: 1024,
    system: [
      {
        type: "text",
        text: SYSTEM_PROMPT,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userBlock }],
  });

  const text = res.content
    .filter((b: any) => b.type === "text")
    .map((b: any) => b.text)
    .join("\n");

  const parsed = safeParseJson(text);
  if (!parsed || typeof parsed.title !== "string" || typeof parsed.body !== "string") {
    throw new Error(`Drafter returned invalid JSON: ${text.slice(0, 300)}`);
  }

  return {
    trend_id: trend.id,
    source: trend.source,
    title: String(parsed.title).slice(0, 300),
    body: String(parsed.body),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(String).slice(0, 8) : [],
    hook: String(parsed.hook ?? ""),
    why_it_matters: String(parsed.why_it_matters ?? ""),
    drafted_at: new Date().toISOString(),
  };
}

export function offlineDraftStub(trend: Trend): Draft {
  return {
    trend_id: trend.id,
    source: trend.source,
    title: `[STUB - no API key] ${trend.title}`.slice(0, 300),
    body:
      `This is a placeholder draft generated without calling the Claude API. ` +
      `Set ANTHROPIC_API_KEY in .env to get real drafts. ` +
      `Original trend: "${trend.title}" from ${trend.source}.`,
    tags: [trend.source, "stub"],
    hook: "Stub draft (no API key configured).",
    why_it_matters: "Pipeline is wired; needs ANTHROPIC_API_KEY to draft for real.",
    drafted_at: new Date().toISOString(),
  };
}
