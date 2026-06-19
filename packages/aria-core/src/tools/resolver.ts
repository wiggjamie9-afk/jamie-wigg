import { ToolRegistryEntry } from './schema.js';
import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * In-memory shape after loading: the on-disk registry stores `byId` as a
 * JSON object, but at runtime we index it as a Map for O(1) lookups. This is
 * intentionally distinct from the Zod `ToolRegistry` (whose `byId` is a Record).
 */
interface LoadedRegistry {
  version: string;
  lastSync: Date;
  categories: Record<string, { count: number; tools: ToolRegistryEntry[] }>;
  byId: Map<string, ToolRegistryEntry>;
}

export class ToolResolver {
  private registry: LoadedRegistry;
  private categoryIndex: Map<string, ToolRegistryEntry[]>;

  constructor(registryPath?: string) {
    const path = registryPath || join(process.cwd(), 'packages/aria-core/data/tool-registry.json');
    const registryJSON = JSON.parse(readFileSync(path, 'utf-8'));

    // Reconstruct registry
    this.registry = {
      version: registryJSON.version,
      lastSync: new Date(registryJSON.lastSync),
      categories: registryJSON.categories,
      byId: new Map(Object.entries(registryJSON.byId || {})) as Map<string, ToolRegistryEntry>,
    };

    // Build category index
    this.categoryIndex = new Map();
    for (const [category, data] of Object.entries(this.registry.categories)) {
      this.categoryIndex.set(category, (data as any).tools || []);
    }
  }

  /**
   * Resolve a single tool by ID
   */
  getTool(toolId: string): ToolRegistryEntry | undefined {
    return this.registry.byId.get(toolId);
  }

  /**
   * Resolve primary tool for a category
   */
  resolveTool(category: string): ToolRegistryEntry | undefined {
    const tools = this.categoryIndex.get(category);
    if (!tools || tools.length === 0) {
      return undefined;
    }

    // Return first enabled, free-tier tool with HTTPS
    return tools.find((t) => t.enabled && t.freetier && t.endpoint.startsWith('https'));
  }

  /**
   * Resolve tool chain with fallbacks
   * Returns [primary, fallback1, fallback2, ...]
   */
  resolveToolChain(category: string): ToolRegistryEntry[] {
    const primary = this.resolveTool(category);
    if (!primary) {
      return [];
    }

    const chain: ToolRegistryEntry[] = [primary];

    // Add equivalents as fallbacks
    if (primary.equivalentTools && primary.equivalentTools.length > 0) {
      for (const fallbackId of primary.equivalentTools) {
        const fallback = this.registry.byId.get(fallbackId);
        if (fallback && fallback.enabled) {
          chain.push(fallback);
        }
      }
    }

    return chain;
  }

  /**
   * Get all tools in a category
   */
  getToolsInCategory(category: string): ToolRegistryEntry[] {
    return this.categoryIndex.get(category) || [];
  }

  /**
   * Get all categories
   */
  getCategories(): string[] {
    return Array.from(this.categoryIndex.keys());
  }

  /**
   * Search tools by name or description
   */
  searchTools(query: string, limit: number = 10): ToolRegistryEntry[] {
    const q = query.toLowerCase();
    const results: ToolRegistryEntry[] = [];

    for (const tool of this.registry.byId.values()) {
      if (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q)
      ) {
        results.push(tool);
        if (results.length >= limit) break;
      }
    }

    return results;
  }

  /**
   * Get registry metadata
   */
  getMetadata() {
    return {
      version: this.registry.version,
      lastSync: this.registry.lastSync,
      totalTools: this.registry.byId.size,
      totalCategories: this.categoryIndex.size,
    };
  }
}
