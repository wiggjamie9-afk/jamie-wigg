"use client";

import React from "react";
import { StepOneCreateAgent } from "./StepOneCreateAgent";
import { StepTwoEnvironment } from "./StepTwoEnvironment";
import { StepThreeBasics } from "./StepThreeBasics";
import { StepFourStream } from "./StepFourStream";
import { StepFiveFineTune } from "./StepFiveFineTune";
import type { AgentConfig } from "@/app/builder/page";

interface BuilderStepsProps {
  currentStep: number;
  config: AgentConfig;
  formData: Partial<AgentConfig>;
  onFieldChange: (path: string, value: any) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
}

export function BuilderSteps({
  currentStep,
  config,
  formData,
  onFieldChange,
  onNextStep,
  onPrevStep,
}: BuilderStepsProps) {
  const stepsData = [
    { number: 1, title: "Create Agent", icon: "⚙️" },
    { number: 2, title: "Configure Environment", icon: "🌍" },
    { number: 3, title: "Build Basics", icon: "🔨" },
    { number: 4, title: "Stream Response", icon: "📡" },
    { number: 5, title: "Fine-tune", icon: "✨" },
  ];

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return config.type && config.name;
      case 2:
        return config.environment.model && config.environment.system_prompt;
      case 3:
        return config.description && config.prompts.system;
      case 4:
        return config.session.memory_type && config.environment.tools.length > 0;
      case 5:
        return config.prompts.success_criteria.length > 0;
      default:
        return false;
    }
  };

  return (
    <div className="w-full">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          {stepsData.map((step) => (
            <div key={step.number} className="flex items-center flex-1">
              <div
                className={`flex items-center justify-center w-12 h-12 rounded-full font-semibold text-lg transition-all ${
                  currentStep >= step.number
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {step.number === currentStep ? step.icon : step.number}
              </div>
              <div className="ml-3 hidden sm:block">
                <p className="text-sm font-semibold text-gray-900">
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">Step {step.number}</p>
              </div>
              {step.number < 5 && (
                <div
                  className={`flex-1 mx-4 h-1 rounded transition-all ${
                    currentStep > step.number ? "bg-blue-500" : "bg-gray-200"
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-8 mb-8">
        {currentStep === 1 && (
          <StepOneCreateAgent
            config={config}
            onFieldChange={onFieldChange}
          />
        )}

        {currentStep === 2 && (
          <StepTwoEnvironment
            config={config}
            onFieldChange={onFieldChange}
          />
        )}

        {currentStep === 3 && (
          <StepThreeBasics
            config={config}
            onFieldChange={onFieldChange}
          />
        )}

        {currentStep === 4 && (
          <StepFourStream
            config={config}
            onFieldChange={onFieldChange}
          />
        )}

        {currentStep === 5 && (
          <StepFiveFineTune
            config={config}
            onFieldChange={onFieldChange}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between gap-4">
        <button
          onClick={onPrevStep}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            currentStep === 1
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-gray-200 text-gray-900 hover:bg-gray-300"
          }`}
        >
          Previous
        </button>

        <div className="text-sm text-gray-600">
          Step {currentStep} of 5
        </div>

        <button
          onClick={onNextStep}
          disabled={currentStep === 5}
          className={`px-6 py-2 rounded-lg font-semibold transition-all ${
            currentStep === 5
              ? "bg-blue-100 text-blue-400 cursor-not-allowed"
              : isStepValid()
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "bg-blue-200 text-blue-400 cursor-not-allowed"
          }`}
        >
          {currentStep === 5 ? "Complete" : "Next"}
        </button>
      </div>

      {/* Validation Message */}
      {!isStepValid() && currentStep < 5 && (
        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
          ⚠️ Please fill in the required fields to continue.
        </div>
      )}
    </div>
  );
}
