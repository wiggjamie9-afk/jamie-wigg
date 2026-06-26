/**
 * Autonomous Improvement Engine
 * Weekly system that analyzes variants, extracts insights, generates improvements,
 * learns from the ecosystem and creator signature, and deploys winners.
 */

import { supabase } from './db';
import { Anthropic } from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

interface VariantAnalytics {
  variant_id: string;
  messages_count: number;
  satisfaction_score: number;
  engagement_score: number;
  sentiment: string;
  retention_rate: number;
}

interface VariantPerformance {
  variant_id: string;
  overall_score: number;
  rank: number;
  winner: boolean;
}

interface ExtractedInsight {
  keyStrengths: string[];
  effectiveTraits: string[];
  recommendedEnhancements: string[];
  userResonance: string;
}

interface EcosystemPattern {
  app_category: string;
  winning_style: string;
  observed_traits: string[];
  avg_performance_score: number;
}

interface CreatorSignature {
  preferred_style: string;
  style_distribution: Record<string, number>;
  common_traits: string[];
  tone_profile: string;
  complexity_preference: string;
}

/**
 * Calculate variant performance score: satisfaction × 0.6 + engagement × 0.4
 */
export async function analyzeVariantPerformance(
  experimentId: string
): Promise<VariantPerformance[]> {
  const { data: analytics, error } = await supabase
    .from('variant_analytics')
    .select('*')
    .eq('experiment_id', experimentId);

  if (error) throw error;

  const performances: VariantPerformance[] = [];

  for (const analytic of analytics || []) {
    const overall_score =
      (analytic.satisfaction_score || 0) * 0.6 +
      (analytic.engagement_score || 0) * 0.4;

    performances.push({
      variant_id: analytic.variant_id,
      overall_score,
      rank: 0, // Will be set after sorting
      winner: false,
    });
  }

  // Rank by performance
  performances.sort((a, b) => b.overall_score - a.overall_score);
  performances.forEach((perf, index) => {
    perf.rank = index + 1;
    perf.winner = index === 0;
  });

  // Save performance scores
  for (const perf of performances) {
    await supabase.from('variant_performance').insert({
      experiment_id: experimentId,
      variant_id: perf.variant_id,
      overall_score: perf.overall_score,
      rank: perf.rank,
      winner: perf.winner,
    });
  }

  return performances;
}

/**
 * Extract insights from winning variant using Claude
 */
export async function extractInsights(
  experimentId: string,
  winningVariantId: string,
  projectId: string
): Promise<ExtractedInsight> {
  // Get variant details
  const { data: variant } = await supabase
    .from('variants')
    .select('*')
    .eq('id', winningVariantId)
    .single();

  // Get analytics for context
  const { data: analytics } = await supabase
    .from('variant_analytics')
    .select('*')
    .eq('variant_id', winningVariantId)
    .eq('experiment_id', experimentId)
    .single();

  const prompt = `You are analyzing why a particular app interface variant resonated with users.

Variant Style: ${variant.style}
System Prompt: ${variant.system_prompt}

Performance Metrics:
- Satisfaction Score: ${analytics.satisfaction_score} / 1.0
- Engagement Score: ${analytics.engagement_score} / 1.0
- Sentiment: ${analytics.sentiment} (score: ${analytics.sentiment_score})
- Retention Rate: ${analytics.retention_rate * 100}%
- Messages Count: ${analytics.messages_count}

Analyze this variant and respond with a JSON object containing:
{
  "keyStrengths": ["array", "of", "strengths"],
  "effectiveTraits": ["traits", "that", "worked"],
  "recommendedEnhancements": ["improvements", "for", "next_version"],
  "userResonance": "1-2 sentence summary of why users connected with this"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const insight = JSON.parse(content.text) as ExtractedInsight;

  // Save insights
  await supabase.from('variant_insights').insert({
    experiment_id: experimentId,
    variant_id: winningVariantId,
    key_strengths: insight.keyStrengths,
    effective_traits: insight.effectiveTraits,
    recommended_enhancements: insight.recommendedEnhancements,
    user_resonance: insight.userResonance,
    explanation: content.text,
  });

  return insight;
}

/**
 * Analyze ecosystem patterns: which styles work across app categories
 */
export async function analyzeEcosystemPatterns(
  userId: string
): Promise<EcosystemPattern[]> {
  // Get all user's projects with their winning variants
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);

  if (!projects || projects.length === 0) return [];

  const patterns: Record<string, EcosystemPattern> = {};

  for (const project of projects) {
    // Get latest completed experiment
    const { data: experiments } = await supabase
      .from('experiments')
      .select('*')
      .eq('project_id', project.id)
      .eq('status', 'completed')
      .order('ended_at', { ascending: false })
      .limit(1);

    if (!experiments || experiments.length === 0) continue;

    // Get winning variant
    const { data: perf } = await supabase
      .from('variant_performance')
      .select('*')
      .eq('experiment_id', experiments[0].id)
      .eq('winner', true)
      .single();

    if (!perf) continue;

    // Get variant details
    const { data: variant } = await supabase
      .from('variants')
      .select('*')
      .eq('id', perf.variant_id)
      .single();

    const category = project.agent_type || 'general';
    const style = variant.style;

    if (!patterns[category]) {
      patterns[category] = {
        app_category: category,
        winning_style: style,
        observed_traits: [],
        avg_performance_score: perf.overall_score,
      };
    } else {
      // Update if this one performed better
      if (perf.overall_score > patterns[category].avg_performance_score) {
        patterns[category].winning_style = style;
        patterns[category].avg_performance_score = perf.overall_score;
      }
    }
  }

  // Save patterns to db
  for (const pattern of Object.values(patterns)) {
    await supabase.from('ecosystem_patterns').upsert({
      app_category: pattern.app_category,
      winning_style: pattern.winning_style,
      avg_performance_score: pattern.avg_performance_score,
      observed_traits: pattern.observed_traits,
    });
  }

  return Object.values(patterns);
}

/**
 * Learn creator's signature style from all their apps
 */
export async function extractCreatorSignature(
  userId: string
): Promise<CreatorSignature> {
  // Get all user's projects with their winning variants
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);

  if (!projects || projects.length === 0) {
    return {
      preferred_style: 'balanced',
      style_distribution: {},
      common_traits: [],
      tone_profile: 'professional',
      complexity_preference: 'balanced',
    };
  }

  const styles: Record<string, number> = {};
  const allTraits: string[] = [];

  for (const project of projects) {
    // Get latest winning variant
    const { data: experiments } = await supabase
      .from('experiments')
      .select('*')
      .eq('project_id', project.id)
      .eq('status', 'completed')
      .order('ended_at', { ascending: false })
      .limit(1);

    if (!experiments || experiments.length === 0) continue;

    const { data: perf } = await supabase
      .from('variant_performance')
      .select('*')
      .eq('experiment_id', experiments[0].id)
      .eq('winner', true)
      .single();

    if (!perf) continue;

    const { data: variant } = await supabase
      .from('variants')
      .select('*')
      .eq('id', perf.variant_id)
      .single();

    styles[variant.style] = (styles[variant.style] || 0) + 1;

    // Get insights for traits
    const { data: insight } = await supabase
      .from('variant_insights')
      .select('*')
      .eq('variant_id', perf.variant_id)
      .single();

    if (insight) {
      allTraits.push(...(insight.effective_traits || []));
    }
  }

  // Normalize style distribution
  const total = Object.values(styles).reduce((a, b) => a + b, 0) || 1;
  const styleDistribution: Record<string, number> = {};
  for (const [style, count] of Object.entries(styles)) {
    styleDistribution[style] = count / total;
  }

  // Find most common traits
  const traitCounts: Record<string, number> = {};
  for (const trait of allTraits) {
    traitCounts[trait] = (traitCounts[trait] || 0) + 1;
  }
  const commonTraits = Object.entries(traitCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([trait]) => trait);

  const preferredStyle = Object.entries(styleDistribution).sort((a, b) => b[1] - a[1])[0]?.[0] || 'balanced';

  const signature: CreatorSignature = {
    preferred_style: preferredStyle,
    style_distribution: styleDistribution,
    common_traits: commonTraits,
    tone_profile: 'professional',
    complexity_preference: 'balanced',
  };

  // Save signature
  await supabase.from('creator_signature').upsert({
    user_id: userId,
    preferred_style: signature.preferred_style,
    style_distribution: signature.style_distribution,
    common_traits: signature.common_traits,
    tone_profile: signature.tone_profile,
    complexity_preference: signature.complexity_preference,
    learned_from_apps: projects.length,
  });

  return signature;
}

/**
 * Generate next-gen variant incorporating insights, ecosystem patterns, and creator signature
 */
export async function generateImprovement(
  projectId: string,
  experimentId: string,
  userId: string
): Promise<string> {
  // Get project
  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .single();

  // Get winning variant insights
  const { data: experiments } = await supabase
    .from('experiments')
    .select('*')
    .eq('id', experimentId)
    .single();

  const { data: winnerPerf } = await supabase
    .from('variant_performance')
    .select('*')
    .eq('experiment_id', experimentId)
    .eq('winner', true)
    .single();

  const { data: winnerInsight } = await supabase
    .from('variant_insights')
    .select('*')
    .eq('experiment_id', experimentId)
    .eq('variant_id', winnerPerf.variant_id)
    .single();

  // Get ecosystem patterns
  const { data: ecoPatterns } = await supabase
    .from('ecosystem_patterns')
    .select('*')
    .eq('app_category', project.agent_type || 'general');

  // Get creator signature
  const { data: signature } = await supabase
    .from('creator_signature')
    .select('*')
    .eq('user_id', userId)
    .single();

  // Generate improvement prompt
  const prompt = `You are an expert at iterating on UI/interaction styles to maximize user satisfaction and engagement.

Current Winning Variant Insights:
- Key Strengths: ${winnerInsight.key_strengths.join(', ')}
- Effective Traits: ${winnerInsight.effective_traits.join(', ')}
- Recommended Enhancements: ${winnerInsight.recommended_enhancements.join(', ')}
- User Resonance: ${winnerInsight.user_resonance}

Ecosystem Pattern (${project.agent_type || 'general'}):
- Winning Style: ${ecoPatterns?.[0]?.winning_style || 'bold'}
- High-performing traits: ${ecoPatterns?.[0]?.observed_traits?.join(', ') || 'none'}

Creator Signature:
- Preferred Style: ${signature?.preferred_style || 'balanced'}
- Common Traits: ${signature?.common_traits?.join(', ') || 'none'}
- Tone: ${signature?.tone_profile || 'professional'}

Generate the next-generation variant that:
1. Incorporates the recommended enhancements
2. Reinforces the key strengths
3. Aligns with ecosystem patterns for this category
4. Reflects the creator's signature style and preferences

Respond with JSON:
{
  "style": "new_style_name",
  "system_prompt": "new system prompt that incorporates improvements",
  "reasoning": "explanation of improvements and inspiration sources"
}`;

  const message = await anthropic.messages.create({
    model: 'claude-3-5-sonnet-20241022',
    max_tokens: 1024,
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  const content = message.content[0];
  if (content.type !== 'text') throw new Error('Unexpected response type');

  const generated = JSON.parse(content.text) as {
    style: string;
    system_prompt: string;
    reasoning: string;
  };

  // Get next variant version
  const { data: variants } = await supabase
    .from('variants')
    .select('version')
    .eq('project_id', projectId)
    .order('version', { ascending: false })
    .limit(1);

  const nextVersion = (variants?.[0]?.version || 0) + 1;

  // Create new variant
  const { data: newVariant } = await supabase
    .from('variants')
    .insert({
      project_id: projectId,
      version: nextVersion,
      style: generated.style,
      system_prompt: generated.system_prompt,
      active: false,
    })
    .select()
    .single();

  // Create improvement record
  await supabase.from('improvements').insert({
    project_id: projectId,
    experiment_id: experimentId,
    variant_id: newVariant.id,
    improvement_id: `imp-${projectId}-${nextVersion}`,
    improvements_applied: winnerInsight.recommended_enhancements,
    inspiration_sources: [
      'insights',
      'ecosystem_patterns',
      'creator_signature',
    ],
    llm_reasoning: generated.reasoning,
    ready_for_deployment: true,
  });

  return newVariant.id;
}

/**
 * Run weekly improvement loop for all user projects
 */
export async function runWeeklyImprovement(userId: string): Promise<{
  loopsCreated: number;
  experimentsRun: number;
  improvementsGenerated: number;
}> {
  const { data: projects } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', userId);

  if (!projects || projects.length === 0) {
    return { loopsCreated: 0, experimentsRun: 0, improvementsGenerated: 0 };
  }

  let improvementsGenerated = 0;

  for (const project of projects) {
    // Create improvement loop record
    const { data: loop } = await supabase
      .from('improvement_loops')
      .insert({
        project_id: project.id,
        loop_type: 'weekly',
        status: 'running',
      })
      .select()
      .single();

    try {
      // Get latest completed experiment
      const { data: experiments } = await supabase
        .from('experiments')
        .select('*')
        .eq('project_id', project.id)
        .eq('status', 'completed')
        .order('ended_at', { ascending: false })
        .limit(1);

      if (!experiments || experiments.length === 0) continue;

      const experiment = experiments[0];

      // Analyze performance
      await analyzeVariantPerformance(experiment.id);

      // Extract insights from winner
      const { data: winner } = await supabase
        .from('variant_performance')
        .select('*')
        .eq('experiment_id', experiment.id)
        .eq('winner', true)
        .single();

      if (winner) {
        await extractInsights(experiment.id, winner.variant_id, project.id);
      }

      // Analyze ecosystem and creator signature
      await analyzeEcosystemPatterns(userId);
      await extractCreatorSignature(userId);

      // Generate improvement
      const improvementId = await generateImprovement(
        project.id,
        experiment.id,
        userId
      );
      improvementsGenerated++;

      // Update loop status
      await supabase
        .from('improvement_loops')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          improvements_generated: improvementsGenerated,
          next_run_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000
          ).toISOString(), // 1 week
        })
        .eq('id', loop.id);
    } catch (error) {
      await supabase
        .from('improvement_loops')
        .update({
          status: 'failed',
          error_message: error instanceof Error ? error.message : 'Unknown error',
        })
        .eq('id', loop.id);
    }
  }

  return {
    loopsCreated: projects.length,
    experimentsRun: projects.length,
    improvementsGenerated,
  };
}
