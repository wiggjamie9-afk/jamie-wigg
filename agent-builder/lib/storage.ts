import { AgentConfig } from './schemas';

const STORAGE_KEY = 'agent-builder-agents';

/**
 * Get all agents from localStorage
 */
export function getAgents(): AgentConfig[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load agents:', error);
    return [];
  }
}

/**
 * Get a single agent by ID
 */
export function getAgent(id: string): AgentConfig | null {
  const agents = getAgents();
  return agents.find((agent) => agent.id === id) || null;
}

/**
 * Save an agent
 */
export function saveAgent(agent: AgentConfig): void {
  if (typeof window === 'undefined') return;

  try {
    const agents = getAgents();
    const existingIndex = agents.findIndex((a) => a.id === agent.id);

    if (existingIndex >= 0) {
      agents[existingIndex] = agent;
    } else {
      agents.push(agent);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
  } catch (error) {
    console.error('Failed to save agent:', error);
  }
}

/**
 * Delete an agent by ID
 */
export function deleteAgent(id: string): void {
  if (typeof window === 'undefined') return;

  try {
    const agents = getAgents();
    const filtered = agents.filter((a) => a.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to delete agent:', error);
  }
}

/**
 * Clear all agents
 */
export function clearAllAgents(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear agents:', error);
  }
}
