import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';
import { execFile } from 'child_process';

const MAX_BUFFER = 256 * 1024;
const MAX_LINES = 2000;

function clip(output: string): { output: string; truncated?: true } {
  const lines = output.split('\n');
  if (lines.length <= MAX_LINES) return { output };
  return { output: lines.slice(-MAX_LINES).join('\n'), truncated: true };
}

export const shellTool = tool({
  name: 'shell',
  description: 'Execute a shell command and return combined stdout/stderr, exit code, and timing. Output is capped at the last 2000 lines / 256KB. Default timeout 120s.',
  inputSchema: z.object({
    command: z.string().describe('Shell command to execute'),
    timeout: z.number().optional().describe('Timeout in seconds (default: 120)'),
  }),
  execute: async ({ command, timeout }) => {
    const shell = process.env.SHELL || '/bin/bash';
    const timeoutMs = (timeout ?? 120) * 1000;
    return new Promise((resolve) => {
      execFile(shell, ['-c', command], { timeout: timeoutMs, maxBuffer: MAX_BUFFER }, (err: any, stdout, stderr) => {
        const combined = (stdout ?? '') + (stderr ?? '');
        const { output, truncated } = clip(combined);
        if (err && err.killed && err.signal === 'SIGTERM') {
          resolve({ output, exitCode: 124, timedOut: true, ...(truncated && { truncated }) });
          return;
        }
        resolve({ output, exitCode: err?.code ?? 0, ...(truncated && { truncated }) });
      });
    });
  },
});
