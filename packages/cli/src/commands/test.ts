import { logger, type DomainType } from '@ecosystem/core';

export async function testCommand(args: string[]): Promise<void> {
  const domain = args[0] as DomainType | undefined;

  if (domain) {
    logger.info(`Running tests for ${domain} domain`);
    console.log(`
Run tests from the domain directory:
  cd domains/${domain}
  pnpm test
`);
  } else {
    logger.info('Running all tests');
    console.log(`
To run all tests:
  pnpm test

This will run test suites across all packages and domains.
`);
  }
}
