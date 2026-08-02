'use client'

import { useEffect, useMemo, useState } from 'react'
import type { ProductData } from '@/lib/api/productsData'
import { buildPublishedReviewList, getProductRatingStats } from '@/lib/productReviews'
import { fetchPublishedReviews, type UserReview } from '@/lib/userReviewsStore'

/** Ratings for catalog cards — only published reviews API, no heavy home content. */
export function usePublishedProductRatings(products: ProductData[]) {
  const [approvedUserReviews, setApprovedUserReviews] = useState<UserReview[]>([])

  useEffect(() => {
    let cancelled = false
    void fetchPublishedReviews().then((reviews) => {
      if (!cancelled) setApprovedUserReviews(reviews)
    })
    const onUpdate = () => {
      void fetchPublishedReviews().then((reviews) => {
        if (!cancelled) setApprovedUserReviews(reviews)
      })
    }
    window.addEventListener('user-reviews-updated', onUpdate)
    return () => {
      cancelled = true
      window.removeEventListener('user-reviews-updated', onUpdate)
    }
  }, [])

  const publishedReviews = useMemo(
    () => buildPublishedReviewList([], approvedUserReviews),
    [approvedUserReviews]
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
