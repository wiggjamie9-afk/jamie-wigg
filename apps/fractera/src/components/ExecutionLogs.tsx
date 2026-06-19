import React from 'react';
import { usePlatformStore } from '../store';

export function ExecutionLogs() {
  const { logs } = usePlatformStore();

  return (
    <div className="max-w-7xl">
      <h2 className="text-3xl font-bold mb-6">Execution Logs</h2>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-700">
              <tr className="text-left text-sm text-slate-400">
                <th className="px-6 py-3">Timestamp</th>
                <th className="px-6 py-3">Tool</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Duration</th>
                <th className="px-6 py-3">Cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-400">
                    No execution logs yet
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-700/30 transition-colors text-sm">
                    <td className="px-6 py-3 text-slate-300">{log.timestamp.toLocaleString()}</td>
                    <td className="px-6 py-3 text-cyan-400 font-medium">{log.toolName}</td>
                    <td className="px-6 py-3 text-slate-400">{log.category}</td>
                    <td className="px-6 py-3">
                      {log.success ? (
                        <span className="text-green-400">✓ Success</span>
                      ) : (
                        <span className="text-red-400">✗ Failed</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-slate-400">{log.duration}ms</td>
                    <td className="px-6 py-3 text-cyan-400">${log.cost?.toFixed(4) || '0.0000'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
