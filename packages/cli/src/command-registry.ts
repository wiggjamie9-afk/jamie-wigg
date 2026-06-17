import { logger } from '@ecosystem/core';
import * as commands from './commands/index.js';

export type CommandHandler = (args: string[]) => Promise<void>;

export class CommandRegistry {
  private commands: Map<string, CommandHandler>;

  constructor() {
    this.commands = new Map([
      ['new', commands.newCommand],
      ['dev', commands.devCommand],
      ['build', commands.buildCommand],
      ['test', commands.testCommand],
      ['list', commands.listCommand],
      ['config', commands.configCommand],
      ['setup', commands.setupCommand],
    ]);
  }

  getCommand(name: string): CommandHandler | undefined {
    return this.commands.get(name);
  }

  getAllCommands(): string[] {
    return Array.from(this.commands.keys());
  }

  registerCommand(name: string, handler: CommandHandler): void {
    this.commands.set(name, handler);
    logger.debug(`Registered command: ${name}`);
  }
}
