const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[38;5;71m'; // HerdCheck green

// Compact 5-row block wordmark for "HERDCHECK" (fits within 60 columns).
const LOGO = [
  '█  █ ████ ███  ███  ████ █  █ ████ ████ █  █',
  '█  █ █    █  █ █  █ █    █  █ █    █    █ █ ',
  '████ ███  ███  █  █ █    ████ ███  █    ██  ',
  '█  █ █    █ █  █  █ █    █  █ █    █    █ █ ',
  '█  █ ████ █  █ ███  ████ █  █ ████ ████ █  █',
].join('\n');

export function printBanner(model: string): void {
  console.log(`\n${GREEN}${BOLD}${LOGO}${RESET}`);
  console.log(`  ${DIM}terminal coding agent · OpenRouter${RESET}`);
  console.log(`  ${DIM}model${RESET}  ${model}\n`);
}
