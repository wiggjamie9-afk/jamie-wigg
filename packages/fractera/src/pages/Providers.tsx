import { ProviderCard } from '../components/ProviderCard.js';
import { mockProviderStatus } from '../lib/api.js';

const s = {
  page: { padding: 32 },
  h1: { color: '#f8fafc', fontSize: 24, fontWeight: 700, marginBottom: 4 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 32 },
  grid: { display: 'flex', gap: 20, flexWrap: 'wrap' as const, marginBottom: 40 },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '24px 28px', maxWidth: 600 },
  sectionTitle: { color: '#94a3b8', fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase' as const, marginBottom: 12 },
  chain: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' as const },
  chainItem: (color: string) => ({ padding: '6px 14px', borderRadius: 8, background: `${color}18`, border: `1px solid ${color}`, color, fontWeight: 600, fontSize: 13 }),
  arrow: { color: '#475569', fontSize: 18 },
  note: { color: '#64748b', fontSize: 13, marginTop: 16, lineHeight: 1.6 },
};

const COLORS: Record<string, string> = { claude: '#c084fc', gemini: '#60a5fa', groq: '#34d399', openmono: '#f59e0b' };

export function Providers() {
  const providers = mockProviderStatus();

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Providers</h1>
      <p style={s.sub}>9Router multi-provider LLM routing with automatic cost-based fallback</p>

      <div style={s.grid}>
        {providers.map(p => <ProviderCard key={p.name} provider={p} />)}
      </div>

      <div style={{ ...s.sectionTitle, marginBottom: 16 }}>Fallback Chain</div>
      <div style={s.card}>
        <div style={s.sectionTitle}>Active Routing Order</div>
        <div style={s.chain}>
          {['claude', 'gemini', 'groq', 'openmono'].map((name, i, arr) => (
            <>
              <span key={name} style={s.chainItem(COLORS[name] ?? '#94a3b8')}>{name}</span>
              {i < arr.length - 1 && <span key={`arrow-${i}`} style={s.arrow}>→</span>}
            </>
          ))}
        </div>
        <p style={s.note}>
          9Router tries providers in priority order. On rate-limit or error, it falls through to the next cheapest provider.
          OpenMono is the local fallback — no API key, no rate limits, works offline. Set <code>OPENMONO_URL</code> to enable it.
        </p>
      </div>
    </div>
  );
}
