import type { HomeReviewItem } from '@/lib/homeContent'
import type { UserReview } from '@/lib/userReviewsStore'

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
