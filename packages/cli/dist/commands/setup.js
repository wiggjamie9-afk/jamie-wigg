import { logger } from '@ecosystem/core';
export async function setupCommand(args) {
    logger.info('Setting up ecosystem workspace');
    console.log(`
⚙️ Ecosystem Setup

This command sets up the entire development environment.

Steps:
  1. Install dependencies: pnpm install
  2. Build shared packages: pnpm run build:all
  3. Verify TypeScript: pnpm type-check
  4. Run linting: pnpm lint

Quick Start:
  pnpm setup          Full setup
  pnpm setup --dev    Setup with development tools

Then:
  cd domains/web/apps/<your-app>
  pnpm dev

For more commands: ecosystem --help
`);
}
//# sourceMappingURL=setup.js.map