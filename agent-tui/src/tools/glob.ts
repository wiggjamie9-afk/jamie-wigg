import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { glob } from 'glob';

const MAX_RESULTS = 1000;

export const globTool = tool({
  name: 'glob',
  description: 'Find files by glob pattern (e.g. "src/**/*.ts"). Returns up to 1000 relative paths, ignoring node_modules and .git.',
  inputSchema: z.object({
    pattern: z.string().describe('Glob pattern, e.g. "src/**/*.ts"'),
    path: z.string().optional().describe('Directory to search in (default: cwd)'),
  }),
  execute: async ({ pattern, path }) => {
    try {
      const matches = await glob(pattern, {
        cwd: path ?? process.cwd(),
        nodir: true,
        ignore: ['**/node_modules/**', '**/.git/**'],
        dot: false,
      });
      const truncated = matches.length > MAX_RESULTS;
      return {
        files: matches.slice(0, MAX_RESULTS).sort(),
        count: matches.length,
        ...(truncated && { truncated: true }),
      };
    } catch (err: any) {
      return { error: err.message };
    }
  },
});
