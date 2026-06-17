import { logger } from '@ecosystem/core';
export async function testCommand(args) {
    const domain = args[0];
    if (domain) {
        logger.info(`Running tests for ${domain} domain`);
        console.log(`
Run tests from the domain directory:
  cd domains/${domain}
  pnpm test
`);
    }
    else {
        logger.info('Running all tests');
        console.log(`
To run all tests:
  pnpm test

This will run test suites across all packages and domains.
`);
    }
}
//# sourceMappingURL=test.js.map