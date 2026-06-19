import { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard.js';
import { AuditRow } from '../components/AuditRow.js';
import { ProviderCard } from '../components/ProviderCard.js';
import { mockRegistry, mockAuditEvents, mockProviderStatus } from '../lib/api.js';
import type { AuditEvent, ProviderStatus } from '../lib/types.js';

const s = {
  page: { padding: 32 },
  h1: { color: '#f8fafc', fontSize: 24, fontWeight: 700, marginBottom: 4 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 32 },
  stats: { display: 'flex', gap: 16, flexWrap: 'wrap' as const, marginBottom: 40 },
  section: { marginBottom: 32 },
  sectionTitle: { color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' },
  providerGrid: { display: 'flex', gap: 16, flexWrap: 'wrap' as const },
  tableHeader: { display: 'grid', gridTemplateColumns: '100px 160px 120px 120px 80px', gap: 16, padding: '10px 20px', borderBottom: '1px solid #334155', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: 0.8 },
};

export function Dashboard() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [providers, setProviders] = useState<ProviderStatus[]>([]);

  useEffect(() => {
    const registry = mockRegistry();
    const all = Object.values(registry.byId);
    setEvents(mockAuditEvents());
    setProviders(mockProviderStatus());
    void all;
  }, []);

  const registry = mockRegistry();
  const tools = Object.values(registry.byId);

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Dashboard</h1>
      <p style={s.sub}>Gary AI Platform — live tool and agent overview</p>

      <div style={s.stats}>
        <StatCard label="Total Tools" value={tools.length} sub={`${Object.keys(registry.categories).length} categories`} />
        <StatCard label="Enabled" value={tools.filter(t => t.enabled).length} accent="#22c55e" />
        <StatCard label="Last Sync" value="just now" sub={new Date(registry.lastSync).toLocaleString()} />
        <StatCard label="Recent Calls" value={events.length} sub="last 5 min" />
        <StatCard label="Providers" value={`${providers.filter(p => p.available).length}/${providers.length}`} sub="online" accent="#6366f1" />
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Provider Status</div>
        <div style={s.providerGrid}>
          {providers.map(p => <ProviderCard key={p.name} provider={p} />)}
        </div>
      </div>

      <div style={s.section}>
        <div style={s.sectionTitle}>Recent Audit Events</div>
        <div style={s.card}>
          <div style={s.tableHeader}>
            <span>Time</span><span>Event</span><span>Tool / Agent</span><span>Provider</span><span>Duration</span>
          </div>
          {events.map(e => <AuditRow key={e.id} event={e} />)}
        </div>
      </div>
    </div>
  );
}
