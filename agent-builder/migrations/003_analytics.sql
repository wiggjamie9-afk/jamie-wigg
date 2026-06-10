-- Analytics table migration
-- Tracks event metrics for agent sessions (usage, success rates, costs)

-- Note: Ensure 002_projects.sql is applied first
-- This migration is idempotent

CREATE TABLE IF NOT EXISTS public.analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for common analytics queries
CREATE INDEX IF NOT EXISTS idx_analytics_project_id ON public.analytics(project_id);
CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON public.analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_timestamp ON public.analytics(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_project_timestamp ON public.analytics(project_id, timestamp DESC);

-- Composite index for common filtering patterns
CREATE INDEX IF NOT EXISTS idx_analytics_project_event_time ON public.analytics(project_id, event_type, timestamp DESC);

-- Enable RLS
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access analytics for their own projects
DROP POLICY IF EXISTS "Users can read analytics for own projects" ON public.analytics;
CREATE POLICY "Users can read analytics for own projects" ON public.analytics
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert analytics for own projects" ON public.analytics;
CREATE POLICY "Users can insert analytics for own projects" ON public.analytics
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM public.projects WHERE user_id = auth.uid()
    )
  );

-- Function to aggregate analytics (used by dashboard queries)
-- Returns event counts grouped by type for a project
CREATE OR REPLACE FUNCTION public.get_project_analytics_summary(
  p_project_id UUID,
  p_days_back INT DEFAULT 30
)
RETURNS TABLE (
  event_type TEXT,
  count BIGINT,
  first_event TIMESTAMP WITH TIME ZONE,
  last_event TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.event_type,
    COUNT(*) as count,
    MIN(a.timestamp) as first_event,
    MAX(a.timestamp) as last_event
  FROM public.analytics a
  WHERE
    a.project_id = p_project_id
    AND a.timestamp >= NOW() - INTERVAL '1 day' * p_days_back
  GROUP BY a.event_type
  ORDER BY count DESC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function to clean old analytics (retention policy)
-- Keeps last 90 days of analytics by default
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics(
  retention_days INT DEFAULT 90
)
RETURNS TABLE (
  deleted_count BIGINT
) AS $$
BEGIN
  DELETE FROM public.analytics
  WHERE timestamp < NOW() - INTERVAL '1 day' * retention_days;

  RETURN QUERY SELECT COUNT(*) as deleted_count FROM (SELECT 1) t;
END;
$$ LANGUAGE plpgsql;
