import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { execFile } from 'child_process';
import { promisify } from 'util';
import { glob } from 'glob';
import { readFile } from 'fs/promises';

const execFileAsync = promisify(execFile);
const MAX_RESULTS = 100;

type Match = { file: string; line: number; content: string };

async function ripgrep(pattern: string, path: string, fileGlob: string | undefined, ignoreCase: boolean): Promise<Match[] | null> {
  try {
    const args = ['--line-number', '--no-heading', '--color=never', '--max-count=50'];
    if (ignoreCase) args.push('--ignore-case');
    if (fileGlob) args.push('--glob', fileGlob);
    args.push(pattern, path);
    const { stdout } = await execFileAsync('rg', args, { maxBuffer: 4 * 1024 * 1024 });
    const matches: Match[] = [];
    for (const raw of stdout.split('\n')) {
      if (!raw) continue;
      const m = raw.match(/^(.*?):(\d+):(.*)$/);
      if (m) matches.push({ file: m[1], line: Number(m[2]), content: m[3].slice(0, 300) });
      if (matches.length >= MAX_RESULTS) break;
    }
    return matches;
  } catch (err: any) {
    // rg exits 1 when no matches — that's a valid empty result, not a failure.
    if (err.code === 1 && !err.stderr) return [];
    if (err.code === 'ENOENT') return null; // rg not installed → fall back
    return null;
  }
}

async function nodeGrep(pattern: string, path: string, fileGlob: string | undefined, ignoreCase: boolean): Promise<Match[]> {
  const re = new RegExp(pattern, ignoreCase ? 'i' : '');
  const files = await glob(fileGlob ?? '**/*', {
    cwd: path,
    nodir: true,
    ignore: ['**/node_modules/**', '**/.git/**'],
  });
  const matches: Match[] = [];
  for (const rel of files) {
    if (matches.length >= MAX_RESULTS) break;
    try {
      const text = await readFile(path === '.' ? rel : `${path}/${rel}`, 'utf-8');
      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (re.test(lines[i])) {
          matches.push({ file: rel, line: i + 1, content: lines[i].slice(0, 300) });
          if (matches.length >= MAX_RESULTS) break;
        }
      }
    } catch { /* skip unreadable/binary */ }
  }
  return matches;
}

export const grepTool = tool({
  name: 'grep',
  description: 'Search file contents by regex. Uses ripgrep when available, else a Node fallback. Returns up to 100 matches as {file, line, content}.',
  inputSchema: z.object({
    pattern: z.string().describe('Regex pattern to search for'),
    path: z.string().optional().describe('Directory or file to search (default: cwd)'),
    glob: z.string().optional().describe('File filter, e.g. "*.ts"'),
    ignoreCase: z.boolean().optional(),
  }),
  execute: async ({ pattern, path, glob: fileGlob, ignoreCase }) => {
    const root = path ?? '.';
    try {
      let matches = await ripgrep(pattern, root, fileGlob, !!ignoreCase);
      if (matches === null) matches = await nodeGrep(pattern, root, fileGlob, !!ignoreCase);
      return { matches, count: matches.length, ...(matches.length >= MAX_RESULTS && { truncated: true }) };
    } catch (err: any) {
      return { error: err.message };
    }
  },
});
