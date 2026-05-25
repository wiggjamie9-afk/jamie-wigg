import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import MemberForm from '../components/MemberForm'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface MemberRole {
  role_id: string
  roles: { name: string } | null
}

interface Member {
  id: string
  name: string
  email: string
  member_roles: MemberRole[]
}

interface OrgInfo {
  member_count: number
  stripe_subscription_status: string | null
}

// ---------------------------------------------------------------------------
// Icon helpers
// ---------------------------------------------------------------------------

function PencilIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden="true"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  )
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
// Free tier constants
// ---------------------------------------------------------------------------

const FREE_TIER_LIMIT = 30
const PAID_TIER_LIMIT = 150

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Members() {
  const { orgId } = useAuth()

  const [members, setMembers] = useState<Member[]>([])
  const [orgInfo, setOrgInfo] = useState<OrgInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)

  // "Add member" form panel visibility
  const [showAddForm, setShowAddForm] = useState(false)

  // Which member row is currently in edit mode (by id)
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null)

  // Deletion in-flight
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Free-tier upgrade prompt
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false)

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  const fetchData = useCallback(async () => {
    if (!orgId) return

    setFetchError(null)

    // Fetch members + their role names in a single query via join
    const [membersResult, orgResult] = await Promise.all([
      supabase
        .from('members')
        .select('id, name, email, member_roles(role_id, roles(name))')
        .order('name', { ascending: true }),
      supabase
        .from('orgs')
        .select('member_count, stripe_subscription_status')
        .eq('id', orgId)
        .limit(1)
        .single(),
    ])

    if (membersResult.error) {
      setFetchError(membersResult.error.message)
    } else {
      setMembers((membersResult.data ?? []) as unknown as Member[])
    }

    if (!orgResult.error && orgResult.data) {
      setOrgInfo(orgResult.data as OrgInfo)
    }

    setLoading(false)
  }, [orgId])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // ---------------------------------------------------------------------------
  // Derived state
  // ---------------------------------------------------------------------------

  const isFreeTier =
    orgInfo == null ||
    orgInfo.stripe_subscription_status == null ||
    orgInfo.stripe_subscription_status !== 'active'

  const tierLimit = isFreeTier ? FREE_TIER_LIMIT : PAID_TIER_LIMIT
  const memberCount = orgInfo?.member_count ?? members.length

  function roleNamesForMember(member: Member): string {
    return member.member_roles
      .map((mr) => mr.roles?.name)
      .filter(Boolean)
      .sort()
      .join(', ')
  }

  function initialValuesForEdit(member: Member) {
    return {
      id: member.id,
      name: member.name,
      email: member.email,
      roleIds: member.member_roles.map((mr) => mr.role_id),
    }
  }

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  function handleMemberAdded() {
    setShowAddForm(false)
    setShowUpgradePrompt(false)
    fetchData()
  }

  function handleMemberEdited() {
    setEditingMemberId(null)
    fetchData()
  }

  function handleLimitReached() {
    setShowAddForm(false)
    setShowUpgradePrompt(true)
    // Scroll up so the banner is visible
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleDelete(member: Member) {
    if (deletingId) return
    setDeletingId(member.id)
    setFetchError(null)

    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', member.id)

    setDeletingId(null)

    if (error) {
      setFetchError(`Could not delete "${member.name}": ${error.message}`)
      return
    }

    // Optimistic remove then re-fetch to keep member_count in sync
    setMembers((prev) => prev.filter((m) => m.id !== member.id))
    fetchData()
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="py-6 space-y-6">
      {/* Page header + count pill */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Members</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your church volunteer directory.
          </p>
        </div>

        {/* Member count badge */}
        {!loading && orgInfo && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600">
            {memberCount} / {tierLimit} members
          </span>
        )}
      </div>

      {/* Upgrade prompt banner */}
      {showUpgradePrompt && (
        <div
          role="alert"
          className="rounded-2xl bg-amber-50 border border-amber-200 px-5 py-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="text-sm font-semibold text-amber-900">
              You've reached the free limit of {FREE_TIER_LIMIT} members.
            </p>
            <p className="mt-0.5 text-sm text-amber-700">
              Upgrade to Chapel Pro for $12/month to add up to {PAID_TIER_LIMIT} members.
            </p>
          </div>
          <a
            href="#"
            className="shrink-0 inline-flex items-center justify-center rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-700 active:bg-amber-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition"
          >
            Upgrade to Pro
          </a>
        </div>
      )}

      {/* Add member panel */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden">
        {!showAddForm ? (
          <button
            type="button"
            onClick={() => {
              setShowUpgradePrompt(false)
              setShowAddForm(true)
            }}
            className="w-full flex items-center gap-2 px-5 py-4 text-sm font-semibold text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 transition"
          >
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
            Add Member
          </button>
        ) : (
          <div className="px-5 py-5">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">New member</h2>
            <MemberForm
              onMemberAdded={handleMemberAdded}
              onLimitReached={handleLimitReached}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}
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

      {/* Member list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <SpinnerIcon label="Loading members" />
        </div>
      ) : members.length === 0 ? (
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
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">No members yet</p>
          <p className="mt-1 text-xs text-gray-400">
            No members yet — add your first volunteer.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" aria-label="Church members">
          {members.map((member) => {
            const isEditing = editingMemberId === member.id
            const roleNames = roleNamesForMember(member)

            return (
              <li
                key={member.id}
                className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden"
              >
                {isEditing ? (
                  /* ---- Edit mode ---- */
                  <div className="px-5 py-5">
                    <h2 className="text-sm font-semibold text-gray-700 mb-4">
                      Edit member
                    </h2>
                    <MemberForm
                      initialValues={initialValuesForEdit(member)}
                      submitLabel="Save changes"
                      onMemberAdded={handleMemberEdited}
                      onLimitReached={handleLimitReached}
                      onCancel={() => setEditingMemberId(null)}
                    />
                  </div>
                ) : (
                  /* ---- View mode ---- */
                  <div className="flex items-center gap-3 px-4 py-3">
                    {/* Avatar initial */}
                    <div
                      className="shrink-0 w-9 h-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-sm select-none"
                      aria-hidden="true"
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>

                    {/* Name + email + roles */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {member.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{member.email}</p>
                      {roleNames && (
                        <p className="mt-0.5 text-xs text-indigo-600 truncate">
                          {roleNames}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditingMemberId(member.id)}
                        aria-label={`Edit ${member.name}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 active:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 transition"
                      >
                        <PencilIcon />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(member)}
                        disabled={deletingId === member.id}
                        aria-label={`Delete ${member.name}`}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed transition"
                      >
                        {deletingId === member.id ? (
                          <SpinnerIcon label="Deleting member" />
                        ) : (
                          <TrashIcon />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
