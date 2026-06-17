export type CommandHandler = (args: string[]) => Promise<void>;
export declare class CommandRegistry {
    private commands;
    constructor();
    getCommand(name: string): CommandHandler | undefined;
    getAllCommands(): string[];
    registerCommand(name: string, handler: CommandHandler): void;
}
//# sourceMappingURL=command-registry.d.ts.map