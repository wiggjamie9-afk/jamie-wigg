-- Projects table migration (extracted from 001 for clarity)
-- Stores user projects with agent configuration and tier info

-- Note: If running fresh, ensure 001_users.sql is applied first
-- This migration is idempotent and handles existing tables gracefully

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  agent_type TEXT NOT NULL CHECK (
    agent_type IN (
      'code-review',
      'document-processing',
      'research',
      'security-audit',
      'data-analysis',
      'customer-support'
    )
  ),
  config JSONB DEFAULT '{}',
  tier TEXT DEFAULT 'starter' CHECK (tier IN ('starter', 'pro', 'addon')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_agent_type ON public.projects(agent_type);
CREATE INDEX IF NOT EXISTS idx_projects_tier ON public.projects(tier);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can read own projects" ON public.projects;
CREATE POLICY "Users can read own projects" ON public.projects
  FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create projects" ON public.projects;
CREATE POLICY "Users can create projects" ON public.projects
  FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own projects" ON public.projects;
CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own projects" ON public.projects;
CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE USING (user_id = auth.uid());

-- Trigger to update updated_at
DROP FUNCTION IF EXISTS public.update_projects_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION public.update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_projects_updated_at ON public.projects;
CREATE TRIGGER trigger_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_projects_updated_at();
