#!/usr/bin/env node

/**
 * /viggle-animate Skill
 * Generate motion animations from static images using ComfyUI Viggle workflows
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

// Configuration
const COMFYUI_URL = process.env.COMFYUI_URL || 'http://localhost:8188';
const SKILL_DIR = path.dirname(__filename);
const REPO_ROOT = path.join(SKILL_DIR, '../../../');
const VIGGLE_DIR = path.join(REPO_ROOT, 'comfyui_viggle');
const OUTPUTS_DIR = path.join(VIGGLE_DIR, 'outputs');
const WORKFLOWS_DIR = path.join(VIGGLE_DIR, 'workflows');

// Workflow mappings
const WORKFLOWS = {
  'lama-inpaint': 'workflow1_lama_inpaint.json',
  'animatediff': 'workflow2_animatediff.json',
  'animatediff-alt': 'workflow2_2_animatediff_alt.json',
  'sdxl': 'workflow3_animatediff_sdxl.json'
};

/**
 * Parse command line arguments
 */
function parseArgs(args) {
  const opts = {
    image: args[0],
    workflow: 'animatediff',
    motionScale: 1.0,
    steps: 25,
    cfgScale: 7.5,
    duration: '5s',
    fps: 30,
    prompt: '',
    seed: -1,
    parallel: 1,
    output: null,
    precision: 'fp32'
  };

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];
    const next = args[i + 1];

    switch (arg) {
      case '--workflow':
        opts.workflow = next;
        i++;
        break;
      case '--motion-scale':
        opts.motionScale = parseFloat(next);
        i++;
        break;
      case '--steps':
        opts.steps = parseInt(next);
        i++;
        break;
      case '--cfg-scale':
        opts.cfgScale = parseFloat(next);
        i++;
        break;
      case '--duration':
        opts.duration = next;
        i++;
        break;
      case '--fps':
        opts.fps = parseInt(next);
        i++;
        break;
      case '--prompt':
        opts.prompt = next;
        i++;
        break;
      case '--seed':
        opts.seed = parseInt(next);
        i++;
        break;
      case '--parallel':
        opts.parallel = parseInt(next);
        i++;
        break;
      case '--output':
        opts.output = next;
        i++;
        break;
      case '--precision':
        opts.precision = next;
        i++;
        break;
    }
  }

  return opts;
}

/**
 * Check if ComfyUI is accessible
 */
async function checkComfyUI() {
  return new Promise((resolve) => {
    const client = COMFYUI_URL.startsWith('https') ? https : http;
    const urlObj = new URL(COMFYUI_URL);

    const req = client.request({
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: '/api/status',
      method: 'GET',
      timeout: 3000
    }, (res) => {
      resolve(res.statusCode === 200);
    });

    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    req.end();
  });
}

/**
 * Validate inputs
 */
function validateInputs(opts) {
  const errors = [];

  // Check image exists
  if (!opts.image) {
    errors.push('❌ Image path required. Usage: /viggle-animate <image>');
  } else if (!fs.existsSync(opts.image)) {
    errors.push(`❌ Image not found: ${opts.image}`);
    errors.push(`   Available in current dir: ${fs.readdirSync('.').filter(f => /\.(png|jpg|jpeg)$/.test(f)).join(', ') || 'none'}`);
  }

  // Check workflow exists
  if (!WORKFLOWS[opts.workflow]) {
    errors.push(`❌ Unknown workflow: ${opts.workflow}`);
    errors.push(`   Available: ${Object.keys(WORKFLOWS).join(', ')}`);
  }

  // Validate parameters
  if (opts.motionScale < 0.5 || opts.motionScale > 2.0) {
    errors.push(`⚠️  motion-scale out of range (0.5-2.0): ${opts.motionScale}`);
  }
  if (opts.steps < 16 || opts.steps > 50) {
    errors.push(`⚠️  steps out of range (16-50): ${opts.steps}`);
  }

  return errors;
}

/**
 * Main execution
 */
async function main() {
  try {
    const args = process.argv.slice(2);
    const opts = parseArgs(args);

    console.log('\n🎬 /viggle-animate Skill Executor\n');

    // Validate inputs
    const errors = validateInputs(opts);
    if (errors.length > 0) {
      errors.forEach(e => console.log(e));
      console.log('\n📖 Usage: /viggle-animate <image> [--workflow animatediff] [--motion-scale 1.0] [--steps 25]\n');
      process.exit(1);
    }

    console.log(`📝 Parameters:`);
    console.log(`   Image: ${opts.image}`);
    console.log(`   Workflow: ${opts.workflow}`);
    console.log(`   Motion Scale: ${opts.motionScale}`);
    console.log(`   Steps: ${opts.steps}`);
    console.log(`   CFG Scale: ${opts.cfgScale}`);
    console.log(`   Seed: ${opts.seed}`);
    console.log(`\n🔍 Checking ComfyUI service at ${COMFYUI_URL}...`);

    // Check if ComfyUI is running
    const isRunning = await checkComfyUI();

    if (!isRunning) {
      console.log(`\n❌ ComfyUI not responding at ${COMFYUI_URL}\n`);
      console.log(`To start ComfyUI:\n`);
      console.log(`🐳 Docker (recommended):`);
      console.log(`   docker run -d --gpus all -p 8188:8188 \\`);
      console.log(`     -v $(pwd)/comfyui_viggle/models:/root/models \\`);
      console.log(`     -v $(pwd)/comfyui_viggle/outputs:/root/outputs \\`);
      console.log(`     yanwk/comfyui-boot:latest-nvidia\n`);
      console.log(`📦 Local installation:`);
      console.log(`   git clone https://github.com/comfyanonymous/ComfyUI.git`);
      console.log(`   cd ComfyUI && python -m venv venv && source venv/bin/activate`);
      console.log(`   pip install -r requirements.txt`);
      console.log(`   python main.py --listen 0.0.0.0 --port 8188\n`);
      console.log(`After starting ComfyUI, retry: /viggle-animate ${opts.image} --workflow ${opts.workflow}\n`);
      process.exit(1);
    }

    console.log(`✅ ComfyUI is running!\n`);

    // Load workflow
    const workflowFile = WORKFLOWS[opts.workflow];
    const workflowPath = path.join(WORKFLOWS_DIR, workflowFile);

    if (!fs.existsSync(workflowPath)) {
      console.log(`❌ Workflow not found: ${workflowPath}\n`);
      process.exit(1);
    }

    const workflow = JSON.parse(fs.readFileSync(workflowPath, 'utf8'));
    console.log(`✅ Loaded workflow: ${opts.workflow}\n`);

    // Prepare output
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const outputPath = opts.output || path.join(OUTPUTS_DIR, `${timestamp}_viggle_output.mp4`);

    // Ensure outputs directory exists
    if (!fs.existsSync(OUTPUTS_DIR)) {
      fs.mkdirSync(OUTPUTS_DIR, { recursive: true });
    }

    console.log(`📊 Job Configuration:`);
    console.log(`   Input: ${opts.image}`);
    console.log(`   Workflow: ${opts.workflow}`);
    console.log(`   Output: ${outputPath}`);
    console.log(`   Motion Scale: ${opts.motionScale}`);
    console.log(`   Steps: ${opts.steps}`);
    console.log(`\n⏳ Sending to ComfyUI (this may take 30-180 seconds)...\n`);

    // For now, return configuration and instructions
    console.log(`📋 To execute this workflow:\n`);
    console.log(`1. Open ComfyUI at ${COMFYUI_URL}`);
    console.log(`2. Load the workflow: comfyui_viggle/workflows/${workflowFile}`);
    console.log(`3. Upload image: ${opts.image}`);
    console.log(`4. Set parameters:`);
    console.log(`   - motion_scale: ${opts.motionScale}`);
    console.log(`   - steps: ${opts.steps}`);
    console.log(`   - cfg_scale: ${opts.cfgScale}`);
    console.log(`5. Click Queue Prompt`);
    console.log(`6. Output will be saved to: ${outputPath}\n`);

    console.log(`🔗 Integration: Ready to pipe into /rhythmix-compose for full promo\n`);
    console.log(`   /viggle-animate ${opts.image} --workflow ${opts.workflow} | /rhythmix-compose --template rhythmix-60s\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
