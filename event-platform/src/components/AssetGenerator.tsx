'use client';

import { useState } from 'react';
import { useGenerateAssets } from '@/hooks/useGenerateAssets';

type GeneratorType = 'replicate' | 'leonardo' | 'craiyon';

interface AssetGeneratorProps {
  eventName: string;
  eventDescription?: string;
  onImageGenerated?: (imageUrl: string) => void;
  onScriptGenerated?: (script: string) => void;
  className?: string;
}

const GENERATORS: { value: GeneratorType; label: string; description: string }[] = [
  {
    value: 'replicate',
    label: 'Replicate FLUX',
    description: 'Best quality (uses credits)',
  },
  {
    value: 'leonardo',
    label: 'Leonardo AI',
    description: 'Fast & stylized (uses credits)',
  },
  {
    value: 'craiyon',
    label: 'Craiyon',
    description: 'Open-source, free tier available',
  },
];

export function AssetGenerator({
  eventName,
  eventDescription,
  onImageGenerated,
  onScriptGenerated,
  className = '',
}: AssetGeneratorProps) {
  const [selectedGenerator, setSelectedGenerator] = useState<GeneratorType>('replicate');
  const [assetType, setAssetType] = useState<'image' | 'script' | 'both'>('both');
  const { generate, loading, error, assets, reset } = useGenerateAssets();

  const handleGenerate = async () => {
    try {
      const result = await generate({
        eventName,
        eventDescription,
        imageGenerator: selectedGenerator,
        scriptType: 'event-description',
        assetType,
      });

      if (result.image && onImageGenerated) {
        onImageGenerated(result.image.url);
      }

      if (result.script && onScriptGenerated) {
        onScriptGenerated(result.script.content);
      }
    } catch (err) {
      console.error('Generation failed:', err);
    }
  };

  if (!eventName) {
    return null;
  }

  return (
    <div className={`rounded-lg border border-var(--color-accent)/20 bg-var(--color-base)/5 p-6 ${className}`}>
      <h3 className="mb-4 text-lg font-semibold">Generate Event Assets</h3>

      {/* Asset Type Selection */}
      <div className="mb-6">
        <label className="mb-2 block text-sm font-medium">What to generate:</label>
        <div className="flex gap-4">
          {(['image', 'script', 'both'] as const).map((type) => (
            <label key={type} className="flex items-center gap-2">
              <input
                type="radio"
                value={type}
                checked={assetType === type}
                onChange={(e) => setAssetType(e.target.value as typeof assetType)}
                className="h-4 w-4"
              />
              <span className="capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Image Generator Selection */}
      {(assetType === 'image' || assetType === 'both') && (
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium">Image Generator:</label>
          <div className="space-y-2">
            {GENERATORS.map((gen) => (
              <label
                key={gen.value}
                className="flex cursor-pointer items-center gap-3 rounded-lg border border-var(--color-base)/10 p-3 hover:bg-var(--color-accent)/5"
              >
                <input
                  type="radio"
                  value={gen.value}
                  checked={selectedGenerator === gen.value}
                  onChange={(e) => setSelectedGenerator(e.target.value as GeneratorType)}
                  className="h-4 w-4"
                />
                <div>
                  <div className="font-medium">{gen.label}</div>
                  <div className="text-xs text-var(--color-base)/60">{gen.description}</div>
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full rounded-lg bg-var(--color-accent) px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Generating...' : 'Generate Assets'}
      </button>

      {/* Error Display */}
      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 p-3 text-sm text-red-600">
          Error: {error}
        </div>
      )}

      {/* Generated Assets Preview */}
      {assets && (
        <div className="mt-6 space-y-4 rounded-lg bg-var(--color-base)/5 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold">Generated Assets</h4>
            <button
              onClick={reset}
              className="text-xs text-var(--color-accent) hover:underline"
            >
              Clear
            </button>
          </div>

          {assets.image && (
            <div>
              <p className="mb-2 text-sm font-medium">Event Image:</p>
              <img
                src={assets.image.url}
                alt="Generated event image"
                className="h-32 w-full rounded-lg object-cover"
              />
            </div>
          )}

          {assets.script && (
            <div>
              <p className="mb-2 text-sm font-medium">Event Description:</p>
              <p className="max-h-40 overflow-y-auto rounded-lg bg-var(--color-base)/10 p-3 text-sm">
                {assets.script.content}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
