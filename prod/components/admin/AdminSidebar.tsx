'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  ADMIN_NAV_ITEMS,
  ADMIN_NAV_SECTIONS,
  isAdminNavActive,
} from './adminNav'
import AdminNavIcon from './AdminNavIcon'

export default function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function handleNavigate() {
    setMobileOpen(false)
    onNavigate?.()
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-5 py-5">
        <p className="text-xs uppercase tracking-[0.14em] text-white/45">Коровушкино</p>
        <p className="mt-1 text-lg font-semibold text-white">Админ-панель</p>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Разделы админ-панели">
        {ADMIN_NAV_SECTIONS.map((section) => {
          const items = ADMIN_NAV_ITEMS.filter((item) => item.section === section.id)
          if (items.length === 0) return null
          return (
            <div key={section.id} className="mb-5">
              <p className="mb-2 px-2 text-[11px] font-medium uppercase tracking-[0.12em] text-white/35">
                {section.label}
              </p>
              <ul className="space-y-1">
                {items.map((item) => {
                  const active = isAdminNavActive(pathname, item.href)
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={handleNavigate}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          active
                            ? 'bg-[#3D8C13] font-medium text-white'
                            : 'text-white/75 hover:bg-white/8 hover:text-white'
                        }`}
                        aria-current={active ? 'page' : undefined}
                      >
                        <AdminNavIcon type={item.icon} active={active} />
                        {item.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </nav>

      <div className="border-t border-white/10 px-3 py-4">
        <Link
          href="/"
          onClick={handleNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/75 transition-colors hover:bg-white/8 hover:text-white"
        >
          <AdminNavIcon type="site" />
          На сайт
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <button
        type="button"
        onClick={() => setMobileOpen(true)}
        className="fixed left-4 top-4 z-[220] flex h-11 w-11 items-center justify-center rounded-lg bg-[#1e1e22] text-white shadow-lg lg:hidden"
        aria-label="Открыть меню"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
          <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
        </svg>
      </button>

      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-[210] bg-black/50 lg:hidden"
          aria-label="Закрыть меню"
          onClick={() => setMobileOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed inset-y-0 left-0 z-[215] w-[min(100vw-3rem,280px)] -translate-x-full bg-[#1e1e22] transition-transform lg:static lg:z-auto lg:w-64 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : ''
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
