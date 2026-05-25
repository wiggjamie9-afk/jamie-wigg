import { useState, useEffect, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Role {
  id: string
  name: string
}

interface EligibleMember {
  id: string
  name: string
}

// Map: roleId -> list of members eligible for that role
type EligibleByRole = Record<string, EligibleMember[]>

// Map: roleId -> selected memberId (empty string = unassigned)
type AssignmentMap = Record<string, string>

export interface ScheduleEditorProps {
  /** null = creating a new service */
  serviceId: string | null
  /** ISO date string e.g. "2025-06-01", or null when creating */
  serviceDate: string | null
  onSaved: (serviceId: string) => void
  onCancel: () => void
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns the YYYY-MM-DD string for the next upcoming Sunday (or today if today IS Sunday). */
function nextSunday(): string {
  const d = new Date()
  const day = d.getDay() // 0 = Sunday
  const daysUntilSunday = day === 0 ? 0 : 7 - day
  d.setDate(d.getDate() + daysUntilSunday)
  return d.toISOString().slice(0, 10)
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function ScheduleEditor({
  serviceId,
  serviceDate,
  onSaved,
  onCancel,
}: ScheduleEditorProps) {
  const { orgId } = useAuth()

  const isEditing = serviceId !== null

  const [date, setDate] = useState<string>(serviceDate ?? nextSunday())
  const [roles, setRoles] = useState<Role[]>([])
  const [eligibleByRole, setEligibleByRole] = useState<EligibleByRole>({})
  const [assignments, setAssignments] = useState<AssignmentMap>({})
  const [dataLoading, setDataLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ---------------------------------------------------------------------------
  // Fetch roles + eligible members + existing assignments (if editing)
  // ---------------------------------------------------------------------------

  useEffect(() => {
    if (!orgId) return

    setDataLoading(true)
    setSubmitError(null)

    async function loadData() {
      // 1. Fetch all roles for the org
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('id, name')
        .order('name', { ascending: true })

      if (rolesError || !rolesData) {
        setSubmitError('Failed to load roles.')
        setDataLoading(false)
        return
      }

      const fetchedRoles = rolesData as Role[]
      setRoles(fetchedRoles)

      // 2. Fetch all members + their eligible roles via member_roles join
      const { data: memberRolesData, error: memberRolesError } = await supabase
        .from('member_roles')
        .select('role_id, members(id, name)')

      if (memberRolesError || !memberRolesData) {
        setSubmitError('Failed to load member roles.')
        setDataLoading(false)
        return
      }

      // Build eligibleByRole map
      const byRole: EligibleByRole = {}
      for (const row of memberRolesData as Array<{
        role_id: string
        members: { id: string; name: string } | null
      }>) {
        if (!row.members) continue
        if (!byRole[row.role_id]) byRole[row.role_id] = []
        // Avoid duplicates
        if (!byRole[row.role_id].some((m) => m.id === row.members!.id)) {
          byRole[row.role_id].push({ id: row.members.id, name: row.members.name })
        }
      }
      // Sort each list by name
      for (const roleId of Object.keys(byRole)) {
        byRole[roleId].sort((a, b) => a.name.localeCompare(b.name))
      }
      setEligibleByRole(byRole)

      // 3. If editing, load existing assignments for this service
      if (isEditing && serviceId) {
        const { data: existingAssignments, error: assignError } = await supabase
          .from('assignments')
          .select('role_id, member_id')
          .eq('service_id', serviceId)

        if (!assignError && existingAssignments) {
          const map: AssignmentMap = {}
          for (const a of existingAssignments as Array<{
            role_id: string
            member_id: string
          }>) {
            map[a.role_id] = a.member_id
          }
          setAssignments(map)
        }
      }

      setDataLoading(false)
    }

    loadData()
  }, [orgId, isEditing, serviceId])

  // ---------------------------------------------------------------------------
  // Save handler
  // ---------------------------------------------------------------------------

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!orgId || saving) return

    setSaving(true)
    setSubmitError(null)

    try {
      let resolvedServiceId = serviceId

      if (!isEditing) {
        // INSERT new service
        const { data: newService, error: serviceError } = await supabase
          .from('services')
          .insert({ org_id: orgId, date })
          .select('id')
          .single()

        if (serviceError || !newService) {
          setSubmitError(serviceError?.message ?? 'Failed to create service.')
          setSaving(false)
          return
        }

        resolvedServiceId = (newService as { id: string }).id
      } else {
        // UPDATE service date
        const { error: updateError } = await supabase
          .from('services')
          .update({ date })
          .eq('id', serviceId)

        if (updateError) {
          setSubmitError(updateError.message)
          setSaving(false)
          return
        }

        // DELETE all existing assignments so we can re-insert
        const { error: deleteError } = await supabase
          .from('assignments')
          .delete()
          .eq('service_id', serviceId)

        if (deleteError) {
          setSubmitError(deleteError.message)
          setSaving(false)
          return
        }
      }

      // INSERT assignments for roles that have a member selected
      const assignmentRows = Object.entries(assignments)
        .filter(([, memberId]) => memberId !== '')
        .map(([roleId, memberId]) => ({
          service_id: resolvedServiceId!,
          member_id: memberId,
          role_id: roleId,
        }))

      if (assignmentRows.length > 0) {
        const { error: insertError } = await supabase
          .from('assignments')
          .insert(assignmentRows)

        if (insertError) {
          setSubmitError(insertError.message)
          setSaving(false)
          return
        }
      }

      onSaved(resolvedServiceId!)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'An unexpected error occurred.')
      setSaving(false)
    }
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (dataLoading) {
    return (
      <div className="flex items-center gap-2 py-6 text-sm text-gray-400">
        <SpinnerIcon label="Loading schedule editor" />
        <span>Loading…</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      {/* Date picker */}
      <div>
        <label
          htmlFor="service-date"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Service date
        </label>
        <input
          id="service-date"
          type="date"
          value={date}
          min={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setDate(e.target.value)}
          disabled={saving}
          required
          className={[
            'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            'disabled:opacity-50 transition',
          ].join(' ')}
        />
      </div>

      {/* Role assignments */}
      {roles.length === 0 ? (
        <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          No roles defined yet.{' '}
          <a href="/roles" className="font-semibold underline underline-offset-2">
            Add roles first.
          </a>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Assign members to roles</p>
          {roles.map((role) => {
            const eligible = eligibleByRole[role.id] ?? []
            const selectedMemberId = assignments[role.id] ?? ''

            return (
              <div key={role.id}>
                <label
                  htmlFor={`role-${role.id}`}
                  className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1"
                >
                  {role.name}
                </label>
                <select
                  id={`role-${role.id}`}
                  value={selectedMemberId}
                  onChange={(e) =>
                    setAssignments((prev) => ({ ...prev, [role.id]: e.target.value }))
                  }
                  disabled={saving}
                  className={[
                    'w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 shadow-sm',
                    'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
                    'disabled:opacity-50 transition',
                  ].join(' ')}
                >
                  <option value="">— Unassigned —</option>
                  {eligible.length === 0 ? (
                    <option disabled>No eligible members</option>
                  ) : (
                    eligible.map((member) => (
                      <option key={member.id} value={member.id}>
                        {member.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
            )
          })}
        </div>
      )}

      {/* Submit error */}
      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={saving || roles.length === 0}
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {saving ? (
            <>
              <svg
                className="w-4 h-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
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
              Saving…
            </>
          ) : isEditing ? (
            'Save changes'
          ) : (
            'Create schedule'
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
