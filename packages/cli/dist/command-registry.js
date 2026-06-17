import { logger } from '@ecosystem/core';
import * as commands from './commands/index.js';
export class CommandRegistry {
    commands;
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
    getCommand(name) {
        return this.commands.get(name);
    }
    getAllCommands() {
        return Array.from(this.commands.keys());
    }
    registerCommand(name, handler) {
        this.commands.set(name, handler);
        logger.debug(`Registered command: ${name}`);
    }
}
//# sourceMappingURL=command-registry.js.map