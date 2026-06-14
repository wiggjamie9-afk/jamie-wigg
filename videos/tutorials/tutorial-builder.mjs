#!/usr/bin/env node

/**
 * Tutorial Video Builder
 * Creates tutorial videos using the Higgsfield-to-HyperFrames pipeline
 * Generates HTML compositions that can be rendered with HyperFrames
 */

import fs from 'fs';
import path from 'path';

const OUTPUT_DIR = process.cwd();

// Tutorial definitions
const tutorials = [
  {
    id: 'mathtutor-pro',
    name: 'MathTutor Pro',
    tagline: 'Solve Math Problems Step-by-Step',
    description: 'AI-powered step-by-step guidance for mastering mathematics',
    accentColor: '#10b981',
    accentLight: '#34d399',
    icon: '∑',
    features: ['Step-by-step solutions', 'AI explanations', 'Visual demonstrations'],
    cta: 'Start Learning Math'
  },
  {
    id: 'bookreader-pro',
    name: 'BookReader Pro',
    tagline: 'Listen While Reading with Word Highlighting',
    description: 'Audiobook reading combined with intelligent word highlighting',
    accentColor: '#a78bfa',
    accentLight: '#c4b5fd',
    icon: '📖',
    features: ['Word-by-word highlighting', 'Natural narration', 'Reading comprehension'],
    cta: 'Start Reading'
  },
  {
    id: 'languagelens',
    name: 'LanguageLens',
    tagline: 'Master Languages with AI Pronunciation Coach',
    description: 'Real-time pronunciation guidance and language mastery tools',
    accentColor: '#3b82f6',
    accentLight: '#60a5fa',
    icon: '🌐',
    features: ['Pronunciation feedback', 'Interactive lessons', 'Fluency tracking'],
    cta: 'Start Learning Languages'
  }
];

// Create HyperFrames HTML composition for each tutorial
function createHyperFramesComposition(tutorial) {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${tutorial.name} Tutorial</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            width: 1920px;
            height: 1080px;
            background: linear-gradient(135deg, ${tutorial.accentColor}15 0%, ${tutorial.accentColor}05 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
        }

        .container {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 60px;
            position: relative;
        }

        .background-shapes {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            overflow: hidden;
            z-index: 0;
        }

        .shape {
            position: absolute;
            border-radius: 50%;
            opacity: 0.1;
        }

        .shape-1 {
            width: 400px;
            height: 400px;
            background: ${tutorial.accentColor};
            top: -100px;
            right: -100px;
        }

        .shape-2 {
            width: 300px;
            height: 300px;
            background: ${tutorial.accentLight};
            bottom: 100px;
            left: -50px;
        }

        .content {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 900px;
        }

        .icon {
            font-size: 120px;
            margin-bottom: 30px;
            opacity: 0;
            animation: slideInDown 0.8s ease-out forwards;
        }

        .title {
            font-size: 72px;
            font-weight: 700;
            color: #1a1a1a;
            margin-bottom: 20px;
            opacity: 0;
            animation: slideInDown 0.8s ease-out 0.2s forwards;
            letter-spacing: -1px;
        }

        .tagline {
            font-size: 36px;
            color: ${tutorial.accentColor};
            font-weight: 600;
            margin-bottom: 40px;
            opacity: 0;
            animation: slideInDown 0.8s ease-out 0.4s forwards;
        }

        .description {
            font-size: 24px;
            color: #4a4a4a;
            line-height: 1.6;
            margin-bottom: 50px;
            opacity: 0;
            animation: slideInUp 0.8s ease-out 0.6s forwards;
        }

        .features {
            display: flex;
            justify-content: center;
            gap: 40px;
            margin-bottom: 40px;
            opacity: 0;
            animation: slideInUp 0.8s ease-out 0.8s forwards;
        }

        .feature {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 12px;
        }

        .feature-icon {
            width: 60px;
            height: 60px;
            background: ${tutorial.accentColor}20;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 28px;
        }

        .feature-text {
            font-size: 18px;
            color: #333;
            font-weight: 500;
        }

        .cta-button {
            background: linear-gradient(135deg, ${tutorial.accentColor}, ${tutorial.accentLight});
            color: white;
            border: none;
            padding: 18px 50px;
            font-size: 20px;
            font-weight: 600;
            border-radius: 50px;
            cursor: pointer;
            box-shadow: 0 10px 30px ${tutorial.accentColor}30;
            opacity: 0;
            animation: slideInUp 0.8s ease-out 1s forwards;
            transition: all 0.3s ease;
        }

        .cta-button:hover {
            transform: translateY(-4px);
            box-shadow: 0 15px 40px ${tutorial.accentColor}40;
        }

        .watermark {
            position: absolute;
            bottom: 20px;
            right: 30px;
            font-size: 14px;
            color: #999;
            opacity: 0.5;
        }

        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes slideInUp {
            from {
                opacity: 0;
                transform: translateY(40px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @keyframes pulse {
            0%, 100% {
                transform: scale(1);
            }
            50% {
                transform: scale(1.05);
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="background-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
        </div>

        <div class="content">
            <div class="icon">${tutorial.icon}</div>
            <h1 class="title">${tutorial.name}</h1>
            <p class="tagline">${tutorial.tagline}</p>
            <p class="description">${tutorial.description}</p>

            <div class="features">
                ${tutorial.features.map((feature, i) => `
                    <div class="feature" style="animation-delay: ${0.9 + i * 0.1}s">
                        <div class="feature-icon">✓</div>
                        <div class="feature-text">${feature}</div>
                    </div>
                `).join('')}
            </div>

            <button class="cta-button">${tutorial.cta}</button>
        </div>

        <div class="watermark">AI Tutorial • ${new Date().getFullYear()}</div>
    </div>

    <script>
        // Optional: Add GSAP animations for more dynamic effects
        window.addEventListener('load', () => {
            // Subtle floating animation on the entire content
            gsap.to('.content', {
                y: 20,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 1
            });
        });
    </script>
</body>
</html>`;

  return html;
}

// Create package.json for HyperFrames
function createPackageJson(tutorial) {
  const pkg = {
    name: `${tutorial.id}-tutorial`,
    version: '1.0.0',
    description: `${tutorial.name} tutorial video`,
    scripts: {
      dev: 'npx --yes hyperframes@0.4.42 preview',
      check: 'npx --yes hyperframes@0.4.42 lint',
      render: 'npx --yes hyperframes@0.4.42 render',
      publish: 'npx --yes hyperframes@0.4.42 publish'
    }
  };

  return JSON.stringify(pkg, null, 2);
}

// Create hyperframes.json metadata
function createHyperFramesJson(tutorial) {
  const meta = {
    id: tutorial.id,
    name: tutorial.name,
    width: 1920,
    height: 1080,
    duration: 8,
    fps: 30,
    format: 'mp4'
  };

  return JSON.stringify(meta, null, 2);
}

// Create meta.json
function createMetaJson() {
  return JSON.stringify(
    { version: '0.4.42' },
    null,
    2
  );
}

// Generate tutorial composition files
function generateCompositions() {
  console.log('🎬 Generating HyperFrames tutorial compositions...\n');

  for (const tutorial of tutorials) {
    const tutorialDir = path.join(OUTPUT_DIR, tutorial.id);

    // Create directory
    if (!fs.existsSync(tutorialDir)) {
      fs.mkdirSync(tutorialDir, { recursive: true });
    }

    // Write index.html
    fs.writeFileSync(
      path.join(tutorialDir, 'index.html'),
      createHyperFramesComposition(tutorial)
    );

    // Write package.json
    fs.writeFileSync(
      path.join(tutorialDir, 'package.json'),
      createPackageJson(tutorial)
    );

    // Write hyperframes.json
    fs.writeFileSync(
      path.join(tutorialDir, 'hyperframes.json'),
      createHyperFramesJson(tutorial)
    );

    // Write meta.json
    fs.writeFileSync(
      path.join(tutorialDir, 'meta.json'),
      createMetaJson()
    );

    console.log(`✅ ${tutorial.name}`);
    console.log(`   📁 ${tutorialDir}`);
    console.log(`   📄 index.html (HyperFrames composition)`);
    console.log('');
  }

  console.log('✨ All tutorial compositions generated!\n');
}

// Create master index page
function createMasterIndex() {
  const cards = tutorials.map(t => {
    const dir = t.id;
    return `
    <div class="tutorial-card" style="border-left: 4px solid ${t.accentColor}">
      <div class="card-icon">${t.icon}</div>
      <h3>${t.name}</h3>
      <p class="tagline">${t.tagline}</p>
      <p class="description">${t.description}</p>
      <div class="card-features">
        ${t.features.map(f => `<span class="feature-tag">${f}</span>`).join('')}
      </div>
      <div class="card-actions">
        <a href="${dir}/" class="btn btn-preview">Preview Composition</a>
        <code class="cmd">cd ${dir} && npm run render</code>
      </div>
    </div>
    `;
  }).join('');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Tutorial Video Generator</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            padding: 40px 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        header {
            text-align: center;
            color: white;
            margin-bottom: 50px;
        }

        h1 {
            font-size: 2.5em;
            margin-bottom: 15px;
        }

        .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
        }

        .instructions {
            background: white;
            padding: 25px;
            border-radius: 12px;
            margin-bottom: 40px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }

        .instructions h2 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.3em;
        }

        .instructions ol {
            margin-left: 20px;
            line-height: 1.8;
        }

        .instructions li {
            margin-bottom: 12px;
        }

        .instructions code {
            background: #f5f5f5;
            padding: 2px 8px;
            border-radius: 4px;
            font-family: monospace;
            color: #d63384;
        }

        .tutorials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-bottom: 40px;
        }

        .tutorial-card {
            background: white;
            border-radius: 12px;
            padding: 25px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        }

        .tutorial-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 30px rgba(0,0,0,0.2);
        }

        .card-icon {
            font-size: 40px;
            margin-bottom: 15px;
        }

        .tutorial-card h3 {
            font-size: 1.3em;
            color: #333;
            margin-bottom: 8px;
        }

        .tagline {
            color: #667eea;
            font-weight: 600;
            margin-bottom: 12px;
            font-size: 0.95em;
        }

        .description {
            color: #666;
            margin-bottom: 15px;
            line-height: 1.5;
            font-size: 0.9em;
        }

        .card-features {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 20px;
        }

        .feature-tag {
            background: #f0f0f0;
            color: #666;
            padding: 4px 10px;
            border-radius: 20px;
            font-size: 0.8em;
        }

        .card-actions {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .btn {
            display: inline-block;
            padding: 10px 15px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
            text-align: center;
            transition: all 0.3s ease;
            font-size: 0.9em;
        }

        .btn:hover {
            background: #5568d3;
            transform: translateX(2px);
        }

        .btn-preview {
            background: #667eea;
        }

        .btn-preview:hover {
            background: #5568d3;
        }

        .cmd {
            background: #f5f5f5;
            padding: 8px 12px;
            border-left: 2px solid #667eea;
            border-radius: 4px;
            font-family: monospace;
            font-size: 0.85em;
            color: #333;
        }

        .tech-stack {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }

        .tech-stack h2 {
            color: #667eea;
            margin-bottom: 15px;
        }

        .tech-items {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .tech-item {
            padding: 12px;
            background: #f9f9f9;
            border-radius: 6px;
            border-left: 3px solid #667eea;
        }

        .tech-item strong {
            color: #667eea;
        }

        footer {
            text-align: center;
            color: white;
            padding-top: 30px;
            border-top: 1px solid rgba(255,255,255,0.2);
            font-size: 0.9em;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 1.8em;
            }

            .tutorials-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎬 AI Tutorial Video Generator</h1>
            <p class="subtitle">Create engaging tutorial videos for educational apps using HyperFrames + Higgsfield DOP</p>
        </header>

        <div class="instructions">
            <h2>🚀 Quick Start</h2>
            <ol>
                <li>Navigate to any tutorial folder: <code>cd mathtutor-pro</code></li>
                <li>Preview the composition: <code>npm run dev</code></li>
                <li>Render to MP4: <code>npm run render</code> (requires FFmpeg)</li>
                <li>Find output: <code>mathtutor-pro.mp4</code></li>
                <li>Optional: Publish to registry: <code>npm run publish</code></li>
            </ol>
        </div>

        <div class="tech-stack">
            <h2>🛠️  Tech Stack</h2>
            <div class="tech-items">
                <div class="tech-item">
                    <strong>HyperFrames</strong>: Modern HTML-based video composition
                </div>
                <div class="tech-item">
                    <strong>GSAP</strong>: Advanced animation library
                </div>
                <div class="tech-item">
                    <strong>Higgsfield DOP</strong>: Image-to-video animation
                </div>
                <div class="tech-item">
                    <strong>FFmpeg</strong>: Video rendering engine
                </div>
            </div>
        </div>

        <h2 style="color: white; margin-bottom: 25px;">📚 Tutorial Compositions</h2>
        <div class="tutorials-grid">
            ${cards}
        </div>

        <footer>
            <p>Generated with ❤️ for educational content creators</p>
            <p>Part of the RHYTHMIX creative pipeline</p>
        </footer>
    </div>
</body>
</html>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html);
  console.log(`✅ Master index created: ${path.join(OUTPUT_DIR, 'index.html')}\n`);
}

// Main execution
function main() {
  console.log('╔════════════════════════════════════════╗');
  console.log('║  AI Tutorial Video Generator           ║');
  console.log('║  HyperFrames + Higgsfield Pipeline     ║');
  console.log('╚════════════════════════════════════════╝\n');

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Generate all compositions
  generateCompositions();

  // Create master index
  createMasterIndex();

  console.log('📁 Output directory:', OUTPUT_DIR);
  console.log('\n💡 Next steps:');
  console.log('   1. cd videos/tutorials/mathtutor-pro');
  console.log('   2. npm run dev         (preview)');
  console.log('   3. npm run render      (render to MP4)');
  console.log('   4. Check mathtutor-pro.mp4\n');
}

main();
