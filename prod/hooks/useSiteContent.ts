'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_SITE_CONTENT,
  type SiteContent,
  mergeSiteContent,
} from '@/lib/siteContent'
import { adminSaveContent, fetchPublicContent } from '@/lib/api/adminSiteApi'

export function useSiteContent() {
  const [content, setContent] = useState<SiteContent>(DEFAULT_SITE_CONTENT)
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(async () => {
    try {
      const data = await fetchPublicContent<Partial<SiteContent>>('site')
      setContent(data.content ? mergeSiteContent(data.content) : DEFAULT_SITE_CONTENT)
    } catch {
      setContent(DEFAULT_SITE_CONTENT)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    void reload()
    const onUpdate = () => void reload()
    window.addEventListener('site-content-updated', onUpdate)
    return () => {
      window.removeEventListener('site-content-updated', onUpdate)
    }
  }, [reload])

  const save = useCallback((next: SiteContent) => {
    setContent(next)
    void adminSaveContent('site', next)
    window.dispatchEvent(new Event('site-content-updated'))
  }, [])

  return { content, hydrated, save, reset: () => save(DEFAULT_SITE_CONTENT) }
}
