'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { ACCOUNT_NAV_ITEMS } from './accountNav'
import AccountNavIcon from './AccountNavIcon'

function isNavActive(pathname: string, href: string) {
  if (href === '/account') return pathname === '/account'
  return pathname === href || pathname.startsWith(`${href}/`)
}

export default function AccountSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { logout } = useAuth()
  const activeItem = ACCOUNT_NAV_ITEMS.find((item) => isNavActive(pathname, item.href)) ?? ACCOUNT_NAV_ITEMS[0]

  function handleLogout() {
    logout()
    router.push('/')
  }

  return (
    <aside className="rounded-xl border border-[#D2B48C] bg-[#FFF8E7] p-5 sm:p-6 lg:sticky lg:top-28 lg:self-start">
      <div className="mb-5 flex items-center gap-2.5 border-b border-[#D2B48C]/50 pb-5">
        <AccountNavIcon type={activeItem.icon} />
        <h2 className="text-base font-bold text-black sm:text-lg">{activeItem.label}</h2>
      </div>

      <nav aria-label="Разделы личного кабинета">
        <ul className="space-y-1">
          {ACCOUNT_NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item.href)
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-2 py-2.5 text-sm transition-colors sm:text-[15px] ${
                    active
                      ? 'bg-white/80 font-medium text-[#1F1F1F]'
                      : 'text-[#232326]/80 hover:bg-white/50 hover:text-[#1F1F1F]'
                  }`}
                  aria-current={active ? 'page' : undefined}
                >
                  <AccountNavIcon type={item.icon} />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="mt-6 border-t border-[#D2B48C]/50 pt-5">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left text-sm text-[#232326]/80 transition-colors hover:bg-white/50 hover:text-[#1F1F1F] sm:text-[15px]"
        >
          <svg className="h-5 w-5 shrink-0 text-[#707070]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Выход
        </button>
      </div>
    </aside>
  )
}

