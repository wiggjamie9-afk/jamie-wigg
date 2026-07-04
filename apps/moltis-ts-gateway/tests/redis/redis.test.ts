import { describe, it, expect, afterEach } from "vitest";
import { redisOptionsFromEnv, RedisConnectionManager, withRedis } from "../../src/redis/index.js";

describe("redis tooling (no live server required)", () => {
  const saved = { ...process.env };
  afterEach(() => { process.env = { ...saved }; });

  it("reads options from env with documented defaults", () => {
    delete process.env.REDIS_URL;
    delete process.env.REDIS_HOST;
    delete process.env.REDIS_PORT;
    delete process.env.REDIS_DB;
    delete process.env.REDIS_KEY_PREFIX;
    const o = redisOptionsFromEnv();
    expect(o.host).toBe("127.0.0.1");
    expect(o.port).toBe(6379);
    expect(o.db).toBe(0);
    expect(o.keyPrefix).toBe("moltis:");
  });

  it("applies the key prefix helper", () => {
    const mgr = new RedisConnectionManager({ keyPrefix: "test:" });
    expect(mgr.key("session:1")).toBe("test:session:1");
  });

  it("surfaces a clear error when ioredis is absent", async () => {
    // withRedis should reject cleanly rather than throw synchronously.
    await expect(
      withRedis(async (c) => c.get("x"), { host: "127.0.0.1", port: 1 }),
    ).rejects.toBeInstanceOf(Error);
  });
});
