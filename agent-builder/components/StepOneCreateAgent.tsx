"use client";

import React, { useState } from "react";
import type { AgentConfig } from "@/app/builder/page";

interface StepOneCreateAgentProps {
  config: AgentConfig;
  onFieldChange: (path: string, value: any) => void;
}

const AGENT_TYPES = [
  {
    id: "code-review",
    name: "Code Review Agent",
    icon: "🔍",
    tier: "starter",
  },
  {
    id: "document-processing",
    name: "Document Processing Agent",
    icon: "📄",
    tier: "starter",
  },
  {
    id: "research",
    name: "Research Agent",
    icon: "🔬",
    tier: "pro",
  },
  {
    id: "security-audit",
    name: "Security Audit Agent",
    icon: "🛡️",
    tier: "pro",
  },
  {
    id: "data-analysis",
    name: "Data Analysis Agent",
    icon: "📊",
    tier: "pro",
  },
  {
    id: "customer-support",
    name: "Customer Support Agent",
    icon: "💬",
    tier: "addon",
  },
];

export function StepOneCreateAgent({
  config,
  onFieldChange,
}: StepOneCreateAgentProps) {
  const [selectedType, setSelectedType] = useState<string>(config.type);

  const handleTypeChange = (typeId: string) => {
    setSelectedType(typeId);
    onFieldChange("type", typeId);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange("name", e.target.value);
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case "starter":
        return "border-blue-300 bg-blue-50";
      case "pro":
        return "border-purple-300 bg-purple-50";
      case "addon":
        return "border-amber-300 bg-amber-50";
      default:
        return "border-gray-300 bg-gray-50";
    }
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "starter":
        return "bg-blue-100 text-blue-700";
      case "pro":
        return "bg-purple-100 text-purple-700";
      case "addon":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Agent</h2>
      <p className="text-gray-600 mb-8">
        Select an agent type and give your agent a name. You can customize everything
        later in the remaining steps.
      </p>

      {/* Agent Type Selection */}
      <div className="mb-10">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          Agent Type <span className="text-red-500">*</span>
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {AGENT_TYPES.map((agent) => (
            <div
              key={agent.id}
              onClick={() => handleTypeChange(agent.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                selectedType === agent.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : getTierColor(agent.tier)
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{agent.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {agent.name}
                    </h3>
                    <p
                      className={`text-xs font-semibold px-2 py-1 rounded inline-block mt-2 ${getTierBadgeColor(
                        agent.tier
                      )}`}
                    >
                      {agent.tier.toUpperCase()}
                    </p>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    selectedType === agent.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {selectedType === agent.id && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Name */}
      <div className="mb-8">
        <label htmlFor="agent-name" className="block text-sm font-semibold text-gray-900 mb-2">
          Agent Name <span className="text-red-500">*</span>
        </label>
        <input
          id="agent-name"
          type="text"
          value={config.name}
          onChange={handleNameChange}
          placeholder="e.g., My Code Review Bot, Document Analyzer..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-600 mt-2">
          Give your agent a descriptive name that reflects its purpose.
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">💡 Tip:</span> Your agent type determines
          the templates and prompts available in later steps. You can always change
          your selection before completing step 5.
        </p>
      </div>
    </div>
  );
}
