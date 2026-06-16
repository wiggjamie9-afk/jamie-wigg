#!/usr/bin/env node
/**
 * patch-buddies-talk.mjs
 *
 * Makes all 50 buddy apps actually TALK with zero setup:
 *   1. No Claude API key? -> generate a warm local reply from the buddy's own
 *      personality (affirmations/greetings) instead of a dead-end alert.
 *   2. Insert localBuddyReply() helper (buddy-specific via BUDDY_CONFIG).
 *   3. Default the "Speak response aloud" checkbox to checked.
 *
 * The Claude-API path is left intact for users who DO paste a key.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const OLD_GUARD =
`      if (!claudeKey) {
        alert('Please set your Claude API key in Settings');
        return;
      }`;

const NEW_GUARD =
`      if (!claudeKey) {
        // Offline-first: no API key needed - reply locally and speak aloud.
        var localReply = localBuddyReply(userMessage);
        state.buddyData[BUDDY_ID].chat.push({ role: 'assistant', content: localReply });
        renderChat();
        saveState();
        if (document.getElementById('use-tts').checked) speakText(localReply);
        return;
      }`;

const HELPER =
`    // Local (offline, no-API-key) reply generator - uses this buddy's personality.
    function localBuddyReply(userMessage) {
      var p = (BUDDY_CONFIG && BUDDY_CONFIG.personality) || {};
      var affirmations = p.affirmations || ["You matter, and I am here with you."];
      var affirm = affirmations[Math.floor(Math.random() * affirmations.length)];
      var msg = (userMessage || "").trim();
      var openers = ["I hear you.", "Thank you for sharing that with me.", "I am really glad you told me.", "That sounds important.", "I am listening."];
      var opener = openers[Math.floor(Math.random() * openers.length)];
      var reflections = ["Tell me a little more about what is on your mind.", "What would feel most supportive right now?", "We can take this one small step at a time.", "How are you feeling about it as you say it out loud?", "I am here for as long as you need."];
      var reflect = reflections[Math.floor(Math.random() * reflections.length)];
      var echo = (msg.length > 0 && msg.length < 140) ? (' You said: "' + msg + '". ') : ' ';
      return opener + echo + reflect + ' Remember - ' + affirm;
    }

    // Send chat message`;

let patched = 0;
const failures = [];

for (let i = 1; i <= 50; i++) {
  const file = path.join(__dirname, `buddy-${i}.html`);
  let src = fs.readFileSync(file, 'utf8');
  const before = src;

  // 1 + 2: guard -> local reply, and inject helper before the "Send chat message" comment.
  if (src.includes(OLD_GUARD)) src = src.replace(OLD_GUARD, NEW_GUARD);
  if (src.includes('    // Send chat message')) src = src.replace('    // Send chat message', HELPER);

  // 3: default the speak-aloud checkbox to ON.
  src = src.replace('<input type="checkbox" id="use-tts">', '<input type="checkbox" id="use-tts" checked>');

  // Sanity: every required change landed.
  const ok =
    src.includes(NEW_GUARD) &&
    src.includes('function localBuddyReply(') &&
    src.includes('id="use-tts" checked') &&
    !src.includes("alert('Please set your Claude API key in Settings')");

  if (!ok) { failures.push(i); continue; }
  if (src !== before) { fs.writeFileSync(file, src); patched++; }
}

console.log(`Patched: ${patched}/50`);
if (failures.length) console.log(`FAILED: ${failures.join(', ')}`);
else console.log('All 50 patched cleanly.');
