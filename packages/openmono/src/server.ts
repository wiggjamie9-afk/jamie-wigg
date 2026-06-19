import express from 'express';
import cors from 'cors';
import { InferenceManager } from './inference.js';
import { ServerConfig } from './types.js';

export class OpenMonoServer {
  private app: express.Application;
  private inference: InferenceManager;
  private config: Required<ServerConfig>;
  private activeRequests = 0;

  constructor(config: ServerConfig = {}) {
    this.app = express();
    this.config = {
      port: config.port || 5000,
      host: config.host || '127.0.0.1',
      defaultBackend: config.defaultBackend || 'ollama',
      models: config.models || [],
      maxConcurrentRequests: config.maxConcurrentRequests || 10,
      requestTimeout: config.requestTimeout || 120000,
      logLevel: config.logLevel || 'info',
    };

    this.inference = new InferenceManager(this.config);
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));

    // Request logging
    this.app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        if (this.config.logLevel !== 'error') {
          console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`);
        }
      });
      next();
    });

    // Request limiting
    this.app.use((req, res, next) => {
      if (this.activeRequests >= this.config.maxConcurrentRequests) {
        res.status(503).json({
          error: 'Service temporarily overloaded',
          maxConcurrentRequests: this.config.maxConcurrentRequests,
        });
        return;
      }
      this.activeRequests++;
      res.on('finish', () => {
        this.activeRequests--;
      });
      next();
    });
  }

  private setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        uptime: process.uptime(),
        activeRequests: this.activeRequests,
        maxConcurrentRequests: this.config.maxConcurrentRequests,
      });
    });

    // List available models
    this.app.get('/v1/models', (req, res) => {
      const models = this.inference.listModels();
      res.json({
        object: 'list',
        data: models.map((m) => ({
          id: m.modelId,
          object: 'model',
          owned_by: 'openmono',
          backend: m.backend,
          size: m.size,
          memory_mb: m.memoryMB,
        })),
      });
    });

    // Inference endpoint (OpenAI-compatible)
    this.app.post('/v1/chat/completions', this.handleChatCompletion.bind(this));
    this.app.post('/v1/completions', this.handleCompletion.bind(this));

    // Health for specific model
    this.app.get('/v1/models/:modelId/health', async (req, res) => {
      try {
        const health = await this.inference.checkModelHealth(req.params.modelId);
        res.json(health);
      } catch (error) {
        res.status(404).json({ error: 'Model not found or not loaded' });
      }
    });

    // Error handling
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Error:', err);
      res.status(500).json({ error: err.message || 'Internal server error' });
    });
  }

  private async handleChatCompletion(req: express.Request, res: express.Response) {
    try {
      const { model, messages, max_tokens, temperature, stream } = req.body;

      if (!model) {
        res.status(400).json({ error: 'model is required' });
        return;
      }

      // Convert messages to prompt format
      const prompt = messages
        .map((m: any) => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n') + '\nASSISTANT:';

      const result = await this.inference.infer({
        model,
        prompt,
        maxTokens: max_tokens || 1024,
        temperature: temperature || 0.7,
      });

      if (stream) {
        // Streaming response
        res.setHeader('Content-Type', 'text/event-stream');
        res.write(
          `data: ${JSON.stringify({
            choices: [{ delta: { content: result.text }, index: 0 }],
            model,
          })}\n\n`,
        );
        res.write('data: [DONE]\n\n');
        res.end();
      } else {
        // Single response
        res.json({
          id: `openmono-${Date.now()}`,
          object: 'chat.completion',
          created: Math.floor(Date.now() / 1000),
          model,
          choices: [
            {
              index: 0,
              message: { role: 'assistant', content: result.text },
              finish_reason: 'stop',
            },
          ],
          usage: {
            prompt_tokens: result.promptTokens,
            completion_tokens: result.completionTokens,
            total_tokens: result.totalTokens,
          },
        });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  private async handleCompletion(req: express.Request, res: express.Response) {
    try {
      const { model, prompt, max_tokens, temperature } = req.body;

      if (!model) {
        res.status(400).json({ error: 'model is required' });
        return;
      }

      if (!prompt) {
        res.status(400).json({ error: 'prompt is required' });
        return;
      }

      const result = await this.inference.infer({
        model,
        prompt: typeof prompt === 'string' ? prompt : prompt.join(''),
        maxTokens: max_tokens || 1024,
        temperature: temperature || 0.7,
      });

      res.json({
        id: `openmono-${Date.now()}`,
        object: 'text_completion',
        created: Math.floor(Date.now() / 1000),
        model,
        choices: [
          {
            text: result.text,
            index: 0,
            finish_reason: 'stop',
          },
        ],
        usage: {
          prompt_tokens: result.promptTokens,
          completion_tokens: result.completionTokens,
          total_tokens: result.totalTokens,
        },
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async start() {
    return new Promise<void>((resolve) => {
      this.app.listen(this.config.port, this.config.host, () => {
        console.log(
          `\n🚀 OpenMono server running at http://${this.config.host}:${this.config.port}`,
        );
        console.log(`📊 Health check: http://${this.config.host}:${this.config.port}/health`);
        console.log(`🤖 Models: http://${this.config.host}:${this.config.port}/v1/models\n`);
        resolve();
      });
    });
  }

  getApp() {
    return this.app;
  }
}
