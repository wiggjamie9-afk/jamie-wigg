import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getAgents, saveAgent, deleteAgent, clearAllAgents, getAgent } from '@/lib/storage';
import { completeAgentConfig } from '@/lib/agent-config';
import { AgentConfig } from '@/lib/schemas';

/**
 * Integration tests for dashboard functionality
 * Tests cover: agent listing, creation, deletion, filtering, and persistence
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

// Helper to create a test agent
function createTestAgent(overrides?: Partial<AgentConfig>): AgentConfig {
  const base = {
    type: 'code-review' as const,
    name: 'Test Agent',
    description: 'A test agent for code review',
    environment: {
      model: 'claude-opus-4.8' as const,
      temperature: 0.3,
      max_tokens: 4096,
      tools: ['analyzer'],
      system_prompt: 'Review code for quality',
    },
    session: {
      max_duration: 3600,
      memory_type: 'conversation' as const,
      context_window: 8192,
    },
    events: ['session_start', 'message_sent', 'session_end'],
    prompts: {
      system: 'Review code',
      examples: [{ input: 'Review this', expected_output: 'Review results' }],
      success_criteria: ['Identifies issues', 'Suggests improvements'],
    },
    tier: 'starter' as const,
  };

  const completed = completeAgentConfig(base as any);
  return { ...completed, ...overrides };
}

describe('Dashboard Integration Tests', () => {
  beforeEach(() => {
    clearAllAgents();
    localStorageMock.clear();
  });

  afterEach(() => {
    clearAllAgents();
    localStorageMock.clear();
  });

  describe('Agent Listing and Loading', () => {
    it('should load empty agent list on first load', () => {
      const agents = getAgents();
      expect(agents).toEqual([]);
    });

    it('should load persisted agents from localStorage', () => {
      const agent1 = createTestAgent({ name: 'Agent 1' });
      const agent2 = createTestAgent({ name: 'Agent 2' });

      saveAgent(agent1);
      saveAgent(agent2);

      const loaded = getAgents();
      expect(loaded).toHaveLength(2);
      expect(loaded[0].name).toBe('Agent 1');
      expect(loaded[1].name).toBe('Agent 2');
    });

    it('should maintain agent order on reload', () => {
      const agents = [
        createTestAgent({ name: 'First' }),
        createTestAgent({ name: 'Second' }),
        createTestAgent({ name: 'Third' }),
      ];

      agents.forEach(saveAgent);
      const loaded = getAgents();

      expect(loaded.map((a) => a.name)).toEqual(['First', 'Second', 'Third']);
    });

    it('should handle corrupted localStorage gracefully', () => {
      localStorage.setItem('agent-builder-agents', 'invalid json {');
      const agents = getAgents();
      expect(agents).toEqual([]);
    });

    it('should load specific agent by ID', () => {
      const agent1 = createTestAgent({ name: 'Agent 1' });
      const agent2 = createTestAgent({ name: 'Agent 2' });

      saveAgent(agent1);
      saveAgent(agent2);

      const loaded = getAgent(agent1.id);
      expect(loaded).not.toBeNull();
      expect(loaded?.id).toBe(agent1.id);
      expect(loaded?.name).toBe('Agent 1');
    });

    it('should return null for non-existent agent ID', () => {
      const loaded = getAgent('non-existent-id');
      expect(loaded).toBeNull();
    });
  });

  describe('Agent Creation', () => {
    it('should create and persist a new agent', () => {
      const agent = createTestAgent();
      saveAgent(agent);

      const loaded = getAgent(agent.id);
      expect(loaded).not.toBeNull();
      expect(loaded?.id).toBe(agent.id);
      expect(loaded?.name).toBe(agent.name);
    });

    it('should generate unique IDs for each agent', () => {
      const agent1 = createTestAgent({ name: 'Agent 1' });
      const agent2 = createTestAgent({ name: 'Agent 2' });

      saveAgent(agent1);
      saveAgent(agent2);

      expect(agent1.id).not.toBe(agent2.id);
    });

    it('should preserve all agent fields', () => {
      const agent = createTestAgent({
        name: 'Full Agent',
        description: 'Complete test agent',
        tier: 'pro',
        environment: {
          model: 'claude-sonnet-4.6',
          temperature: 0.7,
          max_tokens: 8192,
          tools: ['tool1', 'tool2'],
          system_prompt: 'You are helpful',
        },
      });

      saveAgent(agent);
      const loaded = getAgent(agent.id);

      expect(loaded?.name).toBe('Full Agent');
      expect(loaded?.description).toBe('Complete test agent');
      expect(loaded?.tier).toBe('pro');
      expect(loaded?.environment.model).toBe('claude-sonnet-4.6');
      expect(loaded?.environment.temperature).toBe(0.7);
      expect(loaded?.environment.tools).toEqual(['tool1', 'tool2']);
    });

    it('should support all agent types', () => {
      const types = [
        'code-review',
        'document-processing',
        'research',
        'security-audit',
        'data-analysis',
        'customer-support',
      ] as const;

      types.forEach((type) => {
        const agent = createTestAgent({ type });
        saveAgent(agent);
      });

      const agents = getAgents();
      expect(agents).toHaveLength(6);
      expect(agents.map((a) => a.type)).toEqual(types);
    });

    it('should support all pricing tiers', () => {
      const tiers = ['starter', 'pro', 'addon'] as const;

      tiers.forEach((tier) => {
        const agent = createTestAgent({ tier });
        saveAgent(agent);
      });

      const agents = getAgents();
      expect(agents).toHaveLength(3);
      expect(agents.map((a) => a.tier)).toEqual(tiers);
    });
  });

  describe('Agent Deletion', () => {
    it('should delete an agent', () => {
      const agent = createTestAgent();
      saveAgent(agent);

      expect(getAgent(agent.id)).not.toBeNull();

      deleteAgent(agent.id);

      expect(getAgent(agent.id)).toBeNull();
    });

    it('should remove agent from list after deletion', () => {
      const agent1 = createTestAgent({ name: 'Agent 1' });
      const agent2 = createTestAgent({ name: 'Agent 2' });

      saveAgent(agent1);
      saveAgent(agent2);

      deleteAgent(agent1.id);

      const remaining = getAgents();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe(agent2.id);
    });

    it('should handle deletion of non-existent agent gracefully', () => {
      const agent = createTestAgent();
      saveAgent(agent);

      // Should not throw
      expect(() => deleteAgent('non-existent-id')).not.toThrow();

      const agents = getAgents();
      expect(agents).toHaveLength(1);
    });

    it('should support bulk deletion via clear', () => {
      const agents = Array.from({ length: 5 }, (_, i) =>
        createTestAgent({ name: `Agent ${i}` })
      );

      agents.forEach(saveAgent);
      expect(getAgents()).toHaveLength(5);

      clearAllAgents();
      expect(getAgents()).toHaveLength(0);
    });
  });

  describe('Agent Filtering and Grouping', () => {
    beforeEach(() => {
      const agents = [
        createTestAgent({
          name: 'Code Review 1',
          type: 'code-review',
          tier: 'starter',
        }),
        createTestAgent({
          name: 'Security Audit 1',
          type: 'security-audit',
          tier: 'pro',
        }),
        createTestAgent({
          name: 'Research 1',
          type: 'research',
          tier: 'pro',
        }),
        createTestAgent({
          name: 'Code Review 2',
          type: 'code-review',
          tier: 'addon',
        }),
      ];

      agents.forEach(saveAgent);
    });

    it('should filter agents by type', () => {
      const agents = getAgents();
      const codeReviewAgents = agents.filter((a) => a.type === 'code-review');

      expect(codeReviewAgents).toHaveLength(2);
      expect(codeReviewAgents.every((a) => a.type === 'code-review')).toBe(true);
    });

    it('should filter agents by tier', () => {
      const agents = getAgents();
      const proAgents = agents.filter((a) => a.tier === 'pro');

      expect(proAgents).toHaveLength(2);
      expect(proAgents.every((a) => a.tier === 'pro')).toBe(true);
    });

    it('should group agents by type', () => {
      const agents = getAgents();
      const grouped = agents.reduce<Record<string, AgentConfig[]>>((acc, agent) => {
        if (!acc[agent.type]) {
          acc[agent.type] = [];
        }
        acc[agent.type].push(agent);
        return acc;
      }, {});

      expect(Object.keys(grouped)).toContain('code-review');
      expect(Object.keys(grouped)).toContain('security-audit');
      expect(Object.keys(grouped)).toContain('research');
      expect(grouped['code-review']).toHaveLength(2);
    });

    it('should count agents by tier', () => {
      const agents = getAgents();
      const tierCounts = agents.reduce<Record<string, number>>((acc, agent) => {
        acc[agent.tier] = (acc[agent.tier] || 0) + 1;
        return acc;
      }, {});

      expect(tierCounts['starter']).toBe(1);
      expect(tierCounts['pro']).toBe(2);
      expect(tierCounts['addon']).toBe(1);
    });
  });

  describe('Agent Updates', () => {
    it('should update agent in place', () => {
      const agent = createTestAgent({ name: 'Original Name' });
      saveAgent(agent);

      const loaded = getAgent(agent.id)!;
      loaded.name = 'Updated Name';
      loaded.updated_at = new Date().toISOString();
      saveAgent(loaded);

      const updated = getAgent(agent.id);
      expect(updated?.name).toBe('Updated Name');
    });

    it('should preserve agent ID on update', () => {
      const agent = createTestAgent();
      const originalId = agent.id;

      saveAgent(agent);

      const loaded = getAgent(originalId)!;
      loaded.description = 'New description';
      saveAgent(loaded);

      const updated = getAgent(originalId);
      expect(updated?.id).toBe(originalId);
    });

    it('should update timestamp on modification', async () => {
      const agent = createTestAgent();
      const originalUpdatedAt = agent.updated_at;

      saveAgent(agent);
      const loaded = getAgent(agent.id)!;

      // Simulate time passing
      await new Promise(resolve => setTimeout(resolve, 10));

      loaded.updated_at = new Date().toISOString();
      saveAgent(loaded);

      const updated = getAgent(agent.id)!;
      expect(updated.updated_at >= originalUpdatedAt).toBe(true);
    });

    it('should support partial updates', () => {
      const agent = createTestAgent({
        name: 'Test Agent',
        description: 'Original description',
      });

      saveAgent(agent);
      const loaded = getAgent(agent.id)!;

      // Update only name
      loaded.name = 'Updated Name';
      saveAgent(loaded);

      const updated = getAgent(agent.id)!;
      expect(updated.name).toBe('Updated Name');
      expect(updated.description).toBe('Original description');
    });
  });

  describe('Dashboard Statistics', () => {
    beforeEach(() => {
      const agents = [
        createTestAgent({ name: 'Agent 1', tier: 'starter' }),
        createTestAgent({ name: 'Agent 2', tier: 'pro' }),
        createTestAgent({ name: 'Agent 3', tier: 'pro' }),
        createTestAgent({ name: 'Agent 4', tier: 'addon' }),
      ];

      agents.forEach(saveAgent);
    });

    it('should calculate total agent count', () => {
      const agents = getAgents();
      expect(agents.length).toBe(4);
    });

    it('should calculate pro tier count', () => {
      const agents = getAgents();
      const proCount = agents.filter((a) => a.tier === 'pro').length;
      expect(proCount).toBe(2);
    });

    it('should calculate agents created this month', () => {
      const agents = getAgents();
      const thisMonth = agents.filter((a) => {
        const agentMonth = new Date(a.created_at).getMonth();
        const currentMonth = new Date().getMonth();
        return agentMonth === currentMonth;
      }).length;

      expect(thisMonth).toBe(4); // All test agents are created today
    });

    it('should calculate tier distribution', () => {
      const agents = getAgents();
      const distribution = {
        starter: agents.filter((a) => a.tier === 'starter').length,
        pro: agents.filter((a) => a.tier === 'pro').length,
        addon: agents.filter((a) => a.tier === 'addon').length,
      };

      expect(distribution.starter).toBe(1);
      expect(distribution.pro).toBe(2);
      expect(distribution.addon).toBe(1);
    });
  });

  describe('Dashboard Error Handling', () => {
    it('should handle invalid stored data structure', () => {
      localStorage.setItem(
        'agent-builder-agents',
        JSON.stringify([{ incomplete: 'data' }])
      );

      // Should return empty or handle gracefully
      const agents = getAgents();
      expect(Array.isArray(agents)).toBe(true);
    });

    it('should recover from corrupted localStorage', () => {
      const agent = createTestAgent();
      saveAgent(agent);

      localStorage.setItem('agent-builder-agents', 'corrupted data');

      const agents = getAgents();
      expect(agents).toEqual([]);
    });

    it('should handle missing localStorage gracefully', () => {
      localStorage.removeItem('agent-builder-agents');
      const agents = getAgents();
      expect(agents).toEqual([]);
    });
  });

  describe('Dashboard Persistence Across Sessions', () => {
    it('should persist agents across page reloads', () => {
      const agent = createTestAgent();
      saveAgent(agent);

      // Simulate page reload by clearing and reloading
      const stored = localStorage.getItem('agent-builder-agents');
      localStorageMock.clear();
      localStorage.setItem('agent-builder-agents', stored!);

      const loaded = getAgents();
      expect(loaded).toHaveLength(1);
      expect(loaded[0].id).toBe(agent.id);
    });

    it('should maintain data integrity across multiple saves', () => {
      const agents = Array.from({ length: 10 }, (_, i) =>
        createTestAgent({ name: `Agent ${i}` })
      );

      agents.forEach(saveAgent);

      const loaded = getAgents();
      expect(loaded).toHaveLength(10);

      // Verify each agent is intact
      agents.forEach((original) => {
        const found = loaded.find((a) => a.id === original.id);
        expect(found).toBeDefined();
        expect(found?.name).toBe(original.name);
      });
    });

    it('should handle concurrent operations safely', () => {
      const promises = Array.from({ length: 5 }, (_, i) => {
        return Promise.resolve(createTestAgent({ name: `Agent ${i}` })).then(
          (agent) => {
            saveAgent(agent);
            return agent;
          }
        );
      });

      return Promise.all(promises).then(() => {
        const agents = getAgents();
        expect(agents.length).toBeGreaterThanOrEqual(5);
      });
    });
  });
});
