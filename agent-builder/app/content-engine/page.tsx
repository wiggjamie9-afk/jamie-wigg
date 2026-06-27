'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Film, Play, RefreshCw, Settings, ExternalLink, CheckCircle2,
  AlertCircle, Loader2, Clock,
} from 'lucide-react';
import {
  getConfig, setConfig, triggerRun, fetchRuns,
  type EngineConfig, type Run, type RunRequest,
} from '@/lib/content-engine';

const DURATIONS = ['30s', '60s', '90s'];
const ASPECTS = ['landscape', 'portrait', 'square'];
const VIBES = ['cinematic', 'jazz', 'rave', 'rock', 'disco'];

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { cls: string; Icon: typeof CheckCircle2; label: string }> = {
    done: { cls: 'bg-green-100 text-green-700', Icon: CheckCircle2, label: 'Done' },
    processing: { cls: 'bg-blue-100 text-blue-700', Icon: Loader2, label: 'Processing' },
    failed: { cls: 'bg-red-100 text-red-700', Icon: AlertCircle, label: 'Failed' },
    canceled: { cls: 'bg-red-100 text-red-700', Icon: AlertCircle, label: 'Canceled' },
    timeout: { cls: 'bg-amber-100 text-amber-700', Icon: Clock, label: 'Timed out' },
  };
  const { cls, Icon, label } = map[status] ?? map.processing;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${cls}`}>
      <Icon className={`h-3.5 w-3.5 ${status === 'processing' ? 'animate-spin' : ''}`} />
      {label}
    </span>
  );
}

export default function ContentEnginePage() {
  const [cfg, setCfg] = useState<EngineConfig>({ webhookUrl: '', sheetId: '', sheetName: 'Sheet1' });
  const [showConfig, setShowConfig] = useState(false);
  const [form, setForm] = useState<RunRequest>({ topic: '', duration: '30s', aspect: 'portrait', vibe: 'cinematic' });
  const [runs, setRuns] = useState<Run[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const c = getConfig();
    setCfg(c);
    setShowConfig(!c.webhookUrl || !c.sheetId);
  }, []);

  const refresh = useCallback(async () => {
    if (!cfg.sheetId) return;
    setLoading(true);
    try {
      setRuns(await fetchRuns(cfg));
      setMsg(null);
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Failed to read runs' });
    } finally {
      setLoading(false);
    }
  }, [cfg]);

  useEffect(() => { if (cfg.sheetId) refresh(); }, [cfg.sheetId, refresh]);

  // Auto-poll every 10s while any run is still processing.
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (cfg.sheetId && runs.some((r) => r.status === 'processing')) {
      pollRef.current = setInterval(refresh, 10000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [runs, cfg.sheetId, refresh]);

  const saveConfig = () => { setConfig(cfg); setShowConfig(false); setMsg({ kind: 'ok', text: 'Settings saved.' }); };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) { setMsg({ kind: 'err', text: 'Enter a topic.' }); return; }
    setSubmitting(true);
    try {
      const id = await triggerRun(cfg, form);
      setMsg({ kind: 'ok', text: `Run queued (${id.slice(0, 8)}…). It will appear below shortly.` });
      setForm((f) => ({ ...f, topic: '' }));
      setTimeout(refresh, 2500);
    } catch (e) {
      setMsg({ kind: 'err', text: e instanceof Error ? e.message : 'Failed to trigger run' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Film className="h-7 w-7 text-purple-600" /> Content Engine
            </h1>
            <p className="text-gray-600 mt-2">Topic → Kling 2.1 video → auto-post. Runs tracked via your Google Sheet.</p>
          </div>
          <button
            onClick={() => setShowConfig((s) => !s)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" /> Settings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {msg && (
          <div className={`rounded-lg px-4 py-3 text-sm ${msg.kind === 'ok' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
            {msg.text}
          </div>
        )}

        {showConfig && (
          <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Settings</h2>
            <p className="text-sm text-gray-500 mb-4">Stored only in your browser (localStorage). Nothing is sent to our servers.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">n8n Webhook URL</span>
                <input
                  type="url" value={cfg.webhookUrl}
                  onChange={(e) => setCfg({ ...cfg, webhookUrl: e.target.value })}
                  placeholder="https://your-n8n/webhook/content-engine"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Google Sheet ID</span>
                <input
                  type="text" value={cfg.sheetId}
                  onChange={(e) => setCfg({ ...cfg, sheetId: e.target.value })}
                  placeholder="1AbC…"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Sheet/tab name</span>
                <input
                  type="text" value={cfg.sheetName}
                  onChange={(e) => setCfg({ ...cfg, sheetName: e.target.value })}
                  placeholder="Sheet1"
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
                />
              </label>
            </div>
            <button onClick={saveConfig} className="mt-4 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700">
              Save settings
            </button>
          </section>
        )}

        {/* New run */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">New video</h2>
          <form onSubmit={submit} className="grid gap-4 sm:grid-cols-4">
            <label className="block sm:col-span-4">
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500">Topic / brief</span>
              <input
                type="text" value={form.topic}
                onChange={(e) => setForm({ ...form, topic: e.target.value })}
                placeholder="e.g. neon synthwave city drive at night"
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none"
              />
            </label>
            {([['duration', DURATIONS], ['aspect', ASPECTS], ['vibe', VIBES]] as const).map(([key, opts]) => (
              <label key={key} className="block">
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">{key}</span>
                <select
                  value={form[key]}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none capitalize"
                >
                  {opts.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            ))}
            <div className="sm:col-span-1 flex items-end">
              <button
                type="submit" disabled={submitting || !cfg.webhookUrl}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                Generate
              </button>
            </div>
          </form>
          {!cfg.webhookUrl && <p className="mt-3 text-sm text-amber-700">Set your n8n webhook URL in Settings to enable runs.</p>}
        </section>

        {/* Runs */}
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Runs</h2>
            <button onClick={refresh} disabled={loading || !cfg.sheetId} className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 disabled:opacity-50">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
          {runs.length === 0 ? (
            <p className="text-sm text-gray-500">{cfg.sheetId ? 'No runs yet.' : 'Configure a Google Sheet ID in Settings to see runs.'}</p>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {runs.map((r) => (
                <div key={r.run_id} className="rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                  {r.status === 'done' && r.video_url ? (
                    <video src={r.video_url} controls className="w-full aspect-video bg-black" />
                  ) : (
                    <div className="w-full aspect-video bg-gray-100 flex items-center justify-center">
                      <Film className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <StatusBadge status={r.status} />
                      <span className="text-[11px] text-gray-400 capitalize">{r.duration} · {r.aspect} · {r.vibe}</span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-2">{r.topic || '(no topic)'}</p>
                    {r.status === 'done' && r.video_url && (
                      <a href={r.video_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800">
                        Open video <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                    {(r.status === 'failed' || r.status === 'canceled') && r.video_url && (
                      <p className="text-xs text-red-600 line-clamp-2">{r.video_url}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
