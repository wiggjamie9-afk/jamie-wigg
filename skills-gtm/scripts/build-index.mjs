#!/usr/bin/env node
// Build the Stable Skills Manifest v1 for the SKILLS-GTM library and inject
// self-describing YAML frontmatter into each skill file (idempotent).
//
// Usage:  node skills-gtm/scripts/build-index.mjs
// Run from the repo root (or anywhere — paths are derived from this file).
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));   // skills-gtm/scripts
const ROOT = join(HERE, '..');                          // skills-gtm
const REPO = join(ROOT, '..');                          // repo root

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'scripts' || name === 'schemas' || name === 'data') continue;
      walk(p, out);
    } else if (name.endsWith('.md') && name !== 'README.md') {
      out.push(p);
    }
  }
  return out;
}

const GROUP_LABEL = {
  roles: 'role',
  industries: 'industry',
  methodologies: 'methodology',
  workflows: 'workflow',
};

function firstSentence(text, cap = 220) {
  let t = text.replace(/\s+/g, ' ').trim();
  t = t.replace(/\s*Not templates\s*[—-]\s*starting points\.?\s*$/i, '').trim();
  if (t.length <= cap) return t;
  const cut = t.slice(0, cap);
  const lastStop = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('; '));
  return lastStop > 60 ? cut.slice(0, lastStop + 1) : cut.trimEnd() + '…';
}

function parse(content) {
  const lines = content.split('\n');
  let title = '';
  for (const ln of lines) {
    const m = ln.match(/^#\s+(?:Reference:\s*|Workflow:\s*)?(.+?)\s*$/);
    if (m) { title = m[1].replace(/\s+Prompts$/i, '').trim(); break; }
  }
  let purpose = '';
  const pi = lines.findIndex((l) => /^##\s+Purpose\s*$/i.test(l));
  if (pi !== -1) {
    const buf = [];
    for (let i = pi + 1; i < lines.length; i++) {
      const l = lines[i];
      if (/^#{1,6}\s/.test(l) || /^---\s*$/.test(l)) break;
      if (l.trim() === '' && buf.length) break;
      if (l.trim() !== '') buf.push(l.trim());
    }
    purpose = buf.join(' ');
  }
  return { title, purpose };
}

const files = walk(ROOT).sort();
const entries = [];
let injected = 0;

for (const file of files) {
  const raw = readFileSync(file, 'utf8');
  const relPath = relative(REPO, file);
  const parts = relPath.split('/');
  const group = parts[1];
  const sub = parts.length > 3 ? parts[2] : group;
  const slug = relPath.replace(/^skills-gtm\//, '').replace(/\.md$/, '').replace(/\//g, '-');
  const id = `gtm-${slug}`;

  let body = raw;
  const fmMatch = raw.match(/^---\n[\s\S]*?\n---\n?/);
  if (fmMatch) body = raw.slice(fmMatch[0].length);

  const { title, purpose } = parse(body);
  const name = title || slug;
  const description = firstSentence(purpose) || `${name} — go-to-market prompt reference.`;
  const tags = ['go-to-market', GROUP_LABEL[group] || group, sub]
    .filter((v, i, a) => a.indexOf(v) === i);

  entries.push({
    id,
    name,
    path: relPath,
    category: 'marketing',
    metadata: { domain: 'go-to-market', group, subcategory: sub, risk: 'none', license: 'MIT', tags, description },
  });

  const fm = [
    '---',
    `id: ${id}`,
    `name: ${JSON.stringify(name)}`,
    `description: ${JSON.stringify(description)}`,
    'category: marketing',
    `group: ${group}`,
    `subcategory: ${sub}`,
    'risk: none',
    'license: MIT',
    `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`,
    '---',
    '',
  ].join('\n');
  writeFileSync(file, fm + body.replace(/^\n+/, ''));
  injected++;
}

const groupOrder = { roles: 0, industries: 1, methodologies: 2, workflows: 3 };
entries.sort((a, b) =>
  (groupOrder[a.metadata.group] - groupOrder[b.metadata.group]) || a.path.localeCompare(b.path));

const manifest = {
  manifestVersion: 1,
  name: 'skills-gtm',
  title: 'SKILLS-GTM — Go-To-Market Prompt Library',
  description:
    'Role-specific go-to-market prompt references (SDR/BDR, AE, Sales Manager, RevOps, CSM, Founder) plus industry, methodology, and workflow playbooks. Copy-paste starting points, not templates.',
  license: 'MIT',
  count: entries.length,
  skills: entries,
};

const json = JSON.stringify(manifest, null, 2) + '\n';
writeFileSync(join(ROOT, 'skills_index.json'), json);
mkdirSync(join(ROOT, 'data'), { recursive: true });
writeFileSync(join(ROOT, 'data', 'skills_index.json'), json);

console.log(`frontmatter injected/refreshed: ${injected} files`);
console.log(`manifest skills: ${entries.length}`);
console.log('groups:', entries.reduce((m, e) => ((m[e.metadata.group] = (m[e.metadata.group] || 0) + 1), m), {}));
