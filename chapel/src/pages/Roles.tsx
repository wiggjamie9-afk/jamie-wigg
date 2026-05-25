import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import RoleForm, { type RoleFormHandle } from '../components/RoleForm'

interface Role {
  id: string
  name: string
}

const QUICK_ADD_SUGGESTIONS = [
  'Sound Tech',
  'Greeter',
  'Reader',
  'Worship Team',
  'Kids Ministry',
  'Communion',
] as const

/** Trash-can SVG icon */
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

export default function Roles() {
  const { orgId } = useAuth()
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [inputValue, setInputValue] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const formRef = useRef<RoleFormHandle>(null)

  const fetchRoles = useCallback(async () => {
    if (!orgId) return

    setFetchError(null)

    const { data, error } = await supabase
      .from('roles')
      .select('id, name')
      .order('name', { ascending: true })

    if (error) {
      setFetchError(error.message)
    } else {
      setRoles(data ?? [])
    }

    setLoading(false)
  }, [orgId])

  useEffect(() => {
    fetchRoles()
  }, [fetchRoles])

  async function handleDelete(role: Role) {
    if (deletingId) return // prevent double-delete
    setDeletingId(role.id)

    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', role.id)

    setDeletingId(null)

    if (error) {
      // Surface briefly — a toast would be nice but we keep deps minimal
      setFetchError(`Could not delete "${role.name}": ${error.message}`)
      return
    }

    // Optimistic update + re-fetch to confirm
    setRoles((prev) => prev.filter((r) => r.id !== role.id))
    fetchRoles()
  }

  function handleChipClick(suggestion: string) {
    formRef.current?.quickAdd(suggestion)
  }

  // Which suggestions haven't been added yet?
  const existingNames = new Set(roles.map((r) => r.name.toLowerCase()))
  const remainingSuggestions = QUICK_ADD_SUGGESTIONS.filter(
    (s) => !existingNames.has(s.toLowerCase()),
  )

  return (
    <div className="py-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Service Roles
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Define the roles volunteers fill each Sunday.
        </p>
      </div>

      {/* Add role form */}
      <div className="rounded-2xl bg-white border border-gray-100 shadow-sm p-4">
        <RoleForm
          ref={formRef}
          value={inputValue}
          onChange={setInputValue}
          onRoleAdded={fetchRoles}
        />

        {/* Quick Add chips — shown when the list is empty OR there are remaining suggestions */}
        {remainingSuggestions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Quick add
            </p>
            <div className="flex flex-wrap gap-2">
              {remainingSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => handleChipClick(suggestion)}
                  className="inline-flex items-center rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-100 active:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 transition"
                >
                  + {suggestion}
                </button>
              ))}
            </div>
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

      {/* Role list */}
      {loading ? (
        <div className="flex justify-center py-10">
          <svg
            className="w-6 h-6 animate-spin text-indigo-500"
            viewBox="0 0 24 24"
            fill="none"
            aria-label="Loading roles"
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
        </div>
      ) : roles.length === 0 ? (
        <div className="rounded-2xl bg-white border border-dashed border-gray-200 px-6 py-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mb-3">
            {/* People / tag icon */}
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
              <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
              <line x1="7" y1="7" x2="7.01" y2="7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-700">No roles yet</p>
          <p className="mt-1 text-xs text-gray-400">
            Add your first role above or tap a Quick Add chip.
          </p>
        </div>
      ) : (
        <ul className="space-y-2" aria-label="Service roles">
          {roles.map((role) => (
            <li
              key={role.id}
              className="flex items-center justify-between gap-3 rounded-xl bg-white border border-gray-100 shadow-sm px-4 py-3"
            >
              <span className="text-sm font-medium text-gray-900 truncate">
                {role.name}
              </span>
              <button
                type="button"
                onClick={() => handleDelete(role)}
                disabled={deletingId === role.id}
                aria-label={`Delete role ${role.name}`}
                className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 active:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {deletingId === role.id ? (
                  <svg
                    className="w-5 h-5 animate-spin"
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
                ) : (
                  <TrashIcon />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
