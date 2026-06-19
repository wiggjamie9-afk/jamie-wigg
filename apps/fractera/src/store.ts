import { create } from 'zustand';

export interface ToolEntry {
  id: string;
  name: string;
  category: string;
  description: string;
  endpoint: string;
  freetier: boolean;
  enabled: boolean;
}

export interface ExecutionLog {
  id: string;
  timestamp: Date;
  toolId: string;
  toolName: string;
  category: string;
  success: boolean;
  duration: number;
  error?: string;
  cost?: number;
}

export interface PlatformStats {
  totalTools: number;
  totalCategories: number;
  lastSyncTime?: Date;
  executionCount: number;
  totalCost: number;
}

interface PlatformStore {
  // State
  tools: ToolEntry[];
  logs: ExecutionLog[];
  apiKeys: Record<string, string>;
  stats: PlatformStats;
  selectedCategory: string | null;
  searchQuery: string;

  // Tools
  setTools: (tools: ToolEntry[]) => void;
  addTool: (tool: ToolEntry) => void;
  filterTools: (predicate: (t: ToolEntry) => boolean) => ToolEntry[];
  getToolsByCategory: (category: string) => ToolEntry[];
  searchTools: (query: string) => ToolEntry[];

  // Execution Logs
  addLog: (log: Omit<ExecutionLog, 'id'>) => void;
  clearLogs: () => void;
  getRecentLogs: (limit: number) => ExecutionLog[];

  // API Keys
  setApiKey: (toolId: string, key: string) => void;
  getApiKey: (toolId: string) => string | undefined;
  hasApiKey: (toolId: string) => boolean;

  // Stats
  updateStats: (stats: Partial<PlatformStats>) => void;

  // UI State
  setSelectedCategory: (category: string | null) => void;
  setSearchQuery: (query: string) => void;
}

export const usePlatformStore = create<PlatformStore>((set, get) => ({
  // Initial state
  tools: [],
  logs: [],
  apiKeys: {},
  stats: {
    totalTools: 0,
    totalCategories: 0,
    executionCount: 0,
    totalCost: 0,
  },
  selectedCategory: null,
  searchQuery: '',

  // Tools
  setTools: (tools) => set({ tools }),
  addTool: (tool) => set((state) => ({ tools: [...state.tools, tool] })),
  filterTools: (predicate) => get().tools.filter(predicate),
  getToolsByCategory: (category) =>
    get().tools.filter((t) => t.category === category),
  searchTools: (query) => {
    const q = query.toLowerCase();
    return get().tools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q),
    );
  },

  // Execution Logs
  addLog: (log) =>
    set((state) => ({
      logs: [{ id: `log-${Date.now()}`, ...log }, ...state.logs],
      stats: {
        ...state.stats,
        executionCount: state.stats.executionCount + 1,
        totalCost: state.stats.totalCost + (log.cost || 0),
      },
    })),
  clearLogs: () => set({ logs: [] }),
  getRecentLogs: (limit) => get().logs.slice(0, limit),

  // API Keys
  setApiKey: (toolId, key) =>
    set((state) => ({
      apiKeys: { ...state.apiKeys, [toolId]: key },
    })),
  getApiKey: (toolId) => get().apiKeys[toolId],
  hasApiKey: (toolId) => Boolean(get().apiKeys[toolId]),

  // Stats
  updateStats: (updates) =>
    set((state) => ({
      stats: { ...state.stats, ...updates },
    })),

  // UI State
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
