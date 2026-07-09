'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

export default function MainWithTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <main key={pathname} className="page-enter flex-grow">
      {children}
    </main>
  )
}
