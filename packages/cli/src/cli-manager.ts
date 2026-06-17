import { logger, type DomainType } from '@ecosystem/core';
import { CommandRegistry } from './command-registry.js';

export class CliManager {
  private registry: CommandRegistry;

  constructor() {
    this.registry = new CommandRegistry();
  }

  async run(args: string[]): Promise<void> {
    if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
      this.printHelp();
      return;
    }

    const command = args[0];
    const commandArgs = args.slice(1);

    const handler = this.registry.getCommand(command);
    if (!handler) {
      logger.error(`Unknown command: ${command}`);
      this.printHelp();
      process.exit(1);
    }

    await handler(commandArgs);
  }

  private printHelp(): void {
    console.log(`
🚀 Ecosystem CLI - Universal Builder

USAGE
  ecosystem <command> [options]

COMMANDS
  new <domain> <name>     Create a new project in a domain
  dev [domain]            Start development mode (all or specific domain)
  build [domain]          Build projects (all or specific domain)
  test [domain]           Run tests (all or specific domain)
  list                    List all projects and domains
  config                  Show ecosystem configuration
  setup                   Initialize workspace

DOMAINS
  web              Web applications (React, Vue, Svelte)
  backend          Backend services (Node, Python, Go)
  data             Data science (Jupyter, R, SQL)
  ai               AI agents and models
  mobile           Mobile apps (React Native, Flutter)
  desktop          Desktop apps (Electron, Tauri)
  cli              Command-line tools
  infrastructure   DevOps and infrastructure

EXAMPLES
  ecosystem new web my-app
  ecosystem dev web
  ecosystem build
  ecosystem list
`);
  }
}
