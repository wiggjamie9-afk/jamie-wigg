import fetch from 'node-fetch';
import { ToolRegistry, ToolRegistryEntry } from './schema.js';

export interface ValidationResult {
  valid: boolean;
  errors: Array<{ toolId: string; error: string }>;
  warnings: Array<{ toolId: string; warning: string }>;
  tested: number;
}

export async function validateRegistry(
  registry: ToolRegistry,
  sampleSize: number = 15,
  verbose = false
): Promise<ValidationResult> {
  if (verbose) console.log(`🔍 Validating ${sampleSize} random endpoints...`);

  const errors: Array<{ toolId: string; error: string }> = [];
  const warnings: Array<{ toolId: string; warning: string }> = [];

  // Sample random tools from registry
  const allTools = Array.from(registry.byId.values());
  const sampled = allTools
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(sampleSize, allTools.length));

  for (const tool of sampled) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(tool.endpoint, {
        method: tool.method,
        signal: controller.signal as any,
      }).catch(err => {
        clearTimeout(timeoutId);
        throw err;
      });

      clearTimeout(timeoutId);

      if (response.status === 401 || response.status === 403) {
        // Expected if auth required
        if (verbose) console.log(`  ✓ ${tool.id} (auth required)`);
      } else if (response.ok) {
        if (verbose) console.log(`  ✓ ${tool.id}`);
      } else if (response.status === 404) {
        errors.push({
          toolId: tool.id,
          error: `Endpoint 404: ${tool.endpoint}`,
        });
      } else if (response.status >= 500) {
        warnings.push({
          toolId: tool.id,
          warning: `Server error: HTTP ${response.status}`,
        });
      } else {
        warnings.push({
          toolId: tool.id,
          warning: `HTTP ${response.status}`,
        });
      }
    } catch (err: any) {
      if (err.name === 'AbortError') {
        warnings.push({
          toolId: tool.id,
          warning: 'Request timeout (>5s)',
        });
      } else {
        errors.push({
          toolId: tool.id,
          error: err.message || String(err),
        });
      }
    }
  }

  const valid = errors.length === 0;

  if (verbose) {
    console.log(`\n${valid ? '✅' : '⚠️'} Validation: ${errors.length} errors, ${warnings.length} warnings`);
  }

  return {
    valid,
    errors,
    warnings,
    tested: sampled.length,
  };
}
