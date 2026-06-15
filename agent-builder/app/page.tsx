'use client';

import { AgentForm } from '@/components/AgentForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Builder</h1>
              <p className="text-gray-600 mt-1">Configure AI agents with custom tools and capabilities</p>
            </div>
            <div className="hidden sm:flex items-center gap-4">
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Docs
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
                Examples
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="py-12">
        <AgentForm />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white mt-20">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-gray-600 text-sm">
          <p>Visual Agent Builder • Configure, visualize, and export your AI agents</p>
        </div>
      </footer>
    </div>
  );
}
