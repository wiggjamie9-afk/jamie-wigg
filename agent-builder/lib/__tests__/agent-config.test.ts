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
} from "../agent-config";
import { AgentConfig, CreateAgentConfig } from "../schemas";

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
  it("should validate a complete agent config", () => {
    const config = completeAgentConfig(validCreateConfig);
    const result = validateAgentConfig(config);

    expect(result.valid).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.errors).toBeUndefined();
  });

  it("should validate a create config", () => {
    const result = validateCreateAgentConfig(validCreateConfig);

    expect(result.valid).toBe(true);
    expect(result.data).toBeDefined();
    expect(result.data?.id).toBeDefined();
    expect(result.data?.created_at).toBeDefined();
  });

  it("should reject invalid config with missing fields", () => {
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

  it("should reject invalid model", () => {
    const invalidConfig = {
      ...validCreateConfig,
      environment: {
        ...validCreateConfig.environment,
        model: "invalid-model",
      },
    };

    const result = validateCreateAgentConfig(invalidConfig);

    expect(result.valid).toBe(false);
  });

  it("should reject invalid temperature", () => {
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

  it("should reject insufficient success criteria", () => {
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

  it("should validate update config", () => {
    const config = completeAgentConfig(validCreateConfig);
    const update = {
      name: "Updated Agent",
      temperature: 0.7,
    };

    const result = validateUpdateAgentConfig(update);
    expect(result.valid).toBe(true);
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
});

describe("Agent Config Cloning", () => {
  it("should clone config with new ID", () => {
    const originalConfig = completeAgentConfig(validCreateConfig);
    // Wait slightly to ensure timestamp differs
    const start = Date.now();
    let cloned;
    do {
      cloned = cloneAgentConfig(originalConfig);
    } while (Date.now() - start < 1); // Ensure at least 1ms passes

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
});
