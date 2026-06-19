import { InferenceRequest, InferenceResponse, ModelConfig, ServerConfig } from './types.js';

export class InferenceManager {
  private models: Map<string, ModelConfig> = new Map();
  private config: Required<ServerConfig>;
  private loadedModels: Map<string, any> = new Map();

  constructor(config: Required<ServerConfig>) {
    this.config = config;
    this.registerModels();
  }

  private registerModels() {
    // Default models
    const defaultModels: ModelConfig[] = [
      {
        name: 'Phi 2 (Quantized)',
        modelId: 'phi-2-q4',
        backend: 'ollama',
        size: 'small',
        contextLength: 2048,
        quantized: true,
        requiresGPU: false,
        memoryMB: 1500,
        url: 'ollama://phi',
      },
      {
        name: 'Mistral 7B (Quantized)',
        modelId: 'mistral-7b-q4',
        backend: 'ollama',
        size: 'small',
        contextLength: 8192,
        quantized: true,
        requiresGPU: false,
        memoryMB: 3500,
        url: 'ollama://mistral',
      },
      {
        name: 'Neural Chat 7B',
        modelId: 'neural-chat-7b-q4',
        backend: 'ollama',
        size: 'small',
        contextLength: 8192,
        quantized: true,
        requiresGPU: false,
        memoryMB: 3500,
        url: 'ollama://neural-chat',
      },
      {
        name: 'Llama 2 7B (Quantized)',
        modelId: 'llama2-7b-q4',
        backend: 'ollama',
        size: 'small',
        contextLength: 4096,
        quantized: true,
        requiresGPU: false,
        memoryMB: 3500,
        url: 'ollama://llama2',
      },
    ];

    const allModels = [...(this.config.models || []), ...defaultModels];
    for (const model of allModels) {
      this.models.set(model.modelId, model);
    }
  }

  listModels(): ModelConfig[] {
    return Array.from(this.models.values());
  }

  async infer(request: InferenceRequest): Promise<InferenceResponse> {
    const modelConfig = this.models.get(request.model);
    if (!modelConfig) {
      throw new Error(`Model not found: ${request.model}`);
    }

    const startTime = Date.now();

    // Simulate inference (in production, this would call the actual backend)
    const responseText = this.generateResponse(request.prompt, request.maxTokens || 128);

    const duration = Date.now() - startTime;

    return {
      model: request.model,
      text: responseText,
      promptTokens: Math.ceil(request.prompt.split(/\s+/).length * 1.3),
      completionTokens: Math.ceil(responseText.split(/\s+/).length * 1.3),
      totalTokens:
        Math.ceil(request.prompt.split(/\s+/).length * 1.3) +
        Math.ceil(responseText.split(/\s+/).length * 1.3),
      duration,
    };
  }

  async checkModelHealth(modelId: string): Promise<any> {
    const model = this.models.get(modelId);
    if (!model) {
      throw new Error(`Model not found: ${modelId}`);
    }

    return {
      modelId,
      status: 'ok',
      loaded: this.loadedModels.has(modelId),
      backend: model.backend,
      memory_mb: model.memoryMB,
      context_length: model.contextLength,
    };
  }

  private generateResponse(prompt: string, maxTokens: number): string {
    // Placeholder response generation
    const responses = [
      "I understand. This is a local inference response from OpenMono.",
      "Based on your input, here's my response using local inference.",
      "Running on the local OpenMono server for privacy-first processing.",
      "Local model inference complete. This demonstrates offline capability.",
    ];

    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    const wordCount = Math.min(maxTokens / 1.3, prompt.split(/\s+/).length * 0.5);
    const truncated = baseResponse.split(/\s+/).slice(0, Math.floor(wordCount)).join(' ');

    return truncated || baseResponse;
  }
}
