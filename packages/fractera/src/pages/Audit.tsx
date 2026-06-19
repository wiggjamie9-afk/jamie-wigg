import { useState } from 'react';
import { AuditRow } from '../components/AuditRow.js';
import { mockAuditEvents } from '../lib/api.js';
import type { AuditEventType } from '../lib/types.js';

const EVENT_TYPES: AuditEventType[] = ['TOOL_CALLED', 'TOOL_RESOLVED', 'TOOL_FAILED', 'AGENT_STARTED', 'AGENT_COMPLETED', 'PROVIDER_SELECTED', 'PROVIDER_FALLBACK'];

const s = {
  page: { padding: 32 },
  h1: { color: '#f8fafc', fontSize: 24, fontWeight: 700, marginBottom: 4 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 24 },
  toolbar: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' as const },
  select: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', color: '#94a3b8', fontSize: 14, outline: 'none' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' },
  header: { display: 'grid', gridTemplateColumns: '100px 160px 120px 120px 80px', gap: 16, padding: '10px 20px', borderBottom: '1px solid #334155', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: 0.8 },
  empty: { padding: '40px 20px', textAlign: 'center' as const, color: '#475569' },
};

export function Audit() {
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const all = mockAuditEvents();
  const events = typeFilter === 'all' ? all : all.filter(e => e.type === typeFilter);

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Audit Log</h1>
      <p style={s.sub}>KHEPRA compliance trail — every tool call, agent run, and provider decision</p>

      <div style={s.toolbar}>
        <select style={s.select} value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All event types</option>
          {EVENT_TYPES.map(t => <option key={t} value={t}>{t.toLowerCase().replace(/_/g, ' ')}</option>)}
        </select>
      </div>

      <div style={s.card}>
        <div style={s.header}>
          <span>Time</span><span>Event</span><span>Tool / Agent</span><span>Provider</span><span>Duration</span>
        </div>
        {events.length === 0 ? (
          <div style={s.empty}>No events matching filter</div>
        ) : (
          events.map(e => <AuditRow key={e.id} event={e} />)
        )}
      </div>
    </div>
  );
}
