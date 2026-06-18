/**
 * Buddy Ecosystem Engine
 *
 * Central orchestration system for:
 * 1. App generation (multi-variant)
 * 2. Performance analysis (cross-app learning)
 * 3. Autonomous improvement (Claude-driven)
 * 4. Creator intelligence (pattern extraction)
 * 5. Ecosystem propagation (insights spread)
 */

class BuddyEcosystemEngine {
    constructor(claudeApiKey) {
        this.claudeApiKey = claudeApiKey;
        this.db = {
            apps: [],
            analytics: [],
            ecosystemPatterns: [],
            creatorProfiles: {}
        };
        this.loadFromStorage();
    }

    // ============ GENERATION LAYER ============

    /**
     * Generate 3 app variants from personality definition
     */
    async generateVariants(creatorId, personalityDef) {
        const variants = [];
        const styles = ['conservative', 'bold', 'playful'];

        for (let i = 0; i < 3; i++) {
            const variantPrompt = this.buildGenerationPrompt(personalityDef, styles[i]);
            const appCode = await this.callClaude(variantPrompt);

            variants.push({
                id: `v${i + 1}_${Date.now()}`,
                style: styles[i],
                code: appCode,
                deployed: new Date().toISOString(),
                stats: { messages: 0, satisfaction: 0, sentiment: 'neutral' }
            });
        }

        return variants;
    }

    buildGenerationPrompt(personalityDef, style) {
        const { name, emoji, role, personality, purpose } = personalityDef;

        let styleGuidance = '';
        if (style === 'conservative') {
            styleGuidance = 'Proven, reliable personality. Focus on stability and trust. Minimal risk.';
        } else if (style === 'bold') {
            styleGuidance = 'Amplified traits. More direct, confident, experimental. Take friendly risks.';
        } else if (style === 'playful') {
            styleGuidance = 'Lighter tone. More humor, warmth, accessibility. Conversational.';
        }

        return `
Generate a complete AI companion app for the web.

Personality:
  Name: ${name} (${emoji})
  Role: ${role}
  Traits: ${personality}
  Purpose: ${purpose}

Style guidance: ${styleGuidance}

Requirements:
1. Single HTML file with embedded CSS and JS
2. Claude 3.5 Sonnet API integration
3. Chat interface with personality-driven responses
4. Sentiment tracking and crisis detection
5. Offline-capable with localStorage
6. Analytics collection (engagement, sentiment, session duration)
7. Mobile-responsive design

Important:
- System prompt should reflect the "${style}" style
- Responses should feel natural, not generic
- Include emoji reactions to user sentiment
- Collect analytics in window.analyticsCollector object

Output: Complete, production-ready HTML code.
        `;
    }

    // ============ ANALYTICS LAYER ============

    /**
     * Collect analytics from deployed variants
     */
    recordAnalytics(appId, variantId, sessionData) {
        this.db.analytics.push({
            appId,
            variantId,
            timestamp: new Date().toISOString(),
            ...sessionData
        });

        // Update variant stats
        const app = this.db.apps.find(a => a.id === appId);
        if (app) {
            const variant = app.variants.find(v => v.id === variantId);
            if (variant) {
                variant.stats.messages += sessionData.messageCount || 0;
                variant.stats.satisfaction = sessionData.satisfaction || 0;
                variant.stats.sentiment = sessionData.sentiment || 'neutral';
            }
        }

        this.saveToStorage();
    }

    /**
     * Get analytics for a specific app
     */
    getAppAnalytics(appId) {
        return this.db.analytics.filter(a => a.appId === appId);
    }

    // ============ ANALYSIS LAYER ============

    /**
     * Analyze which variant performed best
     */
    analyzeVariantPerformance(appId) {
        const app = this.db.apps.find(a => a.id === appId);
        if (!app) return null;

        // Score each variant
        const scores = app.variants.map(v => ({
            id: v.id,
            style: v.style,
            engagement: v.stats.messages,
            satisfaction: v.stats.satisfaction,
            sentiment: v.stats.sentiment,
            score: (v.stats.satisfaction * 0.6) + ((v.stats.messages / 100) * 0.4)
        }));

        return {
            winner: scores.reduce((best, v) => v.score > best.score ? v : best),
            all: scores.sort((a, b) => b.score - a.score)
        };
    }

    /**
     * Extract insights from winning variant
     */
    async extractInsights(app, winningVariant) {
        const analysisPrompt = `
Analyze why this app variant performed well:

App: ${app.name} (${app.emoji})
Role: ${app.role}
Traits: ${app.personality}
Winning Style: ${winningVariant.style}
Performance: ${winningVariant.score} engagement score

What made this style effective? Respond in JSON:
{
  "keyStrengths": ["strength1", "strength2"],
  "effectiveTraits": ["trait1", "trait2"],
  "recommendedEnhancements": ["enhancement1"],
  "userResonance": "description of user reaction"
}
        `;

        const response = await this.callClaude(analysisPrompt);
        try {
            return JSON.parse(response.match(/\{[\s\S]*\}/)[0]);
        } catch (e) {
            return {};
        }
    }

    // ============ ECOSYSTEM LEARNING LAYER ============

    /**
     * Extract patterns from all apps in a category
     */
    analyzeEcosystemPatterns(category = 'career') {
        const categoryApps = this.db.apps.filter(a =>
            a.personality.toLowerCase().includes(category) ||
            a.name.toLowerCase().includes(category)
        );

        if (categoryApps.length === 0) return [];

        // Aggregate winning traits across category
        const patterns = {};

        categoryApps.forEach(app => {
            const analysis = this.analyzeVariantPerformance(app.id);
            if (analysis && analysis.winner) {
                const key = analysis.winner.style;
                patterns[key] = (patterns[key] || 0) + analysis.winner.score;
            }
        });

        return Object.entries(patterns)
            .map(([style, score]) => ({
                pattern: style,
                effectiveness: score / categoryApps.length,
                category,
                appsAffected: categoryApps.length
            }))
            .sort((a, b) => b.effectiveness - a.effectiveness);
    }

    /**
     * Learn creator's signature style
     */
    extractCreatorSignature(creatorId) {
        const creatorApps = this.db.apps.filter(a => a.creatorId === creatorId);

        if (creatorApps.length === 0) {
            return { style: 'developing', traits: [], antiPatterns: [] };
        }

        const winningStyles = creatorApps.map(app => {
            const analysis = this.analyzeVariantPerformance(app.id);
            return analysis ? analysis.winner.style : null;
        }).filter(Boolean);

        const modeStyle = this.getMostFrequent(winningStyles);

        return {
            style: modeStyle,
            totalApps: creatorApps.length,
            successRate: (winningStyles.length / creatorApps.length * 100).toFixed(1),
            traits: this.extractCommonTraits(creatorApps)
        };
    }

    getMostFrequent(arr) {
        return arr.sort((a, b) =>
            arr.filter(v => v === a).length - arr.filter(v => v === b).length
        ).pop();
    }

    extractCommonTraits(apps) {
        const traitCounts = {};
        apps.forEach(app => {
            app.personality.split(',').map(t => t.trim()).forEach(trait => {
                traitCounts[trait] = (traitCounts[trait] || 0) + 1;
            });
        });

        return Object.entries(traitCounts)
            .filter(([_, count]) => count >= apps.length * 0.5)
            .map(([trait, _]) => trait);
    }

    // ============ IMPROVEMENT GENERATION LAYER ============

    /**
     * Generate next improved variant
     */
    async generateImprovement(appId) {
        const app = this.db.apps.find(a => a.id === appId);
        if (!app) return null;

        // Step 1: Analyze current performance
        const analysis = this.analyzeVariantPerformance(appId);
        const winningVariant = app.variants.find(v => v.id === analysis.winner.id);

        // Step 2: Extract insights
        const insights = await this.extractInsights(app, analysis.winner);

        // Step 3: Get ecosystem patterns
        const ecoPatterns = this.analyzeEcosystemPatterns();

        // Step 4: Get creator signature
        const creatorSignature = this.extractCreatorSignature(app.creatorId);

        // Step 5: Generate improvement prompt
        const improvementPrompt = `
Generate the NEXT GENERATION of this AI companion app.

Current Winner: ${analysis.winner.style} style
Performance: ${analysis.winner.satisfaction}% satisfaction
Key Strengths: ${insights.keyStrengths?.join(', ') || 'adaptability'}

Creator Signature: ${creatorSignature.style}
Success Pattern: Creator succeeds with ${creatorSignature.traits.join(', ')}

Ecosystem Learning:
  • Best performing style in category: ${ecoPatterns[0]?.pattern}
  • Effectiveness: ${ecoPatterns[0]?.effectiveness.toFixed(2)}

Generate enhanced version that:
1. Keeps ${analysis.winner.style} core strengths
2. Adds new capability: ${insights.recommendedEnhancements?.[0] || 'deeper listening'}
3. Incorporates creator's signature style
4. Follows ecosystem best practice

Output: Improved personality traits and system prompt guidelines (JSON)
        `;

        const improvement = await this.callClaude(improvementPrompt);

        return {
            generatedFrom: analysis.winner.id,
            improvement: improvement,
            timestamp: new Date().toISOString(),
            ecoInsights: ecoPatterns[0]?.pattern
        };
    }

    // ============ AUTONOMOUS IMPROVEMENT LOOP ============

    /**
     * Weekly cron: analyze all apps, generate improvements, deploy
     */
    async runWeeklyImprovement() {
        const results = [];

        for (const app of this.db.apps) {
            try {
                const improvement = await this.generateImprovement(app.id);

                if (improvement) {
                    // Add improvement record
                    app.improvements = app.improvements || [];
                    app.improvements.push(improvement);

                    results.push({
                        appId: app.id,
                        appName: app.name,
                        status: 'improved',
                        improvement
                    });
                }
            } catch (error) {
                results.push({
                    appId: app.id,
                    status: 'error',
                    error: error.message
                });
            }
        }

        this.saveToStorage();
        return results;
    }

    // ============ CLAUDE INTEGRATION ============

    async callClaude(prompt) {
        try {
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.claudeApiKey,
                    'anthropic-version': '2023-06-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-5-sonnet-20241022',
                    max_tokens: 2000,
                    messages: [{ role: 'user', content: prompt }]
                })
            });

            const data = await response.json();
            return data.content[0].text;
        } catch (error) {
            console.error('Claude API error:', error);
            return '';
        }
    }

    // ============ STORAGE ============

    saveToStorage() {
        localStorage.setItem('buddy_ecosystem_db', JSON.stringify(this.db));
    }

    loadFromStorage() {
        const saved = localStorage.getItem('buddy_ecosystem_db');
        if (saved) {
            this.db = JSON.parse(saved);
        }
    }
}

// Export for use in HTML apps
window.BuddyEcosystemEngine = BuddyEcosystemEngine;
