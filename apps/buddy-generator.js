/**
 * Buddy Generator — turns a personality spec into a REAL, standalone,
 * openable companion app. No mockup, no setTimeout theatre.
 *
 * Run in Node to emit an actual .html file:
 *   node buddy-generator.js spec.json out.html
 *
 * Or in the browser: BuddyGenerator.generateApp(spec) -> HTML string.
 *
 * The produced app:
 *   - is a single self-contained HTML file (no external deps)
 *   - has a working chat UI
 *   - calls the real Claude API with the user's own key (entered in-app)
 *   - has real crisis detection with real resources
 *   - persists conversation + key in localStorage (offline-friendly)
 *
 * Design note: the GENERATED app deliberately uses string concatenation
 * (no backticks / no ${}) in its inline JS, so it never collides with this
 * generator's own template handling. That's why the code below builds the
 * file by pushing strings into an array and joining — boring on purpose,
 * which is what makes it reliable.
 */

const CRISIS_TERMS = [
  'suicide', 'kill myself', 'end my life', 'self-harm', 'self harm',
  'hurt myself', 'want to die', "don't want to live", 'no reason to live',
];

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildSystemPrompt(spec, style) {
  const toneByStyle = {
    conservative: 'Be reliable, grounded, and professional. Prefer proven, careful guidance.',
    bold: 'Be direct, confident, and candid. Challenge assumptions kindly. Get to the point.',
    playful: 'Be warm, light, and encouraging. Use gentle humour. Keep it human and approachable.',
  };
  const traits = Array.isArray(spec.traits) ? spec.traits.join(', ') : String(spec.traits || '');
  return [
    'You are ' + spec.name + ', a ' + spec.role + '.',
    'Your personality: ' + traits + '.',
    'Your purpose: ' + spec.purpose + '.',
    toneByStyle[style] || toneByStyle.conservative,
    'Keep replies concise (2-4 sentences unless asked for more).',
    'You are a supportive companion, not a licensed professional. Do not diagnose or prescribe.',
    'If someone is in crisis or talking about self-harm, gently encourage them to reach out to a crisis line and share the resources shown in the app.',
  ].join(' ');
}

function generateApp(spec) {
  const style = spec.style || 'conservative';
  const accent = spec.color || '#7c3aed';
  const emoji = spec.emoji || '🤖';
  const name = spec.name || 'Buddy';
  const role = spec.role || 'AI Companion';
  const systemPrompt = buildSystemPrompt(spec, style);

  // backend: 'claude' (cloud, needs key) or 'ollama' (local on your Mac, no key)
  const backend = spec.backend === 'ollama' ? 'ollama' : 'claude';
  const ollamaModel = spec.ollamaModel || 'llama3.2';

  // Config the app reads at runtime. JSON.stringify is safe (no backticks).
  const config = JSON.stringify({
    name, emoji, role, accent,
    backend,
    model: 'claude-3-5-sonnet-20241022',
    ollamaModel,
    ollamaEndpoint: 'http://localhost:11434/api/chat',
    systemPrompt,
    crisisTerms: CRISIS_TERMS,
    storageKey: 'buddy_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
  });

  const L = [];
  L.push('<!DOCTYPE html>');
  L.push('<html lang="en">');
  L.push('<head>');
  L.push('<meta charset="UTF-8">');
  L.push('<meta name="viewport" content="width=device-width, initial-scale=1.0">');
  L.push('<title>' + esc(name) + ' — ' + esc(role) + '</title>');
  L.push('<style>');
  L.push(':root{--accent:' + accent + ';}');
  L.push('*{margin:0;padding:0;box-sizing:border-box;}');
  L.push("body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#0a0e1a;color:#f4f7fc;height:100vh;display:flex;flex-direction:column;}");
  L.push('header{padding:16px 20px;background:rgba(255,255,255,0.04);border-bottom:1px solid rgba(255,255,255,0.1);display:flex;align-items:center;gap:12px;}');
  L.push('header .emoji{font-size:32px;}');
  L.push('header .name{font-weight:700;font-size:18px;}');
  L.push('header .role{font-size:12px;color:#b0b8c6;}');
  L.push('#crisis{display:none;margin:12px 20px;padding:12px 16px;border-radius:10px;background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.4);font-size:13px;color:#fca5a5;}');
  L.push('#crisis a{color:#fff;}');
  L.push('#chat{flex:1;overflow-y:auto;padding:20px;display:flex;flex-direction:column;gap:12px;}');
  L.push('.msg{max-width:78%;padding:10px 14px;border-radius:14px;font-size:14px;line-height:1.5;white-space:pre-wrap;}');
  L.push('.msg.user{align-self:flex-end;background:var(--accent);color:#fff;border-bottom-right-radius:4px;}');
  L.push('.msg.bot{align-self:flex-start;background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-bottom-left-radius:4px;}');
  L.push('.composer{padding:14px 20px;border-top:1px solid rgba(255,255,255,0.1);display:flex;gap:10px;background:rgba(255,255,255,0.02);}');
  L.push('#input{flex:1;padding:12px 14px;border-radius:10px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.04);color:#f4f7fc;font-size:14px;font-family:inherit;}');
  L.push('#input:focus{outline:none;border-color:var(--accent);}');
  L.push('button{padding:12px 18px;border:none;border-radius:10px;background:var(--accent);color:#fff;font-weight:600;cursor:pointer;}');
  L.push('button:disabled{opacity:0.5;cursor:default;}');
  L.push('.setup{padding:12px 20px;background:rgba(255,255,255,0.02);border-top:1px solid rgba(255,255,255,0.08);font-size:12px;color:#b0b8c6;display:flex;gap:8px;align-items:center;}');
  L.push('.setup input{flex:1;padding:8px 10px;border-radius:8px;border:1px solid rgba(255,255,255,0.15);background:rgba(255,255,255,0.04);color:#f4f7fc;font-size:12px;}');
  L.push('</style>');
  L.push('</head>');
  L.push('<body>');
  L.push('<header><span class="emoji">' + esc(emoji) + '</span><div><div class="name">' + esc(name) + '</div><div class="role">' + esc(role) + '</div></div></header>');
  L.push('<div id="crisis">It sounds like you may be going through something serious. You deserve support right now. <strong>Call or text 988</strong> (US Suicide &amp; Crisis Lifeline), text HOME to 741741, or find a line near you at <a href="https://findahelpline.com" target="_blank" rel="noopener">findahelpline.com</a>.</div>');
  L.push('<div id="chat"></div>');
  L.push('<div class="composer"><input id="input" placeholder="Message ' + esc(name) + '..." autocomplete="off"><button id="send">Send</button></div>');
  if (backend === 'ollama') {
    L.push('<div class="setup"><span>🔒 Running locally on your Mac via Ollama (model: ' + esc(ollamaModel) + ') — nothing sent to any server.</span></div>');
  } else {
    L.push('<div class="setup"><span>Claude API key:</span><input id="apikey" type="password" placeholder="sk-ant-..."><button id="savekey" style="padding:8px 12px;font-size:12px;">Save</button></div>');
  }

  // ---- inline app script: NO backticks, NO ${ } — pure concatenation ----
  L.push('<script>');
  L.push('var CONFIG = ' + config + ';');
  L.push('var chat = document.getElementById("chat");');
  L.push('var input = document.getElementById("input");');
  L.push('var sendBtn = document.getElementById("send");');
  L.push('var messages = [];');
  L.push('function load(){');
  L.push('  try{ messages = JSON.parse(localStorage.getItem(CONFIG.storageKey)) || []; }catch(e){ messages = []; }');
  L.push('  if(CONFIG.backend === "claude"){ var k = localStorage.getItem(CONFIG.storageKey + "_key"); if(k){ document.getElementById("apikey").value = k; } }');
  L.push('  if(messages.length === 0){ addBot("Hi, I\\u2019m " + CONFIG.name + ". " + "How can I help you today?", false); }');
  L.push('  else { messages.forEach(function(m){ render(m.role, m.content); }); }');
  L.push('}');
  L.push('function save(){ localStorage.setItem(CONFIG.storageKey, JSON.stringify(messages)); }');
  L.push('function render(role, content){');
  L.push('  var d = document.createElement("div"); d.className = "msg " + (role === "user" ? "user" : "bot"); d.textContent = content; chat.appendChild(d); chat.scrollTop = chat.scrollHeight;');
  L.push('}');
  L.push('function addUser(t){ messages.push({role:"user",content:t}); render("user",t); save(); }');
  L.push('function addBot(t, store){ if(store !== false){ messages.push({role:"assistant",content:t}); } render("assistant",t); save(); }');
  L.push('function checkCrisis(t){');
  L.push('  var low = t.toLowerCase(); var hit = CONFIG.crisisTerms.some(function(term){ return low.indexOf(term) !== -1; });');
  L.push('  if(hit){ document.getElementById("crisis").style.display = "block"; }');
  L.push('  return hit;');
  L.push('}');
  L.push('function apiMessages(){ return messages.map(function(m){ return {role: m.role === "user" ? "user" : "assistant", content: m.content}; }); }');
  L.push('async function callClaude(){');
  L.push('  var key = localStorage.getItem(CONFIG.storageKey + "_key");');
  L.push('  if(!key){ addBot("Please add your Claude API key below to enable replies.", false); return; }');
  L.push('  var res = await fetch("https://api.anthropic.com/v1/messages", {');
  L.push('    method:"POST",');
  L.push('    headers:{"Content-Type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},');
  L.push('    body: JSON.stringify({ model: CONFIG.model, max_tokens: 1024, system: CONFIG.systemPrompt, messages: apiMessages() })');
  L.push('  });');
  L.push('  var data = await res.json();');
  L.push('  if(data.content && data.content[0]){ addBot(data.content[0].text); }');
  L.push('  else if(data.error){ addBot("Error: " + data.error.message, false); }');
  L.push('  else { addBot("Sorry, I could not generate a reply.", false); }');
  L.push('}');
  L.push('async function callOllama(){');
  L.push('  var msgs = [{role:"system",content:CONFIG.systemPrompt}].concat(apiMessages());');
  L.push('  var res = await fetch(CONFIG.ollamaEndpoint, {');
  L.push('    method:"POST",');
  L.push('    headers:{"Content-Type":"application/json"},');
  L.push('    body: JSON.stringify({ model: CONFIG.ollamaModel, messages: msgs, stream: false })');
  L.push('  });');
  L.push('  var data = await res.json();');
  L.push('  if(data.message && data.message.content){ addBot(data.message.content); }');
  L.push('  else if(data.error){ addBot("Ollama error: " + data.error + " (is Ollama running? try: ollama run " + CONFIG.ollamaModel + ")", false); }');
  L.push('  else { addBot("No reply from local model.", false); }');
  L.push('}');
  L.push('async function callModel(){');
  L.push('  sendBtn.disabled = true;');
  L.push('  try{ if(CONFIG.backend === "ollama"){ await callOllama(); } else { await callClaude(); } }');
  L.push('  catch(e){ addBot("Connection error: " + e.message, false); }');
  L.push('  sendBtn.disabled = false;');
  L.push('}');
  L.push('function send(){');
  L.push('  var t = input.value.trim(); if(!t) return; input.value = "";');
  L.push('  addUser(t); checkCrisis(t); callModel();');
  L.push('}');
  L.push('sendBtn.addEventListener("click", send);');
  L.push('input.addEventListener("keydown", function(e){ if(e.key === "Enter"){ send(); } });');
  L.push('var saveKeyBtn = document.getElementById("savekey");');
  L.push('if(saveKeyBtn){ saveKeyBtn.addEventListener("click", function(){');
  L.push('  var k = document.getElementById("apikey").value.trim();');
  L.push('  localStorage.setItem(CONFIG.storageKey + "_key", k); addBot("API key saved. Ready to chat.", false);');
  L.push('}); }');
  L.push('load();');
  L.push('<\/script>');
  L.push('</body>');
  L.push('</html>');
  return L.join('\n');
}

const api = { generateApp, buildSystemPrompt, CRISIS_TERMS };

if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;

  // CLI: node buddy-generator.js spec.json out.html
  if (require.main === module) {
    const fs = require('fs');
    const specPath = process.argv[2];
    const outPath = process.argv[3] || 'buddy-app.html';
    if (!specPath) {
      console.error('Usage: node buddy-generator.js <spec.json> <out.html>');
      process.exit(1);
    }
    const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
    const html = generateApp(spec);
    fs.writeFileSync(outPath, html);
    console.log('Generated ' + outPath + ' (' + html.length + ' bytes)');
  }
}
if (typeof window !== 'undefined') { window.BuddyGenerator = api; }
