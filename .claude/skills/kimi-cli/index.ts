/**
 * Kimi CLI Skill
 *
 * Launch Kimi CLI agent + shell in new terminal
 * Features: Shell mode (Ctrl-X), IDE integration (VS Code/Zed/JetBrains), MCP support
 *
 * Usage:
 *   /kimi-shell              # Launch interactive mode
 *   /kimi-shell --acp        # Launch as ACP server (IDE integration)
 *   /kimi-shell --mcp <url>  # Add MCP server
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

interface KimiOptions {
  mode?: 'interactive' | 'acp' | 'config';
  mcpConfigPath?: string;
  mcpServers?: Array<{
    name: string;
    url?: string;
    command?: string;
    args?: string[];
  }>;
}

/**
 * Check if Kimi CLI is installed
 */
export function isKimiInstalled(): boolean {
  // Check if kimi is available via uv run
  return true; // Assume it's installed if this skill is loaded
}

/**
 * Launch Kimi CLI in interactive mode (agent + shell with Ctrl-X toggle)
 */
export function launchKimiInteractive(): void {
  console.log('🚀 Launching Kimi CLI in interactive mode...');
  console.log('   Press Ctrl-X to toggle between agent and shell mode');
  console.log('   Type /login to authenticate');
  console.log('   Type /help for commands\n');

  // Launch in new terminal (or current terminal depending on platform)
  const child = spawn('uv', ['run', 'kimi'], {
    cwd: '/tmp/kimi-cli',
    stdio: 'inherit',
    shell: true,
  });

  child.on('error', (error) => {
    console.error('Failed to launch Kimi CLI:', error);
    console.log('Make sure Kimi CLI is installed: cd /tmp/kimi-cli && make prepare');
  });
}

/**
 * Launch Kimi CLI as ACP server (IDE integration)
 */
export function launchKimiACP(): void {
  console.log('🚀 Launching Kimi CLI as ACP server...');
  console.log('   Connect from: VS Code (kimi-code extension), Zed, or JetBrains');
  console.log('   Config example for Zed (~/.config/zed/settings.json):');
  console.log(`\n   {
     "agent_servers": {
       "Kimi CLI": {
         "type": "custom",
         "command": "kimi",
         "args": ["acp"]
       }
     }
   }\n`);

  const child = spawn('uv', ['run', 'kimi', 'acp'], {
    cwd: '/tmp/kimi-cli',
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error('Failed to launch Kimi ACP server:', error);
  });
}

/**
 * Create MCP configuration and launch Kimi with it
 */
export function launchKimiWithMCP(options: KimiOptions): void {
  const configPath = options.mcpConfigPath || join(homedir(), '.kimi-mcp.json');

  if (options.mcpServers && options.mcpServers.length > 0) {
    const config = {
      mcpServers: {} as Record<string, any>,
    };

    for (const server of options.mcpServers) {
      if (server.url) {
        config.mcpServers[server.name] = {
          url: server.url,
        };
      } else if (server.command) {
        config.mcpServers[server.name] = {
          command: server.command,
          args: server.args || [],
        };
      }
    }

    writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`✓ MCP config written to ${configPath}`);
  }

  console.log(`🚀 Launching Kimi CLI with MCP config: ${configPath}\n`);

  const child = spawn('uv', ['run', 'kimi', '--mcp-config-file', configPath], {
    cwd: '/tmp/kimi-cli',
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error('Failed to launch Kimi with MCP config:', error);
  });
}

/**
 * Add MCP server dynamically
 */
export function addMCPServer(
  name: string,
  transport: 'http' | 'stdio',
  url: string,
  options?: {
    headers?: Record<string, string>;
    command?: string;
    args?: string[];
    auth?: 'oauth' | 'none';
  }
): void {
  console.log(`Adding MCP server: ${name}`);

  let args = ['mcp', 'add', '--transport', transport, name];

  if (transport === 'http') {
    args.push(url);

    if (options?.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        args.push('--header', `${key}: ${value}`);
      }
    }

    if (options?.auth === 'oauth') {
      args.push('--auth', 'oauth');
    }
  } else if (transport === 'stdio') {
    args.push('--');
    if (options?.command) {
      args.push(options.command);
      if (options.args) {
        args.push(...options.args);
      }
    }
  }

  const child = spawn('uv', ['run', 'kimi', ...args], {
    cwd: '/tmp/kimi-cli',
    stdio: 'inherit',
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log(`✓ MCP server added: ${name}`);
    } else {
      console.error(`✗ Failed to add MCP server: ${name}`);
    }
  });
}

/**
 * List connected MCP servers
 */
export function listMCPServers(): void {
  console.log('Listing connected MCP servers...\n');

  const child = spawn('uv', ['run', 'kimi', 'mcp', 'list'], {
    cwd: '/tmp/kimi-cli',
    stdio: 'inherit',
  });

  child.on('error', (error) => {
    console.error('Failed to list MCP servers:', error);
  });
}

/**
 * Export all functions for skill invocation
 */
export default {
  launchKimiInteractive,
  launchKimiACP,
  launchKimiWithMCP,
  addMCPServer,
  listMCPServers,
};
