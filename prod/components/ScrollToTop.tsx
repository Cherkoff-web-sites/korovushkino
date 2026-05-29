'use client'

import { Suspense, useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'

/** Прокрутка в начало при смене страницы или query (каталог, якоря). */
function ScrollOnRouteInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const qs = searchParams.toString()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, qs])

  return null
}

export default function ScrollToTop() {
  return (
    <>
      <Suspense fallback={null}>
        <ScrollOnRouteInner />
      </Suspense>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#3D8C13] text-white shadow-lg transition-colors hover:bg-[#367c11]"
        aria-label="Наверх"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </>
  )
}
