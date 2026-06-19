import React from 'react';
import { usePlatformStore } from '../store';

export function Dashboard() {
  const { stats, logs } = usePlatformStore();
  const recentLogs = logs.slice(0, 5);
  const successRate = logs.length > 0 ? (logs.filter((l) => l.success).length / logs.length) * 100 : 0;

  return (
    <div className="max-w-7xl">
      <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Tools"
          value={stats.totalTools.toLocaleString()}
          icon="🔧"
          color="cyan"
        />
        <StatCard label="Categories" value={stats.totalCategories} icon="📂" color="blue" />
        <StatCard label="Executions" value={stats.executionCount} icon="⚡" color="purple" />
        <StatCard
          label="Total Cost"
          value={`$${stats.totalCost.toFixed(4)}`}
          icon="💰"
          color="green"
        />
      </div>

      {/* Success Rate & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Success Rate</h3>
          <div className="flex items-baseline">
            <span className="text-3xl font-bold text-emerald-400">{successRate.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
            <div
              className="bg-emerald-400 h-2 rounded-full"
              style={{ width: `${successRate}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Recent Activity</h3>
          <p className="text-3xl font-bold text-cyan-400">{logs.length} logs</p>
          {stats.lastSyncTime && (
            <p className="text-xs text-slate-500 mt-2">
              Last sync: {new Date(stats.lastSyncTime).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
          <h3 className="text-sm font-semibold text-slate-400 mb-2">Platform Status</h3>
          <div className="flex items-center">
            <span className="h-3 w-3 bg-emerald-400 rounded-full mr-2"></span>
            <span className="text-sm text-emerald-400">All Systems Operational</span>
          </div>
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700">
          <h3 className="text-lg font-semibold">Recent Executions</h3>
        </div>
        <div className="divide-y divide-slate-700">
          {recentLogs.length > 0 ? (
            recentLogs.map((log) => (
              <div key={log.id} className="px-6 py-3 hover:bg-slate-700/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{log.toolName}</p>
                    <p className="text-xs text-slate-400">
                      {log.category} · {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      {log.success ? (
                        <span className="text-green-400 text-sm">✓ Success</span>
                      ) : (
                        <span className="text-red-400 text-sm">✗ Failed</span>
                      )}
                      <span className="text-slate-400 text-sm">{log.duration}ms</span>
                      {log.cost && <span className="text-cyan-400 text-sm">${log.cost.toFixed(4)}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-6 py-8 text-center text-slate-400">No execution logs yet</div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: string;
  color: 'cyan' | 'blue' | 'purple' | 'green';
}) {
  const colorMap = {
    cyan: 'from-cyan-500/10 to-cyan-500/5 border-cyan-500/20 text-cyan-400',
    blue: 'from-blue-500/10 to-blue-500/5 border-blue-500/20 text-blue-400',
    purple: 'from-purple-500/10 to-purple-500/5 border-purple-500/20 text-purple-400',
    green: 'from-green-500/10 to-green-500/5 border-green-500/20 text-green-400',
  };

  return (
    <div
      className={`bg-gradient-to-br ${colorMap[color]} border rounded-lg p-6 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className={`text-3xl font-bold ${colorMap[color].split(' ')[2]}`}>{value}</p>
    </div>
  );
}
