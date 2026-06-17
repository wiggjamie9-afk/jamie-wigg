/**
 * Tool Registry for Mary Agent
 * Defines 16+ async tools for video generation, editing, and scoring
 *
 * Primary providers:
 * - MuAPI: 41+ generative skills (Cinema Director, Seedance 2.0, AI Clipping, etc.)
 * - fal.ai: Kling 3.0, Sora 2, Veo 3.1 (fallback)
 * - NeuroPeer: Engagement scoring (in-house)
 * - FFMPEG: Local video assembly
 *
 * Tool categories:
 * - Generate: Text → Image/Video (MuAPI skills)
 * - Edit: Video → Video (AI Clipping, prompt-based editing)
 * - Score: Video → Metrics (NeuroPeer)
 * - Transform: Image/Video → Multi-format (social crops, thumbnails)
 * - Fetch: Web search + context retrieval
 */
export interface Tool {
    name: string;
    description: string;
    parameters: Record<string, any>;
    handler: (args: Record<string, any>) => Promise<string>;
}
export declare class ToolRegistry {
    private tools;
    constructor();
    private registerTools;
    private register;
    getTool(name: string): Tool | undefined;
    getAllTools(): Tool[];
    executeTool(name: string, args: Record<string, any>): Promise<string>;
}
//# sourceMappingURL=registry.d.ts.map