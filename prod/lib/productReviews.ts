import type { ProductData } from '@/lib/api/productsData'
import type { HomeReviewItem } from '@/lib/homeContent'
import { productUrlSlug } from '@/lib/productSeo'
import { averageReviewRating } from '@/lib/reviewRating'
import type { UserReview } from '@/lib/userReviewsStore'

export type ReviewLike = Pick<HomeReviewItem, 'productLabel' | 'rating'> & {
  productId?: string
}

function slugifyLabel(label: string) {
  return label.trim().toLowerCase().replace(/\s+/g, '-')
}

export function reviewMatchesProduct(review: ReviewLike, product: ProductData): boolean {
  const slug = productUrlSlug(product)
  const reviewProductId = String(review.productId || '').trim()
  const label = String(review.productLabel || '').trim()
  const labelSlug = slugifyLabel(label)

  if (reviewProductId && (reviewProductId === product.id || reviewProductId === slug)) {
    return true
  }

  if (label && label.toLowerCase() === product.name.trim().toLowerCase()) {
    return true
  }

  if (labelSlug && (labelSlug === product.id || labelSlug === slug)) {
    return true
  }

  return false
}

export function getReviewsForProduct<T extends ReviewLike>(reviews: T[], product: ProductData): T[] {
  return reviews.filter((review) => reviewMatchesProduct(review, product))
}

export function getProductRatingStats(reviews: ReviewLike[], product: ProductData) {
  const productReviews = getReviewsForProduct(reviews, product)
  return {
    rating: productReviews.length ? averageReviewRating(productReviews) : 0,
    count: productReviews.length,
    reviews: productReviews,
  }
}

export function buildPublishedReviewList(
  curated: HomeReviewItem[],
  approvedUserReviews: UserReview[]
): ReviewLike[] {
  const curatedIds = new Set(curated.map((item) => item.id))
  const fromUsers = approvedUserReviews
    .filter((item) => !curatedIds.has(item.id))
    .map((item) => ({
      productId: item.productId,
      productLabel: item.productLabel,
      rating: item.rating,
    }))

  return [
    ...fromUsers,
    ...curated.map((item) => ({
      productId: slugifyLabel(item.productLabel),
      productLabel: item.productLabel,
      rating: item.rating,
    })),
  ]
}
