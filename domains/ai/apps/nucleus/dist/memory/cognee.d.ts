/**
 * Cognee Memory Integration
 * Provides three-layer memory for Mary agent:
 * 1. Episodic: Session history + campaign outcomes
 * 2. Semantic: Brand knowledge + scoring patterns + audience insights
 * 3. Procedural: Learned system prompt adjustments
 *
 * Uses Cognee knowledge graph with SQLite + LanceDB + Kuzu backends
 * (all local, zero cloud, zero vendor lock-in)
 */
export interface CampaignResult {
    campaignId: string;
    brandName: string;
    videoVariants: Array<{
        url: string;
        generationModel: string;
        promptUsed: string;
    }>;
    neuropeerScores: {
        engagement: number;
        virality: number;
        emotionalResonance: number;
    };
    timestamp: string;
}
export interface ProceduralUpdate {
    type: 'system_prompt' | 'scoring_weights' | 'generation_strategy';
    description: string;
    affectedMetrics: string[];
    timestamp: string;
}
export declare class CogneeMemory {
    private initialized;
    constructor(options?: any);
    storeCampaignResult(result: CampaignResult): Promise<void>;
    searchBrandPatterns(brandName: string, limit?: number): Promise<any[]>;
    storeProcedural(update: ProceduralUpdate): Promise<void>;
    getProcedurals(query: string): Promise<ProceduralUpdate[]>;
    sync(): Promise<void>;
}
//# sourceMappingURL=cognee.d.ts.map