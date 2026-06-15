#!/usr/bin/env node

/**
 * build-web.mjs
 *
 * Copies all HTML, CSS, and other web assets from the apps/ folder
 * into the www/ folder for Capacitor to bundle.
 *
 * Usage: node scripts/build-web.mjs
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');
const appsDir = path.resolve(projectRoot, '..', 'apps');
const wwwDir = path.resolve(projectRoot, 'www');

async function buildWeb() {
  try {
    console.log('Building web assets...');
    console.log(`Source: ${appsDir}`);
    console.log(`Destination: ${wwwDir}`);

    // Check if apps directory exists
    if (!fs.existsSync(appsDir)) {
      console.error(`Error: apps directory not found at ${appsDir}`);
      console.error('Make sure you are running this from the capacitor-buddies directory');
      process.exit(1);
    }

    // Create www directory if it doesn't exist
    await fs.ensureDir(wwwDir);

    // Copy all files from apps/ to www/
    await fs.copy(appsDir, wwwDir, {
      overwrite: true,
      filter: (src) => {
        // Include: .html, .css, .js, .json, .md, .txt, .wav, .mp3, .png, .jpg, .svg, etc.
        // Exclude: node_modules, .DS_Store, etc.
        const basename = path.basename(src);
        if (basename === 'node_modules') return false;
        if (basename === '.DS_Store') return false;
        if (basename === '.git') return false;
        return true;
      },
    });

    // Create a stub index.html if it doesn't exist
    const indexPath = path.join(wwwDir, 'index.html');
    if (!fs.existsSync(indexPath)) {
      const indexContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>50 Buddy Apps</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      padding: 40px 20px;
      max-width: 800px;
      margin: 0 auto;
      line-height: 1.6;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      min-height: 100vh;
    }
    h1 { font-size: 2.5em; margin-bottom: 20px; }
    p { font-size: 1.1em; margin: 10px 0; }
    .info {
      background: rgba(255, 255, 255, 0.1);
      padding: 20px;
      border-radius: 10px;
      margin: 20px 0;
    }
  </style>
</head>
<body>
  <h1>50 Buddy Apps</h1>
  <div class="info">
    <p>Welcome to the 50 Buddy Apps iOS wrapper.</p>
    <p>This app bundles web-based buddy apps for offline access.</p>
    <p>If you see this message, web assets are being loaded.</p>
  </div>
  <script>
    // Check if navigator.userAgent indicates Capacitor
    if (window.location.protocol === 'file:' || navigator.userAgent.includes('Capacitor')) {
      console.log('Running in Capacitor/iOS app');
    }
  </script>
</body>
</html>`;
      fs.writeFileSync(indexPath, indexContent);
      console.log('Created stub index.html');
    }

    console.log('✓ Web assets built successfully');
    console.log(`✓ ${wwwDir} is ready for Capacitor`);
  } catch (error) {
    console.error('Error building web assets:', error.message);
    process.exit(1);
  }
}

buildWeb();
