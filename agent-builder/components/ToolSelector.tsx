'use client';

import { useState } from 'react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
}

const AVAILABLE_TOOLS: Tool[] = [
  // Information & Search
  { id: 'web-search', name: 'Web Search', description: 'Search the internet', category: 'Information' },
  { id: 'knowledge-base', name: 'Knowledge Base', description: 'Query internal knowledge', category: 'Information' },

  // Code & Development
  { id: 'code-execution', name: 'Code Execution', description: 'Execute Python/JavaScript code', category: 'Development' },
  { id: 'api-call', name: 'API Calls', description: 'Make HTTP requests', category: 'Development' },
  { id: 'file-operations', name: 'File Operations', description: 'Read/write files', category: 'Development' },

  // Data & Analytics
  { id: 'data-analysis', name: 'Data Analysis', description: 'Analyze datasets', category: 'Analytics' },
  { id: 'sql-query', name: 'SQL Query', description: 'Query databases', category: 'Analytics' },

  // Communication
  { id: 'email', name: 'Email', description: 'Send emails', category: 'Communication' },
  { id: 'slack', name: 'Slack', description: 'Send Slack messages', category: 'Communication' },

  // Other
  { id: 'memory', name: 'Memory', description: 'Store and retrieve context', category: 'Utility' },
  { id: 'document-processing', name: 'Document Processing', description: 'Process PDFs and documents', category: 'Utility' },
];

interface ToolSelectorProps {
  selectedTools: string[];
  onChange: (tools: string[]) => void;
}

export function ToolSelector({ selectedTools, onChange }: ToolSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(AVAILABLE_TOOLS.map(t => t.category)));
  const filteredTools = selectedCategory
    ? AVAILABLE_TOOLS.filter(t => t.category === selectedCategory)
    : AVAILABLE_TOOLS;

  const toggleTool = (toolId: string) => {
    onChange(
      selectedTools.includes(toolId)
        ? selectedTools.filter(id => id !== toolId)
        : [...selectedTools, toolId]
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Tools</h3>

      {/* Category Filter */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-2">Filter by category:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm transition-colors ${
              selectedCategory === null
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tool Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filteredTools.map(tool => (
          <button
            key={tool.id}
            onClick={() => toggleTool(tool.id)}
            className={`text-left p-3 rounded-lg border-2 transition-all ${
              selectedTools.includes(tool.id)
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300 bg-white'
            }`}
          >
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={selectedTools.includes(tool.id)}
                readOnly
                className="mt-1 w-4 h-4 rounded"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-900">{tool.name}</p>
                <p className="text-sm text-gray-600">{tool.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedTools.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Selected Tools ({selectedTools.length}):
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedTools.map(toolId => {
              const tool = AVAILABLE_TOOLS.find(t => t.id === toolId);
              return (
                <span
                  key={toolId}
                  className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                >
                  {tool?.name}
                  <button
                    onClick={() => toggleTool(toolId)}
                    className="hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
