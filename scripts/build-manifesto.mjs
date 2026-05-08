import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

const W = 1280;
const H = 720;

const SOURCE_VIDEO = process.env.SOURCE_VIDEO || 'videos/rhythmix-studio-001.mp4';
const OUTPUT_NAME  = process.env.OUTPUT_NAME  || 'manifesto-new-world-60s.mp4';
const TMP_DIR = process.env.TMP_DIR || '/tmp/manifesto-overlays';
const OUT_DIR = 'videos';

await mkdir(TMP_DIR, { recursive: true });

function overlaySvg({ kicker, head, sub, accent, accentPosition = 'after' }) {
  // accentPosition controls which side of the heading the gradient word sits on.
  const headBlock = accent
    ? (accentPosition === 'before'
        ? `<tspan fill="url(#brand)">${accent}</tspan> ${head}`
        : `${head} <tspan fill="url(#brand)">${accent}</tspan>`)
    : head;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   stop-color="rgb(255,31,90)"/>
      <stop offset="50%"  stop-color="rgb(124,58,237)"/>
      <stop offset="100%" stop-color="rgb(0,216,255)"/>
    </linearGradient>
    <linearGradient id="band" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   stop-color="rgba(0,0,0,0)"/>
      <stop offset="40%"  stop-color="rgba(0,0,0,0.65)"/>
      <stop offset="100%" stop-color="rgba(0,0,0,0.95)"/>
    </linearGradient>
  </defs>
  <rect x="0" y="380" width="${W}" height="${H - 380}" fill="url(#band)"/>
  <text x="${W / 2}" y="490" fill="rgb(245,192,0)"     font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="22" letter-spacing="6"  text-anchor="middle">${kicker}</text>
  <text x="${W / 2}" y="566" fill="rgb(255,255,255)"   font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="60" letter-spacing="-1" text-anchor="middle">${headBlock}</text>
  <text x="${W / 2}" y="618" fill="rgb(220,220,230)"   font-family="Arial, Helvetica, sans-serif" font-weight="600" font-size="24" text-anchor="middle">${sub}</text>
  <text x="${W / 2}" y="676" fill="rgb(160,160,176)"   font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="16" letter-spacing="4" text-anchor="middle">RHYTHMIXAPP.COM.AU/STUDIO</text>
</svg>`;
}

// 6 scenes · 60 seconds · manifesto / paradigm-shift framing
const slides = [
  { t: [0,  10], svg: overlaySvg({ kicker: 'THE OLD WORLD', head: 'Music had',           accent: 'gatekeepers.', sub: 'For 50 years.' }) },
  { t: [10, 22], svg: overlaySvg({ kicker: 'THE BARRIERS',  head: 'Labels. Studios.',    accent: 'Years.',       sub: 'Six-figure budgets to ship a music video.' }) },
  { t: [22, 35], svg: overlaySvg({ kicker: 'THE SHIFT',     head: 'Then AI',             accent: 'happened.',    sub: 'And the gatekeepers started to fall.' }) },
  { t: [35, 47], svg: overlaySvg({ kicker: 'THE NEW WAY',   head: 'One artist.',         accent: 'One night.',   sub: 'A cinematic music video. From your phone.' }) },
  { t: [47, 55], svg: overlaySvg({ kicker: 'INTRODUCING',   head: 'RHYTHMIX',            accent: 'Studio.',      sub: 'The new world order in music.' }) },
  { t: [55, 60], svg: overlaySvg({ kicker: 'AVAILABLE NOW', head: '$149.',               accent: 'Lifetime.',    sub: 'rhythmixapp.com.au/studio' }) },
];

for (let i = 0; i < slides.length; i++) {
  const path = join(TMP_DIR, `overlay-${i}.png`);
  await sharp(Buffer.from(slides[i].svg))
    .resize(W, H, { fit: 'fill' })
    .png()
    .toFile(path);
  slides[i].path = path;
  console.log(`Rendered overlay ${i + 1}/${slides.length}`);
}

let chain = '';
let prev = '0:v';
for (let i = 0; i < slides.length; i++) {
  const [start, end] = slides[i].t;
  const next = i === slides.length - 1 ? 'final' : `tmp${i}`;
  chain += `[${prev}][${i + 1}:v] overlay=enable='between(t,${start},${end})' [${next}]; `;
  prev = next;
}
chain = chain.replace(/; $/, '');

const inputArgs = ['-i', SOURCE_VIDEO];
slides.forEach((s) => inputArgs.push('-i', s.path));

await mkdir(OUT_DIR, { recursive: true });

const ffmpegArgs = [
  '-y',
  ...inputArgs,
  '-filter_complex', chain,
  '-map', '[final]',
  '-map', '0:a?',
  '-c:v', 'libx264',
  '-preset', 'medium',
  '-crf', '20',
  '-pix_fmt', 'yuv420p',
  '-c:a', 'aac',
  '-b:a', '128k',
  '-t', '60',
  join(OUT_DIR, OUTPUT_NAME),
];

await new Promise((resolve, reject) => {
  const p = spawn('ffmpeg', ffmpegArgs, { stdio: ['ignore', 'pipe', 'pipe'] });
  let stderr = '';
  p.stderr.on('data', (d) => (stderr += d.toString()));
  p.on('close', (code) => {
    if (code === 0) {
      console.log(`✓ Built ${OUT_DIR}/${OUTPUT_NAME}`);
      resolve();
    } else {
      console.error(stderr.slice(-2000));
      reject(new Error(`ffmpeg exited ${code}`));
    }
  });
});
