'use client';

import { useState } from 'react';
import { ToolSelector } from './ToolSelector';
import { ModelSelector } from './ModelSelector';
import { CapabilitiesDisplay } from './CapabilitiesDisplay';

export interface AgentConfig {
  name: string;
  description: string;
  model: string;
  tools: string[];
  systemPrompt: string;
  temperature: number;
}

const DEFAULT_CONFIG: AgentConfig = {
  name: 'My Agent',
  description: 'A helpful AI agent',
  model: 'claude-opus-4-8',
  tools: [],
  systemPrompt: 'You are a helpful AI assistant.',
  temperature: 0.7,
};

export function AgentForm() {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);

  const handleChange = (field: keyof AgentConfig, value: any) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.name.toLowerCase().replace(/\s+/g, '-')}-agent.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name
            </label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="My Agent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={config.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none"
              rows={3}
              placeholder="Describe what your agent does..."
            />
          </div>

          <ModelSelector
            selectedModel={config.model}
            onChange={(model) => handleChange('model', model)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Temperature: {config.temperature.toFixed(1)}
            </label>
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
              className="w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Lower = more deterministic, Higher = more creative
            </p>
          </div>

          <button
            onClick={handleExport}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Export Agent Config
          </button>
        </div>

        {/* Visual Display Panel */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">System Prompt</h2>
            <textarea
              value={config.systemPrompt}
              onChange={(e) => handleChange('systemPrompt', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none font-mono text-sm"
              rows={6}
              placeholder="Enter the system prompt for your agent..."
            />
          </div>

          <ToolSelector
            selectedTools={config.tools}
            onChange={(tools) => handleChange('tools', tools)}
          />

          <CapabilitiesDisplay config={config} />
        </div>
      </div>
    </div>
  );
}
