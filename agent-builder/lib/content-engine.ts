// Content Engine — client helpers for the RHYTHMIX Sheets → Kling → Socials pipeline.
// Triggers runs via the n8n webhook and reads status from the Google Sheet (CSV).
// Everything is client-side; config lives in localStorage.

export type EngineConfig = {
  webhookUrl: string; // n8n Webhook node URL, e.g. https://<n8n>/webhook/content-engine
  sheetId: string; // Google Sheet ID (the run-log)
  sheetName: string; // tab name, default "Sheet1"
};

export type RunRequest = {
  topic: string;
  duration: string; // 30s | 60s | 90s
  aspect: string; // landscape | portrait | square
  vibe: string; // cinematic | jazz | rave | rock | disco
};

export type Run = {
  run_id: string;
  topic: string;
  duration?: string;
  aspect?: string;
  vibe?: string;
  status: string; // processing | done | failed | timeout | canceled
  video_url?: string;
  created_at?: string;
};

const CONFIG_KEY = 'rhythmix.contentEngine.config';

export function getConfig(): EngineConfig {
  if (typeof window === 'undefined') return { webhookUrl: '', sheetId: '', sheetName: 'Sheet1' };
  try {
    const raw = localStorage.getItem(CONFIG_KEY);
    if (raw) return { sheetName: 'Sheet1', ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { webhookUrl: '', sheetId: '', sheetName: 'Sheet1' };
}

export function setConfig(cfg: EngineConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
}

export function newRunId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID();
  // Fallback for older runtimes
  return 'run-' + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

/**
 * Trigger a pipeline run. Generates a run_id client-side and POSTs it to the
 * n8n webhook. The webhook (responseMode: onReceived) returns immediately; we
 * track progress by polling the sheet for this run_id.
 *
 * Requires CORS to be allowed on the n8n webhook for this origin.
 */
export async function triggerRun(cfg: EngineConfig, req: RunRequest): Promise<string> {
  if (!cfg.webhookUrl) throw new Error('No webhook URL configured.');
  const run_id = newRunId();
  const res = await fetch(cfg.webhookUrl, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ run_id, ...req }),
  });
  if (!res.ok) {
    throw new Error(`Webhook returned ${res.status}. Check the URL and that CORS is allowed.`);
  }
  return run_id;
}

/** Minimal CSV parser (handles quoted fields, commas, and escaped quotes). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); rows.push(row); row = []; field = '';
    } else if (c === '\r') {
      /* skip */
    } else field += c;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows;
}

/**
 * Read the run-log from the Google Sheet via the gviz CSV endpoint.
 * The sheet must be shared so "anyone with the link can view".
 * Returns runs newest-first.
 */
export async function fetchRuns(cfg: EngineConfig): Promise<Run[]> {
  if (!cfg.sheetId) throw new Error('No Google Sheet ID configured.');
  const url =
    `https://docs.google.com/spreadsheets/d/${encodeURIComponent(cfg.sheetId)}` +
    `/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(cfg.sheetName || 'Sheet1')}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Sheet read returned ${res.status}. Is it shared as view-public?`);
  const csv = await res.text();
  const rows = parseCsv(csv).filter((r) => r.length && r.some((c) => c.trim() !== ''));
  if (rows.length < 2) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const col = {
    run_id: idx('run_id'), topic: idx('topic'), duration: idx('duration'),
    aspect: idx('aspect'), vibe: idx('vibe'), status: idx('status'),
    video_url: idx('video_url'), created_at: idx('created_at'),
  };
  const get = (r: string[], i: number) => (i >= 0 && i < r.length ? r[i] : '');
  const runs = rows.slice(1).map((r) => ({
    run_id: get(r, col.run_id),
    topic: get(r, col.topic),
    duration: get(r, col.duration),
    aspect: get(r, col.aspect),
    vibe: get(r, col.vibe),
    status: (get(r, col.status) || 'processing').toLowerCase(),
    video_url: get(r, col.video_url),
    created_at: get(r, col.created_at),
  })).filter((r) => r.run_id);
  return runs.reverse();
}
