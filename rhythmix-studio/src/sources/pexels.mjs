import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const PEXELS_KEY = process.env.PEXELS_API_KEY;

export class PexelsError extends Error {
  constructor(message, { status } = {}) {
    super(message);
    this.name = "PexelsError";
    this.status = status;
  }
}

export async function pexelsSearch({ query, perPage = 16, orientation = "landscape", page = 1 }) {
  if (!PEXELS_KEY) {
    throw new PexelsError("PEXELS_API_KEY is not set in the environment");
  }
  const url = new URL("https://api.pexels.com/videos/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("page", String(page));
  const res = await fetch(url, { headers: { Authorization: PEXELS_KEY } });
  if (!res.ok) {
    throw new PexelsError(
      `Pexels search failed: ${res.status} ${await res.text()}`,
      { status: res.status }
    );
  }
  const data = await res.json();
  return data.videos || [];
}

export function pickVideoFile(video, { preferWidth = 1280 } = {}) {
  if (!video?.video_files?.length) return null;
  const mp4s = video.video_files.filter((f) => f.file_type === "video/mp4");
  if (!mp4s.length) return null;
  mp4s.sort(
    (a, b) =>
      Math.abs((a.width || 0) - preferWidth) -
      Math.abs((b.width || 0) - preferWidth)
  );
  return mp4s[0];
}

export async function downloadPexelsVideo({ url, filename, outDir }) {
  const dir = resolve(outDir);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  const res = await fetch(url);
  if (!res.ok) throw new PexelsError(`Pexels download failed: ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const path = join(dir, filename);
  await writeFile(path, buf);
  return path;
}
