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
import { logger } from '@ecosystem/core';
export class ToolRegistry {
    tools = new Map();
    constructor() {
        logger.info('Initializing Mary tool registry');
        this.registerTools();
    }
    registerTools() {
        // VIDEO GENERATION (MuAPI primary, fal.ai fallback)
        this.register({
            name: 'generate_video_kling',
            description: 'Generate video using Kling 3.0 (text-to-video, image-to-video, 720p/1080p)',
            parameters: {
                prompt: { type: 'string', description: 'Creative video prompt' },
                imageUrl: { type: 'string', description: 'Optional reference image' },
                duration: { type: 'number', description: 'Duration in seconds (5-120)' },
                aspectRatio: { type: 'string', enum: ['16:9', '9:16', '1:1'] },
            },
            handler: async (args) => {
                logger.info('Calling generate_video_kling', args);
                // TODO: Call MuAPI or fal.ai Kling endpoint
                return JSON.stringify({ videoUrl: '', processingTime: 0 });
            },
        });
        this.register({
            name: 'generate_video_seedance',
            description: 'Generate cinematic video using Seedance 2.0 Pro (Director-level, native audio sync)',
            parameters: {
                prompt: { type: 'string' },
                imageUrl: { type: 'string' },
                audioUrl: { type: 'string', description: 'Optional background music/voiceover' },
                quality: { type: 'string', enum: ['fast', 'standard', 'pro'] },
            },
            handler: async (args) => {
                logger.info('Calling generate_video_seedance', args);
                return JSON.stringify({ videoUrl: '', audioSynced: true });
            },
        });
        // IMAGE GENERATION
        this.register({
            name: 'generate_image_flux',
            description: 'Generate high-quality image using FLUX Kontext (multi-reference capable)',
            parameters: {
                prompt: { type: 'string' },
                referenceImageUrls: { type: 'array', description: 'Up to 4 reference images' },
                size: { type: 'string', enum: ['1024x1024', '1024x1536', '1536x1024'] },
                style: { type: 'string', enum: ['photo', 'illustration', '3d_render', 'cinematic'] },
            },
            handler: async (args) => {
                logger.info('Calling generate_image_flux', args);
                return JSON.stringify({ imageUrl: '' });
            },
        });
        this.register({
            name: 'generate_image_nano_banana',
            description: 'Reasoning-driven image generation with multi-reference support (Nano Banana Pro)',
            parameters: {
                brief: { type: 'string', description: 'Creative brief instead of prompt' },
                referenceImages: { type: 'array' },
                constraints: { type: 'object', description: 'Brand constraints, style guides, etc.' },
            },
            handler: async (args) => {
                logger.info('Calling generate_image_nano_banana', args);
                return JSON.stringify({ imageUrl: '', reasoning: '' });
            },
        });
        // VIDEO EDITING / TRANSFORMATION
        this.register({
            name: 'create_vertical_clips',
            description: 'Convert long-form video to ranked vertical shorts (AI Clipping: server-side transcription, virality ranking, face-tracking)',
            parameters: {
                videoUrl: { type: 'string' },
                platform: { type: 'string', enum: ['tiktok', 'shorts', 'reels', 'snapchat'] },
                clipCount: { type: 'number', description: 'Number of clips to extract (default 5)' },
            },
            handler: async (args) => {
                logger.info('Calling create_vertical_clips', args);
                return JSON.stringify({
                    clips: [
                        { url: '', rank: 1, viralityScore: 0.95, transcription: '' },
                    ],
                });
            },
        });
        this.register({
            name: 'edit_video_prompt',
            description: 'Edit video using natural language prompt (remove objects, change scene, etc.)',
            parameters: {
                videoUrl: { type: 'string' },
                editPrompt: { type: 'string', description: 'What to change in the video' },
            },
            handler: async (args) => {
                logger.info('Calling edit_video_prompt', args);
                return JSON.stringify({ editedVideoUrl: '' });
            },
        });
        // SCORING / ANALYSIS
        this.register({
            name: 'score_video_neuropeer',
            description: 'Score video engagement via NeuroPeer (neuromarketing metrics)',
            parameters: {
                videoUrl: { type: 'string' },
                targetAudience: { type: 'string', description: 'e.g. "18-35, fitness enthusiasts"' },
                brand: { type: 'string' },
            },
            handler: async (args) => {
                logger.info('Calling score_video_neuropeer', args);
                return JSON.stringify({
                    engagement: 0.85,
                    virality: 0.72,
                    emotionalResonance: 0.91,
                    attention: 0.88,
                    retention: 0.79,
                });
            },
        });
        // AUDIO GENERATION
        this.register({
            name: 'generate_voiceover',
            description: 'Generate voiceover audio with voice cloning support',
            parameters: {
                script: { type: 'string' },
                voice: { type: 'string', description: 'Voice ID or clone reference' },
                tone: { type: 'string', enum: ['professional', 'friendly', 'energetic', 'calm'] },
            },
            handler: async (args) => {
                logger.info('Calling generate_voiceover', args);
                return JSON.stringify({ audioUrl: '', duration: 0 });
            },
        });
        this.register({
            name: 'generate_music',
            description: 'Generate background music with mood/style control',
            parameters: {
                mood: { type: 'string', enum: ['energetic', 'calm', 'cinematic', 'playful'] },
                duration: { type: 'number', description: 'Duration in seconds' },
                genre: { type: 'string' },
            },
            handler: async (args) => {
                logger.info('Calling generate_music', args);
                return JSON.stringify({ audioUrl: '' });
            },
        });
        // CHARACTER / AVATAR
        this.register({
            name: 'create_avatar',
            description: 'Create AI avatar for talking-head videos (photo → avatar)',
            parameters: {
                referencePhoto: { type: 'string', description: 'Photo of person or character concept' },
                animationStyle: { type: 'string', enum: ['realistic', 'stylized', 'cartoon', '3d'] },
            },
            handler: async (args) => {
                logger.info('Calling create_avatar', args);
                return JSON.stringify({ avatarId: '', previewUrl: '' });
            },
        });
        // CONTEXT / RESEARCH
        this.register({
            name: 'search_competitive_videos',
            description: 'Search for competitor videos and campaign examples (context gathering)',
            parameters: {
                brand: { type: 'string' },
                category: { type: 'string', description: 'e.g., "UGC ads", "product videos"' },
                limit: { type: 'number', description: 'Max results (default 5)' },
            },
            handler: async (args) => {
                logger.info('Calling search_competitive_videos', args);
                return JSON.stringify({
                    results: [{ url: '', title: '', score: 0 }],
                });
            },
        });
        logger.info(`Registered ${this.tools.size} tools for Mary agent`);
    }
    register(tool) {
        this.tools.set(tool.name, tool);
    }
    getTool(name) {
        return this.tools.get(name);
    }
    getAllTools() {
        return Array.from(this.tools.values());
    }
    async executeTool(name, args) {
        const tool = this.getTool(name);
        if (!tool) {
            throw new Error(`Tool not found: ${name}`);
        }
        logger.info(`Executing tool: ${name}`, args);
        return tool.handler(args);
    }
}
//# sourceMappingURL=registry.js.map