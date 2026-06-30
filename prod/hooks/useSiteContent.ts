'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_SITE_CONTENT,
  type SiteContent,
  readSiteContent,
  writeSiteContent,
} from '@/lib/siteContent'

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT)
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(() => {
    setContent(readSiteContent())
    setHydrated(true)
  }, [])

  useEffect(() => {
    reload()
    const onUpdate = () => reload()
    window.addEventListener('site-content-updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('site-content-updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [reload])

  const save = useCallback((next: SiteContent) => {
    writeSiteContent(next)
    setContent(next)
  }, [])

  return { content, hydrated, save, reset: () => save(DEFAULT_SITE_CONTENT) }
}
