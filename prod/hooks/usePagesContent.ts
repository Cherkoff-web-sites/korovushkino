'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_PAGES_CONTENT,
  type PagesContent,
  mergePagesContent,
} from '@/lib/pagesContent'
import { adminSaveContent, fetchPublicContent } from '@/lib/api/adminSiteApi'

export function usePagesContent() {
  const [content, setContent] = useState<PagesContent>(DEFAULT_PAGES_CONTENT)
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(async () => {
    try {
      const data = await fetchPublicContent<Partial<PagesContent>>('pages')
      setContent(data.content ? mergePagesContent(data.content) : DEFAULT_PAGES_CONTENT)
    } catch {
      setContent(DEFAULT_PAGES_CONTENT)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    void reload()
    const onUpdate = () => void reload()
    window.addEventListener('pages-content-updated', onUpdate)
    return () => {
      window.removeEventListener('pages-content-updated', onUpdate)
    }
  }, [reload])

  const save = useCallback((next: PagesContent) => {
    setContent(next)
    void adminSaveContent('pages', next)
    window.dispatchEvent(new Event('pages-content-updated'))
  }, [])

  return { content, hydrated, save, reset: () => save(DEFAULT_PAGES_CONTENT) }
}
