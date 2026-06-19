import { NavLink } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '⬛' },
  { to: '/tools', label: 'Tools', icon: '🔧' },
  { to: '/audit', label: 'Audit Log', icon: '📋' },
  { to: '/providers', label: 'Providers', icon: '🔌' },
];

const styles = {
  sidebar: { width: 220, minHeight: '100vh', background: '#0f172a', borderRight: '1px solid #1e293b', padding: '24px 0', flexShrink: 0 },
  logo: { padding: '0 20px 24px', borderBottom: '1px solid #1e293b', marginBottom: 12 },
  logoTitle: { color: '#f8fafc', fontWeight: 700, fontSize: 20, letterSpacing: -0.5 },
  logoSub: { color: '#64748b', fontSize: 11, marginTop: 2 },
  nav: { display: 'flex' as const, flexDirection: 'column' as const, gap: 2 },
  link: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 20px', color: '#94a3b8', textDecoration: 'none', fontSize: 14, fontWeight: 500, borderRadius: 0, transition: 'background 0.15s, color 0.15s' },
  activeLink: { background: '#1e293b', color: '#f8fafc', borderLeft: '3px solid #6366f1' },
};

export function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <div style={styles.logoTitle}>Fractera</div>
        <div style={styles.logoSub}>Gary AI Platform</div>
      </div>
      <nav style={styles.nav}>
        {NAV.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({ ...styles.link, ...(isActive ? styles.activeLink : {}) })}
          >
            <span>{icon}</span>
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
