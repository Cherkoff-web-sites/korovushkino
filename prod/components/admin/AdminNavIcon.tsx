import type { AdminNavIconType } from './adminNav'

const className = 'h-5 w-5 shrink-0'

export default function AdminNavIcon({ type, active = false }: { type: AdminNavIconType; active?: boolean }) {
  const stroke = active ? '#3D8C13' : 'currentColor'

  if (type === 'catalog') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
        <path d="M4 7h16M4 12h10M4 17h16" strokeLinecap="round" />
        <rect x="3" y="4" width="18" height="16" rx="2" />
      </svg>
    )
  }

  if (type === 'home') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
        <path d="M4 10.5L12 4l8 6.5V19a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-8.5z" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'backup') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
        <path d="M12 3v12m0 0l4-4m-4 4l-4-4M5 15v3a2 2 0 002 2h10a2 2 0 002-2v-3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'delivery') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
        <path d="M3 7h11v8H3zM14 10h4l3 3v2h-7v-5z" strokeLinejoin="round" />
        <circle cx="7.5" cy="17.5" r="1.5" fill={stroke} stroke="none" />
        <circle cx="17.5" cy="17.5" r="1.5" fill={stroke} stroke="none" />
      </svg>
    )
  }

  if (type === 'newsletter') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
        <path d="M4 6h16v12H4z" strokeLinejoin="round" />
        <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'contact') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
        <path d="M4 6h16v12H4z" strokeLinejoin="round" />
        <path d="M4 7l8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  if (type === 'orders') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
        <path d="M6 6h15l-1.5 9h-12L6 6z" strokeLinejoin="round" />
        <circle cx="9" cy="19" r="1.5" fill={stroke} stroke="none" />
        <circle cx="17" cy="19" r="1.5" fill={stroke} stroke="none" />
      </svg>
    )
  }

  if (type === 'clients') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
        <circle cx="9" cy="8" r="3" />
        <path d="M4 19c0-2.8 2.2-5 5-5s5 2.2 5 5" strokeLinecap="round" />
        <path d="M16 11h5M18.5 8.5v5" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.6" aria-hidden>
      <path d="M3 12l9-9 9 9M5 10v10h14V10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
