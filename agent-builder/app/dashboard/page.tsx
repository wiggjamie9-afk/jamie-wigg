'use client';

import { useEffect, useState } from 'react';
import { AgentConfig } from '@/lib/schemas';
import { getAgents, deleteAgent } from '@/lib/storage';
import { ProjectList } from '@/components/ProjectList';
import { CreateProjectButton } from '@/components/CreateProjectButton';
import { AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [agents, setAgents] = useState<AgentConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletedId, setDeletedId] = useState<string | null>(null);

  // Load agents on mount
  useEffect(() => {
    const loadAgents = () => {
      try {
        const loaded = getAgents();
        setAgents(loaded);
      } catch (error) {
        console.error('Failed to load agents:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAgents();
  }, []);

  // Handle agent deletion
  const handleDelete = (id: string) => {
    try {
      deleteAgent(id);
      setAgents((prev) => prev.filter((agent) => agent.id !== id));
      setDeletedId(id);

      // Clear deletion message after 3 seconds
      setTimeout(() => setDeletedId(null), 3000);
    } catch (error) {
      console.error('Failed to delete agent:', error);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">
                Manage your AI agents and create new ones
              </p>
            </div>
            <CreateProjectButton />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success message */}
        {deletedId && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <div className="text-green-600 mt-0.5">✓</div>
            <div>
              <p className="text-sm font-medium text-green-900">Agent deleted successfully</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {!isLoading && agents.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-600 text-sm font-medium">Total Agents</div>
              <div className="text-3xl font-bold text-gray-900 mt-1">{agents.length}</div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-600 text-sm font-medium">Pro Tier</div>
              <div className="text-3xl font-bold text-purple-600 mt-1">
                {agents.filter((a) => a.tier === 'pro').length}
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
              <div className="text-gray-600 text-sm font-medium">This Month</div>
              <div className="text-3xl font-bold text-blue-600 mt-1">
                {agents.filter(
                  (a) =>
                    new Date(a.created_at).getMonth() === new Date().getMonth()
                ).length}
              </div>
            </div>
          </div>
        )}

        {/* Info banner */}
        {!isLoading && agents.length === 0 && (
          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900">Get Started</h3>
              <p className="text-sm text-blue-800 mt-1">
                Click &ldquo;Create New Agent&rdquo; to build your first AI agent using our guided workflow.
              </p>
            </div>
          </div>
        )}

        {/* Projects list */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Your Agents</h2>
          <ProjectList agents={agents} onDelete={handleDelete} isLoading={isLoading} />
        </div>
      </div>
    </main>
  );
}
