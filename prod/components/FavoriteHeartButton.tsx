'use client'

import { useFavorites } from '@/contexts/FavoritesContext'

const FAVORITE_ACTIVE = '#BD1B1B'
const FAVORITE_INACTIVE = '#0B2B05'

const HEART_OUTLINE_PATH =
  'M23.0976 2.39276C20.3572 1.9238 17.7501 2.65689 15.9032 4.33415C14.7589 2.14502 12.5674 0.590731 9.82696 0.121774C7.64514 -0.249138 5.40082 0.235038 3.58637 1.46808C1.77192 2.70111 0.535523 4.58232 0.148428 6.69898C-1.48954 15.7145 10.9582 25.3691 11.49 25.7708C11.6299 25.878 11.794 25.9556 11.9695 25.9856C12.1451 26.0157 12.3266 25.9972 12.4959 25.9429C13.1372 25.7419 28.2366 20.8015 29.8745 11.786C30.2567 9.66846 29.7578 7.49032 28.4873 5.72935C27.2168 3.96839 25.2785 2.76844 23.0976 2.39276ZM2.27172 7.06234C1.0154 13.9773 10.1978 21.9854 12.372 23.7704C15.0417 22.813 26.4968 18.3272 27.7512 11.4226C28.0345 9.85158 27.6642 8.23571 26.7217 6.92924C25.7791 5.62279 24.3411 4.73245 22.7231 4.45346C20.142 4.01175 17.7332 4.97134 16.4381 6.96345C16.3237 7.13874 16.1583 7.27708 15.9628 7.36092C15.7673 7.44475 15.5505 7.47027 15.34 7.43425C15.1295 7.39822 14.9348 7.30228 14.7806 7.1586C14.6264 7.01493 14.5197 6.83001 14.474 6.62735C13.9583 4.32934 12.0337 2.62418 9.45254 2.18248C7.83384 1.90757 6.16884 2.26691 4.82271 3.1817C3.47657 4.09649 2.55918 5.49204 2.27172 7.06234Z'

const HEART_FILLED_PATH =
  'M23.0976 2.39276C20.3572 1.9238 17.7501 2.65689 15.9032 4.33415C14.7589 2.14502 12.5674 0.590731 9.82696 0.121774C7.64514 -0.249138 5.40082 0.235038 3.58637 1.46808C1.77192 2.70111 0.535523 4.58232 0.148428 6.69898C-1.48954 15.7145 10.9582 25.3691 11.49 25.7708C11.6299 25.878 11.794 25.9556 11.9695 25.9856C12.1451 26.0157 12.3266 25.9972 12.4959 25.9429C13.1372 25.7419 28.2366 20.8015 29.8745 11.786C30.2567 9.66846 29.7578 7.49032 28.4873 5.72935C27.2168 3.96839 25.2785 2.76844 23.0976 2.39276Z'

type FavoriteHeartButtonProps = {
  productId: string
  iconSize?: number
  className?: string
}

function HeartIcon({ filled, size }: { filled: boolean; size: number }) {
  const height = Math.round((size * 26) / 30)

  return (
    <svg
      width={size}
      height={height}
      viewBox="0 0 30 26"
      fill="none"
      aria-hidden
      className="shrink-0 transition-transform duration-200 ease-out"
    >
      <path
        fillRule={filled ? 'nonzero' : 'evenodd'}
        clipRule={filled ? undefined : 'evenodd'}
        d={filled ? HEART_FILLED_PATH : HEART_OUTLINE_PATH}
        fill={filled ? FAVORITE_ACTIVE : FAVORITE_INACTIVE}
        className="transition-[fill] duration-200 ease-out"
      />
    </svg>
  )
}

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
      className={`inline-flex shrink-0 items-center justify-center rounded-[10px] border border-neutral-400/90 bg-white text-[#232326] shadow-sm transition-colors hover:border-neutral-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3D8C13] focus-visible:ring-offset-2 ${className}`}
    >
      <HeartIcon filled={active} size={iconSize} />
    </button>
  )
}
