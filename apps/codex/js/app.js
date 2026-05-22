// App controller. Wires every module into the DOM and switches between views.

import { CoherenceEngine } from './coherence-engine.js';
import { BreathPacer } from './breath-pacer.js';
import { FrequencyPlayer, SOLFEGGIO } from './frequency-player.js';
import { ProtocolPlayer } from './protocol-player.js';
import { Streak } from './streak.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const views = {
  welcome: $('#view-welcome'),
  demo: $('#view-demo'),
  protocols: $('#view-protocols'),
  player: $('#view-player'),
  frequency: $('#view-frequency'),
};

function go(name) {
  Object.entries(views).forEach(([k, el]) => el.classList.toggle('active', k === name));
  window.scrollTo({ top: 0, behavior: 'instant' });
}

// ----- Welcome -----
$('#go-demo').addEventListener('click', () => go('demo'));
$('#go-protocols').addEventListener('click', () => { renderProtocols(); go('protocols'); });
$('#go-frequency').addEventListener('click', () => go('frequency'));

renderStreak();

// ----- Coherence demo -----
const demoOrb = $('#demo-orb');
const demoHeart = $('#demo-heart');
const demoCue = $('#demo-cue');
const demoCoh = $('#demo-coherence');
const demoBpm = $('#demo-bpm');
const demoRmssd = $('#demo-rmssd');
const demoStatus = $('#demo-status');

let demoEngine = null;
let demoPacer = null;
let demoPulseFallback = null;

$('#demo-start').addEventListener('click', async () => {
  $('#demo-start').disabled = true;
  $('#demo-stop').disabled = false;

  demoPacer = new BreathPacer(demoOrb, demoCue);
  demoPacer.start();

  demoEngine = new CoherenceEngine();
  demoEngine.on('beat', () => {
    demoHeart.classList.remove('beat');
    void demoHeart.offsetWidth;
    demoHeart.classList.add('beat');
  });
  demoEngine.on('metrics', (m) => {
    demoCoh.textContent = m.coherence;
    demoBpm.textContent = m.bpm || '—';
    demoRmssd.textContent = m.rmssd || '—';
    demoOrb.classList.toggle('in-sync', m.coherence >= 50);
  });
  demoEngine.on('status', (s) => {
    demoStatus.textContent = s.message || '';
    demoStatus.classList.toggle('warn', s.state === 'error');
  });

  try {
    await demoEngine.start();
    demoPulseFallback = setTimeout(() => {
      if (demoEngine.metrics.bpm === 0) {
        demoStatus.textContent = 'NO PULSE YET · KEEP YOUR FINGER STILL';
      }
    }, 8000);
  } catch {
    stopDemo();
  }
});

$('#demo-stop').addEventListener('click', stopDemo);
$('#demo-back').addEventListener('click', () => { stopDemo(); go('welcome'); });

function stopDemo() {
  if (demoEngine) { demoEngine.stop(); demoEngine = null; }
  if (demoPacer) { demoPacer.stop(); demoPacer = null; }
  if (demoPulseFallback) { clearTimeout(demoPulseFallback); demoPulseFallback = null; }
  demoCoh.textContent = '0';
  demoBpm.textContent = '—';
  demoRmssd.textContent = '—';
  demoStatus.textContent = '';
  demoStatus.classList.remove('warn', 'ok');
  demoOrb.classList.remove('in-sync');
  $('#demo-start').disabled = false;
  $('#demo-stop').disabled = true;
}

// ----- Protocols list -----
let protocols = [];

async function loadProtocols() {
  if (protocols.length) return protocols;
  const res = await fetch('./data/protocols.json');
  const json = await res.json();
  protocols = json.protocols;
  return protocols;
}

async function renderProtocols() {
  const list = $('#protocol-list');
  list.innerHTML = '';
  const items = await loadProtocols();
  items.forEach(p => {
    const btn = document.createElement('button');
    btn.className = 'protocol-card';
    btn.innerHTML = `
      <div class="cat">${p.vertical} · ${p.category}</div>
      <div class="name">${p.title}</div>
      <div class="meta">${Math.round(p.durationSeconds / 60)} min · ${p.breath.inhale}-${p.breath.hold}-${p.breath.exhale}${p.breath.holdOut ? '-' + p.breath.holdOut : ''} · ${p.frequencyHz} Hz</div>
    `;
    btn.addEventListener('click', () => startProtocol(p));
    list.appendChild(btn);
  });
}

$('#protocols-back').addEventListener('click', () => go('welcome'));

// ----- Player -----
const playerOrb = $('#player-orb');
const playerHeart = $('#player-heart');
const playerCue = $('#player-cue');
const playerStatus = $('#player-status');
const playerCoh = $('#player-coherence');
const playerBpm = $('#player-bpm');
const playerRmssd = $('#player-rmssd');
const playerTitle = $('#player-title');
const playerDesc = $('#player-desc');

let playerEngine = null;
let player = null;

async function startProtocol(p) {
  playerTitle.textContent = p.title;
  playerDesc.textContent = p.description;
  go('player');

  playerEngine = new CoherenceEngine();
  playerEngine.on('beat', () => {
    playerHeart.classList.remove('beat');
    void playerHeart.offsetWidth;
    playerHeart.classList.add('beat');
  });
  playerEngine.on('metrics', (m) => {
    playerCoh.textContent = m.coherence;
    playerBpm.textContent = m.bpm || '—';
    playerRmssd.textContent = m.rmssd || '—';
    playerOrb.classList.toggle('in-sync', m.coherence >= 50);
  });
  playerEngine.on('status', (s) => { playerStatus.textContent = s.message || ''; });

  const freq = new FrequencyPlayer();

  player = new ProtocolPlayer({
    orbEl: playerOrb,
    cueEl: playerCue,
    statusEl: playerStatus,
    coherenceEngine: playerEngine,
    frequencyPlayer: freq,
  });

  try { await playerEngine.start(); } catch {}
  player.play(p, ({ streak, ticked }) => {
    playerStatus.textContent = ticked
      ? `STREAK · ${streak.current} DAY${streak.current === 1 ? '' : 'S'}`
      : 'SESSION LOGGED';
    playerStatus.classList.add('ok');
    renderStreak();
  });
}

$('#player-stop').addEventListener('click', () => {
  if (player) player.stop();
  if (playerEngine) playerEngine.stop();
  go('protocols');
});

// ----- Frequency player -----
const freqUI = new FrequencyPlayer();
let activeSolf = 0;
let activeBeat = 0;

const solfRow = $('#solf-row');
SOLFEGGIO.forEach(hz => {
  const b = document.createElement('button');
  b.className = 'freq-btn';
  b.textContent = `${hz} Hz`;
  b.addEventListener('click', async () => {
    if (activeSolf === hz) {
      await freqUI.setSolfeggio(0);
      activeSolf = 0;
    } else {
      await freqUI.setSolfeggio(hz);
      activeSolf = hz;
    }
    $$('.freq-btn', solfRow).forEach(el => el.classList.toggle('active', el.textContent === `${activeSolf} Hz`));
  });
  solfRow.appendChild(b);
});

const beatRow = $('#beat-row');
[{ name: 'Delta · 2 Hz', hz: 2 }, { name: 'Theta · 6 Hz', hz: 6 }, { name: 'Alpha · 10 Hz', hz: 10 }, { name: 'Schumann · 7.83 Hz', hz: 7.83 }].forEach(p => {
  const b = document.createElement('button');
  b.className = 'freq-btn';
  b.textContent = p.name;
  b.addEventListener('click', async () => {
    if (activeBeat === p.hz) {
      await freqUI.setBinaural(0, 0);
      activeBeat = 0;
    } else {
      await freqUI.setBinaural(220, p.hz);
      activeBeat = p.hz;
    }
    $$('.freq-btn', beatRow).forEach(el => el.classList.toggle('active', el.textContent === p.name && activeBeat === p.hz));
  });
  beatRow.appendChild(b);
});

$('#freq-stop').addEventListener('click', () => {
  freqUI.stop();
  activeSolf = 0;
  activeBeat = 0;
  $$('.freq-btn').forEach(el => el.classList.remove('active'));
});

$('#freq-back').addEventListener('click', () => {
  freqUI.stop();
  activeSolf = 0;
  activeBeat = 0;
  $$('.freq-btn').forEach(el => el.classList.remove('active'));
  go('welcome');
});

// ----- Streak ring -----
function renderStreak() {
  const s = Streak.load();
  const ring = $('#streak-ring');
  ring.textContent = s.current;
  ring.classList.toggle('met', Streak.metToday());
  $('#streak-longest').textContent = s.longest;
  $('#streak-total').textContent = s.totalSessions;
}

// ----- Service worker -----
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}
