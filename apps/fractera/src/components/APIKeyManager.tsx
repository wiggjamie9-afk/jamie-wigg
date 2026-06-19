import React, { useState } from 'react';
import { usePlatformStore } from '../store';

export function APIKeyManager() {
  const { setApiKey, getApiKey, tools } = usePlatformStore();
  const [selectedToolId, setSelectedToolId] = useState<string>('');
  const [keyValue, setKeyValue] = useState('');

  const uniqueToolIds = Array.from(new Set(tools.map((t) => t.id))).sort();

  const handleSave = () => {
    if (selectedToolId && keyValue) {
      setApiKey(selectedToolId, keyValue);
      setKeyValue('');
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-3xl font-bold mb-6">API Key Manager</h2>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-6">
        {/* Add Key Form */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Add API Key</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Tool</label>
              <select
                value={selectedToolId}
                onChange={(e) => setSelectedToolId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500/50"
              >
                <option value="">Select a tool...</option>
                {uniqueToolIds.map((id) => (
                  <option key={id} value={id}>
                    {id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">API Key</label>
              <input
                type="password"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                placeholder="Paste your API key..."
                className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            <button
              onClick={handleSave}
              disabled={!selectedToolId || !keyValue}
              className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Save API Key
            </button>
          </div>
        </div>

        <hr className="border-slate-700" />

        {/* Stored Keys */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Stored Keys</h3>
          <p className="text-sm text-slate-400 mb-4">Keys are stored locally and never sent to external servers.</p>
          <div className="space-y-2">
            {uniqueToolIds.map((id) => {
              const hasKey = Boolean(getApiKey(id));
              return (
                <div key={id} className="flex items-center justify-between px-3 py-2 bg-slate-700/30 rounded">
                  <span className="text-sm">{id}</span>
                  {hasKey ? (
                    <span className="text-green-400 text-xs">✓ Configured</span>
                  ) : (
                    <span className="text-slate-500 text-xs">Not set</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
