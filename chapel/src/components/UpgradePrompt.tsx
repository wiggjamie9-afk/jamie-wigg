/**
 * UpgradePrompt — inline banner shown when a free org hits its member limit.
 *
 * Compact by design: sits inside the Members page without dominating the screen.
 * The parent is responsible for wiring `onUpgradeClick` to the Stripe Checkout
 * flow (e.g. POST /api/create-checkout then redirect to the returned URL).
 */

interface UpgradePromptProps {
  memberCount: number
  limit: number
  onUpgradeClick: () => void
}

export function UpgradePrompt({ memberCount, limit, onUpgradeClick }: UpgradePromptProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      {/* Icon */}
      <span className="mt-0.5 shrink-0 text-amber-500" aria-hidden="true">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {/* Message + CTA */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between w-full">
        <p className="leading-snug">
          You've reached the{' '}
          <strong className="font-semibold">{limit}-member limit</strong> on the free plan
          {memberCount > limit ? ` (${memberCount} members)` : ''}.{' '}
          Upgrade to Chapel Pro ($12/month) to add up to 150 members.
        </p>

        <button
          type="button"
          onClick={onUpgradeClick}
          className="shrink-0 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-1 transition-colors"
        >
          Upgrade to Pro
        </button>
      </div>
    </div>
  )
}
