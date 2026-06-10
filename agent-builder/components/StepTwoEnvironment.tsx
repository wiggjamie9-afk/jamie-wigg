"use client";

import React from "react";
import type { AgentConfig } from "@/app/builder/page";

interface StepTwoEnvironmentProps {
  config: AgentConfig;
  onFieldChange: (path: string, value: any) => void;
}

const MODELS = [
  {
    id: "claude-opus-4.8",
    name: "Claude Opus 4.8",
    description: "Most capable model, best for complex tasks",
    tier: "pro",
  },
  {
    id: "claude-sonnet-4.6",
    name: "Claude Sonnet 4.6",
    description: "Fast and intelligent, balanced performance",
    tier: "pro",
  },
  {
    id: "claude-haiku-4.5",
    name: "Claude Haiku 4.5",
    description: "Lightweight and quick, great for simple tasks",
    tier: "starter",
  },
];

export function StepTwoEnvironment({
  config,
  onFieldChange,
}: StepTwoEnvironmentProps) {
  const handleModelChange = (modelId: string) => {
    onFieldChange("environment.model", modelId);
  };

  const handleTemperatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange("environment.temperature", parseFloat(e.target.value));
  };

  const handleMaxTokensChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFieldChange("environment.max_tokens", parseInt(e.target.value));
  };

  const handleSystemPromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange("environment.system_prompt", e.target.value);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Environment</h2>
      <p className="text-gray-600 mb-8">
        Set up the runtime environment for your agent. Choose a model, adjust parameters,
        and define the system prompt.
      </p>

      {/* Model Selection */}
      <div className="mb-10">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          Language Model <span className="text-red-500">*</span>
        </label>

        <div className="space-y-3">
          {MODELS.map((model) => (
            <div
              key={model.id}
              onClick={() => handleModelChange(model.id)}
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                config.environment.model === model.id
                  ? "border-blue-500 bg-blue-50 shadow-md"
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{model.name}</h3>
                  <p className="text-sm text-gray-600">{model.description}</p>
                </div>
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    config.environment.model === model.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {config.environment.model === model.id && (
                    <span className="text-white text-sm font-bold">✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Temperature */}
      <div className="mb-10">
        <label htmlFor="temperature" className="block text-sm font-semibold text-gray-900 mb-2">
          Temperature <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            id="temperature"
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={config.environment.temperature}
            onChange={handleTemperatureChange}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="text-2xl font-bold text-blue-600 w-12 text-right">
            {config.environment.temperature.toFixed(1)}
          </div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Lower values (0.0) = deterministic; Higher values (1.0) = creative
        </p>
      </div>

      {/* Max Tokens */}
      <div className="mb-10">
        <label htmlFor="max-tokens" className="block text-sm font-semibold text-gray-900 mb-2">
          Max Tokens <span className="text-red-500">*</span>
        </label>
        <input
          id="max-tokens"
          type="number"
          value={config.environment.max_tokens}
          onChange={handleMaxTokensChange}
          min="256"
          max="4096"
          step="256"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-600 mt-2">
          Maximum number of tokens the model can generate in a single response (256 - 4096).
        </p>
      </div>

      {/* System Prompt */}
      <div className="mb-8">
        <label htmlFor="system-prompt" className="block text-sm font-semibold text-gray-900 mb-2">
          System Prompt <span className="text-red-500">*</span>
        </label>
        <textarea
          id="system-prompt"
          value={config.environment.system_prompt}
          onChange={handleSystemPromptChange}
          placeholder="Define the role, behavior, and constraints for your agent..."
          rows={6}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-600 mt-2">
          This prompt defines your agent's core behavior and personality.
        </p>
      </div>

      {/* Info Box */}
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-900">
          <span className="font-semibold">🎯 Best Practice:</span> Be specific in your
          system prompt. Include the agent's role, key responsibilities, and any
          constraints or guidelines it should follow.
        </p>
      </div>
    </div>
  );
}
