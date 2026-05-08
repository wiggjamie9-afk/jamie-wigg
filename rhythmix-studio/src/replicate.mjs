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

  // Replicate's current API:
  //   - Versioned models  → POST /v1/predictions          { version, input }
  //   - Official models   → POST /v1/models/{o}/{n}/predictions { input }
  // The old `{ model: "owner/name", input }` shape is no longer accepted.
  let url;
  let body;
  if (version) {
    url = "https://api.replicate.com/v1/predictions";
    body = { version, input };
  } else {
    url = `https://api.replicate.com/v1/models/${owner}/${name}/predictions`;
    body = { input };
  }

  const start = await fetch(url, {
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
    const poll = await fetch(prediction.urls.get, {
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
