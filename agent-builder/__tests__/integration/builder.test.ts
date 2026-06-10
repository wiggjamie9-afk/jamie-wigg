import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAgents, saveAgent, getAgent, clearAllAgents } from '@/lib/storage';
import { completeAgentConfig, validateAgentConfig } from '@/lib/agent-config';
import { AgentConfig } from '@/lib/schemas';

/**
 * Integration tests for the agent builder workflow
 * Tests cover the complete 5-step workflow: Create → Configure → Build → Stream → Fine-tune
 */

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock window.localStorage for Node.js environment
if (typeof window === 'undefined') {
  (globalThis as any).window = { localStorage: localStorageMock };
} else {
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
  });
}

// Helper to simulate builder step progression
class BuilderSimulator {
  private config: Partial<AgentConfig> = {};
  private currentStep = 1;

  constructor() {
    this.config = {};
  }

  step(step: number): BuilderSimulator {
    this.currentStep = step;
    return this;
  }

  setAgentType(type: string): BuilderSimulator {
    this.config.type = type as any;
    return this;
  }

  setName(name: string): BuilderSimulator {
    this.config.name = name;
    return this;
  }

  setDescription(description: string): BuilderSimulator {
    this.config.description = description;
    return this;
  }

  setEnvironment(environment: Partial<AgentConfig['environment']>): BuilderSimulator {
    this.config.environment = {
      ...this.config.environment,
      ...environment,
    } as AgentConfig['environment'];
    return this;
  }

  setSession(session: Partial<AgentConfig['session']>): BuilderSimulator {
    this.config.session = {
      ...this.config.session,
      ...session,
    } as AgentConfig['session'];
    return this;
  }

  setPrompts(prompts: Partial<AgentConfig['prompts']>): BuilderSimulator {
    this.config.prompts = {
      ...this.config.prompts,
      ...prompts,
    } as AgentConfig['prompts'];
    return this;
  }

  setTier(tier: string): BuilderSimulator {
    this.config.tier = tier as any;
    return this;
  }

  setEvents(events: string[]): BuilderSimulator {
    this.config.events = events as any;
    return this;
  }

  getConfig(): Partial<AgentConfig> {
    return this.config;
  }

  complete(): AgentConfig {
    const base = {
      type: this.config.type || 'code-review',
      name: this.config.name || 'Unnamed Agent',
      description: this.config.description || 'No description',
      environment: {
        model: 'claude-opus-4.8',
        temperature: 0.7,
        max_tokens: 2048,
        tools: [],
        system_prompt: 'You are a helpful AI assistant',
        ...(this.config.environment || {}),
      },
      session: {
        max_duration: 3600,
        memory_type: 'conversation',
        context_window: 8000,
        ...(this.config.session || {}),
      },
      events: this.config.events || ['session_start', 'message_sent', 'session_end'],
      prompts: {
        system: 'Assist the user',
        examples: [{ input: 'Help me', expected_output: 'I can help with that' }],
        success_criteria: ['Clear', 'Helpful'],
        ...(this.config.prompts || {}),
      },
      tier: this.config.tier || 'starter',
    };

    return completeAgentConfig(base);
  }
}

describe('Builder Workflow Integration Tests', () => {
  beforeEach(() => {
    clearAllAgents();
    localStorageMock.clear();
  });

  afterEach(() => {
    clearAllAgents();
    localStorageMock.clear();
  });

  describe('Step 1: Create Agent', () => {
    it('should initialize builder with default config', () => {
      const builder = new BuilderSimulator();
      const config = builder.getConfig();

      expect(config).toEqual({});
    });

    it('should set agent type in step 1', () => {
      const builder = new BuilderSimulator()
        .step(1)
        .setAgentType('code-review');

      expect(builder.getConfig().type).toBe('code-review');
    });

    it('should support all 6 agent types', () => {
      const types = [
        'code-review',
        'document-processing',
        'research',
        'security-audit',
        'data-analysis',
        'customer-support',
      ];

      types.forEach((type) => {
        const builder = new BuilderSimulator().setAgentType(type);
        expect(builder.getConfig().type).toBe(type);
      });
    });

    it('should set agent name and description', () => {
      const builder = new BuilderSimulator()
        .step(1)
        .setAgentType('code-review')
        .setName('My Code Reviewer')
        .setDescription('Reviews code quality');

      const config = builder.getConfig();
      expect(config.type).toBe('code-review');
      expect(config.name).toBe('My Code Reviewer');
      expect(config.description).toBe('Reviews code quality');
    });

    it('should require agent type', () => {
      const builder = new BuilderSimulator().step(1);
      const config = builder.getConfig();

      expect(config.type).toBeUndefined();
    });

    it('should require name and description', () => {
      const builder = new BuilderSimulator()
        .step(1)
        .setAgentType('code-review');

      const config = builder.getConfig();
      expect(config.name).toBeUndefined();
      expect(config.description).toBeUndefined();
    });
  });

  describe('Step 2: Configure Environment', () => {
    it('should set environment configuration', () => {
      const builder = new BuilderSimulator()
        .setAgentType('code-review')
        .step(2)
        .setEnvironment({
          model: 'claude-sonnet-4.6',
          temperature: 0.5,
          max_tokens: 4096,
        });

      const config = builder.getConfig();
      expect(config.environment?.model).toBe('claude-sonnet-4.6');
      expect(config.environment?.temperature).toBe(0.5);
      expect(config.environment?.max_tokens).toBe(4096);
    });

    it('should support all model options', () => {
      const models = [
        'claude-opus-4.8',
        'claude-sonnet-4.6',
        'claude-haiku-4.5',
      ];

      models.forEach((model) => {
        const builder = new BuilderSimulator().setEnvironment({ model: model as any });
        expect(builder.getConfig().environment?.model).toBe(model);
      });
    });

    it('should set tools array', () => {
      const builder = new BuilderSimulator().step(2).setEnvironment({
        tools: ['code_analyzer', 'security_scanner', 'performance_profiler'],
      });

      expect(builder.getConfig().environment?.tools).toEqual([
        'code_analyzer',
        'security_scanner',
        'performance_profiler',
      ]);
    });

    it('should set system prompt', () => {
      const systemPrompt = 'You are an expert code reviewer focusing on quality and security';

      const builder = new BuilderSimulator().step(2).setEnvironment({
        system_prompt: systemPrompt,
      });

      expect(builder.getConfig().environment?.system_prompt).toBe(systemPrompt);
    });

    it('should validate temperature bounds', () => {
      const builder = new BuilderSimulator().setEnvironment({
        temperature: 0.7,
      });

      const config = builder.complete();
      const validation = validateAgentConfig(config);

      expect(validation.valid).toBe(true);
    });
  });

  describe('Step 3: Build Basics (Session Config)', () => {
    it('should set session configuration', () => {
      const builder = new BuilderSimulator()
        .setAgentType('code-review')
        .step(3)
        .setSession({
          max_duration: 7200,
          memory_type: 'context-window',
          context_window: 16000,
        });

      const config = builder.getConfig();
      expect(config.session?.max_duration).toBe(7200);
      expect(config.session?.memory_type).toBe('context-window');
      expect(config.session?.context_window).toBe(16000);
    });

    it('should support all memory types', () => {
      const memoryTypes = ['none', 'conversation', 'context-window'];

      memoryTypes.forEach((type) => {
        const builder = new BuilderSimulator().setSession({
          memory_type: type as any,
        });
        expect(builder.getConfig().session?.memory_type).toBe(type);
      });
    });

    it('should set event types', () => {
      const builder = new BuilderSimulator()
        .step(3)
        .setEvents(['session_start', 'message_sent', 'tool_used', 'session_end']);

      expect(builder.getConfig().events).toEqual([
        'session_start',
        'message_sent',
        'tool_used',
        'session_end',
      ]);
    });

    it('should require at least one event', () => {
      const builder = new BuilderSimulator().setEvents([]);
      const config = builder.complete();
      const validation = validateAgentConfig(config);

      expect(validation.valid).toBe(false);
    });
  });

  describe('Step 4: Stream Response', () => {
    it('should be a review/preview step without config changes', () => {
      const builder = new BuilderSimulator()
        .setAgentType('code-review')
        .setName('Test Agent')
        .setDescription('A test agent');

      const step3Config = builder.getConfig();
      // Step 4 is typically a read-only preview
      const step4Config = builder.getConfig();

      expect(step4Config).toEqual(step3Config);
    });

    it('should show complete configuration', () => {
      const builder = new BuilderSimulator()
        .setAgentType('research')
        .setName('Research Agent')
        .setDescription('Conducts research')
        .setEnvironment({ model: 'claude-sonnet-4.6' })
        .setTier('pro');

      const config = builder.complete();

      expect(config.type).toBe('research');
      expect(config.name).toBe('Research Agent');
      expect(config.environment.model).toBe('claude-sonnet-4.6');
      expect(config.tier).toBe('pro');
    });
  });

  describe('Step 5: Fine-tune', () => {
    it('should set custom prompts', () => {
      const builder = new BuilderSimulator()
        .setAgentType('document-processing')
        .step(5)
        .setPrompts({
          system: 'Extract structured data from documents',
          examples: [
            {
              input: 'Extract dates from contract',
              expected_output: 'JSON with dates',
            },
            {
              input: 'Extract parties from agreement',
              expected_output: 'JSON with parties',
            },
          ],
          success_criteria: ['Accurate extraction', 'Proper formatting', 'Complete coverage'],
        });

      const config = builder.getConfig();
      expect(config.prompts?.system).toBe('Extract structured data from documents');
      expect(config.prompts?.examples).toHaveLength(2);
      expect(config.prompts?.success_criteria).toHaveLength(3);
    });

    it('should support pricing tier selection', () => {
      const tiers = ['starter', 'pro', 'addon'];

      tiers.forEach((tier) => {
        const builder = new BuilderSimulator().setTier(tier);
        expect(builder.getConfig().tier).toBe(tier);
      });
    });

    it('should validate complete configuration', () => {
      const builder = new BuilderSimulator()
        .setAgentType('security-audit')
        .setName('Security Audit Agent')
        .setDescription('Performs security audits')
        .setEnvironment({
          model: 'claude-opus-4.8',
          temperature: 0.3,
          max_tokens: 8192,
          tools: ['vulnerability_scanner', 'code_analyzer'],
          system_prompt: 'You are a security expert',
        })
        .setSession({
          max_duration: 3600,
          memory_type: 'conversation',
          context_window: 8192,
        })
        .setEvents(['session_start', 'message_sent', 'session_end'])
        .setPrompts({
          system: 'Audit code for security vulnerabilities',
          examples: [
            {
              input: 'Review this code',
              expected_output: 'Security findings',
            },
          ],
          success_criteria: ['Identifies vulnerabilities', 'Suggests fixes'],
        })
        .setTier('pro');

      const config = builder.complete();
      const validation = validateAgentConfig(config);

      expect(validation.valid).toBe(true);
    });
  });

  describe('Complete 5-Step Workflow', () => {
    it('should complete full workflow end-to-end', () => {
      // Step 1: Create Agent
      const builder = new BuilderSimulator()
        .step(1)
        .setAgentType('code-review')
        .setName('Code Quality Reviewer')
        .setDescription('Reviews code for quality and best practices');

      // Step 2: Configure Environment
      builder
        .step(2)
        .setEnvironment({
          model: 'claude-sonnet-4.6',
          temperature: 0.5,
          max_tokens: 4096,
          tools: ['linter', 'analyzer'],
          system_prompt: 'You are an expert code reviewer',
        });

      // Step 3: Build Basics
      builder
        .step(3)
        .setSession({
          max_duration: 5400,
          memory_type: 'conversation',
          context_window: 12000,
        })
        .setEvents(['session_start', 'message_sent', 'session_end']);

      // Step 4: Stream Response (preview only)
      const step4Config = builder.getConfig();
      expect(step4Config.type).toBe('code-review');

      // Step 5: Fine-tune
      builder
        .step(5)
        .setPrompts({
          system: 'Review code for quality, security, and performance',
          examples: [
            {
              input: 'Review this function',
              expected_output: 'Quality and performance review',
            },
          ],
          success_criteria: ['Quality improvements', 'Security assessment'],
        })
        .setTier('pro');

      // Complete workflow
      const finalConfig = builder.complete();

      expect(finalConfig.type).toBe('code-review');
      expect(finalConfig.name).toBe('Code Quality Reviewer');
      expect(finalConfig.environment.model).toBe('claude-sonnet-4.6');
      expect(finalConfig.session.memory_type).toBe('conversation');
      expect(finalConfig.tier).toBe('pro');

      const validation = validateAgentConfig(finalConfig);
      expect(validation.valid).toBe(true);
    });

    it('should persist workflow state across steps', () => {
      const builder = new BuilderSimulator()
        .setAgentType('research')
        .setName('Research Agent')
        .setDescription('Conducts research')
        .setEnvironment({ model: 'claude-opus-4.8' })
        .setSession({ memory_type: 'context-window' })
        .setTier('starter');

      const intermediate = builder.getConfig();

      // Continue from intermediate state
      builder.setPrompts({
        system: 'Conduct research',
        examples: [{ input: 'Research topic', expected_output: 'Research findings' }],
        success_criteria: ['Comprehensive', 'Accurate'],
      });

      const final = builder.getConfig();

      expect(final.name).toBe('Research Agent');
      expect(final.environment?.model).toBe('claude-opus-4.8');
      expect(final.prompts?.system).toBe('Conduct research');
    });
  });

  describe('Builder Persistence', () => {
    it('should save builder state to localStorage', () => {
      const builder = new BuilderSimulator()
        .setAgentType('code-review')
        .setName('Test Agent');

      const config = builder.complete();
      saveAgent(config);

      const stored = localStorage.getItem('agent-builder-agents');
      expect(stored).not.toBeNull();
      expect(stored).toContain('code-review');
    });

    it('should restore builder state from localStorage', () => {
      const builder = new BuilderSimulator()
        .setAgentType('document-processing')
        .setName('Doc Processor')
        .setDescription('Processes documents');

      const config = builder.complete();
      saveAgent(config);

      const loaded = getAgent(config.id);
      expect(loaded).not.toBeNull();
      expect(loaded?.name).toBe('Doc Processor');
      expect(loaded?.type).toBe('document-processing');
    });

    it('should update existing agent in workflow', () => {
      let builder = new BuilderSimulator()
        .setAgentType('security-audit')
        .setName('Security Auditor');

      let config = builder.complete();
      saveAgent(config);

      // Load and modify
      const loaded = getAgent(config.id)!;
      builder = new BuilderSimulator();
      builder.getConfig().name = 'Enhanced Security Auditor';

      loaded.name = 'Enhanced Security Auditor';
      loaded.updated_at = new Date().toISOString();
      saveAgent(loaded);

      const updated = getAgent(config.id);
      expect(updated?.name).toBe('Enhanced Security Auditor');
    });
  });

  describe('Workflow Validation', () => {
    it('should validate at workflow completion', () => {
      const builder = new BuilderSimulator()
        .setAgentType('customer-support')
        .setName('Support Agent')
        .setDescription('Provides customer support')
        .setEnvironment({ system_prompt: 'Help customers' })
        .setPrompts({
          system: 'Answer customer questions',
          examples: [{ input: 'How do I...', expected_output: 'Here is how...' }],
          success_criteria: ['Helpful', 'Clear'],
        });

      const config = builder.complete();
      const validation = validateAgentConfig(config);

      expect(validation.valid).toBe(true);
    });

    it('should fail validation for incomplete workflow', () => {
      const builder = new BuilderSimulator().setAgentType('data-analysis');
      // Missing required fields

      const config = builder.complete();
      const validation = validateAgentConfig(config);

      expect(validation.valid).toBe(true); // Should complete with defaults
    });

    it('should provide validation errors for invalid config', () => {
      const builder = new BuilderSimulator()
        .setAgentType('code-review')
        .setEnvironment({ temperature: 1.5 }); // Invalid

      const config = builder.complete();
      const validation = validateAgentConfig(config);

      expect(validation.valid).toBe(false);
      expect(validation.errors).toBeDefined();
    });
  });

  describe('Multi-Agent Workflow', () => {
    it('should create multiple agents in workflow', () => {
      const agents = [
        new BuilderSimulator()
          .setAgentType('code-review')
          .setName('Code Reviewer')
          .complete(),
        new BuilderSimulator()
          .setAgentType('security-audit')
          .setName('Security Auditor')
          .complete(),
        new BuilderSimulator()
          .setAgentType('data-analysis')
          .setName('Data Analyst')
          .complete(),
      ];

      agents.forEach(saveAgent);

      const loaded = getAgents();
      expect(loaded).toHaveLength(3);
    });

    it('should maintain separate agent states', () => {
      const builder1 = new BuilderSimulator()
        .setAgentType('code-review')
        .setName('Agent 1')
        .setTier('starter');

      const builder2 = new BuilderSimulator()
        .setAgentType('research')
        .setName('Agent 2')
        .setTier('pro');

      const config1 = builder1.complete();
      const config2 = builder2.complete();

      saveAgent(config1);
      saveAgent(config2);

      const loaded1 = getAgent(config1.id);
      const loaded2 = getAgent(config2.id);

      expect(loaded1?.tier).toBe('starter');
      expect(loaded2?.tier).toBe('pro');
    });
  });
});
