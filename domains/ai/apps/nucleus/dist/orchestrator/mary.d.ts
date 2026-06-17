/**
 * Mary Agent
 * Pydantic AI-powered agentic orchestrator for neuromarketing video campaigns
 *
 * Capabilities:
 * - Parse brand briefs and generate campaign concepts
 * - Call video generation APIs (MuAPI, fal.ai)
 * - Score outputs via NeuroPeer (engagement prediction)
 * - Learn from campaign performance (procedural memory)
 * - Manage multi-variant A/B testing
 *
 * Architecture (pre-Hermes migration):
 * - Pydantic AI with ~16 async tools
 * - Cognee memory layer (episodic + semantic)
 * - CIL system prompt + per-turn dynamic context
 */
export declare class MaryAgent {
    constructor(options: any);
    generateCampaign(brief: string): Promise<any>;
    learnFromFeedback(campaignId: string, feedback: any): Promise<void>;
}
//# sourceMappingURL=mary.d.ts.map