import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { readFile, writeFile } from 'fs/promises';

function countOccurrences(haystack: string, needle: string): number {
  if (!needle) return 0;
  let count = 0;
  let idx = haystack.indexOf(needle);
  while (idx !== -1) {
    count++;
    idx = haystack.indexOf(needle, idx + needle.length);
  }
  return count;
}

// Minimal unified-style diff: emit changed regions with a few context lines.
function makeDiff(path: string, before: string, after: string): string {
  const a = before.split('\n');
  const b = after.split('\n');
  const out: string[] = [`--- ${path}`, `+++ ${path}`];
  let i = 0, j = 0;
  while (i < a.length || j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    // find next sync point
    let si = i, sj = j;
    outer: for (let k = 1; k < 200; k++) {
      for (let x = 0; x <= k; x++) {
        if (a[i + x] !== undefined && a[i + x] === b[j + (k - x)]) { si = i + x; sj = j + (k - x); break outer; }
        if (b[j + x] !== undefined && b[j + x] === a[i + (k - x)]) { si = i + (k - x); sj = j + x; break outer; }
      }
    }
    for (; i < si && i < a.length; i++) out.push(`- ${a[i]}`);
    for (; j < sj && j < b.length; j++) out.push(`+ ${b[j]}`);
    if (si === i && sj === j) { // no sync found, dump remainder
      for (; i < a.length; i++) out.push(`- ${a[i]}`);
      for (; j < b.length; j++) out.push(`+ ${b[j]}`);
      break;
    }
  }
  return out.join('\n');
}

export const fileEditTool = tool({
  name: 'file_edit',
  description:
    'Apply one or more exact search-and-replace edits to a file. Each old_text must appear exactly once in the file (edit fails otherwise). Returns a diff of the changes.',
  inputSchema: z.object({
    path: z.string().describe('Absolute path to the file'),
    edits: z
      .array(z.object({ old_text: z.string(), new_text: z.string() }))
      .min(1)
      .describe('Edits applied in order; each old_text must be unique in the file'),
  }),
  execute: async ({ path, edits }) => {
    try {
      const before = await readFile(path, 'utf-8');
      let content = before;
      for (const [n, edit] of edits.entries()) {
        const occ = countOccurrences(content, edit.old_text);
        if (occ === 0) return { error: `Edit ${n + 1}: old_text not found in ${path}` };
        if (occ > 1) return { error: `Edit ${n + 1}: old_text appears ${occ} times — make it unique` };
        content = content.replace(edit.old_text, edit.new_text);
      }
      if (content === before) return { error: 'No changes produced' };
      await writeFile(path, content, 'utf-8');
      return { edited: true, path, diff: makeDiff(path, before, content) };
    } catch (err: any) {
      if (err.code === 'ENOENT') return { error: `File not found: ${path}` };
      return { error: err.message };
    }
  },
});
