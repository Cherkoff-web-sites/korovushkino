'use client'

import Image from 'next/image'
import { useFavorites } from '@/contexts/FavoritesContext'

const FAVORITES_ICON = '/images/header/icon-favorites.svg'

type FavoriteHeartButtonProps = {
  productId: string
  iconSize?: number
  className?: string
}

/** Та же иконка, что в шапке (`icon-favorites.svg`). Активное состояние — рамка и фон кнопки. */
export default function FavoriteHeartButton({
  productId,
  iconSize = 22,
  className = '',
}: FavoriteHeartButtonProps) {
  const { toggleFavorite, isFavorite } = useFavorites()
  const active = isFavorite(productId)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleFavorite(productId)
      }}
      aria-pressed={active}
      aria-label={active ? 'Убрать из избранного' : 'В избранное'}
      className={`inline-flex shrink-0 items-center justify-center rounded-[10px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8C13] focus-visible:ring-offset-2 ${
        active
          ? 'border border-red-500 bg-red-50 text-red-600 shadow-sm hover:bg-red-100'
          : 'border border-neutral-400/90 bg-white text-[#232326] shadow-sm hover:border-neutral-500'
      } ${className}`}
    >
      <Image src={FAVORITES_ICON} alt="" width={iconSize} height={iconSize} className="shrink-0 object-contain" />
    </button>
  )
}
