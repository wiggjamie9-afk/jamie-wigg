// Optional Redis tooling. ioredis is an optionalDependency and imported lazily,
// so the gateway runs fine when Redis is absent.
//
//   import { RedisConnectionManager, withRedis } from "moltis/redis";

export interface RedisOptions {
  url?: string;
  host?: string;
  port?: number;
  db?: number;
  keyPrefix?: string;
}

export function redisOptionsFromEnv(): RedisOptions {
  return {
    url: process.env.REDIS_URL || undefined,
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT || "6379"),
    db: Number(process.env.REDIS_DB || "0"),
    keyPrefix: process.env.REDIS_KEY_PREFIX || "moltis:",
  };
}

// Minimal structural type so we don't hard-depend on ioredis' types at build time.
export interface RedisLike {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<unknown>;
  quit(): Promise<unknown>;
}

export class RedisConnectionManager {
  private client: RedisLike | null = null;
  constructor(private readonly opts: RedisOptions = redisOptionsFromEnv()) {}

  async connect(): Promise<RedisLike> {
    if (this.client) return this.client;
    let IORedis: any;
    try {
      ({ default: IORedis } = await import("ioredis"));
    } catch {
      throw new Error("ioredis is not installed. Run: npm install ioredis");
    }
    // Fail fast rather than retry a dead server forever — this is tooling, not the
    // hot path. Callers get a rejected promise instead of a hang.
    const failFast = {
      maxRetriesPerRequest: 1 as const,
      connectTimeout: 800,
      retryStrategy: () => null,
      keyPrefix: this.opts.keyPrefix,
    };
    this.client = this.opts.url
      ? new IORedis(this.opts.url, failFast)
      : new IORedis({ host: this.opts.host, port: this.opts.port, db: this.opts.db, ...failFast });
    return this.client!;
  }

  async close(): Promise<void> {
    if (this.client) {
      await this.client.quit();
      this.client = null;
    }
  }

  get key() {
    const prefix = this.opts.keyPrefix ?? "moltis:";
    return (name: string) => `${prefix}${name}`;
  }
}

/** Run a function with a connected client, always closing afterwards. */
export async function withRedis<T>(
  fn: (client: RedisLike, mgr: RedisConnectionManager) => Promise<T>,
  opts?: RedisOptions,
): Promise<T> {
  const mgr = new RedisConnectionManager(opts);
  try {
    const client = await mgr.connect();
    return await fn(client, mgr);
  } finally {
    await mgr.close();
  }
}
