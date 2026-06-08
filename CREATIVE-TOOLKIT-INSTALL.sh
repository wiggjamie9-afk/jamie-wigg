#!/bin/bash
echo "🎬 Installing Complete Creative Toolkit..."
echo ""

# 1. Music Generation
echo "1. Setting up music generation..."
npm install tone meyda music-theory --save
echo "✓ Tone.js (music synthesis)"

# 2. Video & Animation
echo "2. Video & animation tools..."
npm install ffmpeg-static puppeteer opencv4nodejs --save
echo "✓ Video processing stack"

# 3. Image Generation & Processing
echo "3. Image generation & processing..."
npm install sharp jimp canvas --save
echo "✓ Image processing"

# 4. 3D & Graphics
echo "4. 3D graphics..."
npm install babylon.js oimo webgl-constants --save
echo "✓ Babylon.js (3D engine)"

# 5. App Development
echo "5. App frameworks..."
npm install react-native expo next.js nuxt --save
echo "✓ App frameworks"

# 6. Audio Processing
echo "6. Audio processing..."
npm install wavesurfer.js web-audio-api tone.js --save
echo "✓ Audio tools"

# 7. Algorithms & Math
echo "7. Math & algorithms..."
npm install numeric ml.js mathjs --save
echo "✓ Computation libraries"

# 8. Data & State
echo "8. Data management..."
npm install redux zustand immer --save
echo "✓ State management"

echo ""
echo "✓ Creative Toolkit Complete"
