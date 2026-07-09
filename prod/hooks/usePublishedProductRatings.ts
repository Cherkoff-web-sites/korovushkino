'use client'

import { useEffect, useMemo, useState } from 'react'
import { useHomeContent } from '@/hooks/useHomeContent'
import type { ProductData } from '@/lib/api/productsData'
import { buildPublishedReviewList, getProductRatingStats } from '@/lib/productReviews'
import { fetchPublishedReviews, type UserReview } from '@/lib/userReviewsStore'

export function usePublishedProductRatings(products: ProductData[]) {
  const { content: homeContent } = useHomeContent()
  const [approvedUserReviews, setApprovedUserReviews] = useState<UserReview[]>([])

  useEffect(() => {
    void fetchPublishedReviews().then(setApprovedUserReviews)
    const onUpdate = () => {
      void fetchPublishedReviews().then(setApprovedUserReviews)
    }
    window.addEventListener('user-reviews-updated', onUpdate)
    return () => window.removeEventListener('user-reviews-updated', onUpdate)
  }, [])

  const publishedReviews = useMemo(
    () => buildPublishedReviewList(homeContent.reviews.items, approvedUserReviews),
    [approvedUserReviews, homeContent.reviews.items]
  )

  const ratingsByProductId = useMemo(() => {
    const map = new Map<string, { rating: number; count: number }>()
    for (const product of products) {
      const stats = getProductRatingStats(publishedReviews, product)
      map.set(product.id, { rating: stats.rating, count: stats.count })
    }
    return map
  }, [products, publishedReviews])

  return { ratingsByProductId, publishedReviews }
}
