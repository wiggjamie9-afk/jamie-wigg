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
  function tabOf(btn){ var m = (btn.getAttribute('onclick')||'').match(/switchTab\\('([^']+)'\\)/); return m ? m[1] : null; }
  // Tab buttons live either inside each screen (buddy apps) or in one shared
  // bar outside the screens (food apps). Prefer the active screen's buttons;
  // fall back to the global bar.
  function tabBtns(){
    var s = activeScreen();
    var inScreen = s ? s.querySelectorAll('.tab-btn') : [];
    if (inScreen.length) return Array.prototype.slice.call(inScreen);
    return Array.prototype.slice.call(document.querySelectorAll('.tab-btn'));
  }
  // Do the screen switch ourselves — robust, no reliance on the app's global
  // 'event' (which only exists during a real tap). Mirrors switchTab().
  function selfSwitch(tab, dir){
    var scr = document.getElementById('screen-' + tab); if (!scr) return false;
    document.querySelectorAll('.screen').forEach(function(s){ s.classList.remove('active'); });
    document.documentElement.style.setProperty('--af-dx', (dir > 0 ? 28 : -28) + 'px');
    scr.classList.add('active');
    // mark the matching tab button(s) active wherever they live
    document.querySelectorAll('.tab-btn').forEach(function(b){ b.classList.toggle('active', tabOf(b) === tab); });
    try { if (window.state) window.state.currentTab = tab; } catch(e){}
    syncDots(); return true;
  }
  function go(dir){
    var list = tabBtns(); if (!list.length) return;
    var cur = list.findIndex(function(b){ return b.classList.contains('active'); });
    if (cur < 0) cur = 0;
    var ni = cur + dir; if (ni < 0 || ni >= list.length) return;
    var tab = tabOf(list[ni]);
    if (tab) selfSwitch(tab, dir); else { list[ni].click(); syncDots(); }
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
  function boot(){ buildDots(); }
  if (document.readyState !== 'loading') boot();
  else { document.addEventListener('DOMContentLoaded', boot); window.addEventListener('load', boot); }
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
  const had = html.includes(MARKER);
  // update-safe: strip any previously injected block before re-injecting
  html = html.replace(/\s*<style id="af-carousel">[\s\S]*?<\/style>/g, '');
  html = html.replace(/\s*<script><!-- app-factory:carousel -->[\s\S]*?<\/script>/g, '');
  html = html.replace(/<\/head>/, `${CSS}\n</head>`);
  html = html.replace(/<\/body>/, `${JS}\n</body>`);
  writeFileSync(file, html);
  console.log(`${had ? '↻' : '✓'} ${slug}: swipe carousel + dots ${had ? 'updated' : 'added'}`);
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
