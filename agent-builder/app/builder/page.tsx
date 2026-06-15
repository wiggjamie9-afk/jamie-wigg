"use client";

import React, { useState, useEffect } from "react";
import { BuilderSteps } from "@/components/BuilderSteps";

export interface AgentConfig {
  id: string;
  type: string;
  name: string;
  description: string;
  environment: {
    model: string;
    temperature: number;
    max_tokens: number;
    tools: string[];
    system_prompt: string;
  };
  session: {
    max_duration: number;
    memory_type: string;
    context_window: number;
  };
  events: string[];
  prompts: {
    system: string;
    examples: string[];
    success_criteria: string[];
  };
  tier: string;
}

const DEFAULT_CONFIG: AgentConfig = {
  id: `agent-${Date.now()}`,
  type: "",
  name: "",
  description: "",
  environment: {
    model: "claude-opus-4.8",
    temperature: 0.7,
    max_tokens: 2048,
    tools: [],
    system_prompt: "",
  },
  session: {
    max_duration: 3600,
    memory_type: "conversation",
    context_window: 8000,
  },
  events: ["session_start", "message_sent", "session_end"],
  prompts: {
    system: "",
    examples: [],
    success_criteria: [],
  },
  tier: "starter",
};

export default function BuilderPage() {
  const [config, setConfig] = useState<AgentConfig>(DEFAULT_CONFIG);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<AgentConfig>>({});

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("agent-builder-config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
        setFormData(parsed);
      } catch (e) {
        console.error("Failed to load saved config:", e);
      }
    }
  }, []);

  // Save to localStorage whenever config changes
  useEffect(() => {
    localStorage.setItem("agent-builder-config", JSON.stringify(config));
  }, [config]);

  const handleFieldChange = (path: string, value: any) => {
    setFormData((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });

    // Update config
    setConfig((prev) => {
      const updated = { ...prev };
      const keys = path.split(".");
      let current: any = updated;

      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (!current[key]) {
          current[key] = {};
        }
        current = current[key];
      }

      current[keys[keys.length - 1]] = value;
      return updated;
    });
  };

  const handleNextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Build Your Custom Agent
          </h1>
          <p className="text-gray-600">
            Step {currentStep} of 5: Follow the guided workflow to create a specialized AI agent
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Builder Steps */}
          <div className="lg:col-span-2">
            <BuilderSteps
              currentStep={currentStep}
              config={config}
              formData={formData}
              onFieldChange={handleFieldChange}
              onNextStep={handleNextStep}
              onPrevStep={handlePrevStep}
            />
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Agent Preview
                </h3>

                {/* Agent Config Summary */}
                <div className="space-y-4 text-sm">
                  {/* Type */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Type
                    </p>
                    <p className="text-gray-900 font-medium">
                      {config.type || "Not selected"}
                    </p>
                  </div>

                  {/* Name */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Name
                    </p>
                    <p className="text-gray-900 font-medium">
                      {config.name || "No name"}
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Description
                    </p>
                    <p className="text-gray-700 line-clamp-2">
                      {config.description || "No description"}
                    </p>
                  </div>

                  {/* Model */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Model
                    </p>
                    <p className="text-gray-900 font-medium">
                      {config.environment.model}
                    </p>
                  </div>

                  {/* Temperature */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Temperature
                    </p>
                    <p className="text-gray-900 font-medium">
                      {config.environment.temperature}
                    </p>
                  </div>

                  {/* Memory Type */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Memory Type
                    </p>
                    <p className="text-gray-900 font-medium">
                      {config.session.memory_type}
                    </p>
                  </div>

                  {/* Tier */}
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase">
                      Tier
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-block w-3 h-3 rounded ${
                          config.tier === "starter"
                            ? "bg-blue-500"
                            : config.tier === "pro"
                              ? "bg-purple-500"
                              : "bg-amber-500"
                        }`}
                      ></span>
                      <p className="text-gray-900 font-medium capitalize">
                        {config.tier}
                      </p>
                    </div>
                  </div>

                  {/* Tools */}
                  {config.environment.tools.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Tools ({config.environment.tools.length})
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {config.environment.tools.map((tool) => (
                          <span
                            key={tool}
                            className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events */}
                  {config.events.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase">
                        Events ({config.events.length})
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {config.events.map((event) => (
                          <span
                            key={event}
                            className="inline-block px-2 py-1 bg-green-50 text-green-700 text-xs rounded"
                          >
                            {event}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* JSON Export */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-3">
                    Config (JSON)
                  </p>
                  <textarea
                    value={JSON.stringify(config, null, 2)}
                    readOnly
                    className="w-full h-40 p-3 bg-gray-50 border border-gray-200 rounded text-xs font-mono text-gray-700 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
