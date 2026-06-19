import type { AuditEvent } from '../lib/types.js';
import { formatRelativeTime, formatDuration, eventTypeColor, eventTypeLabel } from '../lib/utils.js';

interface Props {
  event: AuditEvent;
}

const s = {
  row: { display: 'grid', gridTemplateColumns: '100px 160px 120px 120px 80px', alignItems: 'center', gap: 16, padding: '12px 20px', borderBottom: '1px solid #1e293b', fontSize: 13 },
  time: { color: '#64748b', fontFamily: 'monospace', fontSize: 12 },
  typeBadge: (color: string) => ({ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, color, background: `${color}20`, border: `1px solid ${color}` }),
  tool: { color: '#94a3b8', fontFamily: 'monospace', fontSize: 12 },
  provider: { color: '#6366f1', fontSize: 12 },
  duration: { color: '#64748b', fontFamily: 'monospace' },
  error: { color: '#ef4444', fontSize: 11, marginTop: 2 },
};

export function AuditRow({ event }: Props) {
  const color = eventTypeColor(event.type);
  return (
    <div style={s.row}>
      <div style={s.time}>{formatRelativeTime(event.timestamp)}</div>
      <div>
        <span style={s.typeBadge(color)}>{eventTypeLabel(event.type)}</span>
        {event.error && <div style={s.error}>{event.error}</div>}
      </div>
      <div style={s.tool}>{event.toolId ?? event.agentId ?? '—'}</div>
      <div style={s.provider}>{event.provider ?? '—'}</div>
      <div style={s.duration}>{formatDuration(event.duration)}</div>
    </div>
  );
}
