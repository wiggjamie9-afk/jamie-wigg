'use client';

interface Model {
  id: string;
  name: string;
  description: string;
  tier: 'fast' | 'balanced' | 'powerful';
}

const AVAILABLE_MODELS: Model[] = [
  {
    id: 'claude-haiku-4-5-20251001',
    name: 'Claude Haiku',
    description: 'Fast and compact, ideal for quick tasks',
    tier: 'fast',
  },
  {
    id: 'claude-sonnet-4-6',
    name: 'Claude Sonnet',
    description: 'Balanced performance and intelligence',
    tier: 'balanced',
  },
  {
    id: 'claude-opus-4-8',
    name: 'Claude Opus',
    description: 'Most capable, best for complex tasks',
    tier: 'powerful',
  },
];

interface ModelSelectorProps {
  selectedModel: string;
  onChange: (model: string) => void;
}

export function ModelSelector({ selectedModel, onChange }: ModelSelectorProps) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <label className="block text-sm font-medium text-gray-700 mb-3">
        AI Model
      </label>
      <div className="space-y-2">
        {AVAILABLE_MODELS.map((model) => (
          <button
            key={model.id}
            onClick={() => onChange(model.id)}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
              selectedModel === model.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">{model.name}</p>
                <p className="text-sm text-gray-600">{model.description}</p>
              </div>
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                model.tier === 'fast' ? 'bg-green-100 text-green-800' :
                model.tier === 'balanced' ? 'bg-blue-100 text-blue-800' :
                'bg-purple-100 text-purple-800'
              }`}>
                {model.tier.charAt(0).toUpperCase() + model.tier.slice(1)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
