import type { HomeReviewItem } from '@/lib/homeContent'
import { reviewMatchesProduct, type ProductReviewTarget } from '@/lib/productReviews'
import type { UserReview } from '@/lib/userReviewsStore'

export const HOME_REVIEWS_DISPLAY_LIMIT = 6

export function parseReviewDisplayDate(date: string): number {
  const match = String(date || '')
    .trim()
    .match(/^(\d{1,2})\.(\d{1,2})\.(\d{4})$/)
  if (!match) return 0
  const [, day, month, year] = match
  return new Date(Number(year), Number(month) - 1, Number(day)).getTime()
}

export function reviewRelatesToCatalogProduct(
  productLabel: string,
  products: ProductReviewTarget[]
): boolean {
  const label = productLabel.trim()
  if (!label) return false

  return products.some((product) => {
    if (reviewMatchesProduct({ productLabel: label, rating: 0 }, product)) {
      return true
    }

    const name = product.name.toLowerCase()
    const words = label
      .toLowerCase()
      .split(/\s+/)
      .map((word) => word.replace(/[^a-zа-яё0-9]/gi, ''))
      .filter((word) => word.length > 2)

    return words.length > 0 && words.every((word) => name.includes(word))
  })
}

export function userReviewToCarouselItem(
  review: UserReview,
  replyAuthorLabel: string
): HomeReviewItem {
  return {
    id: review.id,
    authorName: review.authorName,
    date: review.date,
    replyDate: review.replyDate || '',
    productLabel: review.productLabel,
    rating: review.rating,
    text: review.text,
    replyText: review.replyText || (review.status === 'approved' ? '' : ''),
  }
}

export function mergePublishedReviews(
  curated: HomeReviewItem[],
  approvedUserReviews: UserReview[],
  replyAuthorLabel: string
): HomeReviewItem[] {
  const curatedIds = new Set(curated.map((item) => item.id))
  const fromUsers = approvedUserReviews
    .filter((item) => !curatedIds.has(item.id))
    .map((item) => userReviewToCarouselItem(item, replyAuthorLabel))

  return [...fromUsers, ...curated]
}

export function selectHomePageReviews(
  curated: HomeReviewItem[],
  approvedUserReviews: UserReview[],
  replyAuthorLabel: string,
  products: ProductReviewTarget[],
  limit = HOME_REVIEWS_DISPLAY_LIMIT
): HomeReviewItem[] {
  const userReviewIds = new Set(approvedUserReviews.map((item) => item.id))
  const merged = mergePublishedReviews(curated, approvedUserReviews, replyAuthorLabel)

  const filtered = merged.filter((item) => {
    if (userReviewIds.has(item.id)) return true
    return reviewRelatesToCatalogProduct(item.productLabel, products)
  })

  return [...filtered]
    .sort((a, b) => parseReviewDisplayDate(b.date) - parseReviewDisplayDate(a.date))
    .slice(0, limit)
}
