import type { ToolEntry } from '../lib/types.js';
import { authBadgeColor } from '../lib/utils.js';

interface Props {
  tool: ToolEntry;
}

const s = {
  row: { display: 'grid', gridTemplateColumns: '200px 120px 1fr 80px 80px', alignItems: 'center', gap: 16, padding: '14px 20px', borderBottom: '1px solid #1e293b', fontSize: 14 },
  name: { color: '#f8fafc', fontWeight: 600 },
  id: { color: '#64748b', fontSize: 12, fontFamily: 'monospace', marginTop: 2 },
  cat: { color: '#6366f1', fontSize: 12, fontWeight: 600 },
  desc: { color: '#94a3b8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const },
  badge: (color: string) => ({ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, color, border: `1px solid ${color}`, background: `${color}18` }),
  status: (enabled: boolean) => ({ width: 8, height: 8, borderRadius: '50%', background: enabled ? '#22c55e' : '#475569', display: 'inline-block' }),
};

export function ToolRow({ tool }: Props) {
  return (
    <div style={s.row}>
      <div>
        <div style={s.name}>{tool.name}</div>
        <div style={s.id}>{tool.id}</div>
      </div>
      <div style={s.cat}>{tool.category}</div>
      <div style={s.desc}>{tool.description}</div>
      <div>
        <span style={s.badge(authBadgeColor(tool.authType))}>{tool.authType}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={s.status(tool.enabled)} />
        <span style={{ color: tool.enabled ? '#22c55e' : '#64748b', fontSize: 12 }}>
          {tool.enabled ? 'On' : 'Off'}
        </span>
      </div>
    </div>
  );
}
