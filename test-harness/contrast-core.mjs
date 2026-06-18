/**
 * Shared contrast analysis — used by the lint (contrast.mjs) and the
 * corrector (scripts/app-factory/fix-contrast.mjs) so they agree exactly.
 * Models a light cascade (per-selector, !important + later-wins) and flags
 * only the "invisible text" disaster: opaque text that vanishes into an opaque
 * surface (both light, or both dark) with a poor ratio.
 */
export const FAIL_BELOW = 2.5;

export function hexToRgb(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  let a = 1;
  if (h.length === 8) { a = parseInt(h.slice(6, 8), 16) / 255; h = h.slice(0, 6); }
  if (h.length !== 6) return null;
  const n = parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255, a];
}
export function parseColorToken(tok) {
  tok = tok.trim();
  const hex = tok.match(/#[0-9a-fA-F]{3,8}\b/);
  if (hex) return hexToRgb(hex[0]);
  const rgb = tok.match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?/i);
  if (rgb) return [(+rgb[1]) | 0, (+rgb[2]) | 0, (+rgb[3]) | 0, rgb[4] !== undefined ? +rgb[4] : 1];
  return null;
}
export function lum([r, g, b]) {
  const f = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}
export function contrast(a, b) { const la = lum(a), lb = lum(b); return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05); }

export function buildVarMap(css) {
  const map = {}; const re = /(--[\w-]+)\s*:\s*([^;]+);/g; let m;
  while ((m = re.exec(css))) map[m[1].trim()] = m[2].trim();
  const resolve = (val, d = 0) => d > 8 ? val : val.replace(/var\(\s*(--[\w-]+)\s*(?:,[^)]*)?\)/g, (_, n) => map[n] !== undefined ? resolve(map[n], d + 1) : _);
  for (const k of Object.keys(map)) map[k] = resolve(map[k]);
  return map;
}
export function resolveColor(expr, vars) {
  if (!expr) return null;
  const v = expr.replace(/var\(\s*(--[\w-]+)\s*(?:,([^)]*))?\)/g, (_, n, fb) => vars[n] !== undefined ? vars[n] : (fb || ''));
  const tokens = v.match(/#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)/g) || [];
  for (const t of tokens) { const c = parseColorToken(t); if (c) return c; }
  return null;
}
const getStyle = (html) => [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');

export function analyze(html) {
  const css = getStyle(html);
  const vars = buildVarMap(css);
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, '');
  const props = {};
  const rec = (s, p, val, imp) => { (props[s] = props[s] || { color: [], bg: [] })[p].push({ val, imp }); };
  const ruleRe = /([^{}]+)\{([^{}]*)\}/g; let m;
  while ((m = ruleRe.exec(clean))) {
    const group = m[1].trim(), body = m[2];
    if (/@|::|:hover|:focus|:active|:disabled|\bkeyframes\b|\bfrom\b|\bto\b|%/.test(group)) continue;
    const cM = body.match(/(?:^|;|\s)color\s*:\s*([^;]+)/);
    const bM = body.match(/background(?:-color)?\s*:\s*([^;]+)/);
    if (!cM && !bM) continue;
    for (const s of group.split(',').map(x => x.trim()).filter(Boolean)) {
      if (cM) rec(s, 'color', cM[1].replace(/!important/i, '').trim(), /!important/i.test(cM[1]));
      if (bM) rec(s, 'bg', bM[1].replace(/!important/i, '').trim(), /!important/i.test(bM[1]));
    }
  }
  const winner = (arr) => { if (!arr.length) return null; const imp = arr.filter(x => x.imp); const p = imp.length ? imp : arr; return p[p.length - 1].val; };
  const issues = [];
  for (const s of Object.keys(props)) {
    const fgv = winner(props[s].color), bgv = winner(props[s].bg);
    if (!fgv || !bgv || /transparent|none/i.test(bgv)) continue;
    const fg = resolveColor(fgv, vars), bg = resolveColor(bgv, vars);
    if (!fg || !bg || bg[3] < 0.9 || fg[3] < 0.5) continue;
    const lf = lum(fg.slice(0, 3)), lb = lum(bg.slice(0, 3));
    if (!((lf > 0.5 && lb > 0.5) || (lf < 0.18 && lb < 0.18))) continue;
    const ratio = contrast(fg.slice(0, 3), bg.slice(0, 3));
    if (ratio < FAIL_BELOW) issues.push({ sel: s, ratio, fgLum: lf, bgLum: lb, bgVal: bgv });
  }
  return { issues, vars };
}
