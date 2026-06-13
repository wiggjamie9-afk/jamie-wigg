'use client';

import { useState } from 'react';
import { PolsiaEditor } from '@/components/PolsiaEditor';
import Navigation from '@/components/Navigation';

export default function PolsiaPage() {
  const [parsedData, setParsedData] = useState<any | null>(null);

  return (
    <main className="min-h-screen bg-base transition-colors duration-200">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold mb-2">Polsia Editor</h1>
          <p className="text-lg opacity-75">
            Define events using structured Polsia syntax with live syntax highlighting
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div>
            <h2 className="text-xl font-serif font-bold mb-4">Event Configuration</h2>
            <PolsiaEditor onParse={setParsedData} />
          </div>

          {/* Preview */}
          <div>
            <h2 className="text-xl font-serif font-bold mb-4">Event Preview</h2>
            {parsedData ? (
              <div className="space-y-4">
                {Object.entries(parsedData).map(([type, data]: [string, any]) => (
                  <div key={type} className="p-4 border border-gray-300 dark:border-gray-600 rounded-lg">
                    <h3 className="font-semibold capitalize mb-3">{type}</h3>
                    <div className="space-y-2 text-sm">
                      {typeof data === 'object' && data !== null ? (
                        Object.entries(data).map(([key, value]: [string, any]) => (
                          <div key={key} className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">{key}:</span>
                            <span className="font-medium">
                              {typeof value === 'string' ? value : JSON.stringify(value)}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p>{JSON.stringify(data)}</p>
                      )}
                    </div>
                  </div>
                ))}

                <button className="w-full px-4 py-2 bg-var(--color-accent) text-white rounded-lg font-medium hover:opacity-90">
                  Create Event from Polsia
                </button>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
                <p className="text-sm">Parse your Polsia configuration to see event preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Documentation */}
        <div className="mt-12 p-6 bg-white dark:bg-slate-800 rounded-lg">
          <h2 className="text-xl font-serif font-bold mb-4">Polsia Reference</h2>
          <div className="grid grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">Types</h3>
              <code className="block space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div>String, Int, Number, Float</div>
                <div>Boolean, Any, Nothing</div>
                <div>NoExport (hidden field)</div>
              </code>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Syntax</h3>
              <code className="block space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <div># Comments with hash</div>
                <div>"string values in quotes"</div>
                <div>true, false, null</div>
                <div>Numbers: 42, 3.14, -5.5</div>
              </code>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
