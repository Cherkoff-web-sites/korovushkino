'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_HOME_CONTENT,
  type HomeContent,
  mergeHomeContent,
} from '@/lib/homeContent'
import { adminSaveContent, fetchPublicContent } from '@/lib/api/adminSiteApi'

export function useHomeContent() {
  const [content, setContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT)
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(async () => {
    try {
      const data = await fetchPublicContent<Partial<HomeContent>>('home')
      setContent(data.content ? mergeHomeContent(data.content) : DEFAULT_HOME_CONTENT)
    } catch {
      setContent(DEFAULT_HOME_CONTENT)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    void reload()
    const onUpdate = () => void reload()
    window.addEventListener('home-content-updated', onUpdate)
    return () => {
      window.removeEventListener('home-content-updated', onUpdate)
    }
  }, [reload])

  const save = useCallback((next: HomeContent) => {
    setContent(next)
    void adminSaveContent('home', next)
    window.dispatchEvent(new Event('home-content-updated'))
  }, [])

  return { content, hydrated, save, reset: () => save(DEFAULT_HOME_CONTENT) }
}
