import type { AccountNavItem } from './accountNav'

export default function AccountNavIcon({ type }: { type: AccountNavItem['icon'] }) {
  const className = 'h-5 w-5 shrink-0 text-[#707070]'
  switch (type) {
    case 'profile':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'orders':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M6 6h15l-1.5 9h-12L6 6zm0 0L5 3H2M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'reviews':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'addresses':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 21s7-4.35 7-11a7 7 0 10-14 0c0 6.65 7 11 7 11z" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      )
    case 'password':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="5" y="11" width="14" height="10" rx="2" />
          <path d="M8 11V8a4 4 0 118 0v3" strokeLinecap="round" />
        </svg>
      )
    case 'favorites':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" strokeLinejoin="round" />
        </svg>
      )
    case 'settings':
      return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
          <rect x="4" y="5" width="16" height="14" rx="2" />
          <path d="M8 10h8M8 14h5" strokeLinecap="round" />
        </svg>
      )
    default:
      return null
  }
}
