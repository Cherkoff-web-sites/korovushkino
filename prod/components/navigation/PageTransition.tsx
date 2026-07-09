'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

const MIN_OVERLAY_MS = 280
const FADE_OUT_MS = 220

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
  if (url.pathname === pathname && url.search === window.location.search) return false

  return true
}

export default function PageTransition() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const startedAtRef = useRef(0)
  const pendingRef = useRef(false)

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as HTMLElement | null)?.closest('a')
      if (!(anchor instanceof HTMLAnchorElement)) return
      if (!isInternalNavigationLink(anchor, pathname)) return

      pendingRef.current = true
      startedAtRef.current = Date.now()
      setFadingOut(false)
      setVisible(true)
    }

    document.addEventListener('click', onClick, true)
    return () => document.removeEventListener('click', onClick, true)
  }, [pathname])

  useEffect(() => {
    if (!pendingRef.current) return

    const elapsed = Date.now() - startedAtRef.current
    const wait = Math.max(0, MIN_OVERLAY_MS - elapsed)

    const timer = window.setTimeout(() => {
      pendingRef.current = false
      setFadingOut(true)
      window.setTimeout(() => {
        setVisible(false)
        setFadingOut(false)
      }, FADE_OUT_MS)
    }, wait)

    return () => window.clearTimeout(timer)
  }, [pathname])

  if (!visible) return null

  return (
    <div
      className={`page-transition-overlay ${fadingOut ? 'page-transition-overlay--out' : ''}`}
      aria-hidden
    >
      <div className="page-transition-spinner" role="status" aria-label="Загрузка страницы" />
    </div>
  )
}
