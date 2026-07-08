import type { HomeReviewItem } from '@/lib/homeContent'

export function averageReviewRating(reviews: Pick<HomeReviewItem, 'rating'>[]) {
  if (!reviews.length) return 0
  const sum = reviews.reduce((acc, item) => acc + (Number(item.rating) || 0), 0)
  return Math.round((sum / reviews.length) * 10) / 10
}

export function formatStarString(rating: number) {
  const rounded = Math.round(rating)
  return Array.from({ length: 5 }, (_, index) => (index < rounded ? '★' : '☆')).join('')
}
