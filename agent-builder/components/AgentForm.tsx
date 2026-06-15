'use client';

import { useEffect, useRef, useState } from 'react';
import { ToolSelector } from './ToolSelector';
import { ModelSelector } from './ModelSelector';
import { CapabilitiesDisplay } from './CapabilitiesDisplay';
import { AGENT_TEMPLATES } from './templates';

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

const STORAGE_KEY = 'agent-builder:config';

/** Coerce arbitrary parsed JSON into a valid AgentConfig, ignoring unknown fields. */
function normalizeConfig(input: unknown): AgentConfig {
  const obj = (input ?? {}) as Partial<Record<keyof AgentConfig, unknown>>;
  return {
    name: typeof obj.name === 'string' ? obj.name : DEFAULT_CONFIG.name,
    description: typeof obj.description === 'string' ? obj.description : DEFAULT_CONFIG.description,
    model: typeof obj.model === 'string' ? obj.model : DEFAULT_CONFIG.model,
    tools: Array.isArray(obj.tools) ? obj.tools.filter((t): t is string => typeof t === 'string') : [],
    systemPrompt: typeof obj.systemPrompt === 'string' ? obj.systemPrompt : DEFAULT_CONFIG.systemPrompt,
    temperature:
      typeof obj.temperature === 'number' && obj.temperature >= 0 && obj.temperature <= 2
        ? obj.temperature
        : DEFAULT_CONFIG.temperature,
  };
}

export function AgentForm() {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);
  const [hydrated, setHydrated] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load any saved config after mount (avoids SSR/client hydration mismatch).
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setConfig(normalizeConfig(JSON.parse(saved)));
    } catch {
      // Corrupt storage — fall back to defaults.
    }
    setHydrated(true);
  }, []);

  // Persist on every change, but only after the initial load.
  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  }, [config, hydrated]);

  // Auto-dismiss the notice banner.
  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(t);
  }, [notice]);

  const handleChange = <K extends keyof AgentConfig>(field: K, value: AgentConfig[K]) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleExport = () => {
    const json = JSON.stringify(config, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(config.name || 'agent').toLowerCase().replace(/\s+/g, '-')}-agent.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      setConfig(normalizeConfig(JSON.parse(text)));
      setNotice(`Imported "${file.name}"`);
    } catch {
      setNotice('Could not import: invalid JSON');
    } finally {
      // Reset so importing the same file twice still fires onChange.
      e.target.value = '';
    }
  };

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG);
    setNotice('Reset to defaults');
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Templates */}
      <div className="mb-8">
        <p className="text-sm font-medium text-gray-700 mb-3">Start from a template</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {AGENT_TEMPLATES.map((tpl) => (
            <button
              key={tpl.templateId}
              onClick={() => {
                const { templateId: _id, templateLabel: _label, ...cfg } = tpl;
                setConfig(cfg);
                setNotice(`Loaded "${tpl.templateLabel}" template`);
              }}
              className="text-left p-4 rounded-lg border border-gray-200 bg-white hover:border-blue-400 hover:shadow-sm transition-all"
            >
              <p className="font-medium text-gray-900">{tpl.templateLabel}</p>
              <p className="text-xs text-gray-500 mt-1 line-clamp-2">{tpl.description}</p>
            </button>
          ))}
        </div>
      </div>

      {notice && (
        <div
          role="status"
          className="mb-6 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800"
        >
          {notice}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Agent Name</label>
            <input
              type="text"
              value={config.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              placeholder="My Agent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
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

          <div className="space-y-2">
            <button
              onClick={handleExport}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Export Agent Config
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg border border-gray-300 transition-colors"
            >
              Import Agent Config
            </button>
            <button
              onClick={handleReset}
              className="w-full text-gray-500 hover:text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors text-sm"
            >
              Reset to defaults
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
          </div>
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
