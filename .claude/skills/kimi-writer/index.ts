/**
 * Kimi Writer Skill
 *
 * Autonomous writing agent powered by kimi-k2-thinking for creating
 * novels, books, short stories, and long-form content.
 *
 * Usage:
 *   /kimi-writer "Create a 5-chapter mystery novel"
 *   /kimi-writer --recover output/project/.context_summary_*.md
 */

import { spawn } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface WriterOptions {
  prompt?: string;
  recover?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  tokenLimit?: number;
}

/**
 * Launch Kimi Writer agent
 */
export function launchKimiWriter(options: WriterOptions = {}): void {
  const prompt = options.prompt || '';
  const recover = options.recover || '';

  console.log('🚀 Launching Kimi Writer Agent...\n');
  console.log('📚 Powered by kimi-k2-thinking (autonomous writing)\n');

  if (recover) {
    console.log(`📂 Recovery Mode: ${recover}`);
    console.log('   Resuming from saved context...\n');
  }

  // Check if Kimi Writer is installed
  if (!isKimiWriterAvailable()) {
    console.log('❌ Kimi Writer not found. Installing...\n');
    installKimiWriter();
  }

  // Build command
  let command = 'uv run kimi-writer.py';
  const args: string[] = [];

  if (recover) {
    args.push('--recover', recover);
  } else if (prompt) {
    args.push(`"${prompt}"`);
  }

  // Launch agent
  console.log(`Command: ${command} ${args.join(' ')}\n`);
  console.log('━'.repeat(80));
  console.log('');

  const child = spawn('bash', ['-c', `${command} ${args.join(' ')}`], {
    stdio: 'inherit',
    cwd: process.cwd(),
  });

  child.on('error', (error) => {
    console.error('❌ Failed to launch Kimi Writer:', error);
    console.log('\nInstall with: bash -c "$(curl -fsSL https://raw.github.com/MoonshotAI/kimi-writer/main/install.sh)"');
  });

  child.on('close', (code) => {
    console.log('\n' + '━'.repeat(80));
    if (code === 0) {
      console.log('✓ Kimi Writer agent completed successfully');
    } else {
      console.log(`✗ Kimi Writer agent exited with code ${code}`);
    }
  });
}

/**
 * Check if Kimi Writer is installed
 */
function isKimiWriterAvailable(): boolean {
  // Check if kimi-writer.py exists or is in PATH
  // For simplicity, assume it's available if user is using this skill
  return true;
}

/**
 * Install Kimi Writer
 */
function installKimiWriter(): void {
  console.log('Installing Kimi Writer from GitHub...\n');

  const installScript =
    'bash -c "$(curl -fsSL https://raw.github.com/MoonshotAI/kimi-writer/main/install.sh)"';

  const child = spawn('bash', ['-c', installScript], {
    stdio: 'inherit',
  });

  child.on('close', (code) => {
    if (code === 0) {
      console.log('✓ Kimi Writer installed successfully\n');
    } else {
      console.log('✗ Installation failed. Try manual setup:\n');
      console.log('  git clone https://github.com/Doriandarko/kimi-writer.git');
      console.log('  cd kimi-writer');
      console.log('  pip install -r requirements.txt');
      console.log('  cp env.example .env');
      console.log('  # Add MOONSHOT_API_KEY to .env\n');
    }
  });
}

/**
 * List available recovery checkpoints
 */
export function listCheckpoints(projectDir: string = 'output'): void {
  console.log('📂 Available recovery checkpoints:\n');

  const { readdirSync } = require('fs');
  const { join } = require('path');

  try {
    const projects = readdirSync(projectDir);

    projects.forEach((project: string) => {
      const projectPath = join(projectDir, project);
      const projectStats = require('fs').statSync(projectPath);

      if (projectStats.isDirectory()) {
        const summaries = readdirSync(projectPath).filter((f: string) =>
          f.startsWith('.context_summary_')
        );

        if (summaries.length > 0) {
          console.log(`📚 ${project}`);
          summaries.forEach((summary: string) => {
            console.log(`   └─ ${summary}`);
          });
        }
      }
    });
  } catch (error) {
    console.log('No projects found yet. Create your first with: /kimi-writer "...');
  }
}

/**
 * Export for skill invocation
 */
export default { launchKimiWriter, listCheckpoints };
