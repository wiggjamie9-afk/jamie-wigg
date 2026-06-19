import React, { useState } from 'react';
import { ToolBrowser } from './components/ToolBrowser';
import { ExecutionLogs } from './components/ExecutionLogs';
import { APIKeyManager } from './components/APIKeyManager';
import { Dashboard } from './components/Dashboard';
import { usePlatformStore } from './store';

type View = 'dashboard' | 'tools' | 'logs' | 'keys' | 'settings';

export function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const { stats } = usePlatformStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Fractera
              </h1>
              <p className="text-sm text-slate-400 mt-1">AI Platform Dashboard</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Total Tools: {stats.totalTools}</p>
              <p className="text-sm text-slate-400">Categories: {stats.totalCategories}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <nav className="w-48 border-r border-slate-700 bg-slate-800/30 p-4">
          <div className="space-y-2">
            <NavButton
              label="Dashboard"
              icon="📊"
              active={currentView === 'dashboard'}
              onClick={() => setCurrentView('dashboard')}
            />
            <NavButton
              label="Tool Browser"
              icon="🔧"
              active={currentView === 'tools'}
              onClick={() => setCurrentView('tools')}
            />
            <NavButton
              label="Execution Logs"
              icon="📋"
              active={currentView === 'logs'}
              onClick={() => setCurrentView('logs')}
            />
            <NavButton
              label="API Keys"
              icon="🔑"
              active={currentView === 'keys'}
              onClick={() => setCurrentView('keys')}
            />
            <NavButton
              label="Settings"
              icon="⚙️"
              active={currentView === 'settings'}
              onClick={() => setCurrentView('settings')}
            />
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'tools' && <ToolBrowser />}
          {currentView === 'logs' && <ExecutionLogs />}
          {currentView === 'keys' && <APIKeyManager />}
          {currentView === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}

function NavButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg transition-all ${
        active
          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/30'
      }`}
    >
      <span className="mr-2">{icon}</span>
      {label}
    </button>
  );
}

function SettingsView() {
  return (
    <div className="max-w-4xl">
      <h2 className="text-2xl font-bold mb-6">Settings</h2>
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Tool Registry Sync</h3>
          <p className="text-slate-400 text-sm mb-4">Auto-sync from public-apis every 24 hours</p>
          <button className="px-4 py-2 bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 rounded hover:bg-cyan-500/30 transition-all">
            Sync Now
          </button>
        </div>
        <hr className="border-slate-700" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Execution Logging</h3>
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" defaultChecked className="mr-2" />
            <span className="text-slate-300">Log all tool executions</span>
          </label>
        </div>
      </div>
    </div>
  );
}
