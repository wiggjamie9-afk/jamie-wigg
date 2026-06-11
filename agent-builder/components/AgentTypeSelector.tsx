"use client";

import React, { useState } from "react";
import { TypeCard } from "./TypeCard";

interface AgentType {
  id: string;
  name: string;
  description: string;
  icon: string;
  useCases: Array<{ title: string; description: string }>;
  tier: 'starter' | 'pro' | 'addon';
}

interface AgentTypeSelectorProps {
  onSelect: (type: string) => void;
  selected?: string;
}

const AGENT_TYPES: AgentType[] = [
  {
    id: 'code-review',
    name: 'Code Review Agent',
    description:
      'Specialized agent for conducting thorough code reviews, identifying bugs, suggesting optimizations, and ensuring code quality standards.',
    icon: '🔍',
    useCases: [
      { title: 'Pull Request Review', description: 'Automated code quality checks' },
      { title: 'Security Analysis', description: 'Detect vulnerabilities in code' },
      { title: 'Performance Optimization', description: 'Suggest performance improvements' },
    ],
    tier: 'starter',
  },
  {
    id: 'document-processing',
    name: 'Document Processing Agent',
    description:
      'Intelligent agent for extracting structured data from documents, summarizing content, and validating document completeness.',
    icon: '📄',
    useCases: [
      { title: 'Data Extraction', description: 'Extract structured data from PDFs' },
      { title: 'Content Summarization', description: 'Summarize long documents' },
      { title: 'Invoice Processing', description: 'Automated invoice parsing' },
    ],
    tier: 'starter',
  },
  {
    id: 'research',
    name: 'Research Agent',
    description:
      'Comprehensive research agent for gathering information, synthesizing findings, and producing well-cited research reports and analysis.',
    icon: '🔬',
    useCases: [
      { title: 'Market Research', description: 'Gather competitive intelligence' },
      { title: 'Literature Review', description: 'Synthesize research findings' },
      { title: 'Trend Analysis', description: 'Identify emerging patterns' },
    ],
    tier: 'pro',
  },
  {
    id: 'security-audit',
    name: 'Security Audit Agent',
    description:
      'Specialized agent for security assessments, vulnerability identification, compliance checking, and risk analysis with actionable remediation.',
    icon: '🛡️',
    useCases: [
      { title: 'Vulnerability Scanning', description: 'Identify security risks' },
      { title: 'Compliance Mapping', description: 'Map to SOC2, ISO, HIPAA standards' },
      { title: 'Risk Assessment', description: 'Prioritize remediation efforts' },
    ],
    tier: 'pro',
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis Agent',
    description:
      'Advanced analytics agent for data exploration, statistical analysis, pattern detection, and business insight generation with visualization recommendations.',
    icon: '📊',
    useCases: [
      { title: 'Statistical Analysis', description: 'Perform advanced statistical tests' },
      { title: 'Pattern Detection', description: 'Find trends and anomalies' },
      { title: 'Business Intelligence', description: 'Generate actionable insights' },
    ],
    tier: 'pro',
  },
  {
    id: 'customer-support',
    name: 'Customer Support Agent',
    description:
      'Responsive support agent for handling customer inquiries, troubleshooting issues, escalating complex cases, and maintaining positive customer relationships.',
    icon: '💬',
    useCases: [
      { title: 'Ticket Handling', description: 'Respond to customer inquiries' },
      { title: 'Issue Troubleshooting', description: 'Provide step-by-step solutions' },
      { title: 'Escalation Management', description: 'Route complex cases to humans' },
    ],
    tier: 'addon',
  },
];

export function AgentTypeSelector({
  onSelect,
  selected,
}: AgentTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<string | undefined>(selected);

  const handleSelect = (id: string) => {
    setSelectedType(id);
    onSelect(id);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Agent Type
        </h2>
        <p className="text-gray-600 max-w-2xl">
          Select from 6 pre-configured agent templates. Each comes with templates, example prompts,
          and best practices tailored to your use case.
        </p>
      </div>

      {/* Grid container - 2 columns on mobile, 3 on tablet/desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENT_TYPES.map((agent) => (
          <TypeCard
            key={agent.id}
            id={agent.id}
            name={agent.name}
            description={agent.description}
            icon={agent.icon}
            useCases={agent.useCases}
            tier={agent.tier}
            isSelected={selectedType === agent.id}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Tier info footer */}
      <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-600 font-semibold mb-3 uppercase">
          Pricing Tiers
        </p>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="inline-block w-3 h-3 bg-blue-100 border border-blue-300 rounded mr-2"></span>
            <span className="text-gray-700">
              <strong>Starter</strong> - $500/mo
            </span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-purple-100 border border-purple-300 rounded mr-2"></span>
            <span className="text-gray-700">
              <strong>Pro</strong> - $1,500/mo
            </span>
          </div>
          <div>
            <span className="inline-block w-3 h-3 bg-amber-100 border border-amber-300 rounded mr-2"></span>
            <span className="text-gray-700">
              <strong>Addon</strong> - $500/mo
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
