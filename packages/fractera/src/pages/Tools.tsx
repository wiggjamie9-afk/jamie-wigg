import { useState } from 'react';
import { ToolRow } from '../components/ToolRow.js';
import { mockRegistry } from '../lib/api.js';

const s = {
  page: { padding: 32 },
  h1: { color: '#f8fafc', fontSize: 24, fontWeight: 700, marginBottom: 4 },
  sub: { color: '#64748b', fontSize: 14, marginBottom: 24 },
  toolbar: { display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center' },
  search: { flex: 1, background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 14px', color: '#f8fafc', fontSize: 14, outline: 'none' },
  select: { background: '#1e293b', border: '1px solid #334155', borderRadius: 8, padding: '8px 12px', color: '#94a3b8', fontSize: 14, outline: 'none' },
  card: { background: '#1e293b', border: '1px solid #334155', borderRadius: 12, overflow: 'hidden' },
  header: { display: 'grid', gridTemplateColumns: '200px 120px 1fr 80px 80px', gap: 16, padding: '10px 20px', borderBottom: '1px solid #334155', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: 0.8 },
  count: { color: '#64748b', fontSize: 13 },
};

export function Tools() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const registry = mockRegistry();
  const categories = Object.keys(registry.categories).sort();
  let tools = Object.values(registry.byId);

  if (category !== 'all') {
    tools = tools.filter(t => t.category === category);
  }
  if (search.trim()) {
    const q = search.toLowerCase();
    tools = tools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q) || t.id.includes(q));
  }

  return (
    <div style={s.page}>
      <h1 style={s.h1}>Tools</h1>
      <p style={s.sub}>{Object.keys(registry.byId).length} tools synced from public-apis</p>

      <div style={s.toolbar}>
        <input
          style={s.search}
          placeholder="Search tools..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select style={s.select} value={category} onChange={e => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <span style={s.count}>{tools.length} results</span>
      </div>

      <div style={s.card}>
        <div style={s.header}>
          <span>Tool</span><span>Category</span><span>Description</span><span>Auth</span><span>Status</span>
        </div>
        {tools.map(t => <ToolRow key={t.id} tool={t} />)}
      </div>
    </div>
  );
}
