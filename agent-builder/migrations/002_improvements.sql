-- Autonomous Improvement Tracking Schema
-- Tracks variants, experiments, analytics, and auto-generated improvements

-- Variants: Different UI/copy styles tested
CREATE TABLE IF NOT EXISTS variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    version INTEGER NOT NULL,
    style TEXT NOT NULL, -- 'conservative', 'bold', 'playful', 'custom'
    system_prompt TEXT NOT NULL,
    active BOOLEAN DEFAULT false,
    deployed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(project_id, version)
);

-- Experiments: Running tests on variants
CREATE TABLE IF NOT EXISTS experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    experiment_id TEXT NOT NULL UNIQUE,
    variant_a_id UUID REFERENCES variants(id),
    variant_b_id UUID REFERENCES variants(id),
    variant_c_id UUID REFERENCES variants(id),
    status TEXT DEFAULT 'running', -- 'running', 'completed', 'paused'
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    ended_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Variant Analytics: Engagement, satisfaction, sentiment per variant
CREATE TABLE IF NOT EXISTS variant_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    messages_count INTEGER DEFAULT 0,
    satisfaction_score DECIMAL(3,2), -- 0.0-1.0
    engagement_score DECIMAL(3,2), -- 0.0-1.0
    sentiment TEXT, -- 'positive', 'neutral', 'negative'
    sentiment_score DECIMAL(3,2),
    retention_rate DECIMAL(3,2), -- % of users who returned
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Variant Performance: Computed scores and rankings
CREATE TABLE IF NOT EXISTS variant_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES variants(id) ON DELETE CASCADE,
    overall_score DECIMAL(4,3), -- weighted score
    satisfaction_weight DECIMAL(3,2) DEFAULT 0.6,
    engagement_weight DECIMAL(3,2) DEFAULT 0.4,
    rank INTEGER,
    winner BOOLEAN DEFAULT false,
    computed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insights: Claude-extracted learnings from winning variants
CREATE TABLE IF NOT EXISTS variant_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_id UUID NOT NULL REFERENCES experiments(id) ON DELETE CASCADE,
    variant_id UUID NOT NULL REFERENCES variants(id),
    key_strengths TEXT[] DEFAULT '{}',
    effective_traits TEXT[] DEFAULT '{}',
    recommended_enhancements TEXT[] DEFAULT '{}',
    user_resonance TEXT,
    explanation TEXT,
    extracted_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Ecosystem Patterns: High-performing styles across app categories
CREATE TABLE IF NOT EXISTS ecosystem_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    app_category TEXT NOT NULL, -- 'buddy', 'learning', 'health', 'productivity', etc.
    winning_style TEXT NOT NULL,
    win_count INTEGER DEFAULT 1,
    avg_performance_score DECIMAL(4,3),
    observed_traits TEXT[] DEFAULT '{}',
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Creator Signature: Learned creator preferences
CREATE TABLE IF NOT EXISTS creator_signature (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    preferred_style TEXT, -- dominant style across their apps
    style_distribution JSONB DEFAULT '{}', -- {"conservative": 0.3, "bold": 0.5, "playful": 0.2}
    common_traits TEXT[] DEFAULT '{}',
    tone_profile TEXT,
    complexity_preference TEXT, -- 'simple', 'balanced', 'detailed'
    learned_from_apps INTEGER DEFAULT 0,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(user_id)
);

-- Improvements: Auto-generated next-gen variants
CREATE TABLE IF NOT EXISTS improvements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    experiment_id UUID REFERENCES experiments(id),
    variant_id UUID REFERENCES variants(id),
    improvement_id TEXT NOT NULL UNIQUE,
    improvements_applied TEXT[] DEFAULT '{}',
    inspiration_sources TEXT[] DEFAULT '{}', -- 'insights', 'ecosystem_patterns', 'creator_signature'
    llm_reasoning TEXT,
    ready_for_deployment BOOLEAN DEFAULT false,
    deployed BOOLEAN DEFAULT false,
    deployed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Improvement Decisions: Log of what was accepted/rejected
CREATE TABLE IF NOT EXISTS improvement_decisions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    improvement_id UUID NOT NULL REFERENCES improvements(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id),
    decision TEXT NOT NULL, -- 'approved', 'rejected', 'modified'
    notes TEXT,
    decided_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Autonomous Loops: Track scheduled improvement runs
CREATE TABLE IF NOT EXISTS improvement_loops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    loop_type TEXT NOT NULL, -- 'weekly', 'monthly', 'on_trigger'
    status TEXT DEFAULT 'pending', -- 'pending', 'running', 'completed', 'failed'
    experiments_run INTEGER DEFAULT 0,
    improvements_generated INTEGER DEFAULT 0,
    improvements_deployed INTEGER DEFAULT 0,
    insights_extracted JSONB DEFAULT '{}',
    error_message TEXT,
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    next_run_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indices for performance
CREATE INDEX IF NOT EXISTS idx_variants_project ON variants(project_id);
CREATE INDEX IF NOT EXISTS idx_variants_active ON variants(project_id, active);
CREATE INDEX IF NOT EXISTS idx_experiments_project ON experiments(project_id);
CREATE INDEX IF NOT EXISTS idx_experiments_status ON experiments(status);
CREATE INDEX IF NOT EXISTS idx_variant_analytics_experiment ON variant_analytics(experiment_id);
CREATE INDEX IF NOT EXISTS idx_variant_performance_experiment ON variant_performance(experiment_id);
CREATE INDEX IF NOT EXISTS idx_improvements_project ON improvements(project_id);
CREATE INDEX IF NOT EXISTS idx_improvements_deployed ON improvements(project_id, deployed);
CREATE INDEX IF NOT EXISTS idx_improvement_loops_project ON improvement_loops(project_id);
CREATE INDEX IF NOT EXISTS idx_improvement_loops_status ON improvement_loops(status);
CREATE INDEX IF NOT EXISTS idx_improvement_loops_next_run ON improvement_loops(next_run_at);

-- RLS Policies
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE experiments ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecosystem_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE creator_signature ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvements ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE improvement_loops ENABLE ROW LEVEL SECURITY;

-- RLS: Users see only their project variants
CREATE POLICY "users_see_own_variants"
    ON variants FOR SELECT
    USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "users_insert_own_variants"
    ON variants FOR INSERT
    WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- RLS: Users see only their project experiments
CREATE POLICY "users_see_own_experiments"
    ON experiments FOR SELECT
    USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "users_insert_own_experiments"
    ON experiments FOR INSERT
    WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- RLS: Users see only their project analytics
CREATE POLICY "users_see_own_analytics"
    ON variant_analytics FOR SELECT
    USING (experiment_id IN (
        SELECT id FROM experiments
        WHERE project_id IN (SELECT id FROM projects WHERE user_id = auth.uid())
    ));

-- RLS: Users see only their project improvements
CREATE POLICY "users_see_own_improvements"
    ON improvements FOR SELECT
    USING (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

CREATE POLICY "users_insert_own_improvements"
    ON improvements FOR INSERT
    WITH CHECK (project_id IN (SELECT id FROM projects WHERE user_id = auth.uid()));

-- RLS: Creator signature is per-user
CREATE POLICY "users_see_own_signature"
    ON creator_signature FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "users_manage_own_signature"
    ON creator_signature FOR INSERT
    WITH CHECK (user_id = auth.uid());
