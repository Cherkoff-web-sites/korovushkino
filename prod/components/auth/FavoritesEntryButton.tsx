'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useFavorites } from '@/contexts/FavoritesContext'

type FavoritesEntryButtonProps = {
  className?: string
  onNavigate?: () => void
}

export default function FavoritesEntryButton({ className, onNavigate }: FavoritesEntryButtonProps) {
  const { user, loading, openLoginModal } = useAuth()
  const { favoriteCount } = useFavorites()

  const icon = <Image src="/images/header/icon-favorites.svg" alt="" width={22} height={22} />

  const badge =
    favoriteCount > 0 ? (
      <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-600 px-0.5 text-[10px] font-bold leading-none text-white ring-2 ring-[#3D8C13]">
        {favoriteCount > 9 ? '9+' : favoriteCount}
      </span>
    ) : null

  if (loading) {
    return (
      <span className={`relative ${className ?? ''}`} aria-label="Избранное" aria-busy="true">
        {icon}
        {badge}
      </span>
    )
  }

  if (user) {
    return (
      <Link
        href="/account/favorites"
        onClick={onNavigate}
        className={`relative ${className ?? ''}`}
        aria-label={`Избранное${favoriteCount > 0 ? `, ${favoriteCount}` : ''}`}
      >
        {icon}
        {badge}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={() => {
        openLoginModal()
        onNavigate?.()
      }}
      className={`relative ${className ?? ''}`}
      aria-label="Войти, чтобы открыть избранное"
    >
      {icon}
      {badge}
    </button>
  )
}
