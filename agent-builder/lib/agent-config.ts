import { z } from "zod";
import {
  AgentConfig,
  AgentConfigSchema,
  CreateAgentConfig,
  CreateAgentConfigSchema,
  UpdateAgentConfig,
  UpdateAgentConfigSchema,
  ValidationResult,
} from "./schemas";

/**
 * Validate an agent configuration object
 * @param config - The configuration to validate
 * @returns ValidationResult with errors if invalid
 */
export function validateAgentConfig(config: unknown): ValidationResult {
  try {
    const result = AgentConfigSchema.safeParse(config);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
        code: issue.code,
      }));

      return {
        valid: false,
        errors,
      };
    }

    return {
      valid: true,
      data: result.data,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          field: "root",
          message: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
          code: "UNKNOWN_ERROR",
        },
      ],
    };
  }
}

/**
 * Validate a partial agent configuration (for creation)
 * @param config - The configuration to validate
 * @returns ValidationResult with errors if invalid
 */
export function validateCreateAgentConfig(
  config: unknown
): ValidationResult {
  try {
    const result = CreateAgentConfigSchema.safeParse(config);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
        code: issue.code,
      }));

      return {
        valid: false,
        errors,
      };
    }

    return {
      valid: true,
      data: completeAgentConfig(result.data),
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          field: "root",
          message: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
          code: "UNKNOWN_ERROR",
        },
      ],
    };
  }
}

/**
 * Validate a partial agent configuration (for updates)
 * @param config - The configuration to validate
 * @returns ValidationResult with errors if invalid
 */
export function validateUpdateAgentConfig(
  config: unknown
): ValidationResult {
  try {
    const result = UpdateAgentConfigSchema.safeParse(config);

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        field: issue.path.join(".") || "root",
        message: issue.message,
        code: issue.code,
      }));

      return {
        valid: false,
        errors,
      };
    }

    return {
      valid: true,
      data: result.data as AgentConfig,
    };
  } catch (error) {
    return {
      valid: false,
      errors: [
        {
          field: "root",
          message: `Validation error: ${error instanceof Error ? error.message : String(error)}`,
          code: "UNKNOWN_ERROR",
        },
      ],
    };
  }
}

/**
 * Generate a simple UUID (fallback if crypto module not available)
 */
function generateSimpleUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Complete a partial agent configuration with defaults and generated values
 * @param partial - The partial configuration
 * @returns Full AgentConfig with defaults
 */
export function completeAgentConfig(
  partial: CreateAgentConfig
): AgentConfig {
  const now = new Date().toISOString();

  return {
    ...partial,
    id: partial.id || generateSimpleUUID(),
    created_at: now,
    updated_at: now,
  } as AgentConfig;
}

/**
 * Merge a partial update with an existing configuration
 * @param existing - The existing configuration
 * @param update - The partial update
 * @returns Merged configuration with updated_at timestamp
 */
export function mergeAgentConfig(
  existing: AgentConfig,
  update: UpdateAgentConfig
): AgentConfig {
  const now = new Date().toISOString();

  return {
    ...existing,
    ...update,
    id: existing.id, // Never update id
    created_at: existing.created_at, // Never update created_at
    updated_at: now,
  };
}

/**
 * Serialize an agent configuration to JSON string
 * @param config - The configuration to serialize
 * @param pretty - Whether to pretty-print the JSON (default: false)
 * @returns JSON string representation
 */
export function serializeAgentConfig(
  config: AgentConfig,
  pretty = false
): string {
  try {
    return pretty
      ? JSON.stringify(config, null, 2)
      : JSON.stringify(config);
  } catch (error) {
    throw new Error(
      `Failed to serialize agent config: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Deserialize an agent configuration from JSON string
 * @param json - The JSON string to deserialize
 * @returns Deserialized and validated AgentConfig
 * @throws Error if JSON is invalid or validation fails
 */
export function deserializeAgentConfig(json: string): AgentConfig {
  try {
    const parsed = JSON.parse(json);
    const result = AgentConfigSchema.safeParse(parsed);

    if (!result.success) {
      const errors = result.error.issues
        .map(
          (issue) =>
            `${issue.path.join(".")}: ${issue.message}`
        )
        .join("; ");
      throw new Error(`Validation failed: ${errors}`);
    }

    return result.data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Apply template defaults to a configuration
 * @param config - The configuration
 * @param template - The template to apply defaults from
 * @returns Configuration with template defaults applied
 */
export function applyTemplateDefaults(
  config: Partial<CreateAgentConfig>,
  template: Partial<CreateAgentConfig>
): CreateAgentConfig {
  const merged = {
    ...template,
    ...config,
  } as CreateAgentConfig;

  // Validate the merged config
  const validation = validateCreateAgentConfig(merged);
  if (!validation.valid) {
    const errors = validation.errors
      ?.map((e) => `${e.field}: ${e.message}`)
      .join("; ");
    throw new Error(`Template merge validation failed: ${errors}`);
  }

  return merged;
}

/**
 * Export agent configuration as a standalone file format
 * Includes metadata for version tracking
 * @param config - The configuration to export
 * @returns Exportable configuration object with metadata
 */
export function exportAgentConfig(config: AgentConfig): {
  version: "1.0";
  metadata: {
    exported_at: string;
    exported_from: string;
  };
  config: AgentConfig;
} {
  return {
    version: "1.0",
    metadata: {
      exported_at: new Date().toISOString(),
      exported_from: "agent-builder/v1",
    },
    config,
  };
}

/**
 * Import agent configuration from exported format
 * @param exported - The exported configuration object
 * @returns The imported AgentConfig
 * @throws Error if format is invalid or validation fails
 */
export function importAgentConfig(exported: unknown): AgentConfig {
  const exportSchema = z.object({
    version: z.literal("1.0"),
    metadata: z.object({
      exported_at: z.string().datetime(),
      exported_from: z.string(),
    }),
    config: AgentConfigSchema,
  });

  try {
    const result = exportSchema.safeParse(exported);

    if (!result.success) {
      const errors = result.error.issues
        .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
        .join("; ");
      throw new Error(`Import validation failed: ${errors}`);
    }

    return result.data.config;
  } catch (error) {
    throw new Error(
      `Failed to import agent config: ${error instanceof Error ? error.message : String(error)}`
    );
  }
}

/**
 * Clone an agent configuration with a new ID
 * Useful for creating variants of existing agents
 * @param config - The configuration to clone
 * @param overrides - Optional field overrides
 * @returns Cloned configuration with new ID
 */
export function cloneAgentConfig(
  config: AgentConfig,
  overrides?: Partial<CreateAgentConfig>
): AgentConfig {
  const now = new Date().toISOString();

  const cloned: AgentConfig = {
    ...config,
    id: generateSimpleUUID(),
    name: overrides?.name || `${config.name} (Clone)`,
    created_at: now,
    updated_at: now,
    ...overrides,
  };

  // Validate the cloned config
  const validation = validateAgentConfig(cloned);
  if (!validation.valid) {
    const errors = validation.errors
      ?.map((e) => `${e.field}: ${e.message}`)
      .join("; ");
    throw new Error(`Clone validation failed: ${errors}`);
  }

  return cloned;
}

/**
 * Get a summary of agent configuration differences
 * @param config1 - First configuration
 * @param config2 - Second configuration
 * @returns Object showing changed fields
 */
export function diffAgentConfigs(
  config1: AgentConfig,
  config2: AgentConfig
): Record<string, { old: unknown; new: unknown }> {
  const diff: Record<string, { old: unknown; new: unknown }> = {};

  const keysSet = new Set([
    ...Object.keys(config1),
    ...Object.keys(config2),
  ]);

  const keys = Array.from(keysSet);

  for (const key of keys) {
    const val1 = config1[key as keyof AgentConfig];
    const val2 = config2[key as keyof AgentConfig];

    if (JSON.stringify(val1) !== JSON.stringify(val2)) {
      diff[key] = { old: val1, new: val2 };
    }
  }

  return diff;
}
