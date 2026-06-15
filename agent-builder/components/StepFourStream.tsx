"use client";

import React, { useState } from "react";
import type { AgentConfig } from "@/app/builder/page";

interface StepFourStreamProps {
  config: AgentConfig;
  onFieldChange: (path: string, value: any) => void;
}

const AVAILABLE_TOOLS = [
  { id: "web-search", name: "Web Search", description: "Search the internet for information" },
  { id: "code-analysis", name: "Code Analysis", description: "Analyze and review code" },
  { id: "file-upload", name: "File Upload", description: "Accept and process file uploads" },
  { id: "data-export", name: "Data Export", description: "Export results in various formats" },
  { id: "api-calls", name: "API Calls", description: "Make HTTP requests to external APIs" },
  { id: "email", name: "Email", description: "Send email notifications" },
  { id: "database", name: "Database", description: "Query and update databases" },
  { id: "webhooks", name: "Webhooks", description: "Receive and send webhook events" },
];

const MEMORY_TYPES = [
  {
    id: "none",
    name: "No Memory",
    description: "Each interaction is independent",
  },
  {
    id: "conversation",
    name: "Conversation Memory",
    description: "Remember messages within a session",
  },
  {
    id: "context-window",
    name: "Context Window",
    description: "Use previous context for better responses",
  },
];

const AVAILABLE_EVENTS = [
  { id: "session_start", label: "Session Start" },
  { id: "message_sent", label: "Message Sent" },
  { id: "tool_used", label: "Tool Used" },
  { id: "session_end", label: "Session End" },
];

export function StepFourStream({
  config,
  onFieldChange,
}: StepFourStreamProps) {
  const handleMemoryTypeChange = (memoryType: string) => {
    onFieldChange("session.memory_type", memoryType);
  };

  const handleContextWindowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange("session.context_window", parseInt(e.target.value));
  };

  const handleMaxDurationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange("session.max_duration", parseInt(e.target.value));
  };

  const toggleTool = (toolId: string) => {
    const tools = config.environment.tools;
    const updated = tools.includes(toolId)
      ? tools.filter((t) => t !== toolId)
      : [...tools, toolId];
    onFieldChange("environment.tools", updated);
  };

  const toggleEvent = (eventId: string) => {
    const events = config.events;
    const updated = events.includes(eventId)
      ? events.filter((e) => e !== eventId)
      : [...events, eventId];
    onFieldChange("events", updated);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Stream Response</h2>
      <p className="text-gray-600 mb-8">
        Configure session management, available tools, and event tracking for your agent.
      </p>

      {/* Session Management */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Management</h3>

        {/* Memory Type */}
        <div className="mb-8">
          <label className="block text-sm font-semibold text-gray-900 mb-4">
            Memory Type <span className="text-red-500">*</span>
          </label>

          <div className="space-y-3">
            {MEMORY_TYPES.map((memType) => (
              <div
                key={memType.id}
                onClick={() => handleMemoryTypeChange(memType.id)}
                className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                  config.session.memory_type === memType.id
                    ? "border-blue-500 bg-blue-50 shadow-md"
                    : "border-gray-300 bg-white hover:border-gray-400"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-gray-900">{memType.name}</h4>
                    <p className="text-sm text-gray-600">{memType.description}</p>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      config.session.memory_type === memType.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {config.session.memory_type === memType.id && (
                      <span className="text-white text-sm font-bold">✓</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Context Window */}
        <div className="mb-8">
          <label htmlFor="context-window" className="block text-sm font-semibold text-gray-900 mb-2">
            Context Window (tokens)
          </label>
          <input
            id="context-window"
            type="number"
            value={config.session.context_window}
            onChange={handleContextWindowChange}
            min="1000"
            max="100000"
            step="1000"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-2">
            Maximum number of tokens to maintain in the conversation context.
          </p>
        </div>

        {/* Max Duration */}
        <div className="mb-8">
          <label htmlFor="max-duration" className="block text-sm font-semibold text-gray-900 mb-2">
            Max Session Duration (seconds)
          </label>
          <input
            id="max-duration"
            type="number"
            value={config.session.max_duration}
            onChange={handleMaxDurationChange}
            min="60"
            max="86400"
            step="60"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-sm text-gray-600 mt-2">
            How long a session can run before automatically ending.
          </p>
        </div>
      </div>

      {/* Available Tools */}
      <div className="mb-10">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Available Tools <span className="text-red-500">*</span>
        </h3>

        <p className="text-sm text-gray-600 mb-4">
          Select the tools your agent can use. Select at least one.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AVAILABLE_TOOLS.map((tool) => (
            <div
              key={tool.id}
              onClick={() => toggleTool(tool.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                config.environment.tools.includes(tool.id)
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                    config.environment.tools.includes(tool.id)
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {config.environment.tools.includes(tool.id) && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{tool.name}</h4>
                  <p className="text-sm text-gray-600">{tool.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Tracking */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Tracking</h3>

        <p className="text-sm text-gray-600 mb-4">
          Select which events your agent should track and log.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {AVAILABLE_EVENTS.map((event) => (
            <div
              key={event.id}
              onClick={() => toggleEvent(event.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                config.events.includes(event.id)
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                    config.events.includes(event.id)
                      ? "border-green-500 bg-green-500"
                      : "border-gray-300"
                  }`}
                >
                  {config.events.includes(event.id) && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </div>
                <span className="font-semibold text-gray-900">{event.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">🔧 Configuration:</span> Tools enable your agent
          to take actions beyond text generation. Events help you monitor and debug agent
          behavior.
        </p>
      </div>
    </div>
  );
}
