'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_PAGES_CONTENT,
  type PagesContent,
  readPagesContent,
  writePagesContent,
} from '@/lib/pagesContent'

export function usePagesContent() {
  const [content, setContent] = useState<PagesContent>(DEFAULT_PAGES_CONTENT)
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(() => {
    setContent(readPagesContent())
    setHydrated(true)
  }, [])

  useEffect(() => {
    reload()
    const onUpdate = () => reload()
    window.addEventListener('pages-content-updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('pages-content-updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [reload])

  const save = useCallback((next: PagesContent) => {
    writePagesContent(next)
    setContent(next)
  }, [])

  return { content, hydrated, save, reset: () => save(DEFAULT_PAGES_CONTENT) }
}
