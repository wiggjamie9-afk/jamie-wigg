#!/usr/bin/env node
// Quick diagnostic: pings Replicate and ElevenLabs with the configured tokens
// and reports status. Use this after pasting tokens into settings.local.json.
//
//   node .claude/mcp/creative-stack/check.mjs

const REPLICATE = process.env.REPLICATE_API_TOKEN;
const ELEVEN = process.env.ELEVENLABS_API_KEY;

const G = (s) => `\x1b[32m${s}\x1b[0m`;
const Y = (s) => `\x1b[33m${s}\x1b[0m`;
const R = (s) => `\x1b[31m${s}\x1b[0m`;
const D = (s) => `\x1b[2m${s}\x1b[0m`;

const redact = (s) => (s ? `${s.slice(0, 5)}…${s.slice(-4)}` : "(empty)");

async function checkReplicate() {
  if (!REPLICATE) {
    console.log(`${Y("?")} Replicate: REPLICATE_API_TOKEN not set`);
    return false;
  }
  try {
    const res = await fetch("https://api.replicate.com/v1/account", {
      headers: { Authorization: `Token ${REPLICATE}` },
    });
    if (res.ok) {
      const data = await res.json();
      console.log(
        `${G("✓")} Replicate: ${data.username || data.name || "ok"} (${redact(REPLICATE)})`,
      );
      return true;
    }
    console.log(`${R("✗")} Replicate: HTTP ${res.status} (${redact(REPLICATE)})`);
    return false;
  } catch (e) {
    console.log(`${R("✗")} Replicate: ${e.message}`);
    return false;
  }
}

async function checkElevenLabs() {
  if (!ELEVEN) {
    console.log(`${Y("?")} ElevenLabs: ELEVENLABS_API_KEY not set`);
    return false;
  }
  try {
    const res = await fetch("https://api.elevenlabs.io/v1/user", {
      headers: { "xi-api-key": ELEVEN },
    });
    if (res.ok) {
      const data = await res.json();
      const tier = data.subscription?.tier || "free";
      const remaining =
        data.subscription?.character_limit && data.subscription?.character_count
          ? `${data.subscription.character_limit - data.subscription.character_count}/${data.subscription.character_limit} chars`
          : "";
      console.log(
        `${G("✓")} ElevenLabs: ${tier} tier (${redact(ELEVEN)}) ${D(remaining)}`,
      );
      return true;
    }
    console.log(`${R("✗")} ElevenLabs: HTTP ${res.status} (${redact(ELEVEN)})`);
    return false;
  } catch (e) {
    console.log(`${R("✗")} ElevenLabs: ${e.message}`);
    return false;
  }
}

const results = await Promise.all([checkReplicate(), checkElevenLabs()]);
console.log(D(`\nServer ready: ${results.every(Boolean) ? "yes" : "no — fill in missing tokens"}`));
process.exit(results.every(Boolean) ? 0 : 1);
