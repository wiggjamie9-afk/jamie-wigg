'use client';

import { AgentConfig } from './AgentForm';

interface CapabilitiesDisplayProps {
  config: AgentConfig;
}

export function CapabilitiesDisplay({ config }: CapabilitiesDisplayProps) {
  const getModelTier = (model: string) => {
    if (model.includes('haiku')) return { name: 'Fast', color: 'bg-green-100 text-green-800' };
    if (model.includes('sonnet')) return { name: 'Balanced', color: 'bg-blue-100 text-blue-800' };
    if (model.includes('opus')) return { name: 'Powerful', color: 'bg-purple-100 text-purple-800' };
    return { name: 'Unknown', color: 'bg-gray-100 text-gray-800' };
  };

  const modelTier = getModelTier(config.model);
  const modelName = config.model.replace('claude-', '').replace('-20251001', '');

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Agent Capabilities</h3>

      {/* Agent Overview Card */}
      <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Agent Name</p>
            <p className="font-semibold text-gray-900">{config.name || 'Unnamed'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">AI Model</p>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">{modelName}</span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${modelTier.color}`}>
                {modelTier.name}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Temperature</p>
            <p className="font-semibold text-gray-900">{config.temperature.toFixed(1)}</p>
          </div>
        </div>
      </div>

      {/* Capabilities Breakdown */}
      <div className="space-y-4">
        {/* Description */}
        {config.description && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">Description</p>
            <p className="text-gray-900">{config.description}</p>
          </div>
        )}

        {/* Tools */}
        {config.tools.length > 0 && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-3 font-medium">
              Available Tools ({config.tools.length})
            </p>
            <div className="space-y-2">
              {config.tools.map(tool => (
                <div key={tool} className="flex items-center gap-2 text-gray-700">
                  <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                  <span className="capitalize">{tool.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* System Prompt Preview */}
        {config.systemPrompt && (
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600 mb-2 font-medium">System Prompt</p>
            <p className="text-sm text-gray-700 font-mono bg-gray-50 p-3 rounded border border-gray-200 line-clamp-4">
              {config.systemPrompt}
            </p>
          </div>
        )}
      </div>

      {/* Agent Readiness */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900">Configuration Status</h4>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            config.name && config.tools.length > 0 && config.systemPrompt
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {config.name && config.tools.length > 0 && config.systemPrompt
              ? '✓ Ready'
              : '○ Incomplete'}
          </span>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className={config.name ? '✓' : '○'} className="font-bold text-gray-400">
              {config.name ? '✓' : '○'}
            </span>
            <span className={config.name ? 'text-gray-700' : 'text-gray-500'}>
              Agent name configured
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={config.tools.length > 0 ? '✓' : '○'} className="font-bold text-gray-400">
              {config.tools.length > 0 ? '✓' : '○'}
            </span>
            <span className={config.tools.length > 0 ? 'text-gray-700' : 'text-gray-500'}>
              At least one tool selected
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={config.systemPrompt ? '✓' : '○'} className="font-bold text-gray-400">
              {config.systemPrompt ? '✓' : '○'}
            </span>
            <span className={config.systemPrompt ? 'text-gray-700' : 'text-gray-500'}>
              System prompt defined
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
