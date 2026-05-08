import sharp from 'sharp';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

function thumbSvg({ W, H, layout }) {
  const cx = W / 2;
  const cy = H / 2;

  const s = layout === 'wide'
    ? {
        badge: 22, title: 132, sub: 24, tag: 30, foot: 14, badgeW: 360,
        gapBadge: -180, gapTitle: -20, gapSub: 60, gapTag: 130,
        stacked: false,
      }
    : layout === 'square'
      ? {
          badge: 24, title: 124, sub: 26, tag: 36, foot: 16, badgeW: 400,
          gapBadge: -240, gapTitle: -20, gapSub: 70, gapTag: 150,
          stacked: false,
        }
      : {
          badge: 22, title: 124, sub: 22, tag: 30, foot: 13, badgeW: 360,
          gapBadge: -360, gapTitleA: -90, gapTitleB: 50, gapSub: 160, gapTag: 230,
          stacked: true,
        };

  const titleMarkup = s.stacked
    ? `<text x="${cx}" y="${cy + s.gapTitleA}" fill="rgb(255,255,255)" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${s.title}" letter-spacing="-3" text-anchor="middle">RHYTHMIX</text>
       <text x="${cx}" y="${cy + s.gapTitleB}" fill="url(#brand)" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${s.title}" letter-spacing="-3" text-anchor="middle">Studio</text>`
    : `<text x="${cx}" y="${cy + s.gapTitle}" fill="rgb(255,255,255)" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${s.title}" letter-spacing="-3" text-anchor="middle">RHYTHMIX <tspan fill="url(#brand)">Studio</tspan></text>`;

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="rgb(124,58,237)" stop-opacity="0.4"/>
      <stop offset="70%" stop-color="rgb(0,0,0)" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow1" cx="50%" cy="0%" r="70%">
      <stop offset="0%" stop-color="rgb(255,31,90)" stop-opacity="0.32"/>
      <stop offset="55%" stop-color="rgb(0,0,0)" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="100%" cy="100%" r="60%">
      <stop offset="0%" stop-color="rgb(0,216,255)" stop-opacity="0.25"/>
      <stop offset="55%" stop-color="rgb(0,0,0)" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="brand" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgb(255,31,90)"/>
      <stop offset="50%" stop-color="rgb(124,58,237)"/>
      <stop offset="100%" stop-color="rgb(0,216,255)"/>
    </linearGradient>
    <linearGradient id="badgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="rgb(245,192,0)"/>
      <stop offset="100%" stop-color="rgb(255,136,0)"/>
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 L 0 48" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="100%" height="100%" fill="rgb(0,0,0)"/>
  <rect width="100%" height="100%" fill="url(#grid)" opacity="0.6"/>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <rect width="100%" height="100%" fill="url(#glow1)"/>
  <rect width="100%" height="100%" fill="url(#glow2)"/>

  <g transform="translate(${cx}, ${cy + s.gapBadge})">
    <rect x="${-s.badgeW / 2}" y="-26" width="${s.badgeW}" height="52" rx="26" fill="url(#badgeGrad)"/>
    <text x="0" y="8" fill="rgb(0,0,0)" font-family="Arial, Helvetica, sans-serif" font-weight="900" font-size="${s.badge}" letter-spacing="3" text-anchor="middle">$149 · LIFETIME ACCESS</text>
  </g>

  ${titleMarkup}

  <text x="${cx}" y="${cy + s.gapSub}" fill="rgb(160,160,176)" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${s.sub}" letter-spacing="6" text-anchor="middle">AI MUSIC VIDEO GENERATOR</text>

  <text x="${cx}" y="${cy + s.gapTag}" fill="rgb(255,255,255)" font-family="Arial, Helvetica, sans-serif" font-weight="700" font-size="${s.tag}" text-anchor="middle">Your music. <tspan fill="url(#brand)">As a movie.</tspan></text>

  <text x="${cx}" y="${H - 40}" fill="rgb(85,85,85)" font-family="Arial, Helvetica, sans-serif" font-weight="800" font-size="${s.foot}" letter-spacing="4" text-anchor="middle">RHYTHMIXAPP.COM.AU</text>
</svg>`;
}

const variants = [
  { name: 'rhythmix-thumbnail-16-9.png',     W: 1280, H: 720,  layout: 'wide' },
  { name: 'rhythmix-thumbnail-square.png',   W: 1080, H: 1080, layout: 'square' },
  { name: 'rhythmix-thumbnail-vertical.png', W: 720,  H: 1280, layout: 'vertical' },
];

const outDir = path.resolve('thumbnails');
await mkdir(outDir, { recursive: true });

for (const v of variants) {
  const svg = thumbSvg({ W: v.W, H: v.H, layout: v.layout });
  await sharp(Buffer.from(svg))
    .resize(v.W * 2, v.H * 2, { fit: 'fill' })
    .png({ quality: 95 })
    .toFile(path.join(outDir, v.name));
  console.log('Generated:', v.name, `(${v.W * 2}x${v.H * 2})`);
}
