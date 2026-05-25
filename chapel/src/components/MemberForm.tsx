import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

interface Role {
  id: string
  name: string
}

interface OrgTierInfo {
  member_count: number
  stripe_subscription_status: string | null
}

export interface MemberFormProps {
  /** Called after a member is successfully inserted. */
  onMemberAdded: () => void
  /** Called when the org has hit the free-tier member limit (≥30 on free plan). */
  onLimitReached: () => void
  /** Optional initial values for edit mode. */
  initialValues?: {
    id: string
    name: string
    email: string
    roleIds: string[]
  }
  /** Label for the submit button; defaults to "Add member". */
  submitLabel?: string
  /** Called when the form should be closed without saving (edit mode). */
  onCancel?: () => void
}

export default function MemberForm({
  onMemberAdded,
  onLimitReached,
  initialValues,
  submitLabel = 'Add member',
  onCancel,
}: MemberFormProps) {
  const { orgId } = useAuth()

  const [name, setName] = useState(initialValues?.name ?? '')
  const [email, setEmail] = useState(initialValues?.email ?? '')
  const [selectedRoleIds, setSelectedRoleIds] = useState<Set<string>>(
    new Set(initialValues?.roleIds ?? []),
  )

  const [availableRoles, setAvailableRoles] = useState<Role[]>([])
  const [rolesLoading, setRolesLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Field-level validation errors
  const [nameError, setNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // Fetch available roles for this org on mount
  useEffect(() => {
    if (!orgId) return

    setRolesLoading(true)
    supabase
      .from('roles')
      .select('id, name')
      .order('name', { ascending: true })
      .then(({ data, error }) => {
        if (!error) {
          setAvailableRoles(data ?? [])
        }
        setRolesLoading(false)
      })
  }, [orgId])

  function toggleRole(roleId: string) {
    setSelectedRoleIds((prev) => {
      const next = new Set(prev)
      if (next.has(roleId)) {
        next.delete(roleId)
      } else {
        next.add(roleId)
      }
      return next
    })
  }

  function validate(): boolean {
    let valid = true

    if (!name.trim()) {
      setNameError('Full name is required.')
      valid = false
    } else {
      setNameError(null)
    }

    if (!email.trim()) {
      setEmailError('Email address is required.')
      valid = false
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setEmailError('Please enter a valid email address.')
      valid = false
    } else {
      setEmailError(null)
    }

    return valid
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (!validate()) return
    if (!orgId) {
      setSubmitError('No organisation found — please refresh.')
      return
    }

    setSaving(true)
    setSubmitError(null)

    // Check tier limit before inserting a new member (not needed for edits)
    if (!initialValues) {
      const { data: orgData, error: orgError } = await supabase
        .from('orgs')
        .select('member_count, stripe_subscription_status')
        .eq('id', orgId)
        .limit(1)
        .single()

      if (orgError || !orgData) {
        setSaving(false)
        setSubmitError('Could not verify membership limit. Please try again.')
        return
      }

      const org = orgData as OrgTierInfo
      const isFreeTier =
        org.stripe_subscription_status == null ||
        org.stripe_subscription_status !== 'active'

      if (isFreeTier && org.member_count >= 30) {
        setSaving(false)
        onLimitReached()
        return
      }
    }

    if (initialValues) {
      // Edit path: update member row then replace member_roles
      const { error: updateError } = await supabase
        .from('members')
        .update({ name: name.trim(), email: email.trim() })
        .eq('id', initialValues.id)

      if (updateError) {
        setSaving(false)
        setSubmitError(updateError.message)
        return
      }

      // Delete existing role links then re-insert the new set
      const { error: deleteError } = await supabase
        .from('member_roles')
        .delete()
        .eq('member_id', initialValues.id)

      if (deleteError) {
        setSaving(false)
        setSubmitError(deleteError.message)
        return
      }

      if (selectedRoleIds.size > 0) {
        const roleRows = Array.from(selectedRoleIds).map((roleId) => ({
          member_id: initialValues.id,
          role_id: roleId,
        }))

        const { error: roleInsertError } = await supabase
          .from('member_roles')
          .insert(roleRows)

        if (roleInsertError) {
          setSaving(false)
          setSubmitError(roleInsertError.message)
          return
        }
      }
    } else {
      // Insert path: new member
      const { data: memberData, error: insertError } = await supabase
        .from('members')
        .insert({ org_id: orgId, name: name.trim(), email: email.trim() })
        .select('id')
        .single()

      if (insertError || !memberData) {
        setSaving(false)
        setSubmitError(insertError?.message ?? 'Failed to add member.')
        return
      }

      const memberId = (memberData as { id: string }).id

      if (selectedRoleIds.size > 0) {
        const roleRows = Array.from(selectedRoleIds).map((roleId) => ({
          member_id: memberId,
          role_id: roleId,
        }))

        const { error: roleInsertError } = await supabase
          .from('member_roles')
          .insert(roleRows)

        if (roleInsertError) {
          setSaving(false)
          setSubmitError(roleInsertError.message)
          return
        }
      }
    }

    setSaving(false)
    onMemberAdded()
  }

  function handleNameChange(e: ChangeEvent<HTMLInputElement>) {
    setName(e.target.value)
    if (nameError) setNameError(null)
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    setEmail(e.target.value)
    if (emailError) setEmailError(null)
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {/* Full name */}
      <div>
        <label
          htmlFor="member-name"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Full name
        </label>
        <input
          id="member-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          placeholder="e.g. Sarah Johnson"
          maxLength={120}
          disabled={saving}
          aria-describedby={nameError ? 'member-name-error' : undefined}
          aria-invalid={nameError != null}
          className={[
            'w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            'disabled:opacity-50 transition',
            nameError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white',
          ].join(' ')}
        />
        {nameError && (
          <p id="member-name-error" role="alert" className="mt-1.5 text-xs text-red-600">
            {nameError}
          </p>
        )}
      </div>

      {/* Email address */}
      <div>
        <label
          htmlFor="member-email"
          className="block text-sm font-medium text-gray-700 mb-1.5"
        >
          Email address
        </label>
        <input
          id="member-email"
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="e.g. sarah@example.com"
          maxLength={200}
          disabled={saving}
          aria-describedby={emailError ? 'member-email-error' : undefined}
          aria-invalid={emailError != null}
          className={[
            'w-full rounded-lg border px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 shadow-sm',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500',
            'disabled:opacity-50 transition',
            emailError ? 'border-red-400 bg-red-50' : 'border-gray-200 bg-white',
          ].join(' ')}
        />
        {emailError && (
          <p id="member-email-error" role="alert" className="mt-1.5 text-xs text-red-600">
            {emailError}
          </p>
        )}
      </div>

      {/* Eligible roles */}
      <div>
        <p className="block text-sm font-medium text-gray-700 mb-1.5">
          Eligible roles{' '}
          <span className="font-normal text-gray-400">(select all that apply)</span>
        </p>

        {rolesLoading ? (
          <p className="text-xs text-gray-400 py-2">Loading roles…</p>
        ) : availableRoles.length === 0 ? (
          <p className="text-xs text-gray-400 py-2">
            No roles defined yet.{' '}
            <a href="/roles" className="text-indigo-600 underline underline-offset-2">
              Add roles first.
            </a>
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {availableRoles.map((role) => {
              const checked = selectedRoleIds.has(role.id)
              return (
                <label
                  key={role.id}
                  className={[
                    'flex items-center gap-2.5 rounded-lg border px-3 py-2.5 cursor-pointer select-none transition',
                    'focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-1',
                    checked
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-900'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300',
                    saving ? 'opacity-50 cursor-not-allowed' : '',
                  ].join(' ')}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleRole(role.id)}
                    disabled={saving}
                    className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                    aria-label={role.name}
                  />
                  <span className="text-sm font-medium truncate">{role.name}</span>
                </label>
              )
            })}
          </div>
        )}
      </div>

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
          disabled={saving}
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
          ) : (
            submitLabel
          )}
        </button>

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="inline-flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
