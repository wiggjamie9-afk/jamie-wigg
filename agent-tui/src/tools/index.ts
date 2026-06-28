import { fileReadTool } from './file-read.js';
import { fileWriteTool } from './file-write.js';
import { fileEditTool } from './file-edit.js';
import { globTool } from './glob.js';
import { grepTool } from './grep.js';
import { listDirTool } from './list-dir.js';
import { shellTool } from './shell.js';
// import { myCustomTool } from './custom.js'; // enable to add a domain-specific tool

export const tools = [
  // User-defined tools — executed client-side
  fileReadTool,
  fileWriteTool,
  fileEditTool,
  globTool,
  grepTool,
  listDirTool,
  shellTool,
  // myCustomTool,

  // NOTE: OpenRouter server tools (web_search, datetime) are not exposed by the
  // published @openrouter/agent@0.1.2 `serverTool` export. When a version that
  // exports `serverTool` lands, add them back here:
  //   import { serverTool } from '@openrouter/agent';
  //   serverTool({ type: 'openrouter:web_search' }),
  //   serverTool({ type: 'openrouter:datetime', parameters: { timezone: 'UTC' } }),
];
