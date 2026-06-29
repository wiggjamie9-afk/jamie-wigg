// Dependency-free PNG icon generator.
//
// Produces REAL .png files (the recurring gap across the portfolio — many apps
// declare icon paths that don't exist, or fake it with emoji data-URIs). Uses
// only Node's built-in zlib; no Pillow / ImageMagick / canvas needed.
//
// Output: app/icons/icon-192.png, icon-512.png, icon-maskable-512.png
//
// Run: node store-template/scripts/gen-icons.mjs
//
// The mark is a white "</>" on the brand gradient. Tweak BRAND / GLYPH to
// rebrand for a different Pro app.

import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, "..", "app", "icons");

// Brand palette (CodeMentor indigo→violet). RGB.
const BRAND_TOP = [99, 102, 241]; // indigo-500
const BRAND_BOT = [139, 92, 246]; // violet-500
const GLYPH = [255, 255, 255];

// ---- tiny RGBA canvas ------------------------------------------------------

function canvas(size) {
  return { size, buf: new Uint8Array(size * size * 4) };
}
function px(c, x, y, [r, g, b], a = 255) {
  if (x < 0 || y < 0 || x >= c.size || y >= c.size) return;
  const i = (y * c.size + x) * 4;
  c.buf[i] = r; c.buf[i + 1] = g; c.buf[i + 2] = b; c.buf[i + 3] = a;
}
function fillGradient(c, top, bot) {
  for (let y = 0; y < c.size; y++) {
    const t = y / (c.size - 1);
    const col = [
      Math.round(top[0] + (bot[0] - top[0]) * t),
      Math.round(top[1] + (bot[1] - top[1]) * t),
      Math.round(top[2] + (bot[2] - top[2]) * t),
    ];
    for (let x = 0; x < c.size; x++) px(c, x, y, col);
  }
}
// Thick line by stamping filled squares along the segment.
function stroke(c, x0, y0, x1, y1, w, col) {
  const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0)) * 2;
  const half = Math.floor(w / 2);
  for (let s = 0; s <= steps; s++) {
    const t = s / steps;
    const cx = Math.round(x0 + (x1 - x0) * t);
    const cy = Math.round(y0 + (y1 - y0) * t);
    for (let dy = -half; dy <= half; dy++)
      for (let dx = -half; dx <= half; dx++) px(c, cx + dx, cy + dy, col);
  }
}

// Draw "</>": left chevron, slash, right chevron — scaled to the canvas.
function drawGlyph(c) {
  const S = c.size;
  const w = Math.max(2, Math.round(S * 0.05)); // stroke width
  const midY = S * 0.5;
  const topY = S * 0.34;
  const botY = S * 0.66;
  // Left chevron "<"
  stroke(c, S * 0.34, midY, S * 0.22, topY + (botY - topY) / 2, w, GLYPH); // upper -> tip
  const lx = S * 0.2, lyTip = midY;
  stroke(c, S * 0.34, topY, lx, lyTip, w, GLYPH);
  stroke(c, S * 0.34, botY, lx, lyTip, w, GLYPH);
  // Right chevron ">"
  const rx = S * 0.8;
  stroke(c, S * 0.66, topY, rx, midY, w, GLYPH);
  stroke(c, S * 0.66, botY, rx, midY, w, GLYPH);
  // Slash "/"
  stroke(c, S * 0.56, topY - S * 0.02, S * 0.44, botY + S * 0.02, w, GLYPH);
}

// ---- PNG encoder (RGBA, 8-bit, no interlace) -------------------------------

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();
function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}
function chunk(type, data) {
  const typeBuf = Buffer.from(type, "ascii");
  const body = Buffer.concat([typeBuf, data]);
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}
function encodePng(c) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(c.size, 0);
  ihdr.writeUInt32BE(c.size, 4);
  ihdr[8] = 8;   // bit depth
  ihdr[9] = 6;   // color type RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
  // raw scanlines, filter byte 0 per row
  const stride = c.size * 4;
  const raw = Buffer.alloc((stride + 1) * c.size);
  for (let y = 0; y < c.size; y++) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(c.buf.buffer, y * stride, stride).copy(raw, y * (stride + 1) + 1);
  }
  const idat = deflateSync(raw, { level: 9 });
  return Buffer.concat([sig, chunk("IHDR", ihdr), chunk("IDAT", idat), chunk("IEND", Buffer.alloc(0))]);
}

// ---- build -----------------------------------------------------------------

function makeIcon(size, { maskable } = {}) {
  const c = canvas(size);
  fillGradient(c, BRAND_TOP, BRAND_BOT);
  // Maskable icons need the mark inside the ~80% safe zone; the full-bleed
  // gradient already satisfies the bleed requirement, so we just keep the
  // glyph centered (it sits within the inner 60%, well inside the safe zone).
  drawGlyph(c);
  return encodePng(c);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(join(OUT_DIR, "icon-192.png"), makeIcon(192));
writeFileSync(join(OUT_DIR, "icon-512.png"), makeIcon(512));
writeFileSync(join(OUT_DIR, "icon-maskable-512.png"), makeIcon(512, { maskable: true }));
console.log("Wrote icon-192.png, icon-512.png, icon-maskable-512.png to", OUT_DIR);
