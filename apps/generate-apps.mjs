#!/usr/bin/env node
/**
 * Generator: Produces all 28 standalone Buddy Apps
 *
 * Usage:
 *   node generate-apps.mjs
 *
 * Output: Creates buddy-{1..28}.html files in the apps/ directory,
 * each customized with a single buddy's personality, colors, emojis, etc.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load the personality library (execute it to get BUDDY_PERSONALITIES)
const personalitiesCode = fs.readFileSync(path.join(__dirname, 'buddy-personalities.js'), 'utf-8');
const buddyPersonalities = {};

// Parse BUDDY_PERSONALITIES from the JS file manually
// (Extract the object literal between "const BUDDY_PERSONALITIES = {" and the closing "}"
const match = personalitiesCode.match(/const BUDDY_PERSONALITIES = ({[\s\S]*?});/);
if (!match) {
  console.error('Could not parse BUDDY_PERSONALITIES from buddy-personalities.js');
  process.exit(1);
}

// Safely evaluate the object (it's just data)
const buddyObject = new Function(`
  const AI_DISCLOSURE = 'You are an AI companion — a caring presence, not a doctor, therapist, or emergency service — and you say so plainly when it matters.';
  const CRISIS_RESOURCES = 'If you ever feel you might act on thoughts of harming yourself or someone else, please reach out right now: in the US, call or text 988 (Suicide & Crisis Lifeline), or text HOME to 741741 (Crisis Text Line). If there is immediate danger, call 911 or your local emergency number. If you are outside the US, contact your local emergency services or a trusted person nearby.';
  return ${match[1]};
`)();

// Buddy color map (one color per buddy for the --glow variable)
const BUDDY_COLORS = {
  1: '#8b5cf6',  // purple
  2: '#3b82f6',  // blue
  3: '#ec4899',  // pink
  4: '#10b981',  // green
  5: '#f59e0b',  // amber
  6: '#06b6d4',  // cyan
  7: '#6366f1',  // indigo
  8: '#8b5cf6',  // purple
  9: '#14b8a6',  // teal
  10: '#d946ef', // fuchsia
  11: '#f97316', // orange
  12: '#06b6d4', // cyan
  13: '#14b8a6', // teal
  14: '#3b82f6', // blue
  15: '#ec4899', // pink
  16: '#10b981', // green
  17: '#f59e0b', // amber
  18: '#8b5cf6', // purple
  19: '#6366f1', // indigo
  20: '#06b6d4', // cyan
  21: '#14b8a6', // teal
  22: '#d946ef', // fuchsia
  23: '#f97316', // orange
  24: '#3b82f6', // blue
  25: '#ec4899', // pink
  26: '#10b981', // green
  27: '#f59e0b', // amber
  28: '#8b5cf6', // purple
  // 10 new loneliness-focused buddies
  29: '#ec4899', // pink (Dating & Romance)
  30: '#f97316', // orange (New Relationship)
  31: '#8b5cf6', // purple (Breakup Recovery)
  32: '#3b82f6', // blue (Long-Distance)
  33: '#06b6d4', // cyan (Social Anxiety)
  34: '#10b981', // green (New City)
  35: '#14b8a6', // teal (Workplace Friendship)
  36: '#f59e0b', // amber (Meetup & Social Skills)
  37: '#06b6d4', // cyan (Solo Traveler)
  38: '#d946ef', // fuchsia (Self-Love & Solo Life)
};

// Buddy emoji map
const BUDDY_EMOJIS = {
  1: '👋', 2: '😰', 3: '😔', 4: '🌙', 5: '💔', 6: '👵', 7: '👨‍👩‍👧‍👦',
  8: '👦', 9: '🌱', 10: '💼', 11: '📈', 12: '📚', 13: '🎨', 14: '⚡',
  15: '💪', 16: '🥗', 17: '✈️', 18: '💰', 19: '🎸', 20: '🎯',
  21: '🛡️', 22: '⚡', 23: '🌈', 24: '🩹', 25: '🔥', 26: '🏳️‍🌈',
  27: '♿', 28: '🌟',
  // New 10: loneliness-focused
  29: '💕', 30: '🌹', 31: '💔', 32: '📱', 33: '🤝', 34: '🏙️',
  35: '👥', 36: '🎉', 37: '✈️', 38: '🌟',
};

// Load template
const template = fs.readFileSync(path.join(__dirname, 'buddy-app-template.html'), 'utf-8');

// Generate all 28 apps
console.log('Generating 28 Buddy Apps...\n');

for (const [buddyId, personality] of Object.entries(buddyObject)) {
  const id = parseInt(buddyId);
  const name = personality.name || `Buddy ${id}`;
  const emoji = BUDDY_EMOJIS[id] || '👋';
  const color = BUDDY_COLORS[id] || '#8b5cf6';

  // Slugify name for filename
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  // Build the app HTML by replacing placeholders
  let appHtml = template;

  // Replace placeholders
  appHtml = appHtml.replace(/{{BUDDY_ID}}/g, id);
  appHtml = appHtml.replace(/{{BUDDY_NAME}}/g, name);
  appHtml = appHtml.replace(/{{BUDDY_EMOJI}}/g, emoji);
  appHtml = appHtml.replace(/{{BUDDY_COLOR}}/g, color);
  appHtml = appHtml.replace(
    /{{BUDDY_PERSONALITY_JSON}}/g,
    JSON.stringify(personality).replace(/'/g, "\\'")
  );

  // Write file
  const outputPath = path.join(__dirname, `buddy-${id}.html`);
  fs.writeFileSync(outputPath, appHtml);
  console.log(`✓ buddy-${id}.html (${name})`);
}

console.log('\n✨ Done! All 38 apps generated (28 original + 10 loneliness-focused).');
console.log('\nNext steps:');
console.log('  1. Commit all buddy-*.html files');
console.log('  2. Start the HTTP server: python3 -m http.server 8000');
console.log('  3. Open http://localhost:8000/apps/buddies.html (launcher hub)');
console.log('  4. Or open a specific buddy: http://localhost:8000/apps/buddy-29.html (Dating & Romance Coach)');
