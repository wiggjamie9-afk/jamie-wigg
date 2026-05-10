import { mkdir, copyFile, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

export class LocalSourceError extends Error {
  constructor(message) {
    super(message);
    this.name = "LocalSourceError";
  }
}

const VIDEO_EXT = /\.(mp4|mov|webm|mkv|m4v)$/i;

export async function listLocalClips(dir) {
  const path = resolve(dir);
  if (!existsSync(path)) {
    throw new LocalSourceError(`Local clips directory not found: ${path}`);
  }
  const files = await readdir(path);
  const clips = files
    .filter((f) => VIDEO_EXT.test(f))
    .map((f) => join(path, f))
    .sort();
  if (clips.length === 0) {
    throw new LocalSourceError(`No video files (.mp4/.mov/.webm/.mkv/.m4v) in ${path}`);
  }
  return clips;
}

export async function copyLocalClip({ srcPath, filename, outDir }) {
  const dir = resolve(outDir);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  const dst = join(dir, filename);
  await copyFile(srcPath, dst);
  return dst;
}
