export type InferenceBackend = 'ollama' | 'transformers' | 'onnx';

export type ModelSize = 'tiny' | 'small' | 'medium' | 'large' | 'xlarge';

export interface ModelConfig {
  name: string;
  modelId: string;
  backend: InferenceBackend;
  size: ModelSize;
  contextLength: number;
  quantized: boolean;
  requiresGPU: boolean;
  memoryMB: number;
  url?: string;
}

export interface InferenceRequest {
  model: string;
  prompt: string;
  maxTokens?: number;
  temperature?: number;
  topP?: number;
  stream?: boolean;
}

export interface InferenceResponse {
  model: string;
  text: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  duration: number;
}

export interface ServerConfig {
  port?: number;
  host?: string;
  defaultBackend?: InferenceBackend;
  models?: ModelConfig[];
  maxConcurrentRequests?: number;
  requestTimeout?: number;
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}
