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
        const className = `text-sm font-normal text-[#FFFFFF] hover:text-[#FFFFFF] focus-visible:text-[#FFFFFF] ${
          isActive ? 'underline underline-offset-[6px] decoration-[#FFFFFF]' : ''
        }`

        if (navLocked) {
          return (
            <span key={item.href} className={`${className} cursor-default`}>
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

