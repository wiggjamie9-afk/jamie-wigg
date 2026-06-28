import { createInterface } from 'readline';
import { loadConfig } from './config.js';
import { runAgentWithRetry, type AgentEvent, type ChatMessage } from './agent.js';
import { detectBg } from './terminal-bg.js';
import { styledReadLine } from './input.js';
import { TuiRenderer } from './renderer.js';
import { Loader } from './loader.js';
import { printBanner } from './banner.js';
import { initSessionDir, newSessionPath, saveMessage } from './session.js';
import { dispatch, type CommandContext } from './commands.js';

const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const CYAN = '\x1b[36m';
const GREEN = '\x1b[32m';
const GRAY = '\x1b[90m';
const YELLOW = '\x1b[33m';

function formatTokens(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}

async function main() {
  const config = loadConfig();
  const BG_INPUT = config.display.inputStyle === 'block' ? await detectBg() : '';

  if (config.showBanner) {
    printBanner(config.model);
  } else {
    const width = Math.min(process.stdout.columns || 60, 60);
    const line = GRAY + '─'.repeat(width) + RESET;
    console.log(`\n${line}`);
    console.log(`  ${BOLD}HERDCHECK${RESET}  ${DIM}v0.1.0${RESET}`);
    console.log(`  ${DIM}model${RESET}  ${CYAN}${config.model}${RESET}`);
    console.log(`${line}\n`);
  }
  if (config.slashCommands) console.log(`  ${DIM}/help for commands · type "exit" to quit${RESET}\n`);

  initSessionDir(config.sessionDir);
  let sessionPath = newSessionPath(config.sessionDir);
  const messages: ChatMessage[] = [];

  const rl = createInterface({ input: process.stdin, output: process.stdout, prompt: `${GREEN}>${RESET} ` });
  if (config.display.inputStyle === 'block') rl.pause(); // styledReadLine drives stdin directly

  const cmdCtx: CommandContext = {
    config,
    rl,
    messages,
    sessionPath,
    resetSession: () => { sessionPath = newSessionPath(config.sessionDir); return sessionPath; },
    totalTokens: { input: 0, output: 0 },
  };

  async function getInput(): Promise<string> {
    if (config.display.inputStyle === 'block') return styledReadLine(BG_INPUT);
    return new Promise((r) => { rl.prompt(); rl.once('line', r); });
  }

  while (true) {
    const input = await getInput();
    const trimmed = input.trim();
    if (!trimmed) continue;

    if (config.display.inputStyle === 'block') {
      const cwd = process.cwd().replace(process.env.HOME ?? '', '~');
      process.stdout.write(`\x1b[K  ${DIM}${cwd}${RESET}\n`);
    }

    if (trimmed.toLowerCase() === 'exit') { rl.close(); process.exit(0); }

    if (config.slashCommands && trimmed.startsWith('/')) {
      await dispatch(trimmed, cmdCtx);
      if (config.display.inputStyle === 'block') rl.pause();
      console.log();
      continue;
    }

    messages.push({ role: 'user', content: trimmed });
    saveMessage(cmdCtx.sessionPath, { role: 'user', content: trimmed });

    console.log();
    const renderer = new TuiRenderer({ display: config.display });
    const loader = new Loader(config.display.loader);
    loader.start();

    const onEvent = (e: AgentEvent) => {
      if (e.type === 'tool_result') {
        renderer.handle(e); // attaches output to the grouped buffer
        loader.start();     // model resumes thinking between turns
        return;
      }
      loader.stop();
      renderer.handle(e);
    };

    try {
      const agentInput = messages.length > 1 ? messages : trimmed;
      const result = await runAgentWithRetry(config, agentInput, { onEvent });
      loader.stop();
      renderer.endTurn();
      messages.push({ role: 'assistant', content: result.text });
      saveMessage(cmdCtx.sessionPath, { role: 'assistant', content: result.text });
      const inT = result.usage?.inputTokens ?? 0;
      const outT = result.usage?.outputTokens ?? 0;
      cmdCtx.totalTokens.input += inT;
      cmdCtx.totalTokens.output += outT;
      console.log(`\n${GRAY}  ${formatTokens(inT)} in · ${formatTokens(outT)} out${RESET}\n`);
    } catch (err: any) {
      loader.stop();
      renderer.endTurn();
      console.log(`\n${YELLOW}  Error: ${err.message}${RESET}\n`);
    }
  }
}

main();
