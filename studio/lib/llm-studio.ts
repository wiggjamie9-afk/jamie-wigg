/**
 * LLM Router for STARLIGHTMIX Studio
 *
 * Intelligently routes Studio tasks between free tiers and Claude:
 * - Low-value tasks (captions, metadata) → Free tiers
 * - High-value tasks (reasoning, editing) → Claude
 * - Graceful fallback if free tiers are exhausted
 */

import { getLLMClient, completeWithLLM, getActiveLLMMode } from "./llm-router";

export type StudioTask =
  | "caption"           // Low-value: generate video captions
  | "narration"         // Low-value: narration text from script
  | "metadata"          // Low-value: tags, descriptions, hashtags
  | "suggestion"        // Low-value: UI suggestions, style ideas
  | "onboarding"        // Low-value: help text, tooltips
  | "reasoning"         // High-value: complex analysis
  | "editing"           // High-value: edit instruction interpretation
  | "creative"          // High-value: creative direction, feedback;

interface StudioLLMRequest {
  task: StudioTask;
  prompt: string;
  options?: {
    temperature?: number;
    maxTokens?: number;
    forceMode?: "free" | "paid";  // Override mode if needed
  };
}

export interface StudioLLMResponse {
  text: string;
  provider: string;
  mode: "free" | "paid";
  cached?: boolean;
}

/**
 * Categorize task by value/importance
 */
function getTaskPriority(task: StudioTask): "low" | "high" {
  const lowValueTasks: StudioTask[] = [
    "caption",
    "narration",
    "metadata",
    "suggestion",
    "onboarding",
  ];
  return lowValueTasks.includes(task) ? "low" : "high";
}

/**
 * Determine which LLM mode to use based on task priority
 */
function selectMode(
  task: StudioTask,
  forceMode?: "free" | "paid"
): "free" | "paid" | "auto" {
  if (forceMode) return forceMode;

  const priority = getTaskPriority(task);

  // Low-value tasks: always try free first
  if (priority === "low") return "free";

  // High-value tasks: use auto (Claude with free fallback)
  // This way morning requests use free, evening requests fall back to Claude
  return "auto";
}

/**
 * Select appropriate model based on task
 */
function selectModel(
  task: StudioTask,
  mode: "free" | "paid" | "auto"
): string {
  if (mode === "paid" || mode === "auto") {
    return "claude-opus-4-8";  // Full Claude for reasoning
  }

  // Free mode: auto-picker
  return "auto";
}

/**
 * Generate appropriate system prompt for the task
 */
function getSystemPrompt(task: StudioTask): string {
  const prompts: Record<StudioTask, string> = {
    caption: "You are a concise video caption writer. Generate short, engaging captions.",
    narration: "You are a professional narration writer. Write clear, engaging narration for videos.",
    metadata: "You are a metadata expert. Generate relevant tags, descriptions, and hashtags.",
    suggestion: "You are a UI/UX suggestion engine. Provide helpful, actionable suggestions.",
    onboarding: "You are a help text writer. Write clear, friendly onboarding guidance.",
    reasoning: "You are an analytical AI assistant. Provide thorough, reasoned analysis.",
    editing: "You are an expert video editor. Help interpret and execute editing instructions.",
    creative: "You are a creative director. Provide thoughtful creative feedback and ideas.",
  };

  return prompts[task];
}

/**
 * Main function: Route Studio task to appropriate LLM
 */
export async function routeStudioTask(
  request: StudioLLMRequest
): Promise<StudioLLMResponse> {
  const { task, prompt, options = {} } = request;
  const { temperature = 0.7, maxTokens = 500, forceMode } = options;

  const mode = selectMode(task, forceMode);
  const model = selectModel(task, mode);
  const systemPrompt = getSystemPrompt(task);

  try {
    const client = getLLMClient(mode);

    const resp = await client.chat.completions.create({
      model,
      temperature,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    const text = resp.choices[0]?.message?.content || "";
    const provider =
      (resp as unknown as { headers?: { get?: (k: string) => string | null } })
        .headers?.get?.("x-routed-via") || "unknown";
    const activeMode = getActiveLLMMode(mode);

    return {
      text,
      provider,
      mode: activeMode,
    };
  } catch (error) {
    // If free tier fails, try paid as fallback for critical tasks
    if (mode === "free" && getTaskPriority(task) === "high") {
      console.warn(`Free tier failed for ${task}, falling back to Claude`);

      const client = getLLMClient("paid");
      const resp = await client.chat.completions.create({
        model: "claude-opus-4-8",
        temperature,
        max_tokens: maxTokens,
        messages: [
          { role: "system", content: getSystemPrompt(task) },
          { role: "user", content: prompt },
        ],
      });

      return {
        text: resp.choices[0]?.message?.content || "",
        provider: "claude-opus-4-8",
        mode: "paid",
      };
    }

    throw error;
  }
}

/**
 * Convenience functions for common Studio tasks
 */

export async function generateCaption(
  videoDescription: string,
  forceMode?: "free" | "paid"
): Promise<StudioLLMResponse> {
  return routeStudioTask({
    task: "caption",
    prompt: `Create a short, engaging caption for this video: ${videoDescription}`,
    options: { maxTokens: 100, temperature: 0.8, forceMode },
  });
}

export async function generateNarration(
  script: string,
  forceMode?: "free" | "paid"
): Promise<StudioLLMResponse> {
  return routeStudioTask({
    task: "narration",
    prompt: `Polish this narration script for a music video: ${script}`,
    options: { maxTokens: 300, temperature: 0.7, forceMode },
  });
}

export async function generateMetadata(
  videoTitle: string,
  description: string,
  forceMode?: "free" | "paid"
): Promise<StudioLLMResponse> {
  return routeStudioTask({
    task: "metadata",
    prompt: `Generate metadata for this video:
Title: ${videoTitle}
Description: ${description}

Provide 5 relevant hashtags and a SEO-optimized description (50 words max).`,
    options: { maxTokens: 200, temperature: 0.6, forceMode },
  });
}

export async function suggestEditStyle(
  currentStyle: string,
  forceMode?: "free" | "paid"
): Promise<StudioLLMResponse> {
  return routeStudioTask({
    task: "suggestion",
    prompt: `Suggest an edit style to complement this existing style: ${currentStyle}`,
    options: { maxTokens: 150, temperature: 0.9, forceMode },
  });
}

export async function interpretEditingInstruction(
  instruction: string,
  forceMode?: "free" | "paid"
): Promise<StudioLLMResponse> {
  return routeStudioTask({
    task: "editing",
    prompt: `Interpret this video editing instruction and explain what to do: ${instruction}`,
    options: { maxTokens: 300, temperature: 0.5, forceMode },
  });
}

/**
 * Cost estimate for a Studio task
 */
export function estimateTaskCost(
  task: StudioTask,
  inputTokens: number,
  outputTokens: number
): number {
  const priority = getTaskPriority(task);

  // Low-value tasks: always free
  if (priority === "low") return 0;

  // High-value tasks: estimate Claude cost (~$0.015 per 1K input, $0.06 per 1K output)
  const inputCost = (inputTokens / 1000) * 0.015;
  const outputCost = (outputTokens / 1000) * 0.06;
  return inputCost + outputCost;
}

/**
 * Get task routing info (for analytics/logging)
 */
export function getTaskRoutingInfo(task: StudioTask) {
  return {
    task,
    priority: getTaskPriority(task),
    mode: selectMode(task),
    expectedProvider: getTaskPriority(task) === "low" ? "free" : "claude",
  };
}
