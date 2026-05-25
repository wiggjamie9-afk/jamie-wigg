import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Roles from './pages/Roles'
import Members from './pages/Members'
import Schedules from './pages/Schedules'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'
import Layout from './components/Layout'

// ---------------------------------------------------------------------------
// Auth guards
// ---------------------------------------------------------------------------

/** Guards routes that require an authenticated session + resolved org. */
function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, orgId, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-sm text-gray-400">Loading…</span>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!orgId) return <Navigate to="/onboarding" replace />

  return <>{children}</>
}

/** Routes that should redirect away once the user is fully authenticated. */
function RequireGuest({ children }: { children: React.ReactNode }) {
  const { user, orgId, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <span className="text-sm text-gray-400">Loading…</span>
      </div>
    )
  }

  if (user && orgId) return <Navigate to="/" replace />

  return <>{children}</>
}

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------

function AppRoutes() {
  return (
    <Routes>
      {/* Guest-only routes */}
      <Route
        path="/login"
        element={
          <RequireGuest>
            <Login />
          </RequireGuest>
        }
      />
      <Route
        path="/onboarding"
        element={<Onboarding />}
      />

      {/* Authenticated routes — all wrapped in Layout */}
      <Route
        path="/"
        element={
          <RequireAuth>
            <Layout>
              <Dashboard />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/members"
        element={
          <RequireAuth>
            <Layout>
              <Members />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/schedules"
        element={
          <RequireAuth>
            <Layout>
              <Schedules />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/attendance"
        element={
          <RequireAuth>
            <Layout>
              <Attendance />
            </Layout>
          </RequireAuth>
        }
      />
      <Route
        path="/roles"
        element={
          <RequireAuth>
            <Layout>
              <Roles />
            </Layout>
          </RequireAuth>
        }
      />

      {/* Fallback — redirect any unknown path to dashboard */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
