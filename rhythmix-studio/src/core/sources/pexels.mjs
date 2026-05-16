// Pexels stock-video API client — platform-agnostic search + result-shaping.
// Uses only `fetch` and reads PEXELS_API_KEY from globalThis.process?.env if
// available (so Node still picks it up automatically without a node: import).
//
// The disk-writing helper (downloadPexelsVideo) lives outside core in
// src/sources/pexels.mjs because it needs fs/path.

const PEXELS_KEY =
  (typeof globalThis !== "undefined" &&
    globalThis.process?.env?.PEXELS_API_KEY) ||
  undefined;

export class PexelsError extends Error {
  constructor(message, { status } = {}) {
    super(message);
    this.name = "PexelsError";
    this.status = status;
  }
}

export async function pexelsSearch({
  query,
  perPage = 16,
  orientation = "landscape",
  page = 1,
  apiKey,
}) {
  const key = apiKey ?? PEXELS_KEY;
  if (!key) {
    throw new PexelsError("PEXELS_API_KEY is not set in the environment");
  }
  const url = new URL("https://api.pexels.com/videos/search");
  url.searchParams.set("query", query);
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("orientation", orientation);
  url.searchParams.set("page", String(page));
  const res = await fetch(url, { headers: { Authorization: key } });
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
