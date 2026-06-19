interface Props {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}

const s = {
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, padding: '20px 24px', minWidth: 160 },
  label: { color: '#64748b', fontSize: 12, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: 0.8, marginBottom: 8 },
  value: { color: '#f8fafc', fontSize: 32, fontWeight: 700, lineHeight: 1 },
  sub: { color: '#94a3b8', fontSize: 12, marginTop: 6 },
};

export function StatCard({ label, value, sub, accent }: Props) {
  return (
    <div style={s.card}>
      <div style={s.label}>{label}</div>
      <div style={{ ...s.value, color: accent ?? '#f8fafc' }}>{value}</div>
      {sub && <div style={s.sub}>{sub}</div>}
    </div>
  );
}
