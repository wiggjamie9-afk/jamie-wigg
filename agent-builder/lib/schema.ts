/**
 * Database schema types and utilities for agent-builder
 * Provides TypeScript interfaces, query builders, and validation for:
 * - Users (extended auth profile)
 * - Projects (agent configurations)
 * - Analytics (usage events)
 */

import { z } from "zod";

/**
 * User schema (extends Supabase auth.users)
 */
export const UserSchema = z.object({
  id: z.string().uuid().describe("User ID from auth.users"),
  email: z.string().email().describe("User email"),
  name: z.string().nullable().describe("User display name"),
  tier: z.enum(["starter", "pro", "addon"]).describe("Current pricing tier"),
  created_at: z.string().datetime().describe("Account creation time"),
  updated_at: z.string().datetime().describe("Last profile update"),
});

export type User = z.infer<typeof UserSchema>;

/**
 * Project schema (agent configuration storage)
 */
export const ProjectSchema = z.object({
  id: z.string().uuid().describe("Unique project ID"),
  user_id: z.string().uuid().describe("Owner user ID"),
  name: z.string().min(1).max(255).describe("Project name"),
  description: z.string().max(1000).nullable().describe("Project description"),
  agent_type: z.enum([
    "code-review",
    "document-processing",
    "research",
    "security-audit",
    "data-analysis",
    "customer-support",
  ]),
  config: z.record(z.unknown()).describe("Agent configuration (JSONB)"),
  tier: z.enum(["starter", "pro", "addon"]).describe("Project tier"),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

export type Project = z.infer<typeof ProjectSchema>;

/**
 * Create project input (omits id, timestamps)
 */
export const CreateProjectSchema = ProjectSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export type CreateProject = z.infer<typeof CreateProjectSchema>;

/**
 * Update project input (all fields optional)
 */
export const UpdateProjectSchema = CreateProjectSchema.partial();
export type UpdateProject = z.infer<typeof UpdateProjectSchema>;

/**
 * Analytics event schema (usage tracking)
 */
export const AnalyticsEventSchema = z.object({
  id: z.string().uuid().describe("Event ID"),
  project_id: z.string().uuid().describe("Associated project"),
  event_type: z.string().min(1).describe("Event type identifier"),
  metadata: z.record(z.unknown()).describe("Event metadata (JSONB)"),
  timestamp: z.string().datetime().describe("Event timestamp"),
});

export type AnalyticsEvent = z.infer<typeof AnalyticsEventSchema>;

/**
 * Create analytics event input
 */
export const CreateAnalyticsEventSchema = AnalyticsEventSchema.omit({
  id: true,
  timestamp: true,
});

export type CreateAnalyticsEvent = z.infer<typeof CreateAnalyticsEventSchema>;

/**
 * Analytics summary (aggregated view)
 */
export const AnalyticsSummarySchema = z.object({
  event_type: z.string(),
  count: z.number().int(),
  first_event: z.string().datetime().nullable(),
  last_event: z.string().datetime().nullable(),
});

export type AnalyticsSummary = z.infer<typeof AnalyticsSummarySchema>;

/**
 * Project statistics (derived from analytics)
 */
export const ProjectStatsSchema = z.object({
  project_id: z.string().uuid(),
  total_events: z.number().int(),
  event_breakdown: z.array(AnalyticsSummarySchema),
  date_range: z.object({
    start: z.string().datetime(),
    end: z.string().datetime(),
  }),
});

export type ProjectStats = z.infer<typeof ProjectStatsSchema>;

/**
 * Tier-based feature access matrix
 */
export const TIER_FEATURES = {
  starter: {
    max_projects: 3,
    max_events_per_day: 1000,
    analytics_retention_days: 30,
    api_calls_per_month: 10000,
  },
  pro: {
    max_projects: 50,
    max_events_per_day: 100000,
    analytics_retention_days: 90,
    api_calls_per_month: 1000000,
  },
  addon: {
    max_projects: 10,
    max_events_per_day: 50000,
    analytics_retention_days: 60,
    api_calls_per_month: 500000,
  },
} as const;

/**
 * Query builder utilities (pseudo-ORM for common patterns)
 * These help maintain <100ms query latency through indexed lookups
 */

export class ProjectQueries {
  /**
   * Get all projects for a user (indexed by user_id)
   * Expected: <50ms for starter tier, <100ms for pro
   */
  static getByUserId(userId: string) {
    return {
      sql: `
        SELECT id, user_id, name, description, agent_type, config, tier, created_at, updated_at
        FROM public.projects
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      params: [userId],
    };
  }

  /**
   * Get single project (indexed by id, with RLS)
   * Expected: <10ms
   */
  static getById(projectId: string) {
    return {
      sql: `
        SELECT id, user_id, name, description, agent_type, config, tier, created_at, updated_at
        FROM public.projects
        WHERE id = $1
      `,
      params: [projectId],
    };
  }

  /**
   * Get projects filtered by agent type and tier
   * Expected: <50ms (uses idx_projects_agent_type + idx_projects_tier)
   */
  static getByTypeAndTier(userId: string, agentType: string, tier: string) {
    return {
      sql: `
        SELECT id, user_id, name, description, agent_type, config, tier, created_at, updated_at
        FROM public.projects
        WHERE user_id = $1 AND agent_type = $2 AND tier = $3
        ORDER BY created_at DESC
      `,
      params: [userId, agentType, tier],
    };
  }

  /**
   * Create new project
   */
  static create(input: CreateProject) {
    return {
      sql: `
        INSERT INTO public.projects (user_id, name, description, agent_type, config, tier)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, user_id, name, description, agent_type, config, tier, created_at, updated_at
      `,
      params: [
        input.user_id,
        input.name,
        input.description,
        input.agent_type,
        JSON.stringify(input.config),
        input.tier,
      ],
    };
  }

  /**
   * Update project
   */
  static update(projectId: string, input: UpdateProject) {
    const updateFields: string[] = [];
    const params: unknown[] = [projectId];
    let paramIndex = 2;

    if (input.name !== undefined) {
      updateFields.push(`name = $${paramIndex++}`);
      params.push(input.name);
    }
    if (input.description !== undefined) {
      updateFields.push(`description = $${paramIndex++}`);
      params.push(input.description);
    }
    if (input.config !== undefined) {
      updateFields.push(`config = $${paramIndex++}`);
      params.push(JSON.stringify(input.config));
    }
    if (input.tier !== undefined) {
      updateFields.push(`tier = $${paramIndex++}`);
      params.push(input.tier);
    }

    return {
      sql: `
        UPDATE public.projects
        SET ${updateFields.join(", ")}
        WHERE id = $1
        RETURNING id, user_id, name, description, agent_type, config, tier, created_at, updated_at
      `,
      params,
    };
  }

  /**
   * Delete project (cascades to analytics)
   */
  static delete(projectId: string) {
    return {
      sql: `DELETE FROM public.projects WHERE id = $1`,
      params: [projectId],
    };
  }
}

export class AnalyticsQueries {
  /**
   * Get analytics for a project (indexed by project_id, timestamp DESC)
   * Expected: <50ms for last 30 days
   */
  static getByProjectId(
    projectId: string,
    options?: {
      limit?: number;
      offset?: number;
      startDate?: Date;
      endDate?: Date;
    }
  ) {
    const limit = options?.limit ?? 100;
    const offset = options?.offset ?? 0;

    let where = "WHERE project_id = $1";
    const params: unknown[] = [projectId];
    let paramIndex = 2;

    if (options?.startDate) {
      where += ` AND timestamp >= $${paramIndex++}`;
      params.push(options.startDate);
    }
    if (options?.endDate) {
      where += ` AND timestamp <= $${paramIndex++}`;
      params.push(options.endDate);
    }

    return {
      sql: `
        SELECT id, project_id, event_type, metadata, timestamp
        FROM public.analytics
        ${where}
        ORDER BY timestamp DESC
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `,
      params: [...params, limit, offset],
    };
  }

  /**
   * Get event counts by type (for dashboard)
   * Expected: <100ms with idx_analytics_project_event_time
   */
  static getSummary(projectId: string, daysBefore: number = 30) {
    return {
      sql: `
        SELECT event_type, COUNT(*) as count,
               MIN(timestamp) as first_event,
               MAX(timestamp) as last_event
        FROM public.analytics
        WHERE project_id = $1
          AND timestamp >= NOW() - INTERVAL '1 day' * $2
        GROUP BY event_type
        ORDER BY count DESC
      `,
      params: [projectId, daysBefore],
    };
  }

  /**
   * Create analytics event
   */
  static create(input: CreateAnalyticsEvent) {
    return {
      sql: `
        INSERT INTO public.analytics (project_id, event_type, metadata)
        VALUES ($1, $2, $3)
        RETURNING id, project_id, event_type, metadata, timestamp
      `,
      params: [input.project_id, input.event_type, JSON.stringify(input.metadata)],
    };
  }

  /**
   * Bulk create analytics events (for batch logging)
   */
  static bulkCreate(events: CreateAnalyticsEvent[]) {
    if (events.length === 0) {
      return { sql: "", params: [] };
    }

    const values = events
      .map(
        (_, i) =>
          `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`
      )
      .join(", ");

    const params = events.flatMap((e) => [
      e.project_id,
      e.event_type,
      JSON.stringify(e.metadata),
    ]);

    return {
      sql: `
        INSERT INTO public.analytics (project_id, event_type, metadata)
        VALUES ${values}
        RETURNING id, project_id, event_type, metadata, timestamp
      `,
      params,
    };
  }

  /**
   * Delete old analytics (runs as cron job)
   */
  static deleteOlderThan(daysBack: number) {
    return {
      sql: `
        DELETE FROM public.analytics
        WHERE timestamp < NOW() - INTERVAL '1 day' * $1
      `,
      params: [daysBack],
    };
  }
}

/**
 * Type guards
 */
export const isValidTier = (
  tier: unknown
): tier is "starter" | "pro" | "addon" => {
  return tier === "starter" || tier === "pro" || tier === "addon";
};

export const isValidAgentType = (
  type: unknown
): type is
  | "code-review"
  | "document-processing"
  | "research"
  | "security-audit"
  | "data-analysis"
  | "customer-support" => {
  return [
    "code-review",
    "document-processing",
    "research",
    "security-audit",
    "data-analysis",
    "customer-support",
  ].includes(type as string);
};
