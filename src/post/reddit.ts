import { config, hasRedditCreds } from "../config.js";
import type { Draft, PostRecord } from "../types.js";

interface TokenCache {
  token: string;
  expiresAt: number;
}
let tokenCache: TokenCache | null = null;

async function getAccessToken(): Promise<string> {
  if (tokenCache && tokenCache.expiresAt > Date.now() + 60_000) return tokenCache.token;

  const { clientId, clientSecret, username, password, userAgent } = config.reddit;
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const body = new URLSearchParams({ grant_type: "password", username, password });

  const res = await fetch("https://www.reddit.com/api/v1/access_token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": userAgent,
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`Reddit auth failed: ${res.status} ${await res.text()}`);
  }
  const json: any = await res.json();
  if (!json.access_token) throw new Error(`Reddit auth: no access_token in response`);
  tokenCache = {
    token: json.access_token,
    expiresAt: Date.now() + (json.expires_in ?? 3600) * 1000,
  };
  return tokenCache.token;
}

export async function postToReddit(draft: Draft): Promise<PostRecord> {
  if (!hasRedditCreds()) {
    throw new Error("Reddit credentials missing. Fill REDDIT_* in .env");
  }
  const token = await getAccessToken();
  const sub = config.reddit.targetSubreddit.replace(/^r\//, "");

  const params = new URLSearchParams({
    sr: sub,
    kind: "self",
    title: draft.title,
    text: draft.body,
    api_type: "json",
    sendreplies: "true",
  });

  const res = await fetch("https://oauth.reddit.com/api/submit", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent": config.reddit.userAgent,
    },
    body: params,
  });
  if (!res.ok) throw new Error(`Reddit submit failed: ${res.status} ${await res.text()}`);
  const json: any = await res.json();
  const errors = json?.json?.errors ?? [];
  if (errors.length) throw new Error(`Reddit rejected post: ${JSON.stringify(errors)}`);
  const url = json?.json?.data?.url as string | undefined;

  return {
    trend_id: draft.trend_id,
    platform: "reddit",
    target: sub,
    url,
    posted_at: new Date().toISOString(),
    dry_run: false,
  };
}
