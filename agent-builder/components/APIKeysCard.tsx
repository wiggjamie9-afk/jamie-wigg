'use client';

import { useState } from 'react';

interface APIKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
}

interface APIKeysCardProps {
  apiKeys: APIKey[];
}

export default function APIKeysCard({ apiKeys: initialKeys }: APIKeysCardProps) {
  const [keys, setKeys] = useState<APIKey[]>(initialKeys);
  const [showNewKeyForm, setShowNewKeyForm] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleGenerateKey = () => {
    if (!newKeyName.trim()) return;

    const newKey: APIKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: `ab_sk_${Math.random().toString(36).slice(2, 40)}`,
      createdAt: new Date().toISOString(),
      lastUsed: null,
    };

    setKeys([...keys, newKey]);
    setNewKeyName('');
    setShowNewKeyForm(false);
  };

  const handleRevokeKey = (id: string) => {
    setKeys(keys.filter((key) => key.id !== id));
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">API Keys</h2>
        <button
          onClick={() => setShowNewKeyForm(true)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium"
        >
          + Generate New Key
        </button>
      </div>

      {showNewKeyForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Create New API Key</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Key Name
              </label>
              <input
                type="text"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production, Testing, Mobile App"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-sm text-gray-500 mt-1">
                Give your key a descriptive name to identify its use case
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleGenerateKey}
                disabled={!newKeyName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition text-sm font-medium"
              >
                Generate Key
              </button>
              <button
                onClick={() => {
                  setShowNewKeyForm(false);
                  setNewKeyName('');
                }}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {keys.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No API keys yet</p>
          <p className="text-sm text-gray-500">
            Generate your first API key to start integrating agents
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {keys.map((key) => (
            <div
              key={key.id}
              className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <div>
                  <p className="font-semibold text-gray-900">{key.name}</p>
                  <p className="text-xs text-gray-500 mt-1">Created {formatDate(key.createdAt)}</p>
                </div>
                <div className="hidden md:block">
                  <p className="text-xs text-gray-600">Last used</p>
                  <p className="text-sm text-gray-900 font-medium">
                    {key.lastUsed ? formatDate(key.lastUsed) : 'Never'}
                  </p>
                </div>
                <div className="flex gap-2 justify-start md:justify-end">
                  <button
                    onClick={() => handleCopyKey(key.key, key.id)}
                    className={`px-3 py-1 rounded text-sm font-medium transition ${
                      copiedId === key.id
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copiedId === key.id ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={() => handleRevokeKey(key.id)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-medium hover:bg-red-200 transition"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-sm text-yellow-800">
          <strong>Security Note:</strong> Never commit API keys to version control. Store keys securely in
          environment variables or a secrets manager.
        </p>
      </div>
    </div>
  );
}
