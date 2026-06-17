import { logger, type DomainType } from '@ecosystem/core';

export async function newCommand(args: string[]): Promise<void> {
  if (args.length < 2) {
    console.log(`
Usage: ecosystem new <domain> <name>

Example:
  ecosystem new web my-app
  ecosystem new backend api-server
  ecosystem new data analytics-pipeline
`);
    return;
  }

  const domain = args[0] as DomainType;
  const name = args[1];

  logger.info(`Creating new ${domain} project: ${name}`);
  logger.warn('Project scaffolding not yet implemented');
  console.log(`
📦 To create a new project, use a domain-specific template:

  - Web: pnpm create next-app@latest
  - Backend: pnpm create express-generator
  - Data: jupyter notebook / R project
  - AI: python -m venv myenv
  - Mobile: npx create-expo-app
  - CLI: pnpm init

Then place in: domains/${domain}/apps/${name}
`);
}
