"use client";

import { useState } from "react";
import Link from "next/link";

interface Sandbox {
  id: string;
  name: string;
  language: string;
  createdAt: string;
  lastModified: string;
}

export default function DashboardPage() {
  const [sandboxes, setSandboxes] = useState<Sandbox[]>([
    {
      id: "1",
      name: "Python Script",
      language: "python",
      createdAt: "2025-06-18",
      lastModified: "2025-06-19",
    },
    {
      id: "2",
      name: "Node.js App",
      language: "javascript",
      createdAt: "2025-06-17",
      lastModified: "2025-06-19",
    },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newSandboxName, setNewSandboxName] = useState("");
  const [newSandboxLanguage, setNewSandboxLanguage] = useState("python");

  const handleCreateSandbox = () => {
    if (!newSandboxName.trim()) return;

    const newSandbox: Sandbox = {
      id: String(sandboxes.length + 1),
      name: newSandboxName,
      language: newSandboxLanguage,
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
    };

    setSandboxes([...sandboxes, newSandbox]);
    setNewSandboxName("");
    setIsCreating(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              ◾
            </div>
            <h1 className="text-xl font-bold text-slate-100">Sandbox Runner</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Pro Plan • 8 runs left today</span>
            <button className="px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-slate-300 font-medium transition">
              Settings
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-100 mb-2">Your Sandboxes</h2>
            <p className="text-slate-400">Create and manage isolated code execution environments</p>
          </div>
          <button
            onClick={() => setIsCreating(true)}
            className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
          >
            New Sandbox
          </button>
        </div>

        {/* Create Modal */}
        {isCreating && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full border border-slate-700">
              <h3 className="text-xl font-bold text-slate-100 mb-6">Create New Sandbox</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newSandboxName}
                    onChange={(e) => setNewSandboxName(e.target.value)}
                    placeholder="My Python Script"
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Language
                  </label>
                  <select
                    value={newSandboxLanguage}
                    onChange={(e) => setNewSandboxLanguage(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="python">Python 3.12</option>
                    <option value="javascript">Node.js 20</option>
                    <option value="ruby">Ruby 3.2</option>
                    <option value="go">Go 1.21</option>
                    <option value="rust">Rust 1.75</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsCreating(false)}
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-600 hover:border-slate-500 text-slate-300 font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateSandbox}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Sandboxes Grid */}
        {sandboxes.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-slate-400 text-lg mb-4">No sandboxes yet</div>
            <button
              onClick={() => setIsCreating(true)}
              className="inline-block px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
            >
              Create Your First Sandbox
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sandboxes.map((sandbox) => (
              <Link key={sandbox.id} href={`/editor/${sandbox.id}`}>
                <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-slate-100 group-hover:text-blue-400 transition">
                        {sandbox.name}
                      </h3>
                      <p className="text-sm text-slate-400 mt-1">{sandbox.language}</p>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center text-blue-400 font-mono text-sm">
                      &gt;
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 space-y-1">
                    <p>Created: {sandbox.createdAt}</p>
                    <p>Modified: {sandbox.lastModified}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
