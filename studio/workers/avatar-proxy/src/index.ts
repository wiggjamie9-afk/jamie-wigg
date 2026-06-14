interface Env {
  HIGGSFIELD_API_KEY: string;
  HIGGSFIELD_SECRET: string;
  HIGGSFIELD_ENDPOINT: string;
}

interface GenerateRequest {
  prompt: string;
  model?: string;
  size?: string;
}

interface HiggsFieldResponse {
  data?: Array<{ url: string }>;
  url?: string;
  error?: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Only POST allowed
    if (request.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed. Use POST.' }),
        {
          status: 405,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    // Verify URL path
    const url = new URL(request.url);
    if (!url.pathname.includes('generate')) {
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }

    try {
      const body: GenerateRequest = await request.json();
      const { prompt, model = 'soul', size = '512x512' } = body;

      // Validate prompt
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return new Response(
          JSON.stringify({ error: 'Missing or invalid prompt' }),
          {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Validate API credentials
      if (!env.HIGGSFIELD_API_KEY || !env.HIGGSFIELD_SECRET) {
        console.error('Missing Higgsfield credentials');
        return new Response(
          JSON.stringify({ error: 'Server misconfiguration - missing API credentials' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Clean prompt to avoid injection
      const cleanedPrompt = prompt.slice(0, 500).trim();

      // Call Higgsfield API
      const higgsResponse = await fetch(env.HIGGSFIELD_ENDPOINT, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.HIGGSFIELD_API_KEY}`,
          'X-API-Secret': env.HIGGSFIELD_SECRET,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: model,
          prompt: `Friendly portrait: ${cleanedPrompt}. Professional, approachable, headshot style.`,
          size: size,
        }),
      });

      // Check Higgsfield response
      if (!higgsResponse.ok) {
        const errorText = await higgsResponse.text();
        console.error(`Higgsfield API error: ${higgsResponse.status}`, errorText);

        return new Response(
          JSON.stringify({
            error: `Higgsfield API error: ${higgsResponse.status} ${higgsResponse.statusText}`,
          }),
          {
            status: higgsResponse.status,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      const data: HiggsFieldResponse = await higgsResponse.json();

      // Extract image URL
      let imageUrl: string | null = null;
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        imageUrl = data.data[0].url;
      } else if (data.url) {
        imageUrl = data.url;
      }

      if (!imageUrl) {
        console.error('No image URL in Higgsfield response', data);
        return new Response(
          JSON.stringify({ error: 'No image URL returned from Higgsfield' }),
          {
            status: 500,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          }
        );
      }

      // Success response
      return new Response(
        JSON.stringify({
          imageUrl: imageUrl,
          success: true,
          model: model,
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'public, max-age=3600',
          },
        }
      );

    } catch (error) {
      console.error('Avatar generation error:', error);

      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';

      return new Response(
        JSON.stringify({
          error: `Generation failed: ${errorMessage}`,
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
