'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { getFavoriteItemNameFromStorage } from '@/lib/favoriteItems'
import { useToast } from '@/contexts/ToastContext'

const STORAGE_KEY = 'korovushkino-favorites'

interface FavoritesContextType {
  favoriteIds: string[]
  toggleFavorite: (productId: string) => void
  removeFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  favoriteCount: number
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as unknown
        if (Array.isArray(parsed) && parsed.every((id) => typeof id === 'string')) {
          setFavoriteIds(parsed)
        }
      }
    } catch {
      console.error('[Favorites] Не удалось прочитать localStorage')
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favoriteIds))
  }, [favoriteIds, hydrated])

  const toggleFavorite = useCallback(
    (productId: string) => {
      const adding = !favoriteIds.includes(productId)

      setFavoriteIds((prev) =>
        prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
      )

      if (adding) {
        const productName = getFavoriteItemNameFromStorage(productId)
        showToast(
          productName ? `${productName} добавлен в избранное` : 'Товар добавлен в избранное',
        )
      }
    },
    [favoriteIds, showToast],
  )

  const removeFavorite = useCallback((productId: string) => {
    setFavoriteIds((prev) => prev.filter((id) => id !== productId))
  }, [])

  const isFavorite = useCallback(
    (productId: string) => favoriteIds.includes(productId),
    [favoriteIds],
  )

  const favoriteCount = favoriteIds.length

  const value = useMemo(
    () => ({
      favoriteIds,
      toggleFavorite,
      removeFavorite,
      isFavorite,
      favoriteCount,
    }),
    [favoriteIds, toggleFavorite, removeFavorite, isFavorite, favoriteCount],
  )

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider')
  }
  return context
}
