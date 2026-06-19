import { ToolResolver } from './tools/resolver.js';
import { ToolExecutor, ExecutionResult } from './tools/executor.js';
import { ToolRegistryEntry } from './tools/schema.js';

export interface AgentStep {
  type: 'thought' | 'action' | 'observation' | 'conclusion';
  content: string;
  toolId?: string;
  toolResult?: ExecutionResult;
}

export interface AgentContext {
  systemPrompt?: string;
  maxSteps?: number;
  toolTimeout?: number;
  retryCount?: number;
}

export interface AgentResponse {
  conclusion: string;
  steps: AgentStep[];
  toolsUsed: Array<{
    toolId: string;
    category: string;
    success: boolean;
    duration: number;
  }>;
  totalDuration: number;
}

export class AriaAgent {
  private resolver: ToolResolver;
  private executor: ToolExecutor;
  private steps: AgentStep[] = [];
  private toolsUsed: Array<{
    toolId: string;
    category: string;
    success: boolean;
    duration: number;
  }> = [];

  constructor(resolver: ToolResolver, executor: ToolExecutor) {
    this.resolver = resolver;
    this.executor = executor;
  }

  async execute(
    goal: string,
    category: string,
    params: Record<string, any>,
    context: AgentContext = {},
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const maxSteps = context.maxSteps || 5;

    this.steps = [];
    this.toolsUsed = [];

    // Step 1: Think
    this.steps.push({
      type: 'thought',
      content: `Goal: ${goal}. Category: ${category}. Looking for available tools to solve this.`,
    });

    // Step 2: Resolve tool chain
    const toolChain = this.resolver.resolveToolChain(category);
    if (toolChain.length === 0) {
      this.steps.push({
        type: 'observation',
        content: `No tools available in category: ${category}`,
      });
      return this.buildResponse(startTime);
    }

    this.steps.push({
      type: 'thought',
      content: `Found ${toolChain.length} tool(s) available. Primary: ${toolChain[0].name} with ${toolChain.length - 1} fallback(s).`,
    });

    // Step 3: Execute tool chain
    this.steps.push({
      type: 'action',
      content: `Executing tool from category "${category}" with parameters: ${JSON.stringify(params)}`,
    });

    const result = await this.executor.executeTool(category, params, {
      timeout: context.toolTimeout || 5000,
      retryCount: context.retryCount || 1,
    });

    this.steps.push({
      type: 'observation',
      content: result.success
        ? `Tool execution successful. Result: ${JSON.stringify(result.data).substring(0, 200)}...`
        : `Tool execution failed: ${result.error}`,
      toolId: result.toolId,
      toolResult: result,
    });

    if (result.success) {
      this.toolsUsed.push({
        toolId: result.toolId,
        category,
        success: true,
        duration: result.duration,
      });
    }

    // Step 4: Conclude
    let conclusion = '';
    if (result.success) {
      conclusion = `Successfully executed "${result.toolId}" and retrieved data. ${
        result.data ? 'Key information: ' + JSON.stringify(result.data).substring(0, 100) : ''
      }`;
    } else {
      conclusion = `Failed to retrieve data from category "${category}": ${result.error}`;
    }

    this.steps.push({
      type: 'conclusion',
      content: conclusion,
    });

    return this.buildResponse(startTime);
  }

  /**
   * Multi-turn agent loop: reason about goals, select tools, execute, and iterate
   */
  async reason(
    goal: string,
    context: AgentContext = {},
  ): Promise<AgentResponse> {
    const startTime = Date.now();
    const maxSteps = context.maxSteps || 5;

    this.steps = [];
    this.toolsUsed = [];

    // Initial thought
    this.steps.push({
      type: 'thought',
      content: `Goal: ${goal}. Analyzing what tools and data sources might help accomplish this.`,
    });

    // Simple category inference from goal
    const inferredCategory = this.inferCategory(goal);

    if (inferredCategory) {
      this.steps.push({
        type: 'thought',
        content: `Inferred relevant category: "${inferredCategory}". Will attempt to fetch data from this category.`,
      });

      const toolChain = this.resolver.resolveToolChain(inferredCategory);
      if (toolChain.length > 0) {
        this.steps.push({
          type: 'action',
          content: `Executing tool chain for "${inferredCategory}": ${toolChain.map((t) => t.name).join(', ')}`,
        });

        const params = this.inferParams(goal, inferredCategory);
        const result = await this.executor.executeTool(inferredCategory, params, {
          timeout: context.toolTimeout || 5000,
        });

        this.steps.push({
          type: 'observation',
          content: result.success
            ? `Retrieved data from ${result.toolId}`
            : `Tool failed: ${result.error}`,
          toolId: result.toolId,
          toolResult: result,
        });

        if (result.success) {
          this.toolsUsed.push({
            toolId: result.toolId,
            category: inferredCategory,
            success: true,
            duration: result.duration,
          });
        }
      }
    }

    // Final conclusion
    const conclusionText = this.synthesizeConclusion(goal);
    this.steps.push({
      type: 'conclusion',
      content: conclusionText,
    });

    return this.buildResponse(startTime);
  }

  /**
   * Infer tool category from natural language goal
   */
  private inferCategory(goal: string): string | undefined {
    const goalLower = goal.toLowerCase();
    const categories = this.resolver.getCategories();

    // Simple heuristic: find category with keyword overlap
    for (const category of categories) {
      if (goalLower.includes(category.toLowerCase())) {
        return category;
      }
    }

    // Fallback: try substring matching on first few categories
    for (const category of categories.slice(0, 5)) {
      const tools = this.resolver.getToolsInCategory(category);
      if (tools.some((t) => goalLower.includes(t.name.toLowerCase()))) {
        return category;
      }
    }

    return undefined;
  }

  /**
   * Infer API parameters from goal and category
   */
  private inferParams(goal: string, category: string): Record<string, any> {
    const tool = this.resolver.resolveTool(category);
    if (!tool || !tool.inputSchema) {
      return {};
    }

    const params: Record<string, any> = {};
    const props = tool.inputSchema.properties || {};

    // Simple parameter extraction from goal text
    Object.keys(props).forEach((key) => {
      const keyLower = key.toLowerCase();
      if (goal.toLowerCase().includes(keyLower)) {
        // Extract value after key name
        const match = goal.match(new RegExp(`${keyLower}[:\\s]+([^,]+)`, 'i'));
        if (match) {
          params[key] = match[1].trim();
        }
      }
    });

    return params;
  }

  /**
   * Synthesize final conclusion from collected observations
   */
  private synthesizeConclusion(goal: string): string {
    const observations = this.steps.filter((s) => s.type === 'observation');
    if (observations.length === 0) {
      return `Could not accomplish goal: ${goal}`;
    }

    const successfulObs = observations.filter((s) => s.toolResult?.success);
    if (successfulObs.length === 0) {
      return `Attempted to accomplish goal but encountered errors: ${goal}`;
    }

    return `Successfully gathered information to address: ${goal}`;
  }

  private buildResponse(startTime: number): AgentResponse {
    return {
      conclusion: this.steps.find((s) => s.type === 'conclusion')?.content || '',
      steps: this.steps,
      toolsUsed: this.toolsUsed,
      totalDuration: Date.now() - startTime,
    };
  }

  getSteps(): AgentStep[] {
    return this.steps;
  }

  getMetadata() {
    return {
      resolver: {
        totalCategories: this.resolver.getCategories().length,
        metadata: this.resolver.getMetadata(),
      },
      lastExecution: {
        stepsCount: this.steps.length,
        toolsUsed: this.toolsUsed.length,
      },
    };
  }
}
