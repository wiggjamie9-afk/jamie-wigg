import type { ProviderStatus } from '../lib/types.js';
import { formatRelativeTime } from '../lib/utils.js';

interface Props {
  provider: ProviderStatus;
}

const PROVIDER_COLORS: Record<string, string> = {
  claude: '#c084fc',
  gemini: '#60a5fa',
  groq: '#34d399',
  openmono: '#f59e0b',
};

const s = {
  card: (available: boolean) => ({
    background: '#1e293b',
    border: `1px solid ${available ? '#334155' : '#ef444440'}`,
    borderRadius: 12,
    padding: '20px 24px',
    minWidth: 200,
  }),
  header: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  name: (color: string) => ({ color, fontWeight: 700, fontSize: 16, textTransform: 'capitalize' as const }),
  dot: (available: boolean) => ({ width: 10, height: 10, borderRadius: '50%', background: available ? '#22c55e' : '#ef4444' }),
  latency: { color: '#f8fafc', fontSize: 28, fontWeight: 700 },
  latencyUnit: { color: '#64748b', fontSize: 14, marginLeft: 4 },
  meta: { color: '#64748b', fontSize: 12, marginTop: 8 },
  error: { color: '#f87171', fontSize: 12, marginTop: 6 },
};

export function ProviderCard({ provider }: Props) {
  const color = PROVIDER_COLORS[provider.name] ?? '#94a3b8';
  return (
    <div style={s.card(provider.available)}>
      <div style={s.header}>
        <span style={s.name(color)}>{provider.name}</span>
        <span style={s.dot(provider.available)} />
      </div>
      {provider.available && provider.latency !== undefined ? (
        <>
          <span style={s.latency}>{provider.latency}</span>
          <span style={s.latencyUnit}>ms</span>
        </>
      ) : (
        <span style={{ color: '#ef4444', fontWeight: 600 }}>Offline</span>
      )}
      <div style={s.meta}>Checked {formatRelativeTime(provider.lastChecked)}</div>
      {provider.error && <div style={s.error}>{provider.error}</div>}
    </div>
  );
}
