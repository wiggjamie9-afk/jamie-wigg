#!/usr/bin/env node
/**
 * Gemini + Nano Banana Integration
 * Combines curated Nano Banana Pro prompts with Google Gemini image generation
 */

import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const __root = path.join(__dirname, "..");

// Configuration
const OUTPUT_DIR = path.join(__root, "generated-images");
const PROMPTS_DIR = path.join(__root, ".claude/skills/nano-banana-pro-prompts-recommend-skill/references");

const API_KEY = process.env.GOOGLE_API_KEY;
if (!API_KEY) {
  console.error(
    "❌ GOOGLE_API_KEY not set. Add it to .env:\n" +
    "   GOOGLE_API_KEY=your-google-api-key\n" +
    "   Get it from: https://aistudio.google.com/app/apikey"
  );
  process.exit(1);
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Load a prompt from the nano-banana library
 */
async function loadPromptByCategory(category) {
  try {
    const filePath = path.join(PROMPTS_DIR, `${category}.json`);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Category file not found: ${category}.json`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf8"));
    // Return a random prompt from the category
    return data[Math.floor(Math.random() * data.length)];
  } catch (error) {
    console.error(`Error loading prompt: ${error.message}`);
    return null;
  }
}

/**
 * Get available categories from manifest
 */
async function getCategories() {
  try {
    const manifestPath = path.join(PROMPTS_DIR, "manifest.json");
    const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
    return manifest.categories.map(c => c.slug);
  } catch (error) {
    console.error(`Error loading manifest: ${error.message}`);
    return [];
  }
}

/**
 * Generate image with Gemini
 */
async function generateImage(prompt, outputPath) {
  try {
    console.log(`\n🎨 Generating image for: "${prompt.substring(0, 60)}..."`);

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    const response = await model.generateContent({
      contents: [{ text: prompt }],
    });

    const result = await response.response;

    // Extract image data
    for (const part of result.candidates[0].content.parts) {
      if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, "base64");
        fs.writeFileSync(outputPath, buffer);
        console.log(`✅ Image saved: ${outputPath}`);
        return true;
      }
    }

    console.error("⚠️  No image data in response");
    return false;
  } catch (error) {
    console.error(`❌ Generation error: ${error.message}`);
    return false;
  }
}

/**
 * Main workflow
 */
async function main() {
  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log("🍌 Nano Banana + Gemini Image Generator");
  console.log("=" .repeat(50));

  // Get available categories
  const categories = await getCategories();
  if (categories.length === 0) {
    console.error("❌ No prompt categories found. Run nano-banana setup first.");
    process.exit(1);
  }

  console.log(`\n📚 Available categories: ${categories.length}`);
  categories.forEach((cat, i) => {
    console.log(`   ${i + 1}. ${cat}`);
  });

  // If a category is specified as argument, use it
  const selectedCategory = process.argv[2] || categories[0];

  if (!categories.includes(selectedCategory)) {
    console.error(`\n❌ Category not found: ${selectedCategory}`);
    console.log(`\nUsage: npm run generate-with-gemini [category]`);
    console.log(`Examples:\n   npm run generate-with-gemini social-media-post`);
    process.exit(1);
  }

  // Load prompt from category
  console.log(`\n🔍 Loading prompt from: ${selectedCategory}`);
  const promptData = await loadPromptByCategory(selectedCategory);

  if (!promptData) {
    console.error("❌ Failed to load prompt");
    process.exit(1);
  }

  console.log(`\n📝 Prompt loaded:`);
  console.log(`   Title: ${promptData.title}`);
  console.log(`   Content: ${promptData.content.substring(0, 100)}...`);

  // Generate image
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
  const filename = `${selectedCategory}-${timestamp}.png`;
  const outputPath = path.join(OUTPUT_DIR, filename);

  const success = await generateImage(promptData.content, outputPath);

  if (success) {
    console.log("\n" + "=".repeat(50));
    console.log("✨ Generation complete!");
    console.log(`📁 Output: generated-images/`);
  } else {
    process.exit(1);
  }
}

main().catch(console.error);
