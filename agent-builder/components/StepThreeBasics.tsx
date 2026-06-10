"use client";

import React, { useState } from "react";
import type { AgentConfig } from "@/app/builder/page";

interface StepThreeBasicsProps {
  config: AgentConfig;
  onFieldChange: (path: string, value: any) => void;
}

export function StepThreeBasics({
  config,
  onFieldChange,
}: StepThreeBasicsProps) {
  const [newExample, setNewExample] = useState("");
  const [newCriteria, setNewCriteria] = useState("");

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange("description", e.target.value);
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onFieldChange("prompts.system", e.target.value);
  };

  const handleAddExample = () => {
    if (newExample.trim()) {
      const examples = [...(config.prompts.examples || []), newExample.trim()];
      onFieldChange("prompts.examples", examples);
      setNewExample("");
    }
  };

  const handleRemoveExample = (index: number) => {
    const examples = config.prompts.examples.filter((_, i) => i !== index);
    onFieldChange("prompts.examples", examples);
  };

  const handleAddCriteria = () => {
    if (newCriteria.trim()) {
      const criteria = [...(config.prompts.success_criteria || []), newCriteria.trim()];
      onFieldChange("prompts.success_criteria", criteria);
      setNewCriteria("");
    }
  };

  const handleRemoveCriteria = (index: number) => {
    const criteria = config.prompts.success_criteria.filter((_, i) => i !== index);
    onFieldChange("prompts.success_criteria", criteria);
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Build Basics</h2>
      <p className="text-gray-600 mb-8">
        Define your agent's core behavior, add examples of how it should respond, and set
        success criteria.
      </p>

      {/* Agent Description */}
      <div className="mb-10">
        <label htmlFor="description" className="block text-sm font-semibold text-gray-900 mb-2">
          Agent Description <span className="text-red-500">*</span>
        </label>
        <textarea
          id="description"
          value={config.description}
          onChange={handleDescriptionChange}
          placeholder="Write a detailed description of what your agent does and its primary use cases..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-600 mt-2">
          This helps document your agent's purpose and intended behavior.
        </p>
      </div>

      {/* Agent Prompt */}
      <div className="mb-10">
        <label htmlFor="agent-prompt" className="block text-sm font-semibold text-gray-900 mb-2">
          Agent Prompt <span className="text-red-500">*</span>
        </label>
        <textarea
          id="agent-prompt"
          value={config.prompts.system}
          onChange={handlePromptChange}
          placeholder="Define the specific instructions and guidelines for your agent's behavior..."
          rows={5}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg font-medium text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-sm text-gray-600 mt-2">
          Provide clear instructions for how the agent should think and respond.
        </p>
      </div>

      {/* Examples */}
      <div className="mb-10">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          Examples (Optional)
        </label>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newExample}
            onChange={(e) => setNewExample(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddExample();
              }
            }}
            placeholder="Add example input/output or interaction..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddExample}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
          >
            Add
          </button>
        </div>

        {config.prompts.examples.length > 0 && (
          <div className="space-y-2">
            {config.prompts.examples.map((example, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
              >
                <p className="text-sm text-gray-900">{example}</p>
                <button
                  onClick={() => handleRemoveExample(index)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Success Criteria */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-gray-900 mb-4">
          Success Criteria <span className="text-red-500">*</span>
        </label>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleAddCriteria();
              }
            }}
            placeholder="Define what a successful response looks like..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleAddCriteria}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
          >
            Add
          </button>
        </div>

        {config.prompts.success_criteria.length > 0 ? (
          <div className="space-y-2">
            {config.prompts.success_criteria.map((criteria, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <p className="text-sm text-gray-900">✓ {criteria}</p>
                <button
                  onClick={() => handleRemoveCriteria(index)}
                  className="text-red-500 hover:text-red-700 font-semibold"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-amber-600 italic">
            Add at least one success criterion to proceed.
          </p>
        )}
      </div>

      {/* Info Box */}
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-900">
          <span className="font-semibold">📝 Note:</span> Success criteria help measure
          whether your agent is achieving its goals. Examples: "Response is under 200 words",
          "Identifies all code issues", "Provides actionable recommendations".
        </p>
      </div>
    </div>
  );
}
