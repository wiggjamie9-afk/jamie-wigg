import { useState, useCallback } from 'react';

type GeneratorType = 'replicate' | 'leonardo' | 'craiyon';
type ScriptType = 'narration' | 'social' | 'event-description' | 'video-hook' | 'product-pitch';
type AssetType = 'image' | 'script' | 'both';

interface GenerateAssetOptions {
  eventName: string;
  eventDescription?: string;
  imageGenerator?: GeneratorType;
  scriptType?: ScriptType;
  assetType?: AssetType;
}

interface GeneratedAssets {
  image?: {
    url: string;
    path: string;
  };
  script?: {
    content: string;
    type: string;
  };
}

export function useGenerateAssets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assets, setAssets] = useState<GeneratedAssets | null>(null);

  const generate = useCallback(async (options: GenerateAssetOptions) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/generate-event-assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventName: options.eventName,
          eventDescription: options.eventDescription,
          imageGenerator: options.imageGenerator || 'replicate',
          scriptType: options.scriptType || 'event-description',
          assetType: options.assetType || 'both',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate assets');
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Asset generation failed');
      }

      setAssets({
        image: data.image,
        script: data.script,
      });

      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setAssets(null);
    setError(null);
  }, []);

  return {
    generate,
    loading,
    error,
    assets,
    reset,
  };
}
