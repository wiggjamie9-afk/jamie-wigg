import { logger } from '@ecosystem/core';

export async function listCommand(args: string[]): Promise<void> {
  logger.info('Listing ecosystem domains and projects');
  console.log(`
📦 Ecosystem Domains:

  🌐 Web               domains/web/
  🔧 Backend           domains/backend/
  📊 Data Science      domains/data/
  🤖 AI Agents         domains/ai/
  📱 Mobile            domains/mobile/
  🖥️ Desktop           domains/desktop/
  ⚙️ Infrastructure    domains/infrastructure/

📚 Shared Packages:

  @ecosystem/core      packages/shared/core/
  @ecosystem/cli       packages/cli/

Run 'pnpm list --recursive' for detailed project listing.
`);
}
