import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const REPLICATE_TOKEN = process.env.REPLICATE_API_TOKEN?.trim();

export class ReplicateError extends Error {
  constructor(message, { status, predictionId } = {}) {
    super(message);
    this.name = "ReplicateError";
    this.status = status;
    this.predictionId = predictionId;
  }
}

// Fetch with automatic retry on 429 (rate limit). Honors the retry_after
// hint from Replicate's response body, falling back to exponential backoff.
async function fetchWithRateLimitRetry(url, init, { maxRetries = 6 } = {}) {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const res = await fetch(url, init);
    if (res.status !== 429) return res;

    if (attempt >= maxRetries) return res;

    let retryAfter = 10;
    try {
      const body = await res.clone().json();
      if (typeof body.retry_after === "number") {
        retryAfter = Math.min(120, Math.max(1, body.retry_after));
      }
    } catch {
      // body wasn't JSON; use default
    }
    // Add a small jitter so concurrent retries don't collide
    const jitter = Math.random() * 2;
    const waitMs = (retryAfter + jitter) * 1000;
    console.log(
      `[replicate] 429 received, waiting ${(waitMs / 1000).toFixed(1)}s before retry ${attempt + 1}/${maxRetries}…`
    );
    await new Promise((r) => setTimeout(r, waitMs));
  }
}

export async function replicateRun({
  model,
  input,
  timeoutMs = 1_200_000,
  onProgress,
}) {
  if (!REPLICATE_TOKEN) {
    throw new ReplicateError("REPLICATE_API_TOKEN is not set in the environment");
  }

  const [owner, rest] = model.split("/");
  if (!owner || !rest) {
    throw new ReplicateError(`Invalid model id: ${model}. Expected 'owner/name' or 'owner/name:version'.`);
  }
  const [name, version] = rest.split(":");

  let url;
  let body;
  if (version) {
    url = "https://api.replicate.com/v1/predictions";
    body = { version, input };
  } else {
    url = `https://api.replicate.com/v1/models/${owner}/${name}/predictions`;
    body = { input };
  }

  const start = await fetchWithRateLimitRetry(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REPLICATE_TOKEN}`,
      "Content-Type": "application/json",
      Prefer: "wait=60",
    },
    body: JSON.stringify(body),
  });

  if (!start.ok) {
    throw new ReplicateError(
      `Replicate start failed: ${start.status} ${await start.text()}`,
      { status: start.status }
    );
  }

  let prediction = await start.json();
  const deadline = Date.now() + timeoutMs;

  while (
    prediction.status !== "succeeded" &&
    prediction.status !== "failed" &&
    prediction.status !== "canceled"
  ) {
    if (Date.now() > deadline) {
      throw new ReplicateError("Replicate prediction timed out", {
        predictionId: prediction.id,
      });
    }
    onProgress?.(prediction.status);
    await new Promise((r) => setTimeout(r, 2000));
    const poll = await fetchWithRateLimitRetry(prediction.urls.get, {
      headers: { Authorization: `Bearer ${REPLICATE_TOKEN}` },
    });
    prediction = await poll.json();
  }

  if (prediction.status !== "succeeded") {
    throw new ReplicateError(
      `Replicate ${prediction.status}: ${prediction.error || "unknown error"}`,
      { predictionId: prediction.id }
    );
  }

  return prediction.output;
}

export async function downloadToDisk(url, filename, outDir) {
  const dir = resolve(outDir);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new ReplicateError(`download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const path = join(dir, filename);
  await writeFile(path, buf);
  return path;
}

export function firstUrl(output) {
  if (typeof output === "string") return output;
  if (Array.isArray(output) && output.length) return output[0];
  if (output && typeof output === "object" && output.url) return output.url;
  throw new ReplicateError(`Unrecognized model output shape: ${JSON.stringify(output)}`);
}
