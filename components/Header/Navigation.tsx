'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { lockInternalNavOnHome } from '@/lib/siteFlags'

const NAVIGATION_ITEMS = [
  { href: '/catalog', label: 'Каталог' },
  { href: '/delivery-payment', label: 'Доставка и оплата' },
  { href: '/contact', label: 'Контакты' },
  { href: '/about', label: 'О нас' },
]

export default function Navigation() {
  const pathname = usePathname()
  const navLocked = lockInternalNavOnHome && pathname === '/'

  return (
    <nav className="hidden lg:flex items-center gap-8">
      {NAVIGATION_ITEMS.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const className = `text-sm font-normal transition-colors ${
          isActive ? 'text-[#FFFFFF]' : 'text-[#FFFFFF] hover:text-white/85'
        }`

        if (navLocked) {
          return (
            <span key={item.href} className={`${className} cursor-default opacity-70`}>
              {item.label}
            </span>
          )
        }

        return (
          <Link key={item.href} href={item.href} className={className}>
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}

