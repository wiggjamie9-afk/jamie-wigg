import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AttendanceStatus = 'present' | 'absent'

interface AttendanceRow {
  assignment_id: string
  status: AttendanceStatus
}

interface AssignmentWithAttendance {
  id: string
  member_id: string
  role_id: string
  members: { name: string } | null
  roles: { name: string } | null
  attendance: AttendanceRow | null
}

interface ServiceWithAttendance {
  id: string
  date: string
  assignments: AssignmentWithAttendance[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Formats an ISO date string as "Sunday, June 1" — parsed as local to avoid UTC off-by-one */
function formatServiceDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number)
  const d = new Date(year, month - 1, day)
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

/** Today's date as YYYY-MM-DD */
function todayISO(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/** Returns a summary badge label for a service's attendance state */
function attendanceSummary(assignments: AssignmentWithAttendance[]): string {
  if (assignments.length === 0) return ''
  const recorded = assignments.filter((a) => a.attendance !== null)
  if (recorded.length === 0) return 'Not recorded yet'
  const present = recorded.filter((a) => a.attendance?.status === 'present').length
  const absent = recorded.filter((a) => a.attendance?.status === 'absent').length
  const parts: string[] = []
  if (present > 0) parts.push(`${present} present`)
  if (absent > 0) parts.push(`${absent} absent`)
  const unrecorded = assignments.length - recorded.length
  if (unrecorded > 0) parts.push(`${unrecorded} unrecorded`)
  return parts.join(' · ')
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function SpinnerIcon({ label }: { label: string }) {
  return (
    <svg
      className="w-5 h-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
      aria-label={label}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
  )
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className ?? 'w-4 h-4'}
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
        clipRule="evenodd"
      />
    </svg>
  )
}

function ChevronDownIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      className={[
        'w-4 h-4 shrink-0 transition-transform duration-200',
        open ? 'rotate-180' : '',
      ].join(' ')}
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 7.5l5 5 5-5" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// MemberAttendanceRow
// ---------------------------------------------------------------------------

interface MemberAttendanceRowProps {
  assignment: AssignmentWithAttendance
  onToggle: (assignmentId: string, status: AttendanceStatus) => Promise<void>
  saving: boolean
  savedFlash: boolean
}

function MemberAttendanceRow({
  assignment,
  onToggle,
  saving,
  savedFlash,
}: MemberAttendanceRowProps) {
  const currentStatus = assignment.attendance?.status ?? null

  return (
    <li className="flex items-center justify-between gap-3 py-3 border-b border-gray-100 last:border-0">
      {/* Name + role */}
      <div className="min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {assignment.members?.name ?? 'Unknown member'}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {assignment.roles?.name ?? 'Unknown role'}
        </p>
      </div>

      {/* Present / Absent toggle */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Saved flash */}
        {savedFlash && (
          <span className="flex items-center gap-0.5 text-xs text-emerald-600 font-medium animate-pulse">
            <CheckIcon className="w-3.5 h-3.5" />
            Saved
          </span>
        )}

        {saving && (
          <span className="text-gray-400">
            <SpinnerIcon label="Saving…" />
          </span>
        )}

        {!saving && (
          <>
            <button
              type="button"
              onClick={() => onToggle(assignment.id, 'present')}
              aria-pressed={currentStatus === 'present'}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition',
                currentStatus === 'present'
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600',
              ].join(' ')}
            >
              Present
            </button>
            <button
              type="button"
              onClick={() => onToggle(assignment.id, 'absent')}
              aria-pressed={currentStatus === 'absent'}
              className={[
                'px-3 py-1.5 rounded-lg text-xs font-semibold border transition',
                currentStatus === 'absent'
                  ? 'bg-red-500 border-red-500 text-white shadow-sm'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-600',
              ].join(' ')}
            >
              Absent
            </button>
          </>
        )}
      </div>
    </li>
  )
}

// ---------------------------------------------------------------------------
// ServiceAttendanceCard
// ---------------------------------------------------------------------------

interface ServiceAttendanceCardProps {
  service: ServiceWithAttendance
  /** Called when an attendance upsert updates local state */
  onAttendanceChange: (assignmentId: string, status: AttendanceStatus) => void
}

function ServiceAttendanceCard({
  service,
  onAttendanceChange,
}: ServiceAttendanceCardProps) {
  const [expanded, setExpanded] = useState(false)
  // savingId: which assignment is currently being saved
  const [savingId, setSavingId] = useState<string | null>(null)
  // flashId: which assignment just got a "Saved" flash
  const [flashId, setFlashId] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)

  const summary = attendanceSummary(service.assignments)
  const hasAssignments = service.assignments.length > 0

  async function handleToggle(assignmentId: string, status: AttendanceStatus) {
    setSavingId(assignmentId)
    setSaveError(null)

    const { error } = await supabase.from('attendance').upsert(
      { assignment_id: assignmentId, status, recorded_at: new Date().toISOString() },
      { onConflict: 'assignment_id' },
    )

    setSavingId(null)

    if (error) {
      setSaveError(error.message)
      return
    }

    // Update parent state so summary badge refreshes
    onAttendanceChange(assignmentId, status)

    // Show brief "Saved" tick
    setFlashId(assignmentId)
    setTimeout(() => setFlashId(null), 1500)
  }

  return (
    <li className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
      {/* Card header — tap to expand */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-3 px-5 py-4 text-left hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition"
        aria-expanded={expanded}
        aria-controls={`service-panel-${service.id}`}
      >
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900">
            {formatServiceDate(service.date)}
          </p>
          {hasAssignments && summary && (
            <p
              className={[
                'mt-0.5 text-xs font-medium',
                summary === 'Not recorded yet'
                  ? 'text-amber-500'
                  : 'text-gray-400',
              ].join(' ')}
            >
              {summary}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-semibold text-indigo-600">
            {expanded ? 'Close' : 'Record Attendance'}
          </span>
          <ChevronDownIcon open={expanded} />
        </div>
      </button>

      {/* Expandable attendance panel */}
      {expanded && (
        <div
          id={`service-panel-${service.id}`}
          className="border-t border-gray-100 px-5 pb-4"
        >
          {saveError && (
            <div
              role="alert"
              className="mt-3 rounded-lg bg-red-50 border border-red-200 px-3 py-2 text-xs text-red-700"
            >
              {saveError}
            </div>
          )}

          {!hasAssignments ? (
            <p className="mt-4 text-sm text-gray-400 text-center py-4">
              No volunteers were scheduled for this service.
            </p>
          ) : (
            <ul
              aria-label={`Attendance for ${formatServiceDate(service.date)}`}
            >
              {service.assignments.map((a) => (
                <MemberAttendanceRow
                  key={a.id}
                  assignment={a}
                  onToggle={handleToggle}
                  saving={savingId === a.id}
                  savedFlash={flashId === a.id}
                />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  )
}

// ---------------------------------------------------------------------------
// Main page — Attendance
// ---------------------------------------------------------------------------

export default function Attendance() {
  const { orgId } = useAuth()

  const [services, setServices] = useState<ServiceWithAttendance[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchPastServices = useCallback(async () => {
    if (!orgId) return

    setFetchError(null)

    const today = todayISO()

    // Fetch past services with their assignments (including member/role names)
    // and any existing attendance rows per assignment.
    const { data, error } = await supabase
      .from('services')
      .select(
        `id, date,
         assignments(
           id,
           member_id,
           role_id,
           members(name),
           roles(name),
           attendance(assignment_id, status)
         )`,
      )
      .lt('date', today)
      .order('date', { ascending: false })

    if (error) {
      setFetchError(error.message)
      setLoading(false)
      return
    }

    // attendance is a one-to-one relation; Supabase returns it as an array or object.
    // Normalise it to a single row or null.
    const normalised: ServiceWithAttendance[] = (data ?? []).map((svc) => ({
      id: svc.id as string,
      date: svc.date as string,
      assignments: ((svc.assignments ?? []) as unknown as Array<{
        id: string
        member_id: string
        role_id: string
        members: { name: string } | null
        roles: { name: string } | null
        attendance:
          | AttendanceRow
          | AttendanceRow[]
          | null
      }>).map((a) => {
        // Supabase may return attendance as array (one-to-many hint) or object (one-to-one).
        let att: AttendanceRow | null = null
        if (Array.isArray(a.attendance)) {
          att = (a.attendance as AttendanceRow[])[0] ?? null
        } else {
          att = a.attendance as AttendanceRow | null
        }
        return {
          id: a.id,
          member_id: a.member_id,
          role_id: a.role_id,
          members: a.members as { name: string } | null,
          roles: a.roles as { name: string } | null,
          attendance: att,
        }
      }),
    }))

    setServices(normalised)
    setLoading(false)
  }, [orgId])

  useEffect(() => {
    fetchPastServices()
  }, [fetchPastServices])

  // ---------------------------------------------------------------------------
  // Local attendance update (avoids re-fetching the whole list on every save)
  // ---------------------------------------------------------------------------

  function handleAttendanceChange(assignmentId: string, status: AttendanceStatus) {
    setServices((prev) =>
      prev.map((svc) => ({
        ...svc,
        assignments: svc.assignments.map((a) =>
          a.id === assignmentId
            ? {
                ...a,
                attendance: {
                  assignment_id: assignmentId,
                  status,
                },
              }
            : a,
        ),
      })),
    )
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="py-6 space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Attendance</h1>
        <p className="mt-1 text-sm text-gray-500">
          Mark attendance for completed services.
        </p>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700"
        >
          {fetchError}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex justify-center py-16">
          <SpinnerIcon label="Loading past services" />
        </div>
      )}

      {/* Empty state */}
      {!loading && services.length === 0 && !fetchError && (
        <div className="rounded-2xl bg-white border border-dashed border-gray-200 px-6 py-14 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-6 h-6 text-indigo-400"
              aria-hidden="true"
            >
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
              <line x1="9" y1="12" x2="15" y2="12" />
              <line x1="9" y1="16" x2="13" y2="16" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">No past services yet</p>
          <p className="mt-1 text-xs text-gray-400">
            No past services yet — attendance will appear here after your first Sunday.
          </p>
        </div>
      )}

      {/* Services list */}
      {!loading && services.length > 0 && (
        <ul className="space-y-2" aria-label="Past services">
          {services.map((service) => (
            <ServiceAttendanceCard
              key={service.id}
              service={service}
              onAttendanceChange={handleAttendanceChange}
            />
          ))}
        </ul>
      )}
    </div>
  )
}
