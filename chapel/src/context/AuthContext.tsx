import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { User, Session } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  user: User | null
  session: Session | null
  orgId: string | null
  orgName: string | null
  loading: boolean
  /** Call after creating an org so the context re-resolves the membership. */
  refreshOrg: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

async function resolveOrg(userId: string): Promise<{ orgId: string; orgName: string } | null> {
  const { data, error } = await supabase
    .from('org_members')
    .select('org_id, orgs(id, name)')
    .eq('user_id', userId)
    .limit(1)
    .single()

  if (error || !data) return null

  // Supabase returns the joined row as an object or array depending on the cardinality hint.
  // `orgs` is a many-to-one FK so it comes back as a single object.
  const org = data.orgs as { id: string; name: string } | null
  if (!org) return null

  return { orgId: org.id, orgName: org.name }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [orgId, setOrgId] = useState<string | null>(null)
  const [orgName, setOrgName] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const handleSession = useCallback(async (newSession: Session | null) => {
    setSession(newSession)
    setUser(newSession?.user ?? null)

    if (newSession?.user) {
      const org = await resolveOrg(newSession.user.id)
      setOrgId(org?.orgId ?? null)
      setOrgName(org?.orgName ?? null)
    } else {
      setOrgId(null)
      setOrgName(null)
    }
  }, [])

  const refreshOrg = useCallback(async () => {
    if (!user) return
    const org = await resolveOrg(user.id)
    setOrgId(org?.orgId ?? null)
    setOrgName(org?.orgName ?? null)
  }, [user])

  useEffect(() => {
    // Initialise from the persisted session (avoids flicker on reload)
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      handleSession(s).finally(() => setLoading(false))
    })

    // Keep in sync with auth state changes (magic-link callback, sign-out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      handleSession(s)
    })

    return () => subscription.unsubscribe()
  }, [handleSession])

  return (
    <AuthContext.Provider value={{ user, session, orgId, orgName, loading, refreshOrg }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used inside <AuthProvider>')
  }
  return ctx
}
