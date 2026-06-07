#!/bin/bash

# SURGE Episode 1: "Discover" - Animation Renderer
# Professional 13-minute animated series pilot
# Renders to H.264 MP4 for iPad viewing

set -e

EPISODE_DIR="/home/user/jamie-wigg/surge-episode-01"
OUTPUT_FILE="$EPISODE_DIR/surge-episode-01-discover.mp4"
TEMP_DIR="/tmp/surge-episode-01-frames"

echo "================================================"
echo "SURGE - Episode 1: Discover"
echo "Professional Animation Renderer"
echo "================================================"
echo ""

# Create output directory
mkdir -p "$TEMP_DIR"
echo "✓ Created temporary frame directory"

# Create the animation rendering script (Node.js)
cat > "$TEMP_DIR/render.js" << 'RENDER_SCRIPT'
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');
const { spawn } = require('child_process');

const WIDTH = 1920;
const HEIGHT = 1080;
const FPS = 30;
const TOTAL_DURATION = 780; // 13 minutes in seconds
const TOTAL_FRAMES = TOTAL_DURATION * FPS;

console.log('SURGE Episode 1: Discover');
console.log(`Resolution: ${WIDTH}x${HEIGHT}`);
console.log(`Duration: ${TOTAL_DURATION}s (${TOTAL_DURATION/60} minutes)`);
console.log(`Total Frames: ${TOTAL_FRAMES}`);
console.log('');

// Scene definitions
const scenes = [
  { name: 'Morning in Chaos', startFrame: 0, endFrame: 45*30, bgColor: '#FFE5CC', characters: ['ziggy'] },
  { name: 'Walking to School', startFrame: 45*30, endFrame: 105*30, bgColor: '#E8F4F8', characters: ['ziggy', 'mira'] },
  { name: 'Entering School', startFrame: 105*30, endFrame: 150*30, bgColor: '#D0D0D0', characters: ['ziggy', 'mira'] },
  { name: 'The Cafeteria', startFrame: 150*30, endFrame: 240*30, bgColor: '#FFF8DC', characters: ['ziggy', 'mira', 'echo'] },
  { name: 'After School - Office', startFrame: 240*30, endFrame: 285*30, bgColor: '#E8F5E9', characters: ['ziggy', 'mschen'] },
  { name: 'The Realization', startFrame: 285*30, endFrame: 330*30, bgColor: '#F3E5F5', characters: ['ziggy', 'echo'] },
  { name: 'The Awakening', startFrame: 330*30, endFrame: 405*30, bgColor: '#FFF8DC', characters: ['ziggy', 'mira', 'mschen'] },
  { name: 'First Test', startFrame: 405*30, endFrame: 450*30, bgColor: '#E0F2F1', characters: ['ziggy'] },
  { name: 'Cliffhanger', startFrame: 450*30, endFrame: 495*30, bgColor: '#1a1a2e', characters: ['ziggy', 'echo'] },
  { name: 'Epilogue', startFrame: 495*30, endFrame: 780*30, bgColor: '#FFF4E6', characters: ['ziggy', 'mira'] }
];

// Character color palette
const charColors = {
  ziggy: '#FF8C00',
  mira: '#A8B89A',
  echo: '#1a1a2e',
  mschen: '#1B5E5E',
  jordan: '#4A90E2',
  kai: '#FFD700'
};

function getCurrentScene(frameNum) {
  for (const scene of scenes) {
    if (frameNum >= scene.startFrame && frameNum < scene.endFrame) {
      return scene;
    }
  }
  return scenes[scenes.length - 1];
}

function drawCharacter(ctx, charName, x, y, scale, alpha, emotion) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  const color = charColors[charName] || '#333';

  // Character body (circle for now, will be replaced with character designs)
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, 0, 50, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#333';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Character name
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(charName.substring(0, 1).toUpperCase(), 0, 0);

  ctx.restore();
}

function drawSceneInfo(ctx, scene, frameNum) {
  ctx.fillStyle = '#333';
  ctx.font = 'bold 32px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(scene.name, 60, 120);

  const seconds = Math.floor(frameNum / 30);
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  ctx.font = '16px Arial';
  ctx.fillStyle = '#666';
  ctx.fillText(`${minutes}:${secs.toString().padStart(2, '0')}`, 60, 160);
}

function renderFrame(frameNum) {
  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  const scene = getCurrentScene(frameNum);
  const sceneProgress = (frameNum - scene.startFrame) / (scene.endFrame - scene.startFrame);

  // Background
  ctx.fillStyle = scene.bgColor;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  // Draw characters
  if (scene.characters.includes('ziggy')) {
    const ziggyX = 400 + Math.sin(sceneProgress * Math.PI * 2) * 50;
    drawCharacter(ctx, 'ziggy', ziggyX, 700, 1 + sceneProgress * 0.2, 0.9, 'energetic');
  }
  if (scene.characters.includes('mira')) {
    const miraX = 1200 - Math.sin(sceneProgress * Math.PI * 2) * 50;
    drawCharacter(ctx, 'mira', miraX, 700, 0.9, 0.8, 'calm');
  }
  if (scene.characters.includes('echo')) {
    const echoY = 300 + sceneProgress * 200;
    const echoAlpha = Math.min(sceneProgress * 2, 1);
    drawCharacter(ctx, 'echo', 960, echoY, 1.2 + sceneProgress * 0.3, echoAlpha, 'chaotic');
  }
  if (scene.characters.includes('mschen')) {
    drawCharacter(ctx, 'mschen', 1400, 600, 0.95, 0.85, 'wise');
  }

  // Scene info
  drawSceneInfo(ctx, scene, frameNum);

  return canvas.toBuffer('image/png');
}

// Render all frames
console.log('Rendering frames...');
const startTime = Date.now();
let lastProgress = 0;

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const frameBuffer = renderFrame(i);
  const framePath = path.join('/tmp/surge-episode-01-frames', `frame_${i.toString().padStart(8, '0')}.png`);
  fs.writeFileSync(framePath, frameBuffer);

  const progress = Math.floor((i / TOTAL_FRAMES) * 100);
  if (progress % 10 === 0 && progress !== lastProgress) {
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`  [${progress}%] - ${elapsed}s elapsed`);
    lastProgress = progress;
  }
}

const renderTime = ((Date.now() - startTime) / 1000).toFixed(1);
console.log(`✓ Rendered ${TOTAL_FRAMES} frames in ${renderTime}s`);

// Encode with FFmpeg
console.log('Encoding to H.264 MP4...');
const ffmpegCmd = spawn('ffmpeg', [
  '-framerate', '30',
  '-pattern_type', 'glob',
  '-i', '/tmp/surge-episode-01-frames/frame_*.png',
  '-c:v', 'libx264',
  '-preset', 'fast',
  '-crf', '18',
  '-pix_fmt', 'yuv420p',
  '-movflags', 'faststart',
  '/home/user/jamie-wigg/surge-episode-01/surge-episode-01-discover.mp4'
]);

ffmpegCmd.on('close', (code) => {
  if (code === 0) {
    console.log('✓ Episode 1 rendering complete!');
    console.log('');
    console.log('Output: /home/user/jamie-wigg/surge-episode-01/surge-episode-01-discover.mp4');
    console.log('Ready for iPad review');
  } else {
    console.error(`FFmpeg exited with code ${code}`);
    process.exit(1);
  }
});

RENDER_SCRIPT

echo "✓ Created rendering script"

# Install canvas if needed
if ! npm ls canvas > /dev/null 2>&1; then
  echo "Installing canvas library..."
  npm install canvas
fi

echo ""
echo "Rendering 13-minute episode..."
echo "(This may take several minutes)"
echo ""

# Run the renderer
node "$TEMP_DIR/render.js"

# Verify output
if [ -f "$OUTPUT_FILE" ]; then
  echo ""
  echo "✓ SURGE Episode 1 successfully created!"
  echo ""
  ls -lh "$OUTPUT_FILE"
  echo ""
  echo "File ready for iPad viewing"
  echo "Location: $OUTPUT_FILE"
else
  echo "Error: Output file not created"
  exit 1
fi
