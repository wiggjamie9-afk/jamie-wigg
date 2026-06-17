#!/usr/bin/env node
import { logger } from '@ecosystem/core';
import { CliManager } from './cli-manager.js';
async function main() {
    try {
        const cli = new CliManager();
        await cli.run(process.argv.slice(2));
    }
    catch (error) {
        logger.error('CLI error', error);
        process.exit(1);
    }
}
main();
//# sourceMappingURL=index.js.map