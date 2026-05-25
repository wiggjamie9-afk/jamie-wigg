import { NavLink, useLocation } from 'react-router-dom'

interface NavItem {
  to: string
  label: string
  icon: React.ReactNode
  activeIcon: React.ReactNode
}

function HomeIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-1.3-1.3V19.5a1.5 1.5 0 01-1.5 1.5h-4.5a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75v4.5a.75.75 0 01-.75.75H4.5A1.5 1.5 0 013 19.5V10.17l-1.3 1.3a.75.75 0 00-1.06-1.06l8.69-8.69z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <path d="M2.25 12L11.204 3.045a1.125 1.125 0 011.591 0L21.75 12M4.5 9.75V19.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75v-4.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75v4.5a.75.75 0 00.75.75h4.5a.75.75 0 00.75-.75V9.75" />
    </svg>
  )
}

function PeopleIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  )
}

function CalendarIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0118 3v1.5h.75a3 3 0 013 3v11.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V7.5a3 3 0 013-3H6V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  )
}

function CheckIcon({ filled }: { filled: boolean }) {
  return filled ? (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6" aria-hidden="true">
      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  )
}

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', exact: true },
  { to: '/members', label: 'Members', exact: false },
  { to: '/schedules', label: 'Schedules', exact: false },
  { to: '/attendance', label: 'Attendance', exact: false },
] as const

export default function BottomNav() {
  const { pathname } = useLocation()

  function isActive(to: string, exact: boolean) {
    return exact ? pathname === to : pathname.startsWith(to)
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 z-50"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
      aria-label="Main navigation"
    >
      <div className="grid grid-cols-4 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ to, label, exact }) => {
          const active = isActive(to, exact)
          return (
            <NavLink
              key={to}
              to={to}
              end={exact}
              className="flex flex-col items-center justify-center gap-0.5 min-h-[56px] py-2 px-1 select-none"
              aria-label={label}
            >
              <span className={active ? 'text-indigo-600' : 'text-gray-400'}>
                {to === '/' && <HomeIcon filled={active} />}
                {to === '/members' && <PeopleIcon filled={active} />}
                {to === '/schedules' && <CalendarIcon filled={active} />}
                {to === '/attendance' && <CheckIcon filled={active} />}
              </span>
              <span
                className={`text-[10px] font-medium leading-none ${
                  active ? 'text-indigo-600' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </NavLink>
          )
        })}
      </div>
    </nav>
  )
}
