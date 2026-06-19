import slugify from 'slugify';
import { RawAPI, BuiltRegistry } from './types.js';
import { ToolRegistryEntry } from './schema.js';

const ENDPOINT_PATTERNS: Record<string, string> = {
  'OpenWeatherMap': 'https://api.openweathermap.org/data/2.5/weather',
  'WeatherAPI': 'https://api.weatherapi.com/v1/current.json',
  'Weatherstack': 'http://api.weatherstack.com/current',
  'Alpha Vantage': 'https://www.alphavantage.co/query',
  'Finnhub': 'https://finnhub.io/api/v1/quote',
  'CoinGecko': 'https://api.coingecko.com/api/v3/simple/price',
  'NewsAPI': 'https://newsapi.org/v2/top-headlines',
  'JSONPlaceholder': 'https://jsonplaceholder.typicode.com/posts',
};

const EQUIVALENCE_MAP: Record<string, string[]> = {
  openweathermap: ['weatherapi', 'weatherstack'],
  weatherapi: ['openweathermap', 'weatherstack'],
  weatherstack: ['openweathermap', 'weatherapi'],
  alpha_vantage: ['finnhub', 'twelve_data'],
  finnhub: ['alpha_vantage', 'twelve_data'],
  newsapi: ['mediastack', 'currents'],
  mediastack: ['newsapi', 'currents'],
  coingecko: ['coinmarketcap', 'binance'],
};

function mapAuthType(auth: string): ToolRegistryEntry['authType'] {
  const normalized = auth.toLowerCase();
  if (normalized.includes('apikey') || normalized.includes('api key')) return 'apiKey';
  if (normalized.includes('oauth')) return 'oauth';
  if (normalized.includes('bearer')) return 'bearer';
  return 'none';
}

function getAuthHeader(auth: string): string | undefined {
  const normalized = auth.toLowerCase();
  if (normalized.includes('apikey') || normalized.includes('api key')) return 'X-API-Key';
  if (normalized.includes('bearer')) return 'Authorization';
  if (normalized.includes('oauth')) return 'Authorization';
  return undefined;
}

function resolveEndpoint(name: string, description: string): string {
  // Try exact match first
  if (ENDPOINT_PATTERNS[name]) {
    return ENDPOINT_PATTERNS[name];
  }

  // Try partial match on description
  for (const [key, url] of Object.entries(ENDPOINT_PATTERNS)) {
    if (description.toLowerCase().includes(key.toLowerCase())) {
      return url;
    }
  }

  // Fallback: construct generic endpoint
  const slug = slugify(name, { lower: true, strict: true });
  return `https://api.${slug}.com/v1/data`;
}

function findEquivalents(toolId: string): string[] {
  return EQUIVALENCE_MAP[toolId] || [];
}

export async function buildToolRegistry(rawAPIs: RawAPI[], verbose = false): Promise<BuiltRegistry> {
  if (verbose) console.log('🏗️  Building tool registry...');

  const registry: BuiltRegistry = {
    version: '1.0.0',
    lastSync: new Date(),
    categories: {},
    byId: new Map(),
  };

  const seen = new Set<string>();
  let skipped = 0;

  for (const api of rawAPIs) {
    const toolId = slugify(api.name, { lower: true, strict: true });

    // Skip duplicates
    if (seen.has(toolId)) {
      skipped++;
      continue;
    }
    seen.add(toolId);

    // Skip if HTTPS is not available (unless unknown)
    if (!api.https && api.https !== undefined) {
      skipped++;
      continue;
    }

    const endpoint = resolveEndpoint(api.name, api.description);
    const authType = mapAuthType(api.auth);
    const authHeader = getAuthHeader(api.auth);

    const entry: ToolRegistryEntry = {
      id: toolId,
      name: api.name,
      category: api.category,
      description: api.description,
      provider: 'public-apis',

      endpoint,
      method: 'GET',
      authType,
      authHeader,

      inputSchema: {
        type: 'object',
        properties: {},
        required: [],
        additionalProperties: false,
      },
      outputSchema: {
        type: 'object',
        properties: {},
      },

      freetier: true,
      rateLimit: undefined,
      enabled: true,
      lastUpdated: new Date(),
      equivalentTools: findEquivalents(toolId),
      tags: [],
    };

    // Register by ID
    registry.byId.set(toolId, entry);

    // Register by category
    if (!registry.categories[api.category]) {
      registry.categories[api.category] = {
        count: 0,
        tools: [],
      };
    }

    registry.categories[api.category].tools.push(entry);
    registry.categories[api.category].count++;
  }

  if (verbose) {
    console.log(`✓ Generated ${registry.byId.size} tools across ${Object.keys(registry.categories).length} categories`);
    if (skipped > 0) console.log(`  (skipped ${skipped} duplicates/non-HTTPS)`);
  }

  return registry;
}
