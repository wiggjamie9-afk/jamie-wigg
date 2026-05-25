import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

type Status = 'idle' | 'loading' | 'sent' | 'error'

export default function Login() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setErrorMessage('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    if (error) {
      setErrorMessage(error.message)
      setStatus('error')
    } else {
      setStatus('sent')
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo / Wordmark */}
        <div className="mb-10 text-center">
          {/* Simple cross icon */}
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="w-7 h-7 text-white"
            >
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="5" y1="9" x2="19" y2="9" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Chapel</h1>
          <p className="mt-1 text-sm text-gray-500">Church volunteer scheduling</p>
        </div>

        {status === 'sent' ? (
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-2">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-900">Check your email</h2>
            <p className="text-sm text-gray-500 leading-relaxed">
              We sent a magic link to <span className="font-medium text-gray-700">{email}</span>.
              Click the link in that email to sign in — no password needed.
            </p>
            <button
              onClick={() => { setStatus('idle'); setEmail('') }}
              className="mt-4 text-sm text-indigo-600 underline underline-offset-2 hover:text-indigo-800 transition-colors"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@yourchurch.org"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="block w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition"
              />
            </div>

            {status === 'error' && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                {errorMessage || 'Something went wrong. Please try again.'}
              </p>
            )}

            <button
              type="submit"
              disabled={status === 'loading' || !email.trim()}
              className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {status === 'loading' ? 'Sending…' : 'Send magic link'}
            </button>

            <p className="text-center text-xs text-gray-400 pt-2 leading-relaxed">
              We'll email you a one-click sign-in link.
              <br />No password required.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
