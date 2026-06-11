// Frame-by-frame renderer for HyperFrames-style GSAP compositions.
// Usage: node render-frames.mjs <composition-dir> <fps> <duration-seconds>
import { chromium } from '/home/user/jamie-wigg/node_modules/playwright/index.mjs';
import { mkdirSync } from 'node:fs';
import { resolve, join } from 'node:path';

const [dir, fpsArg, durArg] = process.argv.slice(2);
const fps = Number(fpsArg) || 30;
const duration = Number(durArg) || 18;
const totalFrames = Math.ceil(fps * duration);
const compDir = resolve(dir);
const framesDir = join(compDir, 'frames');
mkdirSync(framesDir, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--force-device-scale-factor=1'],
});
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
await page.goto('file://' + join(compDir, 'index.html'));

// Freeze the timeline so we control time explicitly. Scripts are synchronous,
// so gsap/tl exist as soon as 'load' fires — no rAF-based waiting (it never
// fires in this headless build).
const state = await page.evaluate(() => {
  gsap.ticker.lagSmoothing(0);
  tl.pause(0);
  return { gsap: gsap.version, dur: tl.duration() };
});
console.log('timeline ready:', JSON.stringify(state));

for (let f = 0; f < totalFrames; f++) {
  const t = f / fps;
  // Don't return tl from evaluate — serializing the timeline object hangs the protocol.
  await page.evaluate((time) => { tl.seek(time, false); return null; }, t);
  const name = String(f).padStart(4, '0');
  await page.screenshot({ path: join(framesDir, `f${name}.png`) });
  if (f % 60 === 0) console.log(`frame ${f}/${totalFrames}`);
}

await browser.close();
console.log(`DONE: ${totalFrames} frames -> ${framesDir}`);
