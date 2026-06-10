"use client";

import { useState } from "react";
import { toMarkdown, toText, downloadFile, copyToClipboard } from "@/lib/prompt-export";

interface PromptData {
  system: string;
  examples?: Array<{
    input: string;
    expected_output: string;
  }>;
  success_criteria?: string[];
}

interface PromptViewerProps {
  agentName: string;
  agentType: string;
  prompt: PromptData;
}

export default function PromptViewer({
  agentName,
  agentType,
  prompt,
}: PromptViewerProps) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"system" | "examples" | "criteria">(
    "system"
  );

  const handleCopySystemPrompt = async () => {
    const success = await copyToClipboard(prompt.system);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleExportMarkdown = () => {
    const markdown = toMarkdown({ agentName, agentType, prompt });
    const sanitizedName = agentName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    downloadFile(markdown, `${sanitizedName}-prompt.md`, "text/markdown");
  };

  const handleExportText = () => {
    const text = toText({ agentName, agentType, prompt });
    const sanitizedName = agentName
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
    downloadFile(text, `${sanitizedName}-prompt.txt`, "text/plain");
  };

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{agentName}</h3>
            <p className="text-sm text-gray-500">Type: {agentType}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleCopySystemPrompt}
              className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              title="Copy system prompt to clipboard"
            >
              {copied ? "Copied!" : "Copy Prompt"}
            </button>
            <button
              onClick={handleExportMarkdown}
              className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              title="Export as Markdown"
            >
              Export MD
            </button>
            <button
              onClick={handleExportText}
              className="px-3 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition"
              title="Export as plain text"
            >
              Export TXT
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="flex">
          <button
            onClick={() => setActiveTab("system")}
            className={`flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 transition ${
              activeTab === "system"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            System Prompt
          </button>
          {prompt.examples && prompt.examples.length > 0 && (
            <button
              onClick={() => setActiveTab("examples")}
              className={`flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 transition ${
                activeTab === "examples"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Examples ({prompt.examples.length})
            </button>
          )}
          {prompt.success_criteria && prompt.success_criteria.length > 0 && (
            <button
              onClick={() => setActiveTab("criteria")}
              className={`flex-1 px-4 py-3 text-center text-sm font-medium border-b-2 transition ${
                activeTab === "criteria"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              Success Criteria
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* System Prompt Tab */}
        {activeTab === "system" && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">
              System Prompt
            </h4>
            <pre className="bg-gray-950 text-gray-100 p-4 rounded-md overflow-auto max-h-96 text-xs leading-relaxed font-mono">
              {prompt.system}
            </pre>
          </div>
        )}

        {/* Examples Tab */}
        {activeTab === "examples" && prompt.examples && (
          <div className="space-y-6">
            {prompt.examples.map((example, idx) => (
              <div key={idx} className="border border-gray-200 rounded-md p-4">
                <h5 className="font-semibold text-gray-900 mb-3">
                  Example {idx + 1}
                </h5>
                <div className="grid gap-4">
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                      Input
                    </p>
                    <pre className="bg-gray-950 text-gray-100 p-3 rounded text-xs leading-relaxed font-mono overflow-auto max-h-48">
                      {example.input}
                    </pre>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
                      Expected Output
                    </p>
                    <pre className="bg-gray-950 text-gray-100 p-3 rounded text-xs leading-relaxed font-mono overflow-auto max-h-48">
                      {example.expected_output}
                    </pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Success Criteria Tab */}
        {activeTab === "criteria" && prompt.success_criteria && (
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">
              Success Criteria
            </h4>
            <ul className="space-y-3">
              {prompt.success_criteria.map((criterion, idx) => (
                <li key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 inline-flex items-center justify-center h-6 w-6 rounded-md bg-blue-100 text-blue-600 text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700">{criterion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
