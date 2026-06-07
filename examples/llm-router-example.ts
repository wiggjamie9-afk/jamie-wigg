/**
 * Example: Using LLM Router with Claude and FreeLLMAPI
 *
 * Run with:
 *   npx ts-node examples/llm-router-example.ts
 *
 * Toggle providers:
 *   LLM_MODE=free npx ts-node examples/llm-router-example.ts
 *   LLM_MODE=paid npx ts-node examples/llm-router-example.ts
 */

import {
  getLLMClient,
  completeWithLLM,
  getActiveLLMMode,
  isFreeLLMAvailable,
} from "../lib/llm-router";

async function main() {
  console.log("🚀 LLM Router Example\n");

  // Check which provider is active
  const mode = getActiveLLMMode();
  console.log(`📡 Active mode: ${mode}`);

  // Check if FreeLLMAPI is available
  const freeLLMAvailable = await isFreeLLMAvailable();
  console.log(`✅ FreeLLMAPI available: ${freeLLMAvailable}\n`);

  // Example 1: Simple completion
  console.log("📝 Example 1: Simple completion");
  const { text, provider } = await completeWithLLM(
    "Write a one-line haiku about building AI."
  );
  console.log(`Response: ${text}`);
  console.log(`Provider: ${provider}\n`);

  // Example 2: Using a specific mode
  console.log("📝 Example 2: Force free tier");
  try {
    const { text: freeText, provider: freeProvider } = await completeWithLLM(
      "What is 2 + 2?",
      { mode: "free", maxTokens: 50 }
    );
    console.log(`Response: ${freeText}`);
    console.log(`Provider: ${freeProvider}\n`);
  } catch (err) {
    console.log(`❌ Free tier not available: ${(err as Error).message}\n`);
  }

  // Example 3: Using the raw client
  console.log("📝 Example 3: Raw OpenAI-compatible client");
  const client = getLLMClient(mode);
  const resp = await client.chat.completions.create({
    model: mode === "free" ? "auto" : "claude-opus-4-8",
    messages: [
      {
        role: "user",
        content: "List 3 benefits of free LLM aggregation in bullet points.",
      },
    ],
    max_tokens: 200,
  });

  console.log(resp.choices[0]?.message?.content);
  console.log(
    `\n✅ Routed via: ${resp.headers?.get?.("x-routed-via") || "unknown"}\n`
  );

  // Example 4: Streaming
  console.log("📝 Example 4: Streaming response");
  const streamClient = getLLMClient(mode);
  const stream = await streamClient.chat.completions.create({
    model: mode === "free" ? "auto" : "claude-opus-4-8",
    messages: [
      {
        role: "user",
        content: "Write a short 2-sentence story about a robot learning.",
      },
    ],
    stream: true,
  });

  process.stdout.write("Response: ");
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
  console.log("\n");

  console.log("✨ Done!");
}

main().catch(console.error);
