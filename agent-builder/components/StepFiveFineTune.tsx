"use client";

import React from "react";
import type { AgentConfig } from "@/app/builder/page";

interface StepFiveFineTuneProps {
  config: AgentConfig;
  onFieldChange: (path: string, value: any) => void;
}

export function StepFiveFineTune({
  config,
  onFieldChange,
}: StepFiveFineTuneProps) {
  const handleConfigExport = () => {
    const jsonStr = JSON.stringify(config, null, 2);
    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:application/json;charset=utf-8," + encodeURIComponent(jsonStr)
    );
    element.setAttribute("download", `${config.name || "agent"}-config.json`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleConfigCopy = () => {
    const jsonStr = JSON.stringify(config, null, 2);
    navigator.clipboard.writeText(jsonStr);
    alert("Configuration copied to clipboard!");
  };

  // Calculate completion stats
  const completionStats = {
    fields_configured: [
      config.type,
      config.name,
      config.description,
      config.environment.system_prompt,
      config.prompts.system,
      config.session.memory_type,
      config.environment.tools.length > 0,
      config.prompts.success_criteria.length > 0,
    ].filter(Boolean).length,
    total_fields: 8,
  };

  const completionPercent = Math.round(
    (completionStats.fields_configured / completionStats.total_fields) * 100
  );

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Fine-tune & Deploy</h2>
      <p className="text-gray-600 mb-8">
        Review your agent configuration and prepare it for deployment.
      </p>

      {/* Completion Progress */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-900">Configuration Complete</h3>
          <span className="text-lg font-bold text-blue-600">{completionPercent}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          ></div>
        </div>

        <p className="text-xs text-gray-600 mt-2">
          {completionStats.fields_configured} of {completionStats.total_fields} core fields configured
        </p>
      </div>

      {/* Configuration Summary */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuration Summary</h3>

        <div className="space-y-4">
          {/* Agent Identity */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Agent Identity</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Type:</span>{" "}
                <span className="font-medium text-gray-900">{config.type}</span>
              </div>
              <div>
                <span className="text-gray-600">Name:</span>{" "}
                <span className="font-medium text-gray-900">{config.name}</span>
              </div>
              <div>
                <span className="text-gray-600">Tier:</span>{" "}
                <span className={`font-medium px-2 py-1 rounded text-xs ${
                  config.tier === "starter"
                    ? "bg-blue-100 text-blue-700"
                    : config.tier === "pro"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-amber-100 text-amber-700"
                }`}>
                  {config.tier.toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* Environment Settings */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Environment Settings</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Model:</span>{" "}
                <span className="font-medium text-gray-900">{config.environment.model}</span>
              </div>
              <div>
                <span className="text-gray-600">Temperature:</span>{" "}
                <span className="font-medium text-gray-900">{config.environment.temperature}</span>
              </div>
              <div>
                <span className="text-gray-600">Max Tokens:</span>{" "}
                <span className="font-medium text-gray-900">{config.environment.max_tokens}</span>
              </div>
            </div>
          </div>

          {/* Session Configuration */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Session Configuration</h4>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-600">Memory Type:</span>{" "}
                <span className="font-medium text-gray-900">{config.session.memory_type}</span>
              </div>
              <div>
                <span className="text-gray-600">Context Window:</span>{" "}
                <span className="font-medium text-gray-900">{config.session.context_window} tokens</span>
              </div>
              <div>
                <span className="text-gray-600">Max Duration:</span>{" "}
                <span className="font-medium text-gray-900">{config.session.max_duration} seconds</span>
              </div>
            </div>
          </div>

          {/* Capabilities */}
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3">Capabilities</h4>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">TOOLS ({config.environment.tools.length})</p>
                <div className="flex flex-wrap gap-2">
                  {config.environment.tools.map((tool) => (
                    <span
                      key={tool}
                      className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded font-medium"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-gray-600 font-semibold mb-2">EVENTS ({config.events.length})</p>
                <div className="flex flex-wrap gap-2">
                  {config.events.map((event) => (
                    <span
                      key={event}
                      className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded font-medium"
                    >
                      {event}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Success Criteria */}
          {config.prompts.success_criteria.length > 0 && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Success Criteria</h4>
              <ul className="space-y-2 text-sm">
                {config.prompts.success_criteria.map((criteria, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-900">
                    <span className="text-green-600 font-bold mt-0.5">✓</span>
                    <span>{criteria}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Export Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export & Deploy</h3>

        <p className="text-sm text-gray-600 mb-4">
          Your agent configuration is ready. Export it as JSON to integrate with your systems.
        </p>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={handleConfigCopy}
            className="px-4 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
          >
            📋 Copy Config
          </button>
          <button
            onClick={handleConfigExport}
            className="px-4 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all"
          >
            💾 Download JSON
          </button>
        </div>
      </div>

      {/* Next Steps */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-gray-900 mb-2">🚀 Next Steps</h4>
        <ol className="text-sm text-gray-900 space-y-2">
          <li>1. Download your agent configuration as JSON</li>
          <li>2. Integrate with your application or deployment platform</li>
          <li>3. Test your agent with sample inputs</li>
          <li>4. Monitor usage and refine prompts as needed</li>
          <li>5. Scale deployment based on performance metrics</li>
        </ol>
      </div>
    </div>
  );
}
