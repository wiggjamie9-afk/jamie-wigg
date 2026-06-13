'use client';

import { useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { polsia } from '@/lib/polsia';

interface PolsiaEditorProps {
  onParse?: (data: Record<string, any>) => void;
  initialValue?: string;
}

const TEMPLATE = `# Define events in Polsia syntax
event {
  title: "My Event"
  date: "2026-06-20"
  time: "18:00"
  location: "Downtown Park"
  description: "Community gathering"
  type: String
}`;

export function PolsiaEditor({ onParse, initialValue = TEMPLATE }: PolsiaEditorProps) {
  const [code, setCode] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  const [parsed, setParsed] = useState<any | null>(null);

  const handleParse = () => {
    try {
      setError(null);

      // Simple Polsia parser
      const result: Record<string, any> = {};
      const lines = code.split('\n').filter(line => !line.trim().startsWith('#'));
      let currentKey = '';
      let currentBlock: Record<string, any> = {};

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        // Start of block (e.g., "event {")
        if (trimmed.match(/^(\w+)\s*\{/)) {
          const match = trimmed.match(/^(\w+)\s*\{/);
          if (match) {
            currentKey = match[1];
            currentBlock = {};
          }
        }
        // End of block
        else if (trimmed === '}') {
          if (currentKey) {
            result[currentKey] = currentBlock;
          }
          currentKey = '';
          currentBlock = {};
        }
        // Key-value pair (e.g., "title: \"My Event\"")
        else if (trimmed.includes(':')) {
          const [key, ...valueParts] = trimmed.split(':');
          let value = valueParts.join(':').trim();

          // Remove trailing comma
          if (value.endsWith(',')) {
            value = value.slice(0, -1).trim();
          }

          // Parse value
          if (value === 'true') {
            currentBlock[key.trim()] = true;
          } else if (value === 'false') {
            currentBlock[key.trim()] = false;
          } else if (value === 'null') {
            currentBlock[key.trim()] = null;
          } else if (value.match(/^-?\d+(\.\d+)?$/)) {
            currentBlock[key.trim()] = parseFloat(value);
          } else if (value.startsWith('"') && value.endsWith('"')) {
            currentBlock[key.trim()] = value.slice(1, -1);
          } else {
            currentBlock[key.trim()] = value;
          }
        }
      }

      setParsed(result);
      if (onParse) {
        onParse(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parse error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-300 dark:border-gray-600 overflow-hidden">
        <CodeMirror
          value={code}
          onChange={(value) => {
            setCode(value);
            setError(null);
          }}
          theme="dark"
          extensions={[polsia()]}
          height="300px"
          className="text-sm"
        />
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleParse}
          className="px-4 py-2 bg-var(--color-accent) text-white rounded-lg font-medium hover:opacity-90"
        >
          Parse Polsia
        </button>
        <button
          onClick={() => setCode(TEMPLATE)}
          className="px-4 py-2 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg font-medium hover:opacity-90"
        >
          Load Template
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {parsed && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
          <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2">Parsed Result</h4>
          <pre className="text-xs overflow-x-auto bg-green-950/20 p-3 rounded text-green-900 dark:text-green-100">
            {JSON.stringify(parsed, null, 2)}
          </pre>
        </div>
      )}

      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-2">
        <p className="font-semibold">Polsia Syntax:</p>
        <code className="block bg-gray-100 dark:bg-gray-900 p-3 rounded">
          event {'{'}
          <br />
          &nbsp;&nbsp;title: "Event Name"
          <br />
          &nbsp;&nbsp;date: "2026-06-20"
          <br />
          &nbsp;&nbsp;time: "18:00"
          <br />
          &nbsp;&nbsp;location: "Place"
          <br />
          {'}'}
        </code>
      </div>
    </div>
  );
}
