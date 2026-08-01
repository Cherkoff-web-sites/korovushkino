'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const MIN_VISIBLE_MS = 200
const HIDE_DELAY_MS = 120

function isAdminPath(pathname: string) {
  return pathname === '/admin' || pathname.startsWith('/admin/')
}

function isInternalNavigationLink(anchor: HTMLAnchorElement, pathname: string) {
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return false

  const rawHref = anchor.getAttribute('href')
  if (!rawHref || rawHref.startsWith('#') || rawHref.startsWith('mailto:') || rawHref.startsWith('tel:')) {
    return false
  }

  let url: URL
  try {
    url = new URL(rawHref, window.location.origin)
  } catch {
    return false
  }

  if (url.origin !== window.location.origin) return false
  if (isAdminPath(url.pathname)) return false
  if (url.pathname === pathname && url.search === window.location.search) return false

  return true
}

/** Small corner spinner on navigation — no overlay, no page animation. */
export default function NavigationLoadingIndicator() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const startedAtRef = useRef(0)
  const pendingRef = useRef(false)
  const admin = isAdminPath(pathname)

  useEffect(() => {
    if (admin) {
      pendingRef.current = false
      setVisible(false)
      return
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement | null)?.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (!isInternalNavigationLink(anchor, pathname)) return

      pendingRef.current = true
      startedAtRef.current = Date.now()
      setVisible(true)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname, admin])

  useEffect(() => {
    if (admin || !pendingRef.current) return

    const elapsed = Date.now() - startedAtRef.current
    const wait = Math.max(HIDE_DELAY_MS, MIN_VISIBLE_MS - elapsed)

    const timer = window.setTimeout(() => {
      pendingRef.current = false
      setVisible(false)
    }, wait)

    return () => window.clearTimeout(timer)
  }, [pathname, admin])

  if (admin || !visible) return null

  return (
    <div className="nav-loading-indicator" role="status" aria-live="polite" aria-label="Загрузка">
      <span className="nav-loading-spinner" aria-hidden />
    </div>
  )
}
