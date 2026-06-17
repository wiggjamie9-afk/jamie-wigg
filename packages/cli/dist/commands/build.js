import { logger } from '@ecosystem/core';
export async function buildCommand(args) {
    const domain = args[0];
    if (domain) {
        logger.info(`Building ${domain} domain`);
        console.log(`
Build from the domain directory:
  cd domains/${domain}
  pnpm build
`);
    }
    else {
        logger.info('Building all domains');
        console.log(`
To build all projects:
  pnpm build

This will compile all packages and domain projects.
`);
    }
}
//# sourceMappingURL=build.js.map