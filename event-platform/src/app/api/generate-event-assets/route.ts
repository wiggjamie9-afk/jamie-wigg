import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';
import path from 'path';

const execAsync = promisify(exec);

// Supported generators
type GeneratorType = 'replicate' | 'leonardo' | 'craiyon';
type AssetType = 'image' | 'script' | 'both';

interface GenerateRequest {
  eventName: string;
  eventDescription?: string;
  imageGenerator?: GeneratorType;
  scriptType?: 'narration' | 'social' | 'event-description' | 'video-hook' | 'product-pitch';
  assetType?: AssetType;
}

interface GenerateResponse {
  success: boolean;
  image?: {
    url: string;
    path: string;
  };
  script?: {
    content: string;
    type: string;
  };
  error?: string;
}

// Ensure content-automation directory exists
const contentAutomationDir = path.join(process.cwd(), '..', 'content-automation');

async function generateImage(
  eventName: string,
  generator: GeneratorType = 'replicate'
): Promise<{ url: string; path: string } | null> {
  try {
    const outputDir = path.join(process.cwd(), 'public', 'generated-assets', 'images');
    await fs.mkdir(outputDir, { recursive: true });

    const timestamp = Date.now();
    const outputPath = path.join(outputDir, `event-${timestamp}.png`);
    const pythonScript = path.join(contentAutomationDir, 'image_generator.py');

    const command = `python3 ${pythonScript} --title "${eventName}" --generator ${generator} --output "${outputPath}"`;

    console.log(`Executing: ${command}`);
    await execAsync(command);

    const publicUrl = `/generated-assets/images/event-${timestamp}.png`;

    return {
      url: publicUrl,
      path: outputPath,
    };
  } catch (error) {
    console.error('Image generation error:', error);
    return null;
  }
}

async function generateScript(
  eventName: string,
  scriptType: string = 'event-description'
): Promise<string | null> {
  try {
    const pythonScript = path.join(contentAutomationDir, 'script_generator.py');

    const command = `python3 ${pythonScript} --prompt "${eventName}" --type ${scriptType}`;

    console.log(`Executing: ${command}`);
    const { stdout } = await execAsync(command);

    // Extract script content from output
    return stdout.trim();
  } catch (error) {
    console.error('Script generation error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();

    const {
      eventName,
      eventDescription,
      imageGenerator = 'replicate',
      scriptType = 'event-description',
      assetType = 'both',
    } = body;

    if (!eventName) {
      return NextResponse.json(
        { success: false, error: 'Event name is required' },
        { status: 400 }
      );
    }

    const response: GenerateResponse = { success: true };

    // Generate image
    if (assetType === 'image' || assetType === 'both') {
      console.log(`Generating image for: ${eventName}`);
      const image = await generateImage(eventName, imageGenerator);

      if (image) {
        response.image = image;
      }
    }

    // Generate script
    if (assetType === 'script' || assetType === 'both') {
      console.log(`Generating script for: ${eventName}`);
      const script = await generateScript(
        eventDescription || eventName,
        scriptType
      );

      if (script) {
        response.script = {
          content: script,
          type: scriptType,
        };
      }
    }

    if (!response.image && !response.script) {
      return NextResponse.json(
        { success: false, error: 'No assets generated' },
        { status: 500 }
      );
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error('Generate assets error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check available generators and script types
export async function GET() {
  return NextResponse.json({
    imageGenerators: ['replicate', 'leonardo', 'craiyon'],
    scriptTypes: ['narration', 'social', 'event-description', 'video-hook', 'product-pitch'],
    requiresEnv: {
      replicate: 'REPLICATE_API_TOKEN',
      leonardo: 'LEONARDO_API_KEY',
      craiyon: 'none',
    },
  });
}
