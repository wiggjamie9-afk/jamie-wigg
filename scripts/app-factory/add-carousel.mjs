#!/usr/bin/env node
/**
 * App Factory — carousel swipe injector
 * --------------------------------------------------------------------------
 * The buddy/food apps are already multi-screen (.screen + .tab-btn + switchTab)
 * but only switch on TAP. This adds 2026 "carousel" feel — swipe left/right to
 * move between screens, with a spring slide-in animation — WITHOUT touching the
 * existing DOM or logic. It's purely additive: if the swipe handler ever fails,
 * the tab buttons still work (graceful degradation).
 *
 * Mechanism: on a horizontal swipe, find the active screen's tab buttons,
 * locate the active one, and .click() its neighbour — so the app's own
 * switchTab() (which relies on event.target) runs exactly as on a real tap.
 *
 * Idempotent (marker-guarded).
 *
 * Usage:
 *   node scripts/app-factory/add-carousel.mjs                 # all buddy/food apps
 *   node scripts/app-factory/add-carousel.mjs buddy-1 food-buddy-3
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const APPS = join(ROOT, 'apps');
const MARKER = 'app-factory:carousel';

const CSS = `<style id="af-carousel"><!-- ${MARKER} -->
  .screen.active { animation: afCarIn .34s cubic-bezier(.22,.61,.36,1); }
  @keyframes afCarIn { from { opacity:.45; transform: translateX(var(--af-dx, 26px)); } to { opacity:1; transform:none; } }
  .af-dots { position: fixed; left:0; right:0; bottom: calc(env(safe-area-inset-bottom) + 8px); z-index: 60;
    display:flex; gap:6px; justify-content:center; pointer-events:none; }
  .af-dots i { width:6px; height:6px; border-radius:99px; background:rgba(0,0,0,.18); transition:all .25s; }
  .af-dots i.on { width:18px; background: var(--vibe-accent, #888); }
</style>`;

const JS = `<script><!-- ${MARKER} -->
(function(){
  if (window.__afCarousel) return; window.__afCarousel = true;
  function activeScreen(){ return document.querySelector('.screen.active'); }
  function tabBtns(){ var s = activeScreen(); return s ? Array.prototype.slice.call(s.querySelectorAll('.tab-btn')) : []; }
  function go(dir){
    var list = tabBtns(); if (!list.length) return;
    var cur = list.findIndex(function(b){ return b.classList.contains('active'); });
    if (cur < 0) cur = 0;
    var ni = cur + dir; if (ni < 0 || ni >= list.length) return;
    document.documentElement.style.setProperty('--af-dx', (dir > 0 ? 28 : -28) + 'px');
    list[ni].click(); syncDots();
  }
  // page dots reflecting active tab
  var dots;
  function buildDots(){
    var list = tabBtns(); if (!list.length) return;
    if (!dots){ dots = document.createElement('div'); dots.className = 'af-dots'; document.body.appendChild(dots); }
    dots.innerHTML = list.map(function(){ return '<i></i>'; }).join('');
    syncDots();
  }
  function syncDots(){
    if (!dots) return;
    var list = tabBtns();
    var cur = list.findIndex(function(b){ return b.classList.contains('active'); });
    Array.prototype.forEach.call(dots.children, function(d,i){ d.classList.toggle('on', i === cur); });
  }
  var x0=null, y0=null, t0=0;
  window.addEventListener('touchstart', function(e){ var t=e.changedTouches[0]; x0=t.clientX; y0=t.clientY; t0=Date.now(); }, {passive:true});
  window.addEventListener('touchend', function(e){
    if (x0==null) return; var t=e.changedTouches[0];
    var dx=t.clientX-x0, dy=t.clientY-y0, dt=Date.now()-t0;
    if (Math.abs(dx)>55 && Math.abs(dx)>Math.abs(dy)*1.6 && dt<700) go(dx<0?1:-1);
    x0=null;
  }, {passive:true});
  // keep dots in sync when tabs are tapped too
  window.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('.tab-btn')) setTimeout(syncDots, 0); }, true);
  if (document.readyState !== 'loading') buildDots();
  else document.addEventListener('DOMContentLoaded', buildDots);
})();
</script>`;

function processApp(slug) {
  const file = join(APPS, `${slug}.html`);
  if (!existsSync(file)) { console.error(`✗ ${slug}: not found`); return false; }
  let html = readFileSync(file, 'utf8');
  if (!/class="screen/.test(html) || !/switchTab/.test(html)) {
    console.log(`• ${slug}: not the screen/switchTab template — skipped`);
    return true;
  }
  if (html.includes(MARKER)) { console.log(`• ${slug}: already has carousel`); return true; }
  html = html.replace(/<\/head>/, `${CSS}\n</head>`);
  html = html.replace(/<\/body>/, `${JS}\n</body>`);
  writeFileSync(file, html);
  console.log(`✓ ${slug}: swipe carousel + dots added`);
  return true;
}

let targets = process.argv.slice(2);
if (!targets.length) {
  targets = readdirSync(APPS)
    .filter(f => /^(buddy-\d+|food-buddy-\d+)\.html$/.test(f))
    .map(f => f.replace(/\.html$/, ''));
}
let ok = true;
for (const t of targets) ok = processApp(t) && ok;
console.log(`\nCarousel pass: ${targets.length} app(s).`);
process.exit(ok ? 0 : 1);
