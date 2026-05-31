import type { AdminNavItem } from './adminNav'

export default function AdminNavIcon({ type }: { type: AdminNavItem['icon'] }) {
  const className = 'h-5 w-5 shrink-0 text-[#707070]'

  if (type === 'catalog') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
        <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        <rect x="3" y="4" width="18" height="16" rx="2" />
      </svg>
    )
  }

  return null
}
