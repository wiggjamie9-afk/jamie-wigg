import { AgentConfig } from './AgentForm';

export interface AgentTemplate extends AgentConfig {
  templateId: string;
  templateLabel: string;
}

export const AGENT_TEMPLATES: AgentTemplate[] = [
  {
    templateId: 'research-assistant',
    templateLabel: 'Research Assistant',
    name: 'Research Assistant',
    description: 'Searches the web and synthesizes findings into cited summaries.',
    model: 'claude-opus-4-8',
    tools: ['web-search', 'knowledge-base', 'document-processing', 'memory'],
    systemPrompt:
      'You are a meticulous research assistant. Search for credible sources, cross-check claims, and produce concise summaries with citations. Flag uncertainty rather than guessing.',
    temperature: 0.3,
  },
  {
    templateId: 'coding-agent',
    templateLabel: 'Coding Agent',
    name: 'Coding Agent',
    description: 'Writes, runs, and debugs code against a real environment.',
    model: 'claude-sonnet-4-6',
    tools: ['code-execution', 'file-operations', 'api-call'],
    systemPrompt:
      'You are a senior software engineer. Write correct, idiomatic code, run it to verify behavior, and fix failures before reporting done. Prefer the smallest change that works.',
    temperature: 0.2,
  },
  {
    templateId: 'data-analyst',
    templateLabel: 'Data Analyst',
    name: 'Data Analyst',
    description: 'Queries databases and analyzes datasets to answer questions.',
    model: 'claude-sonnet-4-6',
    tools: ['sql-query', 'data-analysis', 'code-execution'],
    systemPrompt:
      'You are a data analyst. Translate questions into queries, validate results, and explain findings in plain language with the numbers that back them up.',
    temperature: 0.4,
  },
  {
    templateId: 'support-agent',
    templateLabel: 'Support Agent',
    name: 'Support Agent',
    description: 'Answers customer questions and escalates over email and Slack.',
    model: 'claude-haiku-4-5-20251001',
    tools: ['knowledge-base', 'email', 'slack', 'memory'],
    systemPrompt:
      'You are a friendly, accurate customer support agent. Answer from the knowledge base, stay concise, and escalate to a human when you are unsure or the issue is sensitive.',
    temperature: 0.6,
  },
];
