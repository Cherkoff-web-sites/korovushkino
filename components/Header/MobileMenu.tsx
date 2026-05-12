'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAVIGATION_ITEMS = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/delivery-payment', label: 'Доставка и оплата' },
  { href: '/contact', label: 'Контакты' },
  { href: '/about', label: 'О нас' },
]

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const pathname = usePathname()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Мобильное меню */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-[#3D8C13] z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
          isOpen ? 'translate-x-0 pointer-events-auto' : 'translate-x-full pointer-events-none'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between border-b border-[#FFFFFF] p-4">
            <span className="font-semibold text-[#FFFFFF]">Меню</span>
            <button
              onClick={onClose}
              className="text-[#FFFFFF] hover:text-[#FFFFFF]"
              aria-label="Закрыть меню"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 6L6 18M6 6L18 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          {/* Навигация */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-2">
              {NAVIGATION_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                const className = `block px-4 py-3 rounded-lg font-normal text-[#FFFFFF] ${
                  isActive
                    ? 'bg-[#FFFFFF] text-[#3D8C13]'
                    : 'bg-transparent hover:bg-[#2f7510] hover:text-[#FFFFFF] focus-visible:bg-[#2f7510]'
                }`

                return (
                  <li key={item.href}>
                    <Link href={item.href} onClick={onClose} className={className}>
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
