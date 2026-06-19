import type { ToolRegistry, AuditEvent, ProviderStatus, DashboardStats } from './types.js';

const BASE = import.meta.env.VITE_API_URL ?? '/api';

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const api = {
  registry: {
    get: () => get<ToolRegistry>('/registry'),
  },
  audit: {
    list: (limit = 50) => get<AuditEvent[]>(`/audit?limit=${limit}`),
  },
  providers: {
    status: () => get<ProviderStatus[]>('/providers/status'),
  },
  stats: {
    dashboard: () => get<DashboardStats>('/stats'),
  },
};

export function mockRegistry(): ToolRegistry {
  const now = new Date().toISOString();
  const tools = [
    { id: 'openweathermap', name: 'OpenWeatherMap', category: 'Weather', description: 'Current weather data', provider: 'public-apis', endpoint: 'https://api.openweathermap.org/data/2.5/weather', method: 'GET', authType: 'apiKey' as const, authHeader: 'X-API-Key', freetier: true, enabled: true, lastUpdated: now, equivalentTools: ['weatherapi', 'weatherstack'], tags: [] },
    { id: 'newsapi', name: 'NewsAPI', category: 'News', description: 'Top headlines and search', provider: 'public-apis', endpoint: 'https://newsapi.org/v2/top-headlines', method: 'GET', authType: 'apiKey' as const, authHeader: 'X-API-Key', freetier: true, enabled: true, lastUpdated: now, equivalentTools: ['mediastack'], tags: [] },
    { id: 'coingecko', name: 'CoinGecko', category: 'Finance', description: 'Crypto price data', provider: 'public-apis', endpoint: 'https://api.coingecko.com/api/v3/simple/price', method: 'GET', authType: 'none' as const, freetier: true, enabled: true, lastUpdated: now, equivalentTools: ['coinmarketcap'], tags: [] },
    { id: 'jsonplaceholder', name: 'JSONPlaceholder', category: 'Testing', description: 'Fake REST API for testing', provider: 'public-apis', endpoint: 'https://jsonplaceholder.typicode.com/posts', method: 'GET', authType: 'none' as const, freetier: true, enabled: true, lastUpdated: now, equivalentTools: [], tags: [] },
    { id: 'finnhub', name: 'Finnhub', category: 'Finance', description: 'Stock market data', provider: 'public-apis', endpoint: 'https://finnhub.io/api/v1/quote', method: 'GET', authType: 'apiKey' as const, authHeader: 'X-API-Key', freetier: true, enabled: false, lastUpdated: now, equivalentTools: ['alpha_vantage'], tags: [] },
  ];

  const byId: Record<string, typeof tools[0]> = {};
  const categories: ToolRegistry['categories'] = {};

  for (const tool of tools) {
    byId[tool.id] = tool;
    if (!categories[tool.category]) {
      categories[tool.category] = { count: 0, tools: [] };
    }
    categories[tool.category].tools.push(tool);
    categories[tool.category].count++;
  }

  return { version: '1.0.0', lastSync: now, categories, byId };
}

export function mockAuditEvents(): AuditEvent[] {
  const now = Date.now();
  return [
    { id: '1', timestamp: new Date(now - 5000).toISOString(), type: 'TOOL_CALLED', toolId: 'openweathermap', provider: 'claude', duration: 342 },
    { id: '2', timestamp: new Date(now - 12000).toISOString(), type: 'PROVIDER_SELECTED', provider: 'groq', duration: 89 },
    { id: '3', timestamp: new Date(now - 18000).toISOString(), type: 'TOOL_FAILED', toolId: 'newsapi', error: 'Rate limit exceeded', duration: 1200 },
    { id: '4', timestamp: new Date(now - 25000).toISOString(), type: 'PROVIDER_FALLBACK', provider: 'gemini', meta: { reason: 'groq_rate_limit' } },
    { id: '5', timestamp: new Date(now - 31000).toISOString(), type: 'AGENT_COMPLETED', agentId: 'aria-1', duration: 4500 },
    { id: '6', timestamp: new Date(now - 45000).toISOString(), type: 'TOOL_RESOLVED', toolId: 'coingecko', duration: 120 },
  ];
}

export function mockProviderStatus(): ProviderStatus[] {
  const now = new Date().toISOString();
  return [
    { name: 'claude', available: true, latency: 380, lastChecked: now },
    { name: 'gemini', available: true, latency: 210, lastChecked: now },
    { name: 'groq', available: true, latency: 95, lastChecked: now },
    { name: 'openmono', available: false, lastChecked: now, error: 'Connection refused (start with: openmono start)' },
  ];
}
