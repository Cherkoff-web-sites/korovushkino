'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function MainWithTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname === '/admin' || pathname.startsWith('/admin/')

  return (
    <main key={pathname} className={`flex-grow${isAdmin ? '' : ' page-enter'}`}>
      {children}
    </main>
  )
}
