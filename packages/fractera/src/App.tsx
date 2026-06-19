import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar.js';
import { Dashboard } from './pages/Dashboard.js';
import { Tools } from './pages/Tools.js';
import { Audit } from './pages/Audit.js';
import { Providers } from './pages/Providers.js';

const s = {
  root: { display: 'flex', minHeight: '100vh', background: '#0f172a', color: '#f8fafc' },
  main: { flex: 1, overflow: 'auto' },
};

export function App() {
  return (
    <BrowserRouter>
      <div style={s.root}>
        <Sidebar />
        <main style={s.main}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/providers" element={<Providers />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
