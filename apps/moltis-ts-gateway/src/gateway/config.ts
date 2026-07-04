// Gateway configuration, parsed from environment with Moltis-style keys.
import { resolve } from "node:path";

function env(name: string, fallback: string): string {
  const v = process.env[name];
  return v === undefined || v === "" ? fallback : v;
}

export interface GatewayConfig {
  host: string;
  port: number;
  dataDir: string;
  openaiApiKey: string | undefined;
  defaultModel: string;
  defaultProvider: string;
}

export function loadConfig(): GatewayConfig {
  return {
    host: env("MOLTIS_GATEWAY__HOST", "127.0.0.1"),
    port: Number(env("MOLTIS_GATEWAY__PORT", "8080")),
    dataDir: resolve(env("MOLTIS_DATA_DIR", ".moltis/data")),
    openaiApiKey: process.env.OPENAI_API_KEY || undefined,
    defaultModel: env("MOLTIS_DEFAULT_MODEL", "gpt-4o-mini"),
    defaultProvider: env("MOLTIS_DEFAULT_PROVIDER", "openai"),
  };
}
