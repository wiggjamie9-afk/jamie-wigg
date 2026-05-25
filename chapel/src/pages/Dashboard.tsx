import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Assignment {
  id: string
  member: { name: string }
  role: { name: string }
}

interface Service {
  id: string
  date: string
  assignments: Assignment[]
}

interface AttendanceSummary {
  present: number
  absent: number
  total: number
  recorded: boolean
}

interface PastService {
  id: string
  date: string
  attendance: AttendanceSummary
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function greeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate(iso: string): string {
  // iso is a date string like "2025-06-01"
  const [year, month, day] = iso.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Skeleton
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
      <div className="h-6 bg-gray-200 rounded w-2/3 mb-3" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-5/6" />
        <div className="h-4 bg-gray-100 rounded w-4/6" />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Section: This Sunday
// ---------------------------------------------------------------------------

function ThisSundaySection({ service }: { service: Service | null | undefined }) {
  if (service === undefined) {
    // still loading — skeleton rendered at parent level
    return null
  }

  if (service === null) {
    return (
      <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-3">
          This Sunday
        </h2>
        <p className="text-gray-500 text-sm mb-4">No service scheduled yet.</p>
        <Link
          to="/schedules"
          className="inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
        >
          Create Schedule
        </Link>
      </section>
    )
  }

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-amber-600 mb-1">
        This Sunday
      </h2>
      <p className="text-xl font-bold text-gray-900 mb-4">{formatDate(service.date)}</p>

      {service.assignments.length === 0 ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">No volunteers scheduled yet.</p>
          <Link
            to="/schedules"
            className="text-sm font-medium text-amber-600 hover:text-amber-700 underline underline-offset-2"
          >
            Schedule Now →
          </Link>
        </div>
      ) : (
        <ul className="space-y-2">
          {service.assignments.map((a) => (
            <li key={a.id} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full bg-amber-400" />
              <span>
                <span className="font-medium text-gray-800">{a.role.name}</span>
                <span className="text-gray-400"> — </span>
                <span className="text-gray-700">{a.member.name}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Section: Last Sunday
// ---------------------------------------------------------------------------

function LastSundaySection({ service }: { service: PastService | null | undefined }) {
  // undefined = still loading (handled by parent skeleton)
  // null = no past services → hide entirely
  if (service === undefined || service === null) return null

  return (
    <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-indigo-600 mb-1">
        Last Sunday
      </h2>
      <p className="text-base font-semibold text-gray-800 mb-4">{formatDate(service.date)}</p>

      {!service.attendance.recorded ? (
        <div>
          <p className="text-sm text-gray-500 mb-3">Attendance not recorded yet.</p>
          <Link
            to="/attendance"
            className="text-sm font-medium text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
          >
            Record Now →
          </Link>
        </div>
      ) : (
        <div className="flex gap-4">
          <div className="flex-1 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-green-700">{service.attendance.present}</p>
            <p className="text-xs font-medium text-green-600 mt-0.5">Present</p>
          </div>
          <div className="flex-1 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-center">
            <p className="text-2xl font-bold text-red-600">{service.attendance.absent}</p>
            <p className="text-xs font-medium text-red-500 mt-0.5">Absent</p>
          </div>
        </div>
      )}
    </section>
  )
}

// ---------------------------------------------------------------------------
// Section: Quick Actions
// ---------------------------------------------------------------------------

const QUICK_ACTIONS = [
  {
    label: 'Add Member',
    to: '/members',
    emoji: '👤',
    color: 'bg-blue-50 border-blue-100 text-blue-700',
  },
  {
    label: 'New Schedule',
    to: '/schedules',
    emoji: '📅',
    color: 'bg-amber-50 border-amber-100 text-amber-700',
  },
  {
    label: 'Manage Roles',
    to: '/roles',
    emoji: '🎭',
    color: 'bg-purple-50 border-purple-100 text-purple-700',
  },
]

function QuickActionsSection() {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
        Quick Actions
      </h2>
      <div className="grid grid-cols-3 gap-3">
        {QUICK_ACTIONS.map((action) => (
          <Link
            key={action.to}
            to={action.to}
            className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-center transition-transform active:scale-95 ${action.color}`}
          >
            <span className="text-2xl" role="img" aria-label={action.label}>
              {action.emoji}
            </span>
            <span className="text-xs font-semibold leading-tight">{action.label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}

// ---------------------------------------------------------------------------
// Main Dashboard
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const { orgName } = useAuth()

  // undefined = loading, null = not found, Service = loaded
  const [nextService, setNextService] = useState<Service | null | undefined>(undefined)
  const [pastService, setPastService] = useState<PastService | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)

      const today = new Date().toISOString().split('T')[0]

      // Fetch next upcoming service (date >= today)
      const { data: nextData } = await supabase
        .from('services')
        .select(`
          id,
          date,
          assignments (
            id,
            member:members ( name ),
            role:roles ( name )
          )
        `)
        .gte('date', today)
        .order('date', { ascending: true })
        .limit(1)
        .maybeSingle()

      // Fetch most recent past service (date < today)
      const { data: pastData } = await supabase
        .from('services')
        .select(`
          id,
          date,
          assignments (
            id,
            attendance (
              assignment_id,
              status
            )
          )
        `)
        .lt('date', today)
        .order('date', { ascending: false })
        .limit(1)
        .maybeSingle()

      if (cancelled) return

      // Process next service
      if (!nextData) {
        setNextService(null)
      } else {
        // Supabase returns nested arrays; cast carefully
        const rawAssignments = (nextData.assignments ?? []) as Array<{
          id: string
          member: { name: string } | null
          role: { name: string } | null
        }>

        const assignments: Assignment[] = rawAssignments
          .filter((a) => a.member && a.role)
          .map((a) => ({
            id: a.id,
            member: a.member as { name: string },
            role: a.role as { name: string },
          }))

        setNextService({ id: nextData.id, date: nextData.date, assignments })
      }

      // Process past service
      if (!pastData) {
        setPastService(null)
      } else {
        const rawAssignments = (pastData.assignments ?? []) as Array<{
          id: string
          attendance: { assignment_id: string; status: string } | null
        }>

        const hasAnyAttendance = rawAssignments.some((a) => a.attendance !== null)

        if (!hasAnyAttendance) {
          setPastService({
            id: pastData.id,
            date: pastData.date,
            attendance: { present: 0, absent: 0, total: rawAssignments.length, recorded: false },
          })
        } else {
          const present = rawAssignments.filter((a) => a.attendance?.status === 'present').length
          const absent = rawAssignments.filter((a) => a.attendance?.status === 'absent').length
          setPastService({
            id: pastData.id,
            date: pastData.date,
            attendance: {
              present,
              absent,
              total: rawAssignments.length,
              recorded: true,
            },
          })
        }
      }

      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const greet = greeting()
  const churchName = orgName ?? 'Church'

  return (
    <div className="max-w-lg mx-auto px-4 pb-24 pt-6 space-y-6">
      {/* Header */}
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-0.5">
          {greet}
        </p>
        <h1 className="text-2xl font-bold text-gray-900 leading-tight">{churchName}</h1>
      </header>

      {/* This Sunday */}
      {loading ? (
        <SkeletonCard />
      ) : (
        <ThisSundaySection service={nextService} />
      )}

      {/* Last Sunday — only shown if a past service exists */}
      {loading ? (
        <SkeletonCard />
      ) : pastService !== null ? (
        <LastSundaySection service={pastService} />
      ) : null}

      {/* Quick Actions */}
      <QuickActionsSection />
    </div>
  )
}
