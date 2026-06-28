import { tool } from '@openrouter/agent/tool';
import { z } from 'zod';

// Starting point for a domain-specific tool. Rename, give it a real schema and
// implementation, then add it to the array in src/tools/index.ts.
export const myCustomTool = tool({
  name: 'my_tool',
  description: 'Describe what this tool does so the model knows when to call it',
  inputSchema: z.object({
    param: z.string().describe('Description of the parameter'),
  }),
  // requireApproval: true, // uncomment to gate behind user confirmation
  execute: async ({ param }) => {
    return { result: `received: ${param}` };
  },
});
