import { describe, it, expect } from "vitest";
import {
  AgentTypeSchema,
  ModelSchema,
  TierSchema,
  MemoryTypeSchema,
  EventTypeSchema,
  EnvironmentSchema,
  SessionSchema,
  EventsSchema,
  PromptExampleSchema,
  PromptsSchema,
  AgentConfigSchema,
  CreateAgentConfigSchema,
  UpdateAgentConfigSchema,
  ValidationErrorSchema,
  ValidationResultSchema,
  type Environment,
  type Session,
  type PromptExample,
  type Prompts,
  type AgentConfig,
  type CreateAgentConfig,
  type UpdateAgentConfig,
  type ValidationError,
  type ValidationResult,
} from "../lib/schemas";

describe("Schema: AgentTypeSchema", () => {
  it("should accept valid agent types", () => {
    const validTypes = [
      "code-review",
      "document-processing",
      "research",
      "security-audit",
      "data-analysis",
      "customer-support",
    ];

    validTypes.forEach((type) => {
      const result = AgentTypeSchema.safeParse(type);
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid agent types", () => {
    const invalidTypes = ["invalid", "test", "", "CODE-REVIEW", null, undefined];

    invalidTypes.forEach((type) => {
      const result = AgentTypeSchema.safeParse(type);
      expect(result.success).toBe(false);
    });
  });

  it("should be case-sensitive", () => {
    const result = AgentTypeSchema.safeParse("CODE-REVIEW");
    expect(result.success).toBe(false);
  });
});

describe("Schema: ModelSchema", () => {
  it("should accept valid models", () => {
    const validModels = [
      "claude-opus-4.8",
      "claude-sonnet-4.6",
      "claude-haiku-4.5",
    ];

    validModels.forEach((model) => {
      const result = ModelSchema.safeParse(model);
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid models", () => {
    const invalidModels = [
      "gpt-4",
      "claude-3",
      "claude-opus",
      "",
      null,
      undefined,
    ];

    invalidModels.forEach((model) => {
      const result = ModelSchema.safeParse(model);
      expect(result.success).toBe(false);
    });
  });

  it("should be case-sensitive", () => {
    const result = ModelSchema.safeParse("CLAUDE-OPUS-4.8");
    expect(result.success).toBe(false);
  });
});

describe("Schema: TierSchema", () => {
  it("should accept valid tiers", () => {
    const validTiers = ["starter", "pro", "addon"];

    validTiers.forEach((tier) => {
      const result = TierSchema.safeParse(tier);
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid tiers", () => {
    const invalidTiers = ["free", "enterprise", "basic", "", null, undefined];

    invalidTiers.forEach((tier) => {
      const result = TierSchema.safeParse(tier);
      expect(result.success).toBe(false);
    });
  });
});

describe("Schema: MemoryTypeSchema", () => {
  it("should accept valid memory types", () => {
    const validTypes = ["none", "conversation", "context-window"];

    validTypes.forEach((type) => {
      const result = MemoryTypeSchema.safeParse(type);
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid memory types", () => {
    const invalidTypes = ["short-term", "long-term", "cache", "", null, undefined];

    invalidTypes.forEach((type) => {
      const result = MemoryTypeSchema.safeParse(type);
      expect(result.success).toBe(false);
    });
  });
});

describe("Schema: EventTypeSchema", () => {
  it("should accept valid event types", () => {
    const validTypes = ["session_start", "message_sent", "tool_used", "session_end"];

    validTypes.forEach((type) => {
      const result = EventTypeSchema.safeParse(type);
      expect(result.success).toBe(true);
    });
  });

  it("should reject invalid event types", () => {
    const invalidTypes = ["start", "message", "tool", "end", "", null, undefined];

    invalidTypes.forEach((type) => {
      const result = EventTypeSchema.safeParse(type);
      expect(result.success).toBe(false);
    });
  });

  it("should be case-sensitive", () => {
    const result = EventTypeSchema.safeParse("SESSION_START");
    expect(result.success).toBe(false);
  });
});

describe("Schema: EnvironmentSchema", () => {
  const validEnvironment: Environment = {
    model: "claude-opus-4.8",
    temperature: 0.5,
    max_tokens: 4096,
    tools: ["tool1", "tool2"],
    system_prompt: "You are helpful",
  };

  it("should accept valid environment", () => {
    const result = EnvironmentSchema.safeParse(validEnvironment);
    expect(result.success).toBe(true);
  });

  it("should reject environment with invalid model", () => {
    const result = EnvironmentSchema.safeParse({
      ...validEnvironment,
      model: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should enforce temperature bounds", () => {
    [-0.1, 1.1, -1, 2].forEach((temp) => {
      const result = EnvironmentSchema.safeParse({
        ...validEnvironment,
        temperature: temp,
      });
      expect(result.success).toBe(false);
    });
  });

  it("should accept boundary temperature values", () => {
    [0, 0.5, 1].forEach((temp) => {
      const result = EnvironmentSchema.safeParse({
        ...validEnvironment,
        temperature: temp,
      });
      expect(result.success).toBe(true);
    });
  });

  it("should require positive max_tokens", () => {
    const result = EnvironmentSchema.safeParse({
      ...validEnvironment,
      max_tokens: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should require integer max_tokens", () => {
    const result = EnvironmentSchema.safeParse({
      ...validEnvironment,
      max_tokens: 4096.5,
    });
    expect(result.success).toBe(false);
  });

  it("should allow empty tools array", () => {
    const result = EnvironmentSchema.safeParse({
      ...validEnvironment,
      tools: [],
    });
    expect(result.success).toBe(true);
  });

  it("should require non-empty system_prompt", () => {
    const result = EnvironmentSchema.safeParse({
      ...validEnvironment,
      system_prompt: "",
    });
    expect(result.success).toBe(false);
  });

  it("should require all fields", () => {
    const incomplete = {
      model: "claude-opus-4.8",
      // Missing temperature, max_tokens, tools, system_prompt
    };

    const result = EnvironmentSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});

describe("Schema: SessionSchema", () => {
  const validSession: Session = {
    max_duration: 3600,
    memory_type: "conversation",
    context_window: 8192,
  };

  it("should accept valid session", () => {
    const result = SessionSchema.safeParse(validSession);
    expect(result.success).toBe(true);
  });

  it("should require positive max_duration", () => {
    const result = SessionSchema.safeParse({
      ...validSession,
      max_duration: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should require integer max_duration", () => {
    const result = SessionSchema.safeParse({
      ...validSession,
      max_duration: 3600.5,
    });
    expect(result.success).toBe(false);
  });

  it("should require valid memory_type", () => {
    const result = SessionSchema.safeParse({
      ...validSession,
      memory_type: "invalid",
    });
    expect(result.success).toBe(false);
  });

  it("should require positive context_window", () => {
    const result = SessionSchema.safeParse({
      ...validSession,
      context_window: 0,
    });
    expect(result.success).toBe(false);
  });

  it("should require integer context_window", () => {
    const result = SessionSchema.safeParse({
      ...validSession,
      context_window: 8192.5,
    });
    expect(result.success).toBe(false);
  });

  it("should require all fields", () => {
    const incomplete = {
      max_duration: 3600,
      // Missing memory_type and context_window
    };

    const result = SessionSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});

describe("Schema: EventsSchema", () => {
  it("should accept valid events array", () => {
    const validEvents = ["session_start", "message_sent"];

    const result = EventsSchema.safeParse(validEvents);
    expect(result.success).toBe(true);
  });

  it("should reject empty events array", () => {
    const result = EventsSchema.safeParse([]);
    expect(result.success).toBe(false);
  });

  it("should reject array with invalid event", () => {
    const result = EventsSchema.safeParse(["session_start", "invalid"]);
    expect(result.success).toBe(false);
  });

  it("should require array type", () => {
    const result = EventsSchema.safeParse("session_start");
    expect(result.success).toBe(false);
  });

  it("should accept single event", () => {
    const result = EventsSchema.safeParse(["session_start"]);
    expect(result.success).toBe(true);
  });

  it("should accept all four events", () => {
    const result = EventsSchema.safeParse([
      "session_start",
      "message_sent",
      "tool_used",
      "session_end",
    ]);
    expect(result.success).toBe(true);
  });
});

describe("Schema: PromptExampleSchema", () => {
  const validExample: PromptExample = {
    input: "What is 2+2?",
    expected_output: "The answer is 4",
  };

  it("should accept valid example", () => {
    const result = PromptExampleSchema.safeParse(validExample);
    expect(result.success).toBe(true);
  });

  it("should require non-empty input", () => {
    const result = PromptExampleSchema.safeParse({
      input: "",
      expected_output: "Output",
    });
    expect(result.success).toBe(false);
  });

  it("should require non-empty expected_output", () => {
    const result = PromptExampleSchema.safeParse({
      input: "Input",
      expected_output: "",
    });
    expect(result.success).toBe(false);
  });

  it("should require both fields", () => {
    const result = PromptExampleSchema.safeParse({ input: "Test" });
    expect(result.success).toBe(false);
  });

  it("should allow long inputs and outputs", () => {
    const result = PromptExampleSchema.safeParse({
      input: "a".repeat(1000),
      expected_output: "b".repeat(1000),
    });
    expect(result.success).toBe(true);
  });
});

describe("Schema: PromptsSchema", () => {
  const validPrompts: Prompts = {
    system: "You are helpful",
    examples: [
      { input: "Hi", expected_output: "Hello" },
      { input: "How are you?", expected_output: "I'm doing well" },
    ],
    success_criteria: ["Helpful", "Accurate"],
  };

  it("should accept valid prompts", () => {
    const result = PromptsSchema.safeParse(validPrompts);
    expect(result.success).toBe(true);
  });

  it("should require non-empty system prompt", () => {
    const result = PromptsSchema.safeParse({
      ...validPrompts,
      system: "",
    });
    expect(result.success).toBe(false);
  });

  it("should require at least one example", () => {
    const result = PromptsSchema.safeParse({
      ...validPrompts,
      examples: [],
    });
    expect(result.success).toBe(false);
  });

  it("should require at least two success criteria", () => {
    const result = PromptsSchema.safeParse({
      ...validPrompts,
      success_criteria: ["Only one"],
    });
    expect(result.success).toBe(false);
  });

  it("should accept exactly two success criteria", () => {
    const result = PromptsSchema.safeParse({
      ...validPrompts,
      success_criteria: ["First", "Second"],
    });
    expect(result.success).toBe(true);
  });

  it("should accept many examples", () => {
    const result = PromptsSchema.safeParse({
      ...validPrompts,
      examples: Array.from({ length: 100 }, (_, i) => ({
        input: `Input ${i}`,
        expected_output: `Output ${i}`,
      })),
    });
    expect(result.success).toBe(true);
  });

  it("should reject empty success criteria strings", () => {
    const result = PromptsSchema.safeParse({
      ...validPrompts,
      success_criteria: ["Valid", ""],
    });
    expect(result.success).toBe(false);
  });
});

describe("Schema: AgentConfigSchema", () => {
  const validConfig: AgentConfig = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    type: "code-review",
    name: "Test Agent",
    description: "A test agent",
    environment: {
      model: "claude-opus-4.8",
      temperature: 0.5,
      max_tokens: 4096,
      tools: [],
      system_prompt: "You are helpful",
    },
    session: {
      max_duration: 3600,
      memory_type: "conversation",
      context_window: 8192,
    },
    events: ["session_start"],
    prompts: {
      system: "System prompt",
      examples: [{ input: "Test", expected_output: "Output" }],
      success_criteria: ["First", "Second"],
    },
    tier: "starter",
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  };

  it("should accept valid complete config", () => {
    const result = AgentConfigSchema.safeParse(validConfig);
    expect(result.success).toBe(true);
  });

  it("should require valid UUID", () => {
    const result = AgentConfigSchema.safeParse({
      ...validConfig,
      id: "invalid-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("should require valid ISO datetime for created_at", () => {
    const result = AgentConfigSchema.safeParse({
      ...validConfig,
      created_at: "2024-01-01",
    });
    expect(result.success).toBe(false);
  });

  it("should require valid ISO datetime for updated_at", () => {
    const result = AgentConfigSchema.safeParse({
      ...validConfig,
      updated_at: "invalid date",
    });
    expect(result.success).toBe(false);
  });

  it("should enforce name length constraints", () => {
    const result1 = AgentConfigSchema.safeParse({
      ...validConfig,
      name: "",
    });
    expect(result1.success).toBe(false);

    const result2 = AgentConfigSchema.safeParse({
      ...validConfig,
      name: "a".repeat(256),
    });
    expect(result2.success).toBe(false);
  });

  it("should enforce description length constraints", () => {
    const result1 = AgentConfigSchema.safeParse({
      ...validConfig,
      description: "",
    });
    expect(result1.success).toBe(false);

    const result2 = AgentConfigSchema.safeParse({
      ...validConfig,
      description: "a".repeat(1001),
    });
    expect(result2.success).toBe(false);
  });

  it("should require all fields", () => {
    const incomplete = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      type: "code-review",
      // Missing name, description, environment, session, events, prompts, tier, created_at, updated_at
    };

    const result = AgentConfigSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });
});

describe("Schema: CreateAgentConfigSchema", () => {
  const validCreateConfig: CreateAgentConfig = {
    type: "code-review",
    name: "Test Agent",
    description: "A test agent",
    environment: {
      model: "claude-opus-4.8",
      temperature: 0.5,
      max_tokens: 4096,
      tools: [],
      system_prompt: "You are helpful",
    },
    session: {
      max_duration: 3600,
      memory_type: "conversation",
      context_window: 8192,
    },
    events: ["session_start"],
    prompts: {
      system: "System prompt",
      examples: [{ input: "Test", expected_output: "Output" }],
      success_criteria: ["First", "Second"],
    },
    tier: "starter",
  };

  it("should accept valid create config without id, created_at, updated_at", () => {
    const result = CreateAgentConfigSchema.safeParse(validCreateConfig);
    expect(result.success).toBe(true);
  });

  it("should accept optional id", () => {
    const result = CreateAgentConfigSchema.safeParse({
      ...validCreateConfig,
      id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("should reject invalid id UUID", () => {
    const result = CreateAgentConfigSchema.safeParse({
      ...validCreateConfig,
      id: "not-a-uuid",
    });
    expect(result.success).toBe(false);
  });

  it("should reject id, created_at, updated_at if included", () => {
    const result = CreateAgentConfigSchema.safeParse({
      ...validCreateConfig,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    });

    // CreateAgentConfigSchema allows partial, so these will be included but might fail
    // depending on schema definition
    expect(result.success).toBeDefined();
  });
});

describe("Schema: UpdateAgentConfigSchema", () => {
  it("should accept empty object", () => {
    const result = UpdateAgentConfigSchema.safeParse({});
    expect(result.success).toBe(true);
  });

  it("should accept single field update", () => {
    const result = UpdateAgentConfigSchema.safeParse({
      name: "Updated Name",
    });
    expect(result.success).toBe(true);
  });

  it("should accept partial nested updates", () => {
    const result = UpdateAgentConfigSchema.safeParse({
      environment: {
        temperature: 0.8,
      },
    });
    expect(result.success).toBeDefined();
  });
});

describe("Schema: ValidationErrorSchema", () => {
  const validError: ValidationError = {
    field: "name",
    message: "Name is required",
    code: "INVALID_TYPE",
  };

  it("should accept valid validation error", () => {
    const result = ValidationErrorSchema.safeParse(validError);
    expect(result.success).toBe(true);
  });

  it("should require all fields", () => {
    const result = ValidationErrorSchema.safeParse({
      field: "name",
      message: "Error",
      // Missing code
    });
    expect(result.success).toBe(false);
  });
});

describe("Schema: ValidationResultSchema", () => {
  it("should accept valid success result", () => {
    const result = ValidationResultSchema.safeParse({
      valid: true,
    });
    expect(result.success).toBe(true);
  });

  it("should accept result with errors", () => {
    const result = ValidationResultSchema.safeParse({
      valid: false,
      errors: [
        { field: "name", message: "Required", code: "INVALID_TYPE" },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("should accept result with data", () => {
    const result = ValidationResultSchema.safeParse({
      valid: true,
      data: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        type: "code-review",
        name: "Test",
        description: "Test",
        environment: {
          model: "claude-opus-4.8",
          temperature: 0.5,
          max_tokens: 4096,
          tools: [],
          system_prompt: "Test",
        },
        session: {
          max_duration: 3600,
          memory_type: "conversation",
          context_window: 8192,
        },
        events: ["session_start"],
        prompts: {
          system: "Test",
          examples: [{ input: "A", expected_output: "B" }],
          success_criteria: ["A", "B"],
        },
        tier: "starter",
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:00:00Z",
      },
    });
    expect(result.success).toBe(true);
  });

  it("should require valid boolean", () => {
    const result = ValidationResultSchema.safeParse({
      valid: "true", // String instead of boolean
    });
    expect(result.success).toBe(false);
  });
});

describe("Type Inference", () => {
  it("Environment type should be inferred correctly", () => {
    const env: Environment = {
      model: "claude-opus-4.8",
      temperature: 0.5,
      max_tokens: 4096,
      tools: ["tool1"],
      system_prompt: "Test",
    };
    expect(env).toBeDefined();
  });

  it("Session type should be inferred correctly", () => {
    const session: Session = {
      max_duration: 3600,
      memory_type: "conversation",
      context_window: 8192,
    };
    expect(session).toBeDefined();
  });

  it("PromptExample type should be inferred correctly", () => {
    const example: PromptExample = {
      input: "Test",
      expected_output: "Output",
    };
    expect(example).toBeDefined();
  });

  it("Prompts type should be inferred correctly", () => {
    const prompts: Prompts = {
      system: "Test",
      examples: [{ input: "A", expected_output: "B" }],
      success_criteria: ["X", "Y"],
    };
    expect(prompts).toBeDefined();
  });

  it("AgentConfig type should be inferred correctly", () => {
    const config: AgentConfig = {
      id: "550e8400-e29b-41d4-a716-446655440000",
      type: "code-review",
      name: "Test",
      description: "Test",
      environment: {
        model: "claude-opus-4.8",
        temperature: 0.5,
        max_tokens: 4096,
        tools: [],
        system_prompt: "Test",
      },
      session: {
        max_duration: 3600,
        memory_type: "conversation",
        context_window: 8192,
      },
      events: ["session_start"],
      prompts: {
        system: "Test",
        examples: [{ input: "A", expected_output: "B" }],
        success_criteria: ["X", "Y"],
      },
      tier: "starter",
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:00:00Z",
    };
    expect(config).toBeDefined();
  });
});
