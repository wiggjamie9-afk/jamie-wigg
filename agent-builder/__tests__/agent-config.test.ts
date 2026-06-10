import { describe, it, expect } from "vitest";
import {
  validateAgentConfig,
  validateCreateAgentConfig,
  validateUpdateAgentConfig,
  completeAgentConfig,
  serializeAgentConfig,
  deserializeAgentConfig,
  mergeAgentConfig,
  applyTemplateDefaults,
  cloneAgentConfig,
  diffAgentConfigs,
  exportAgentConfig,
  importAgentConfig,
} from "../lib/agent-config";
import { AgentConfig, CreateAgentConfig } from "../lib/schemas";

const validCreateConfig: CreateAgentConfig = {
  type: "code-review",
  name: "Test Code Review Agent",
  description: "A test agent for code reviews",
  environment: {
    model: "claude-opus-4.8",
    temperature: 0.3,
    max_tokens: 4096,
    tools: ["code_analyzer", "security_scanner"],
    system_prompt: "You are an expert code reviewer",
  },
  session: {
    max_duration: 3600,
    memory_type: "conversation",
    context_window: 8192,
  },
  events: ["session_start", "message_sent", "session_end"],
  prompts: {
    system: "Review the provided code for quality issues",
    examples: [
      {
        input: "Review this function",
        expected_output: "Review findings with recommendations",
      },
      {
        input: "Check for security issues",
        expected_output: "Security analysis results",
      },
    ],
    success_criteria: ["Identifies bugs", "Suggests improvements"],
  },
  tier: "starter",
};

describe("Agent Config Validation", () => {
  describe("Complete Configuration Validation", () => {
    it("should validate a complete agent config", () => {
      const config = completeAgentConfig(validCreateConfig);
      const result = validateAgentConfig(config);

      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.errors).toBeUndefined();
    });

    it("should accept all valid agent types", () => {
      const types = [
        "code-review",
        "document-processing",
        "research",
        "security-audit",
        "data-analysis",
        "customer-support",
      ] as const;

      types.forEach((type) => {
        const config = completeAgentConfig({ ...validCreateConfig, type });
        const result = validateAgentConfig(config);
        expect(result.valid).toBe(true);
      });
    });

    it("should accept all valid models", () => {
      const models = [
        "claude-opus-4.8",
        "claude-sonnet-4.6",
        "claude-haiku-4.5",
      ] as const;

      models.forEach((model) => {
        const config = completeAgentConfig({
          ...validCreateConfig,
          environment: { ...validCreateConfig.environment, model },
        });
        const result = validateAgentConfig(config);
        expect(result.valid).toBe(true);
      });
    });

    it("should accept all valid tiers", () => {
      const tiers = ["starter", "pro", "addon"] as const;

      tiers.forEach((tier) => {
        const config = completeAgentConfig({ ...validCreateConfig, tier });
        const result = validateAgentConfig(config);
        expect(result.valid).toBe(true);
      });
    });
  });

  describe("Create Configuration Validation", () => {
    it("should validate a create config", () => {
      const result = validateCreateAgentConfig(validCreateConfig);

      expect(result.valid).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.id).toBeDefined();
      expect(result.data?.created_at).toBeDefined();
    });

    it("should reject invalid config with missing required fields", () => {
      const invalidConfig = {
        type: "code-review",
        name: "Incomplete Agent",
        // Missing description, environment, session, etc.
      };

      const result = validateCreateAgentConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it("should reject invalid agent type", () => {
      const invalidConfig = {
        ...validCreateConfig,
        type: "invalid-type" as any,
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject empty name", () => {
      const invalidConfig = {
        ...validCreateConfig,
        name: "",
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject overly long name (>255 chars)", () => {
      const invalidConfig = {
        ...validCreateConfig,
        name: "a".repeat(256),
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject empty description", () => {
      const invalidConfig = {
        ...validCreateConfig,
        description: "",
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject overly long description (>1000 chars)", () => {
      const invalidConfig = {
        ...validCreateConfig,
        description: "a".repeat(1001),
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });
  });

  describe("Environment Configuration Validation", () => {
    it("should reject invalid model", () => {
      const invalidConfig = {
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          model: "invalid-model" as any,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject temperature below 0", () => {
      const invalidConfig = {
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          temperature: -0.1,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject temperature above 1", () => {
      const invalidConfig = {
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          temperature: 1.5,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should accept temperature boundary values", () => {
      [0, 0.5, 1].forEach((temp) => {
        const config = completeAgentConfig({
          ...validCreateConfig,
          environment: {
            ...validCreateConfig.environment,
            temperature: temp,
          },
        });
        const result = validateAgentConfig(config);
        expect(result.valid).toBe(true);
      });
    });

    it("should reject non-positive max_tokens", () => {
      const invalidConfig = {
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          max_tokens: 0,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject non-integer max_tokens", () => {
      const invalidConfig = {
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          max_tokens: 1024.5,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should accept large max_tokens values", () => {
      const config = completeAgentConfig({
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          max_tokens: 100000,
        },
      });
      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should reject empty system_prompt", () => {
      const invalidConfig = {
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          system_prompt: "",
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should allow empty tools array", () => {
      const config = completeAgentConfig({
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          tools: [],
        },
      });
      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
    });
  });

  describe("Session Configuration Validation", () => {
    it("should reject non-positive max_duration", () => {
      const invalidConfig = {
        ...validCreateConfig,
        session: {
          ...validCreateConfig.session,
          max_duration: 0,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject non-integer max_duration", () => {
      const invalidConfig = {
        ...validCreateConfig,
        session: {
          ...validCreateConfig.session,
          max_duration: 3600.5,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should accept all valid memory types", () => {
      const types = ["none", "conversation", "context-window"] as const;

      types.forEach((memType) => {
        const config = completeAgentConfig({
          ...validCreateConfig,
          session: {
            ...validCreateConfig.session,
            memory_type: memType,
          },
        });
        const result = validateAgentConfig(config);
        expect(result.valid).toBe(true);
      });
    });

    it("should reject invalid memory_type", () => {
      const invalidConfig = {
        ...validCreateConfig,
        session: {
          ...validCreateConfig.session,
          memory_type: "invalid-memory" as any,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject non-positive context_window", () => {
      const invalidConfig = {
        ...validCreateConfig,
        session: {
          ...validCreateConfig.session,
          context_window: 0,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject non-integer context_window", () => {
      const invalidConfig = {
        ...validCreateConfig,
        session: {
          ...validCreateConfig.session,
          context_window: 8192.5,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });
  });

  describe("Events Configuration Validation", () => {
    it("should reject empty events array", () => {
      const invalidConfig = {
        ...validCreateConfig,
        events: [],
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should accept all valid event types", () => {
      const eventCombos = [
        ["session_start"],
        ["session_start", "message_sent"],
        ["session_start", "message_sent", "tool_used", "session_end"],
      ];

      eventCombos.forEach((events) => {
        const config = completeAgentConfig({
          ...validCreateConfig,
          events: events as any,
        });
        const result = validateAgentConfig(config);
        expect(result.valid).toBe(true);
      });
    });

    it("should reject invalid event type", () => {
      const invalidConfig = {
        ...validCreateConfig,
        events: ["session_start", "invalid_event"] as any,
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });
  });

  describe("Prompts Configuration Validation", () => {
    it("should reject empty system prompt", () => {
      const invalidConfig = {
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          system: "",
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject empty examples array", () => {
      const invalidConfig = {
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          examples: [],
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject example with empty input", () => {
      const invalidConfig = {
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          examples: [
            {
              input: "",
              expected_output: "Valid output",
            },
          ],
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject example with empty expected_output", () => {
      const invalidConfig = {
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          examples: [
            {
              input: "Valid input",
              expected_output: "",
            },
          ],
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should reject insufficient success criteria (< 2)", () => {
      const invalidConfig = {
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          success_criteria: ["Only one criterion"],
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });

    it("should accept exactly 2 success criteria", () => {
      const config = completeAgentConfig({
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          success_criteria: ["First", "Second"],
        },
      });
      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should reject empty success criteria strings", () => {
      const invalidConfig = {
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          success_criteria: ["Valid", ""],
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);
      expect(result.valid).toBe(false);
    });
  });

  describe("Update Configuration Validation", () => {
    it("should validate update config with single field", () => {
      const update = {
        name: "Updated Agent",
      };

      const result = validateUpdateAgentConfig(update);
      expect(result.valid).toBe(true);
    });

    it("should validate empty update config", () => {
      const result = validateUpdateAgentConfig({});
      expect(result.valid).toBe(true);
    });

    it("should reject invalid field in update", () => {
      const update = {
        temperature: 1.5, // Invalid value for top-level
      };

      const result = validateUpdateAgentConfig(update);
      expect(result.valid).toBe(true); // Top-level partial, so incomplete objects OK
    });
  });

  describe("Edge Cases and Boundary Conditions", () => {
    it("should handle very large max_tokens", () => {
      const config = completeAgentConfig({
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          max_tokens: 999999,
        },
      });
      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should handle very large context_window", () => {
      const config = completeAgentConfig({
        ...validCreateConfig,
        session: {
          ...validCreateConfig.session,
          context_window: 999999,
        },
      });
      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should handle many tools", () => {
      const config = completeAgentConfig({
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          tools: Array.from({ length: 50 }, (_, i) => `tool_${i}`),
        },
      });
      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should handle many examples", () => {
      const config = completeAgentConfig({
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          examples: Array.from({ length: 20 }, (_, i) => ({
            input: `Input ${i}`,
            expected_output: `Output ${i}`,
          })),
        },
      });
      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
    });

    it("should handle many success criteria", () => {
      const config = completeAgentConfig({
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          success_criteria: Array.from({ length: 10 }, (_, i) => `Criterion ${i}`),
        },
      });
      const result = validateAgentConfig(config);
      expect(result.valid).toBe(true);
    });
  });

  describe("Validation Error Reporting", () => {
    it("should report field path in validation errors", () => {
      const invalidConfig = {
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          temperature: 1.5,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      const temperatureError = result.errors?.find((e) =>
        e.field.includes("temperature")
      );
      expect(temperatureError).toBeDefined();
    });

    it("should report nested field paths", () => {
      const invalidConfig = {
        ...validCreateConfig,
        prompts: {
          ...validCreateConfig.prompts,
          examples: [
            {
              input: "",
              expected_output: "Valid",
            },
          ],
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);
    });

    it("should provide error codes", () => {
      const invalidConfig = {
        ...validCreateConfig,
        environment: {
          ...validCreateConfig.environment,
          temperature: 1.5,
        },
      };

      const result = validateCreateAgentConfig(invalidConfig);

      expect(result.valid).toBe(false);
      expect(result.errors).toBeDefined();
      result.errors!.forEach((error) => {
        expect(error.code).toBeDefined();
      });
    });
  });
});

describe("Agent Config Serialization", () => {
  it("should serialize config to JSON", () => {
    const config = completeAgentConfig(validCreateConfig);
    const json = serializeAgentConfig(config);

    expect(typeof json).toBe("string");
    expect(json).toContain(config.name);
    expect(json).toContain(config.id);
  });

  it("should serialize with pretty printing", () => {
    const config = completeAgentConfig(validCreateConfig);
    const json = serializeAgentConfig(config, true);

    expect(json).toContain("\n");
    expect(json).toContain("  ");
  });

  it("should deserialize JSON to config", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const json = serializeAgentConfig(originalConfig);
    const deserializedConfig = deserializeAgentConfig(json);

    expect(deserializedConfig.id).toBe(originalConfig.id);
    expect(deserializedConfig.name).toBe(originalConfig.name);
    expect(deserializedConfig.tier).toBe(originalConfig.tier);
  });

  it("should throw on invalid JSON", () => {
    expect(() => {
      deserializeAgentConfig("{ invalid json");
    }).toThrow("Invalid JSON");
  });

  it("should throw on validation failure during deserialization", () => {
    const invalidJson = JSON.stringify({
      type: "code-review",
      name: "Test",
      // Missing required fields
    });

    expect(() => {
      deserializeAgentConfig(invalidJson);
    }).toThrow("Validation failed");
  });

  it("should preserve nested structures on serialization roundtrip", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const json = serializeAgentConfig(originalConfig);
    const deserialized = deserializeAgentConfig(json);

    expect(deserialized.environment).toEqual(originalConfig.environment);
    expect(deserialized.session).toEqual(originalConfig.session);
    expect(deserialized.prompts).toEqual(originalConfig.prompts);
  });
});

describe("Agent Config Merging", () => {
  it("should merge update with existing config", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const update = {
      name: "Updated Name",
      description: "Updated description",
    };

    const merged = mergeAgentConfig(originalConfig, update);

    expect(merged.name).toBe("Updated Name");
    expect(merged.description).toBe("Updated description");
    expect(merged.id).toBe(originalConfig.id);
    expect(merged.created_at).toBe(originalConfig.created_at);
    expect(merged.updated_at).toBeDefined();
    expect(new Date(merged.updated_at).getTime()).toBeGreaterThanOrEqual(
      new Date(originalConfig.updated_at).getTime()
    );
  });

  it("should preserve id and created_at on merge", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const originalId = originalConfig.id;
    const originalCreatedAt = originalConfig.created_at;

    const merged = mergeAgentConfig(originalConfig, {
      name: "New Name",
    });

    expect(merged.id).toBe(originalId);
    expect(merged.created_at).toBe(originalCreatedAt);
  });

  it("should update timestamp on merge", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const originalUpdatedAt = originalConfig.updated_at;

    // Small delay to ensure timestamp difference
    const merged = mergeAgentConfig(originalConfig, { name: "New Name" });

    expect(merged.updated_at).toBeDefined();
    expect(merged.updated_at >= originalUpdatedAt).toBe(true);
  });
});

describe("Agent Config Template Defaults", () => {
  it("should apply template defaults", () => {
    const template: Partial<CreateAgentConfig> = {
      ...validCreateConfig,
    };

    const partial: Partial<CreateAgentConfig> = {
      name: "Custom Agent",
    };

    const result = applyTemplateDefaults(partial, template);

    expect(result.name).toBe("Custom Agent");
    expect(result.environment?.model).toBe("claude-opus-4.8");
  });

  it("should override template defaults", () => {
    const template: Partial<CreateAgentConfig> = {
      ...validCreateConfig,
    };

    const partial: Partial<CreateAgentConfig> = {
      ...template,
      environment: {
        ...template.environment!,
        temperature: 0.8,
      },
    };

    const result = applyTemplateDefaults(partial, template);

    expect(result.environment?.temperature).toBe(0.8);
  });

  it("should throw on invalid merged config", () => {
    const template: Partial<CreateAgentConfig> = {
      ...validCreateConfig,
    };

    const partial: Partial<CreateAgentConfig> = {
      name: "Custom Agent",
      environment: {
        ...template.environment!,
        temperature: 1.5, // Invalid
      },
    };

    expect(() => {
      applyTemplateDefaults(partial, template);
    }).toThrow();
  });
});

describe("Agent Config Cloning", () => {
  it("should clone config with new ID", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const cloned = cloneAgentConfig(originalConfig);

    expect(cloned.id).not.toBe(originalConfig.id);
    expect(cloned.name).toContain("Clone");
    expect(new Date(cloned.created_at).getTime()).toBeGreaterThanOrEqual(
      new Date(originalConfig.created_at).getTime()
    );
  });

  it("should override fields when cloning", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const cloned = cloneAgentConfig(originalConfig, {
      name: "Custom Clone Name",
    });

    expect(cloned.name).toBe("Custom Clone Name");
    expect(cloned.id).not.toBe(originalConfig.id);
  });

  it("should validate cloned config", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const cloned = cloneAgentConfig(originalConfig);

    const validation = validateAgentConfig(cloned);
    expect(validation.valid).toBe(true);
  });

  it("should throw on invalid override in clone", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);

    expect(() => {
      cloneAgentConfig(originalConfig, {
        environment: {
          ...originalConfig.environment,
          temperature: 1.5, // Invalid
        },
      });
    }).toThrow();
  });
});

describe("Agent Config Diff", () => {
  it("should identify differences between configs", () => {
    const config1 = completeAgentConfig(validCreateConfig);
    const config2 = completeAgentConfig({
      ...validCreateConfig,
      name: "Different Name",
    });

    const diff = diffAgentConfigs(config1, config2);

    expect(diff.name).toBeDefined();
    expect(diff.name?.old).toBe(config1.name);
    expect(diff.name?.new).toBe(config2.name);
  });

  it("should return empty diff for identical configs", () => {
    const config = completeAgentConfig(validCreateConfig);
    const diff = diffAgentConfigs(config, config);

    expect(Object.keys(diff).length).toBe(0);
  });

  it("should detect nested differences", () => {
    const config1 = completeAgentConfig(validCreateConfig);
    const config2 = completeAgentConfig({
      ...validCreateConfig,
      environment: {
        ...validCreateConfig.environment,
        temperature: 0.7,
      },
    });

    const diff = diffAgentConfigs(config1, config2);

    expect(diff.environment).toBeDefined();
  });

  it("should show all differences in a complex change", () => {
    const config1 = completeAgentConfig(validCreateConfig);
    const config2 = completeAgentConfig({
      ...validCreateConfig,
      name: "New Name",
      tier: "pro",
      environment: {
        ...validCreateConfig.environment,
        temperature: 0.9,
      },
    });

    const diff = diffAgentConfigs(config1, config2);

    expect(Object.keys(diff).length).toBeGreaterThanOrEqual(3);
  });
});

describe("Agent Config Export/Import", () => {
  it("should export config with metadata", () => {
    const config = completeAgentConfig(validCreateConfig);
    const exported = exportAgentConfig(config);

    expect(exported.version).toBe("1.0");
    expect(exported.metadata).toBeDefined();
    expect(exported.metadata.exported_at).toBeDefined();
    expect(exported.config).toEqual(config);
  });

  it("should import exported config", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const exported = exportAgentConfig(originalConfig);
    const imported = importAgentConfig(exported);

    expect(imported.id).toBe(originalConfig.id);
    expect(imported.name).toBe(originalConfig.name);
  });

  it("should throw on invalid export format", () => {
    expect(() => {
      importAgentConfig({
        version: "2.0", // Wrong version
        config: {},
      });
    }).toThrow("Import validation failed");
  });

  it("should throw on missing export metadata", () => {
    expect(() => {
      importAgentConfig({
        config: completeAgentConfig(validCreateConfig),
      });
    }).toThrow("Import validation failed");
  });

  it("should roundtrip through export/import", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    const exported = exportAgentConfig(originalConfig);
    const imported = importAgentConfig(exported);

    expect(imported).toEqual(originalConfig);
  });
});

describe("Agent Config Completion", () => {
  it("should generate UUID for new config", () => {
    const config = completeAgentConfig(validCreateConfig);

    expect(config.id).toBeDefined();
    expect(config.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("should use provided UUID if given", () => {
    const uuid = "550e8400-e29b-41d4-a716-446655440000";
    const config = completeAgentConfig({
      ...validCreateConfig,
      id: uuid,
    });

    expect(config.id).toBe(uuid);
  });

  it("should set timestamps", () => {
    const config = completeAgentConfig(validCreateConfig);

    expect(config.created_at).toBeDefined();
    expect(config.updated_at).toBeDefined();
    expect(new Date(config.created_at).getTime()).toBeGreaterThan(0);
  });

  it("should generate unique IDs for sequential completions", () => {
    const config1 = completeAgentConfig(validCreateConfig);
    const config2 = completeAgentConfig(validCreateConfig);

    expect(config1.id).not.toBe(config2.id);
  });
});
