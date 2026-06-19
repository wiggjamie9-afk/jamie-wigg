export interface ToolEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  provider: string;
  endpoint: string;
  method: string;
  authType: 'apiKey' | 'oauth' | 'bearer' | 'none';
  authHeader?: string;
  freetier: boolean;
  enabled: boolean;
  lastUpdated: string;
  equivalentTools: string[];
  tags: string[];
}

export interface ToolCategory {
  count: number;
  tools: ToolEntry[];
}

export interface ToolRegistry {
  version: string;
  lastSync: string;
  categories: Record<string, ToolCategory>;
  byId: Record<string, ToolEntry>;
}

export type AuditEventType =
  | 'TOOL_CALLED'
  | 'TOOL_RESOLVED'
  | 'TOOL_FAILED'
  | 'AGENT_STARTED'
  | 'AGENT_COMPLETED'
  | 'PROVIDER_SELECTED'
  | 'PROVIDER_FALLBACK';

export interface AuditEvent {
  id: string;
  timestamp: string;
  type: AuditEventType;
  toolId?: string;
  agentId?: string;
  provider?: string;
  duration?: number;
  error?: string;
  meta?: Record<string, unknown>;
}

export type ProviderName = 'claude' | 'gemini' | 'groq' | 'openmono';

export interface ProviderStatus {
  name: ProviderName;
  available: boolean;
  latency?: number;
  lastChecked: string;
  error?: string;
}

export interface DashboardStats {
  totalTools: number;
  enabledTools: number;
  categories: number;
  lastSync: string;
  recentCalls: number;
  failureRate: number;
  providers: ProviderStatus[];
}
