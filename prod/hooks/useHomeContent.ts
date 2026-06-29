'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  DEFAULT_HOME_CONTENT,
  type HomeContent,
  readHomeContent,
  writeHomeContent,
} from '@/lib/homeContent'

export function useHomeContent() {
  const [content, setContent] = useState<HomeContent>(DEFAULT_HOME_CONTENT)
  const [hydrated, setHydrated] = useState(false)

  const reload = useCallback(() => {
    setContent(readHomeContent())
    setHydrated(true)
  }, [])

  useEffect(() => {
    reload()
    const onUpdate = () => reload()
    window.addEventListener('home-content-updated', onUpdate)
    window.addEventListener('storage', onUpdate)
    return () => {
      window.removeEventListener('home-content-updated', onUpdate)
      window.removeEventListener('storage', onUpdate)
    }
  }, [reload])

  const save = useCallback((next: HomeContent) => {
    writeHomeContent(next)
    setContent(next)
  }, [])

  return { content, hydrated, save, reset: () => save(DEFAULT_HOME_CONTENT) }
}
