import {
  useState,
  forwardRef,
  useImperativeHandle,
  type FormEvent,
} from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface RoleFormProps {
  /** Controlled value for the role name input. */
  value: string
  /** Called when the input value changes. */
  onChange: (value: string) => void
  /** Called after a role is successfully inserted so the parent can refetch. */
  onRoleAdded: () => void
}

/** Methods the parent can call imperatively (e.g. from Quick Add chips). */
export interface RoleFormHandle {
  /** Fills the input with `roleName` and immediately submits. */
  quickAdd: (roleName: string) => Promise<void>
}

/**
 * Inline form for adding a new church service role.
 *
 * The parent controls the input value so Quick Add chips can prefill it.
 * Use the forwarded ref to call `quickAdd(name)` from a chip click.
 */
const RoleForm = forwardRef<RoleFormHandle, RoleFormProps>(function RoleForm(
  { value, onChange, onRoleAdded },
  ref,
) {
  const { orgId } = useAuth()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function addRole(roleName: string) {
    const trimmed = roleName.trim()
    if (!trimmed || saving) return

    if (!orgId) {
      setError('No organisation found — please refresh.')
      return
    }

    setSaving(true)
    setError(null)

    const { error: dbError } = await supabase
      .from('roles')
      .insert({ org_id: orgId, name: trimmed })

    setSaving(false)

    if (dbError) {
      setError(dbError.message)
      return
    }

    onChange('')
    onRoleAdded()
  }

  useImperativeHandle(ref, () => ({
    async quickAdd(roleName: string) {
      onChange(roleName)
      await addRole(roleName)
    },
  }))

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    await addRole(value)
  }

  const inputId = 'role-name-input'

  return (
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <div className="flex gap-2">
          <div className="flex-1">
            <label
              htmlFor={inputId}
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Role name
            </label>
            <input
              id={inputId}
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="e.g. Sound Tech"
              maxLength={80}
              disabled={saving}
              className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50 transition"
              aria-describedby={error ? 'role-form-error' : undefined}
            />
          </div>

          {/* Top padding aligns the button baseline with the input */}
          <div className="pt-[1.625rem]">
            <button
              type="submit"
              disabled={saving || !value.trim()}
              className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
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
              ) : (
                'Add role'
              )}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <p
          id="role-form-error"
          role="alert"
          className="mt-2 text-sm text-red-600"
        >
          {error}
        </p>
      )}
    </div>
  )
})

export default RoleForm
