import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'
import BottomNav from './BottomNav'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const { orgName } = useAuth()

  return (
    <div className="flex flex-col bg-gray-50" style={{ minHeight: '100dvh' }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm"
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <div className="flex items-center justify-between h-14 px-4 max-w-lg mx-auto">
          <span className="text-base font-semibold text-gray-900 truncate max-w-[70%]">
            {orgName ?? 'My Church'}
          </span>
          <span className="flex items-center gap-1.5 text-sm font-bold text-indigo-600 tracking-tight shrink-0">
            {/* Small cross mark */}
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <line x1="12" y1="3" x2="12" y2="21" />
              <line x1="5" y1="9" x2="19" y2="9" />
            </svg>
            Chapel
          </span>
        </div>
      </header>

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto pb-[calc(56px+env(safe-area-inset-bottom,0px))]">
        <div className="max-w-lg mx-auto w-full px-4 py-4">
          {children}
        </div>
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  )
}
