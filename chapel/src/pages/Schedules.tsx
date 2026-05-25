import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import ScheduleEditor from '../components/ScheduleEditor'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface AssignmentRow {
  role_id: string
  member_id: string
  roles: { name: string } | null
  members: { name: string } | null
}

interface Service {
  id: string
  date: string
  assignments: AssignmentRow[]
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Formats an ISO date string as "Sunday, June 1" */
function formatServiceDate(isoDate: string): string {
  // Parse as local date to avoid UTC off-by-one issues
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
  return new Date().toISOString().slice(0, 10)
}

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

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function AssignmentList({ assignments }: { assignments: AssignmentRow[] }) {
  if (assignments.length === 0) {
    return (
      <p className="text-xs text-gray-400 mt-1">No assignments yet.</p>
    )
  }

  // Sort by role name
  const sorted = [...assignments].sort((a, b) =>
    (a.roles?.name ?? '').localeCompare(b.roles?.name ?? ''),
  )

  return (
    <ul className="mt-2 space-y-1">
      {sorted.map((a) => (
        <li key={`${a.role_id}-${a.member_id}`} className="flex items-center gap-1.5 text-xs">
          <span className="font-medium text-gray-600">{a.roles?.name ?? 'Unknown role'}</span>
          <span className="text-gray-400">–</span>
          <span className="text-gray-800">{a.members?.name ?? 'Unknown member'}</span>
        </li>
      ))}
    </ul>
  )
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function Schedules() {
  const { orgId } = useAuth()

  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // Editor state
  // null serviceId + null serviceDate = "create new" panel is open
  // string serviceId = editing existing service
  const [editorOpen, setEditorOpen] = useState(false)
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null)
  const [editingServiceDate, setEditingServiceDate] = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchServices = useCallback(async () => {
    if (!orgId) return

    setFetchError(null)

    const { data, error } = await supabase
      .from('services')
      .select(
        `id, date, assignments(role_id, member_id, roles(name), members(name))`,
      )
      .order('date', { ascending: true })

    if (error) {
      setFetchError(error.message)
      setLoading(false)
      return
    }

    setServices((data ?? []) as unknown as Service[])
    setLoading(false)
  }, [orgId])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const today = todayISO()
  const upcoming = services.filter((s) => s.date >= today)
  const past = services.filter((s) => s.date < today)

  // ---------------------------------------------------------------------------
  // Editor handlers
  // ---------------------------------------------------------------------------

  function openNewEditor() {
    setEditingServiceId(null)
    setEditingServiceDate(null)
    setEditorOpen(true)
  }

  function openEditEditor(service: Service) {
    setEditingServiceId(service.id)
    setEditingServiceDate(service.date)
    setEditorOpen(true)
  }

  function closeEditor() {
    setEditorOpen(false)
    setEditingServiceId(null)
    setEditingServiceDate(null)
  }

  function handleSaved(_savedId: string) {
    closeEditor()
    // Re-fetch to get fresh data including new assignments
    setLoading(true)
    fetchServices()
  }

  // ---------------------------------------------------------------------------
  // Render helpers
  // ---------------------------------------------------------------------------

  function renderServiceCard(service: Service, editable: boolean) {
    const isEditing = editorOpen && editingServiceId === service.id

    if (isEditing) {
      return (
        <li
          key={service.id}
          className="rounded-2xl bg-white border border-indigo-200 shadow-sm px-5 py-5"
        >
          <h3 className="text-sm font-semibold text-gray-700 mb-4">
            Edit — {formatServiceDate(service.date)}
          </h3>
          <ScheduleEditor
            serviceId={service.id}
            serviceDate={service.date}
            onSaved={handleSaved}
            onCancel={closeEditor}
          />
        </li>
      )
    }

    return (
      <li
        key={service.id}
        className={[
          'rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden',
          editable ? 'cursor-pointer hover:border-indigo-200 hover:shadow-md transition' : '',
        ].join(' ')}
        onClick={editable ? () => openEditEditor(service) : undefined}
        role={editable ? 'button' : undefined}
        tabIndex={editable ? 0 : undefined}
        onKeyDown={
          editable
            ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  openEditEditor(service)
                }
              }
            : undefined
        }
        aria-label={
          editable ? `Edit schedule for ${formatServiceDate(service.date)}` : undefined
        }
      >
        <div className="px-5 py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {formatServiceDate(service.date)}
            </p>
            {editable && (
              <span className="shrink-0 text-xs font-medium text-indigo-500">
                Tap to edit
              </span>
            )}
          </div>
          <AssignmentList assignments={service.assignments} />
        </div>
      </li>
    )
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="py-6 space-y-8">
      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Schedules</h1>
          <p className="mt-1 text-sm text-gray-500">
            Plan Sunday services and assign volunteers to roles.
          </p>
        </div>
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

      {/* "New Schedule" button / inline editor for creating */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        {editorOpen && editingServiceId === null ? (
          <div className="px-5 py-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">New schedule</h2>
            <ScheduleEditor
              serviceId={null}
              serviceDate={null}
              onSaved={handleSaved}
              onCancel={closeEditor}
            />
          </div>
        ) : (
          <button
            type="button"
            onClick={openNewEditor}
            className="w-full flex items-center gap-2 px-5 py-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition"
          >
            <PlusIcon />
            New Schedule
          </button>
        )}
      </div>

      {/* Upcoming section */}
      <section aria-labelledby="upcoming-heading">
        <h2
          id="upcoming-heading"
          className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3"
        >
          Upcoming
        </h2>

        {loading ? (
          <div className="flex justify-center py-10">
            <SpinnerIcon label="Loading schedules" />
          </div>
        ) : upcoming.length === 0 ? (
          <div className="rounded-2xl bg-white border border-dashed border-gray-200 px-6 py-10 text-center">
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
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">
              No upcoming services scheduled
            </p>
            <p className="mt-1 text-xs text-gray-400">
              No upcoming services scheduled — create your first one.
            </p>
          </div>
        ) : (
          <ul className="space-y-2" aria-label="Upcoming services">
            {upcoming.map((service) => renderServiceCard(service, true))}
          </ul>
        )}
      </section>

      {/* Past section */}
      {!loading && past.length > 0 && (
        <section aria-labelledby="past-heading">
          <h2
            id="past-heading"
            className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3"
          >
            Past
          </h2>
          <ul className="space-y-2" aria-label="Past services">
            {[...past].reverse().map((service) => renderServiceCard(service, false))}
          </ul>
        </section>
      )}
    </div>
  )
}
