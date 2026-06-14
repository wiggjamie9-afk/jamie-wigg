#!/usr/bin/env node

/**
 * AI Tutorial Video Generator
 * Generates 3 tutorial videos using Higgsfield DOP (image-to-video)
 * for MathTutor Pro, BookReader Pro, and LanguageLens
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const HIGGSFIELD_API_KEY = process.env.HIGGSFIELD_API_KEY;
const HIGGSFIELD_SECRET = process.env.HIGGSFIELD_SECRET;
const BASE_URL = 'https://api.higgsfield.ai';
const OUTPUT_DIR = path.join(process.cwd(), 'videos', 'tutorials');

// Tutorial definitions with prompts and metadata
const tutorials = [
  {
    id: 'mathtutor-pro',
    name: 'MathTutor Pro',
    title: 'Solve Math Problems Step-by-Step',
    description: 'MathTutor Pro helps you master mathematics with AI-powered step-by-step guidance',
    avatarPrompt: 'A friendly, professional math tutor avatar with a warm smile, wearing smart casual attire. The avatar should have an engaging expression and be positioned against a clean, bright background with subtle mathematical elements (equations, graphs) softly visible. Professional, trustworthy, encouraging demeanor. 3D character style.',
    motionPrompt: 'The math tutor avatar is enthusiastically gesturing while explaining a math concept. The tutor points to mathematical symbols and equations appearing beside them, showing hand movements that convey explanation and teaching. The avatar nods encouragingly and makes natural teaching gestures. Camera stays close on the face and upper body.',
    textOverlay: 'Solve math problems step-by-step with AI',
    accentColor: '#10b981',
    duration: 8
  },
  {
    id: 'bookreader-pro',
    name: 'BookReader Pro',
    title: 'Listen While Reading with Word Highlighting',
    description: 'BookReader Pro combines audiobook reading with intelligent word highlighting',
    avatarPrompt: 'A warm, encouraging reading buddy avatar with a gentle smile, holding or surrounded by books. The avatar has an inviting, approachable look, positioned with soft warm lighting. Should convey enthusiasm for reading and learning. Professional illustration style with a cozy atmosphere.',
    motionPrompt: 'The reading buddy avatar is gesturing encouragingly at a book, pointing to text while moving lips as if reading aloud. The avatar makes welcoming hand gestures and nods supportively. Natural hand movements that suggest highlighting words or turning pages. The avatar appears engaged and warm.',
    textOverlay: 'Listen while reading with word highlighting',
    accentColor: '#a78bfa',
    duration: 8
  },
  {
    id: 'languagelens',
    name: 'LanguageLens',
    title: 'Master Languages with AI Pronunciation Coach',
    description: 'LanguageLens provides real-time pronunciation guidance and language mastery',
    avatarPrompt: 'An enthusiastic language tutor avatar with an expressive, passionate expression. The avatar should project confidence and joy, with diverse, inclusive features. Positioned against a multicultural background suggesting languages (flags, globes, text in different scripts). Professional, energetic style.',
    motionPrompt: 'The language tutor avatar is speaking animatedly with expressive face and hand movements. The avatar demonstrates pronunciation by moving mouth and gesturing to show how to form words. Natural enthusiasm with animated hands showing language concepts. Eye contact with camera, encouraging nodding.',
    textOverlay: 'Master any language with AI pronunciation coach',
    accentColor: '#3b82f6',
    duration: 8
  }
];

// Helper to make authenticated API calls to Higgsfield
async function callHiggsfield(endpoint, method = 'POST', body = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${HIGGSFIELD_API_KEY}`,
      'X-Secret': HIGGSFIELD_SECRET,
      'Content-Type': 'application/json'
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Higgsfield API error: ${response.status} - ${error}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`API call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

// Generate avatar image using Soul text-to-image
async function generateAvatarImage(tutorial) {
  console.log(`\n📸 Generating avatar image for ${tutorial.name}...`);

  try {
    const result = await callHiggsfield('/v1/text_to_image', 'POST', {
      prompt: tutorial.avatarPrompt,
      width: 1080,
      height: 1080,
      steps: 30,
      seed: Math.floor(Math.random() * 1000000),
      model: 'soul',
      style: 'realistic'
    });

    if (result.image_url) {
      const imageData = await fetch(result.image_url).then(r => r.buffer());
      const imagePath = path.join(OUTPUT_DIR, `${tutorial.id}-avatar.png`);
      fs.writeFileSync(imagePath, imageData);
      console.log(`✅ Avatar saved: ${imagePath}`);
      return imagePath;
    }
  } catch (err) {
    console.error(`Failed to generate avatar for ${tutorial.name}:`, err.message);
    // Return placeholder if generation fails
    return createPlaceholderAvatar(tutorial);
  }
}

// Create a simple placeholder avatar (fallback)
function createPlaceholderAvatar(tutorial) {
  const placeholderPath = path.join(OUTPUT_DIR, `${tutorial.id}-avatar.png`);

  // Create a simple colored square with text as placeholder
  const svg = `<svg width="1080" height="1080" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${tutorial.accentColor};stop-opacity:0.8" />
        <stop offset="100%" style="stop-color:#000;stop-opacity:0.9" />
      </linearGradient>
    </defs>
    <rect width="1080" height="1080" fill="url(#grad)"/>
    <circle cx="540" cy="400" r="120" fill="rgba(255,255,255,0.3)"/>
    <text x="540" y="800" font-family="Arial" font-size="48" fill="white" text-anchor="middle" font-weight="bold">${tutorial.name}</text>
    <text x="540" y="860" font-family="Arial" font-size="32" fill="rgba(255,255,255,0.8)" text-anchor="middle">AI Tutor Avatar</text>
  </svg>`;

  // Convert SVG to PNG using ImageMagick if available, otherwise save as SVG
  try {
    const tempSvg = placeholderPath.replace('.png', '.svg');
    fs.writeFileSync(tempSvg, svg);
    execSync(`convert "${tempSvg}" "${placeholderPath}"`, { stdio: 'pipe' });
    fs.unlinkSync(tempSvg);
    console.log(`✅ Placeholder avatar created: ${placeholderPath}`);
  } catch (err) {
    // If ImageMagick not available, write SVG directly as PNG won't work
    console.warn(`⚠️  Could not convert SVG to PNG. Using SVG placeholder instead.`);
  }

  return placeholderPath;
}

// Generate motion video using DOP (image-to-video)
async function generateMotionVideo(tutorial, avatarImagePath) {
  console.log(`\n🎬 Generating motion video for ${tutorial.name}...`);

  try {
    // Read the avatar image
    const imageBuffer = fs.readFileSync(avatarImagePath);
    const base64Image = imageBuffer.toString('base64');

    // Call DOP API to animate the image
    const result = await callHiggsfield('/v1/image_to_video', 'POST', {
      image_base64: base64Image,
      prompt: tutorial.motionPrompt,
      duration: tutorial.duration,
      motion_strength: 0.6,
      fps: 24,
      model: 'dop'
    });

    if (result.video_url) {
      const videoData = await fetch(result.video_url).then(r => r.buffer());
      const videoPath = path.join(OUTPUT_DIR, `${tutorial.id}-tutorial.mp4`);
      fs.writeFileSync(videoPath, videoData);
      console.log(`✅ Tutorial video saved: ${videoPath}`);
      return videoPath;
    }
  } catch (err) {
    console.error(`Failed to generate motion video for ${tutorial.name}:`, err.message);
    return null;
  }
}

// Add text overlay to video using FFmpeg
async function addTextOverlay(videoPath, tutorial) {
  console.log(`\n✏️  Adding text overlay to ${tutorial.name}...`);

  const outputPath = videoPath.replace('.mp4', '-with-text.mp4');

  try {
    // FFmpeg filter for centered text with background
    const filter = `drawtext=text='${tutorial.textOverlay}':fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:fontsize=48:fontcolor=white:x=(w-text_w)/2:y=h-100:box=1:boxcolor=black@0.5:boxborderw=10`;

    execSync(`ffmpeg -i "${videoPath}" -vf "${filter}" -c:a copy "${outputPath}" -y 2>/dev/null`, {
      stdio: 'pipe'
    });

    console.log(`✅ Text overlay added: ${outputPath}`);
    return outputPath;
  } catch (err) {
    console.warn(`⚠️  Could not add text overlay with FFmpeg. Keeping original video.`);
    return videoPath;
  }
}

// Generate WebM version for better browser support
async function convertToWebM(videoPath) {
  console.log(`\n📦 Converting to WebM format...`);

  const webmPath = videoPath.replace('.mp4', '.webm');

  try {
    execSync(`ffmpeg -i "${videoPath}" -c:v libvpx-vp9 -b:v 1M -c:a libopus "${webmPath}" -y 2>/dev/null`, {
      stdio: 'pipe'
    });
    console.log(`✅ WebM version created: ${webmPath}`);
    return webmPath;
  } catch (err) {
    console.warn(`⚠️  Could not convert to WebM format.`);
    return null;
  }
}

// Generate index HTML page
function generateIndexHTML(tutorials) {
  const videosHtml = tutorials.map(t => {
    const videoPath = `${t.id}-tutorial.mp4`;
    const webmPath = `${t.id}-tutorial.webm`;

    return `
    <div class="tutorial-card">
      <div class="video-container">
        <video width="100%" height="auto" controls poster="">
          <source src="${videoPath}" type="video/mp4">
          <source src="${webmPath}" type="video/webm">
          Your browser does not support the video tag.
        </video>
      </div>
      <h3>${t.title}</h3>
      <p>${t.description}</p>
      <div class="download-links">
        <a href="${videoPath}" download class="btn btn-mp4">Download MP4</a>
        <a href="${webmPath}" download class="btn btn-webm">Download WebM</a>
      </div>
    </div>
    `;
  }).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI App Tutorials</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: #333;
            padding: 40px 20px;
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        h1 {
            text-align: center;
            color: white;
            margin-bottom: 50px;
            font-size: 2.5em;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .tutorials-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
        }

        .tutorial-card {
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .tutorial-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.3);
        }

        .video-container {
            width: 100%;
            aspect-ratio: 16 / 9;
            background: #000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .video-container video {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }

        .tutorial-card h3 {
            padding: 20px 20px 10px;
            color: #333;
            font-size: 1.3em;
        }

        .tutorial-card p {
            padding: 0 20px 20px;
            color: #666;
            line-height: 1.5;
            font-size: 0.95em;
        }

        .download-links {
            display: flex;
            gap: 10px;
            padding: 20px;
            border-top: 1px solid #eee;
        }

        .btn {
            flex: 1;
            padding: 10px 15px;
            border: none;
            border-radius: 6px;
            text-align: center;
            text-decoration: none;
            font-weight: 600;
            font-size: 0.85em;
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .btn-mp4 {
            background: #667eea;
            color: white;
        }

        .btn-mp4:hover {
            background: #5568d3;
            transform: translateY(-2px);
        }

        .btn-webm {
            background: #764ba2;
            color: white;
        }

        .btn-webm:hover {
            background: #5f3a85;
            transform: translateY(-2px);
        }

        .info {
            background: rgba(255,255,255,0.1);
            color: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            text-align: center;
        }

        @media (max-width: 768px) {
            h1 {
                font-size: 1.8em;
                margin-bottom: 30px;
            }

            .tutorials-grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>AI App Tutorials</h1>

        <div class="info">
            <p>Short tutorial videos for learning how to use AI-powered educational apps.</p>
            <p>Each video is optimized for mobile viewing and quick learning.</p>
        </div>

        <div class="tutorials-grid">
            ${videosHtml}
        </div>
    </div>
</body>
</html>`;

  const indexPath = path.join(OUTPUT_DIR, 'index.html');
  fs.writeFileSync(indexPath, html);
  console.log(`\n✅ Index HTML generated: ${indexPath}`);
}

// Main orchestration function
async function generateTutorials() {
  console.log('🎬 Starting AI Tutorial Video Generation');
  console.log('=====================================\n');

  if (!HIGGSFIELD_API_KEY || !HIGGSFIELD_SECRET) {
    console.error('❌ Higgsfield credentials not found in .env file');
    process.exit(1);
  }

  const completedTutorials = [];

  for (const tutorial of tutorials) {
    try {
      console.log(`\n🎯 Processing: ${tutorial.name}`);
      console.log('─'.repeat(50));

      // Step 1: Generate avatar image
      const avatarPath = await generateAvatarImage(tutorial);

      // Step 2: Generate motion video from avatar
      const videoPath = await generateMotionVideo(tutorial, avatarPath);

      if (videoPath) {
        // Step 3: Add text overlay
        const finalVideoPath = await addTextOverlay(videoPath, tutorial);

        // Step 4: Convert to WebM
        const webmPath = await convertToWebM(finalVideoPath);

        completedTutorials.push(tutorial);
        console.log(`\n✨ ${tutorial.name} tutorial completed!`);
      }
    } catch (err) {
      console.error(`\n❌ Error processing ${tutorial.name}:`, err.message);
    }
  }

  // Generate index HTML
  if (completedTutorials.length > 0) {
    generateIndexHTML(completedTutorials);
  }

  console.log('\n=====================================');
  console.log(`🎉 Generated ${completedTutorials.length}/${tutorials.length} tutorials`);
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  console.log(`🌐 View at: ${path.join(OUTPUT_DIR, 'index.html')}`);
}

// Run the generator
generateTutorials().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
