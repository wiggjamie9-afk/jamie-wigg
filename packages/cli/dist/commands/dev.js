import { logger } from '@ecosystem/core';
export async function devCommand(args) {
    const domain = args[0];
    if (domain) {
        logger.info(`Starting dev mode for ${domain} domain`);
        console.log(`
Run from the domain directory:
  cd domains/${domain}
  pnpm dev
`);
    }
    else {
        logger.info('Starting dev mode for all domains');
        console.log(`
To start development across all domains:
  pnpm dev

This will watch and rebuild all packages and domain projects.
`);
    }
}
//# sourceMappingURL=dev.js.map