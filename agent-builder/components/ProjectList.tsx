'use client';

import { AgentConfig } from '@/lib/schemas';
import { Trash2, Edit2 } from 'lucide-react';
import Link from 'next/link';

interface ProjectListProps {
  agents: AgentConfig[];
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function ProjectList({ agents, onDelete, isLoading }: ProjectListProps) {
  const getAgentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'code-review': 'Code Review',
      'document-processing': 'Document Processing',
      'research': 'Research',
      'security-audit': 'Security Audit',
      'data-analysis': 'Data Analysis',
      'customer-support': 'Customer Support',
    };
    return labels[type] || type;
  };

  const getTierBadgeColor = (tier: string) => {
    const colors: Record<string, string> = {
      starter: 'bg-blue-100 text-blue-800',
      pro: 'bg-purple-100 text-purple-800',
      addon: 'bg-green-100 text-green-800',
    };
    return colors[tier] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Loading agents...</p>
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No agents yet. Create your first agent to get started!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <div
          key={agent.id}
          className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition overflow-hidden"
        >
          <div className="p-6">
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {agent.name}
              </h3>
              <p className="text-sm text-gray-600 line-clamp-2">
                {agent.description}
              </p>
            </div>

            {/* Agent info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Type</span>
                <span className="text-sm font-medium text-gray-900">
                  {getAgentTypeLabel(agent.type)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Tier</span>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${getTierBadgeColor(agent.tier)}`}>
                  {agent.tier.charAt(0).toUpperCase() + agent.tier.slice(1)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">Model</span>
                <span className="text-sm text-gray-900 font-mono text-right">
                  {agent.environment.model.split('-')[1]}
                </span>
              </div>
            </div>

            {/* Metadata */}
            <div className="border-t border-gray-200 pt-4 mb-4">
              <p className="text-xs text-gray-500">
                Created {new Date(agent.created_at).toLocaleDateString()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Link
                href={`/dashboard/${agent.id}`}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Edit2 size={16} />
                Edit
              </Link>
              <button
                onClick={() => {
                  if (confirm(`Delete "${agent.name}"?`)) {
                    onDelete(agent.id);
                  }
                }}
                className="px-4 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition flex items-center justify-center gap-2 text-sm font-medium"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
