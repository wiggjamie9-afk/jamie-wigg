import fs from "fs";
import path from "path";

/**
 * Agent template configuration structure
 */
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  tier: "starter" | "pro" | "addon";
  environment: {
    model: string;
    temperature: number;
    max_tokens: number;
    tools: string[];
    system_prompt: string;
  };
  session: {
    max_duration: number;
    memory_type: "none" | "conversation" | "context-window";
    context_window: number;
  };
  prompts: {
    system: string;
    examples: Array<{
      input: string;
      expected_output: string;
    }>;
    success_criteria: string[];
  };
}

// Template IDs
export type AgentTemplateType =
  | "code-review"
  | "document-processing"
  | "research"
  | "security-audit"
  | "data-analysis"
  | "customer-support";

const TEMPLATES_DIR = path.join(__dirname, "../templates");

/**
 * Load a single agent template by type
 * @param type - The agent template type
 * @returns The template configuration
 * @throws Error if template not found
 */
export function loadTemplate(type: AgentTemplateType): AgentTemplate {
  const templatePath = path.join(TEMPLATES_DIR, `${type}.json`);

  if (!fs.existsSync(templatePath)) {
    throw new Error(`Template not found: ${type}`);
  }

  const content = fs.readFileSync(templatePath, "utf-8");
  return JSON.parse(content) as AgentTemplate;
}

/**
 * Load all available templates
 * @returns Map of template type to template configuration
 */
export function loadAllTemplates(): Map<AgentTemplateType, AgentTemplate> {
  const templates = new Map<AgentTemplateType, AgentTemplate>();

  const files = fs.readdirSync(TEMPLATES_DIR);

  for (const file of files) {
    if (file.endsWith(".json")) {
      const type = file.replace(".json", "") as AgentTemplateType;
      try {
        const template = loadTemplate(type);
        templates.set(type, template);
      } catch (error) {
        console.error(`Failed to load template ${type}:`, error);
      }
    }
  }

  return templates;
}

/**
 * Get a list of all available template types
 * @returns Array of available agent template types
 */
export function getAvailableTemplates(): AgentTemplateType[] {
  const templates = loadAllTemplates();
  return Array.from(templates.keys());
}

/**
 * Get template metadata (name, description, tier)
 * @returns Array of template metadata sorted by tier
 */
export function getTemplateMetadata(): Array<{
  id: AgentTemplateType;
  name: string;
  description: string;
  tier: string;
}> {
  const templates = loadAllTemplates();
  const tierOrder = { starter: 0, pro: 1, addon: 2 };

  return Array.from(templates.values())
    .map((t) => ({
      id: t.id as AgentTemplateType,
      name: t.name,
      description: t.description,
      tier: t.tier,
    }))
    .sort((a, b) => tierOrder[a.tier as keyof typeof tierOrder] - tierOrder[b.tier as keyof typeof tierOrder]);
}

/**
 * Validate that a template has all required fields
 * @param template - The template to validate
 * @returns true if valid, false otherwise
 */
export function validateTemplate(template: AgentTemplate): boolean {
  // Check required top-level fields
  if (!template.id || !template.name || !template.description || !template.tier) {
    return false;
  }

  // Check environment
  if (
    !template.environment ||
    !template.environment.model ||
    template.environment.temperature === undefined ||
    !template.environment.max_tokens ||
    !Array.isArray(template.environment.tools) ||
    !template.environment.system_prompt
  ) {
    return false;
  }

  // Check session
  if (
    !template.session ||
    !template.session.max_duration ||
    !template.session.memory_type ||
    !template.session.context_window
  ) {
    return false;
  }

  // Check prompts
  if (
    !template.prompts ||
    !template.prompts.system ||
    !Array.isArray(template.prompts.examples) ||
    !Array.isArray(template.prompts.success_criteria)
  ) {
    return false;
  }

  // Check examples structure
  for (const example of template.prompts.examples) {
    if (!example.input || !example.expected_output) {
      return false;
    }
  }

  // Check success criteria count
  if (template.prompts.success_criteria.length < 2) {
    return false;
  }

  return true;
}

/**
 * Validate all templates
 * @returns object with validation results
 */
export function validateAllTemplates(): {
  valid: string[];
  invalid: Array<{ id: string; errors: string[] }>;
} {
  const templates = loadAllTemplates();
  const valid: string[] = [];
  const invalid: Array<{ id: string; errors: string[] }> = [];

  for (const [id, template] of templates) {
    if (validateTemplate(template)) {
      valid.push(id);
    } else {
      invalid.push({
        id,
        errors: ["Template failed validation - missing required fields"],
      });
    }
  }

  return { valid, invalid };
}

// Export cache for in-memory loading (if needed for performance)
let templateCache: Map<AgentTemplateType, AgentTemplate> | null = null;

/**
 * Load all templates into memory cache (for performance)
 */
export function initializeTemplateCache(): void {
  if (!templateCache) {
    templateCache = loadAllTemplates();
  }
}

/**
 * Get cached template (must call initializeTemplateCache first)
 * @param type - The agent template type
 * @returns The cached template
 */
export function getCachedTemplate(type: AgentTemplateType): AgentTemplate {
  if (!templateCache) {
    throw new Error("Template cache not initialized. Call initializeTemplateCache() first.");
  }
  const template = templateCache.get(type);
  if (!template) {
    throw new Error(`Template not found in cache: ${type}`);
  }
  return template;
}

/**
 * Clear template cache
 */
export function clearTemplateCache(): void {
  templateCache = null;
}
