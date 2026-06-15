#!/usr/bin/env node
/**
 * Food Nutrition Apps Generator
 * Generates 45 food buddy apps with Stitch Vibe Design
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load personalities
const personalitiesCode = fs.readFileSync(path.join(__dirname, 'food-buddy-personalities.js'), 'utf-8');
const match = personalitiesCode.match(/const FOOD_BUDDY_PERSONALITIES = ({[\s\S]*?});/);
if (!match) {
  console.error('Could not parse FOOD_BUDDY_PERSONALITIES');
  process.exit(1);
}

const buddyObject = new Function(`return ${match[1]}`)();

// Load vibes
const vibesCode = fs.readFileSync(path.join(__dirname, 'food-buddy-vibes.js'), 'utf-8');
const vibeMatch = vibesCode.match(/export const FOOD_BUDDY_VIBES = ({[\s\S]*?});/);
if (!vibeMatch) {
  console.error('Could not parse FOOD_BUDDY_VIBES');
  process.exit(1);
}

const buddyVibes = new Function(`return ${vibeMatch[1]}`)();

// Emoji map for food buddies
const FOOD_BUDDY_EMOJIS = {
  1: '👶', 2: '🧒', 3: '👧', 4: '🧑', 5: '👨', 6: '🧑', 7: '🧑', 8: '👴', 9: '👵',
  10: '🤝', 11: '🧠', 12: '⏰', 13: '🍽️', 14: '👁️', 15: '🚫', 16: '💚', 17: '🫀',
  18: '💪', 19: '⚖️', 20: '⚖️', 21: '📊', 22: '⚡', 23: '💪',
  24: '🍽️', 25: '🥕', 26: '👨‍🍳', 27: '👨‍👩‍👧‍👦', 28: '👶', 29: '🍴', 30: '🥘',
  31: '🍬', 32: '❤️', 33: '🫘', 34: '🍎', 35: '🤰',
  36: '💰', 37: '🥬', 38: '🥑', 39: '🫒', 40: '🌱',
  41: '🚫', 42: '🧘', 43: '😌', 44: '🏃', 45: '🧠'
};

function generateVibeCss(vibe) {
  const shadowPace = vibe.animationPace === 'slow' ? '800ms' : vibe.animationPace === 'fast' ? '200ms' : '400ms';
  const shadowBlur = vibe.shadowStyle === 'gentle' ? '8px' : vibe.shadowStyle === 'bold' ? '16px' : '12px';
  const fontScale = vibe.fontSize === 'large' ? '1.15' : vibe.fontSize === 'small' ? '0.9' : '1';

  return `
    --vibe-primary: ${vibe.primary};
    --vibe-secondary: ${vibe.secondary};
    --vibe-accent: ${vibe.accent};
    --vibe-text: ${vibe.textColor};
    --vibe-animation-duration: ${shadowPace};
    --vibe-shadow-blur: ${shadowBlur};
    --vibe-shadow-color: rgba(0, 0, 0, 0.15);
    --vibe-font-scale: ${fontScale};
  `.trim();
}

console.log('Generating 45 Food Nutrition Buddy Apps with Stitch Vibe Design...\n');

const template = fs.readFileSync(path.join(__dirname, 'food-app-template.html'), 'utf-8');

for (const [buddyId, personality] of Object.entries(buddyObject)) {
  const id = parseInt(buddyId);
  const name = personality.name || `Nutrition Buddy ${id}`;
  const emoji = FOOD_BUDDY_EMOJIS[id] || '🥗';
  const vibe = buddyVibes[id];

  if (!vibe) {
    console.warn(`⚠️  No vibe found for buddy ${id}, skipping...`);
    continue;
  }

  const vibeCss = generateVibeCss(vibe);

  let appHtml = template;
  appHtml = appHtml.replace(/{{BUDDY_ID}}/g, id);
  appHtml = appHtml.replace(/{{BUDDY_NAME}}/g, name);
  appHtml = appHtml.replace(/{{BUDDY_EMOJI}}/g, emoji);
  appHtml = appHtml.replace(/{{BUDDY_VIBE_CSS}}/g, vibeCss);
  appHtml = appHtml.replace(/{{BUDDY_SPECIALIZATION}}/g, personality.specialization);
  appHtml = appHtml.replace(/{{BUDDY_AGE_GROUP}}/g, personality.ageGroup);
  appHtml = appHtml.replace(
    /{{BUDDY_PERSONALITY_JSON}}/g,
    JSON.stringify(personality).replace(/'/g, "\\'")
  );

  const outputPath = path.join(__dirname, `food-buddy-${id}.html`);
  fs.writeFileSync(outputPath, appHtml);
  console.log(`✓ food-buddy-${id}.html (${name})`);
}

console.log('\n✨ Done! All 45 food nutrition apps generated.');
console.log('\nNext steps:');
console.log('  1. cd /home/user/jamie-wigg');
console.log('  2. git add apps/food-buddy-*.html apps/food-buddy-personalities.js apps/food-buddy-vibes.js apps/food-app-template.html apps/generate-food-apps.mjs');
console.log('  3. git commit -m "Build complete 45-app food nutrition ecosystem"');
console.log('  4. python3 -m http.server 8000');
console.log('  5. Open http://localhost:8000/apps/food-buddy-1.html');
