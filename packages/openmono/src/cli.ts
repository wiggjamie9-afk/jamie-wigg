#!/usr/bin/env node

import { OpenMonoServer } from './server.js';

const args = process.argv.slice(2);

let port = 5000;
let host = '127.0.0.1';
let logLevel: 'debug' | 'info' | 'warn' | 'error' = 'info';

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--port') {
    port = parseInt(args[i + 1], 10);
  } else if (args[i] === '--host') {
    host = args[i + 1];
  } else if (args[i] === '--log-level') {
    logLevel = args[i + 1] as any;
  } else if (args[i] === '--help') {
    console.log(`
OpenMono - Local LLM Inference Server

Usage:
  openmono [OPTIONS]

Options:
  --port <number>       Server port (default: 5000)
  --host <string>       Server host (default: 127.0.0.1)
  --log-level <level>   Log level: debug, info, warn, error (default: info)
  --help                Show this help message

Examples:
  openmono
  openmono --port 8000
  openmono --host 0.0.0.0 --port 3000
    `);
    process.exit(0);
  }
}

const server = new OpenMonoServer({
  port,
  host,
  logLevel,
});

server.start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\nShutting down OpenMono server...');
  process.exit(0);
});
