#!/usr/bin/env node

/**
 * Treegress + Ollama Checkout Automation Demo
 *
 * This script demonstrates a complete automated checkout flow:
 * 1. Navigate to a checkout page
 * 2. Analyze the form with Ollama
 * 3. Fill fields from a saved profile
 * 4. Wait for approval
 * 5. Submit the order
 *
 * Usage:
 *   node scripts/checkout-demo.js <url> [profileName]
 *
 * Example:
 *   node scripts/checkout-demo.js https://shop.example.com/checkout default
 */

import fetch from "node-fetch";
import readline from "readline";

const OLLAMA_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "mistral";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(
    "Usage: node scripts/checkout-demo.js <url> [profileName]"
  );
  console.error("Example: node scripts/checkout-demo.js https://shop.example.com/checkout default");
  process.exit(1);
}

const checkoutUrl = args[0];
const profileName = args[1] || "default";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function callOllama(prompt) {
  try {
    const res = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        prompt,
        stream: false,
        temperature: 0.3,
      }),
    });

    if (!res.ok) {
      throw new Error(`Ollama API error: ${res.status}`);
    }

    const data = await res.json();
    return data.response.trim();
  } catch (error) {
    throw new Error(`Ollama call failed: ${error.message}`);
  }
}

async function main() {
  console.log("🛒 Treegress + Ollama Checkout Automation Demo\n");

  console.log(`📍 Checkout URL: ${checkoutUrl}`);
  console.log(`👤 Profile: ${profileName}`);
  console.log(`🤖 Ollama: ${OLLAMA_URL} (${OLLAMA_MODEL})\n`);

  console.log("⏳ This demo shows the workflow. In Claude Code, you'd use:\n");

  console.log("1️⃣  browser_open");
  console.log("   ↓");
  console.log("2️⃣  browser_snapshot");
  console.log("   ↓");
  console.log("3️⃣  checkout_analyze");
  console.log("   ↓");
  console.log("4️⃣  checkout_fill_profile (autoApprove: false)");
  console.log("   ↓ [AWAIT YOUR APPROVAL]");
  console.log("5️⃣  checkout_confirm\n");

  const answer = await prompt("Ready to simulate checkout analysis? (y/n) ");
  if (answer.toLowerCase() !== "y") {
    console.log("Cancelled.");
    rl.close();
    process.exit(0);
  }

  console.log("\n🔍 Simulating checkout form analysis...\n");

  const sampleDOMJson = `
{
  "tag": "form",
  "children": [
    {
      "refId": "ref_5",
      "tag": "input",
      "attrs": { "placeholder": "First Name", "name": "firstName" },
      "isInteractive": true
    },
    {
      "refId": "ref_6",
      "tag": "input",
      "attrs": { "placeholder": "Last Name", "name": "lastName" },
      "isInteractive": true
    },
    {
      "refId": "ref_12",
      "tag": "input",
      "attrs": { "placeholder": "Email", "type": "email", "name": "email" },
      "isInteractive": true
    },
    {
      "refId": "ref_15",
      "tag": "input",
      "attrs": { "placeholder": "Phone", "type": "tel", "name": "phone" },
      "isInteractive": true
    },
    {
      "refId": "ref_20",
      "tag": "input",
      "attrs": { "placeholder": "Address", "name": "address" },
      "isInteractive": true
    },
    {
      "refId": "ref_42",
      "tag": "button",
      "attrs": { "type": "submit" },
      "isInteractive": true
    }
  ]
}
  `;

  const analyzePrompt = `Analyze this checkout form DOM and list all detected fields. Return ONLY valid JSON with structure:
{
  "fields": [
    { "label": "First Name", "refId": "ref_5", "type": "text", "required": true }
  ],
  "formAction": "ref_42"
}

DOM:
${sampleDOMJson}`;

  try {
    console.log("📡 Querying Ollama...");
    const analysisResponse = await callOllama(analyzePrompt);

    console.log("\n✅ Ollama form analysis:");
    console.log(analysisResponse);

    let parsedAnalysis;
    try {
      parsedAnalysis = JSON.parse(analysisResponse);
    } catch {
      console.log("\n⚠️  Ollama didn't return valid JSON. This is normal—try a different model.");
      console.log("Parsed response (raw):", analysisResponse.slice(0, 200));
      parsedAnalysis = {
        fields: [
          { label: "First Name", refId: "ref_5", type: "text", required: true },
          { label: "Last Name", refId: "ref_6", type: "text", required: true },
          { label: "Email", refId: "ref_12", type: "email", required: true },
          { label: "Phone", refId: "ref_15", type: "tel", required: true },
          { label: "Address", refId: "ref_20", type: "text", required: true },
        ],
        formAction: "ref_42",
      };
    }

    console.log("\n🎯 Detected fields:");
    if (parsedAnalysis.fields) {
      parsedAnalysis.fields.forEach((field) => {
        console.log(
          `   ${field.refId}: ${field.label} (${field.type})${field.required ? " [REQUIRED]" : ""}`
        );
      });
    }

    const fillAnswer = await prompt(
      "\n✓ Fields look good? Simulate filling profile? (y/n) "
    );
    if (fillAnswer.toLowerCase() === "y") {
      console.log(
        "\n✓ Profile 'default' would be mapped and filled:\n"
      );
      console.log("  ref_5 (First Name) → Jamie");
      console.log("  ref_6 (Last Name) → Wigg");
      console.log("  ref_12 (Email) → jamie.jack.28@hotmail.com");
      console.log("  ref_15 (Phone) → +61412345678");
      console.log("  ref_20 (Address) → 123 Example Street\n");

      const approveAnswer = await prompt("✓ Ready to submit? (y/n) ");
      if (approveAnswer.toLowerCase() === "y") {
        console.log("\n🔄 Submitting checkout_confirm { submitButtonRefId: 'ref_42' }...\n");
        console.log("✅ Order placed! Order confirmation page loaded.");
      } else {
        console.log("\n✓ Submission cancelled (approval gate working).");
      }
    }
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nMake sure Ollama is running:");
    console.error("  ollama serve");
  }

  console.log("\n📚 Next Steps:");
  console.log("  1. Read: TREEGRESS-OLLAMA-SETUP.md");
  console.log("  2. Install Ollama: https://ollama.ai/download");
  console.log("  3. Pull a model: ollama pull mistral");
  console.log("  4. Set .env: OLLAMA_API_URL, OLLAMA_MODEL");
  console.log("  5. In Claude Code, invoke: browser_open → checkout_analyze → checkout_fill_profile → checkout_confirm\n");

  rl.close();
}

main().catch(console.error);
