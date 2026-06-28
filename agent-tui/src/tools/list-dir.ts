import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { readdir } from 'fs/promises';

const MAX_ENTRIES = 500;

export const listDirTool = tool({
  name: 'list_dir',
  description: 'List the contents of a directory. Directories are suffixed with "/". Returns up to 500 entries, sorted.',
  inputSchema: z.object({
    path: z.string().optional().describe('Directory path (default: cwd)'),
  }),
  execute: async ({ path }) => {
    const dir = path ?? process.cwd();
    try {
      const entries = await readdir(dir, { withFileTypes: true });
      const names = entries
        .map((e) => (e.isDirectory() ? `${e.name}/` : e.name))
        .sort((a, b) => a.localeCompare(b));
      const truncated = names.length > MAX_ENTRIES;
      return { path: dir, entries: names.slice(0, MAX_ENTRIES), count: names.length, ...(truncated && { truncated: true }) };
    } catch (err: any) {
      if (err.code === 'ENOENT') return { error: `Directory not found: ${dir}` };
      if (err.code === 'ENOTDIR') return { error: `Not a directory: ${dir}` };
      return { error: err.message };
    }
  },
});
