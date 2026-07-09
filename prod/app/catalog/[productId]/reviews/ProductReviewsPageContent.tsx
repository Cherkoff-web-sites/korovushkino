'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import ReviewAccountAvatar from '@/components/reviews/ReviewAccountAvatar'
import { useHomeContent } from '@/hooks/useHomeContent'
import type { ProductData } from '@/lib/api/productsData'
import { CATEGORY_LABELS } from '@/lib/api/productsData'
import { productReviewsHref } from '@/lib/catalogPaths'
import { productPublicPath } from '@/lib/productSeo'
import { formatStarString } from '@/lib/reviewRating'
import { getProductRatingStats, getReviewsForProduct } from '@/lib/productReviews'
import { mergePublishedReviews } from '@/lib/reviewsDisplay'
import { fetchPublishedReviews, type UserReview } from '@/lib/userReviewsStore'

const PLACEHOLDER = '/images/home/hero-bg.png'

function StarsFilled({ count, suffix }: { count: number; suffix: string }) {
  return (
    <div className="flex gap-0.5 text-[#C88C39]" aria-hidden>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={`star-${suffix}-${i}`}
          className={`text-base sm:text-lg ${i < count ? 'opacity-100' : 'opacity-25'}`}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default function ProductReviewsPageContent({ product }: { product: ProductData }) {
  const { content: homeContent } = useHomeContent()
  const [approvedUserReviews, setApprovedUserReviews] = useState<UserReview[]>([])

  useEffect(() => {
    void fetchPublishedReviews().then(setApprovedUserReviews)
  }, [])

  const publishedReviews = useMemo(
    () =>
      mergePublishedReviews(
        homeContent.reviews.items,
        approvedUserReviews,
        homeContent.reviews.replyAuthorLabel
      ),
    [approvedUserReviews, homeContent.reviews.items, homeContent.reviews.replyAuthorLabel]
  )

  const productReviews = useMemo(
    () => getReviewsForProduct(publishedReviews, product),
    [publishedReviews, product]
  )
  const { rating } = getProductRatingStats(publishedReviews, product)

  const mainImage = product.images[0] ?? PLACEHOLDER
  const categoryHref = `/catalog?category=${product.categorySlug}`
  const categoryLabel = CATEGORY_LABELS[product.categorySlug]

  return (
    <div className="min-h-screen bg-white">
      <div className="h-1 w-full bg-[#3D8C13]" aria-hidden />

      <section className="border-b border-[#E5DECF] py-6 sm:py-8">
        <div className="container">
          <nav className="mb-4 text-sm text-[#232326]/55 sm:text-[15px]" aria-label="Навигация">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="transition-colors hover:text-[#232326]">
                  Главная
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href="/catalog" className="transition-colors hover:text-[#232326]">
                  Каталог
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href={categoryHref} className="transition-colors hover:text-[#232326]">
                  {categoryLabel}
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li>
                <Link href={productPublicPath(product)} className="transition-colors hover:text-[#232326]">
                  {product.name}
                </Link>
              </li>
              <li className="text-[#232326]/35" aria-hidden>
                •
              </li>
              <li className="text-[#232326]/70">Отзывы</li>
            </ol>
          </nav>

          <h1 className="text-[28px] font-normal leading-tight text-[#1F1F1F] sm:text-[32px] lg:text-[36px]">
            Отзывы: {product.name}
          </h1>
        </div>
      </section>

      <section className="py-8 sm:py-10 lg:py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
            <div className="min-w-0 space-y-5 lg:col-span-8">
              {productReviews.length === 0 ? (
                <p className="rounded-xl border border-[#D2B48C] bg-[#FFF8E7] p-6 text-sm text-[#707070] sm:text-[15px]">
                  Пока нет опубликованных отзывов об этом товаре.
                </p>
              ) : (
                productReviews.map((review) => (
                  <article
                    key={review.id}
                    className="rounded-xl border border-[#D2B48C] bg-[#FFF8E7] p-5 sm:p-6"
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <ReviewAccountAvatar size="md" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-base font-medium text-black">{review.authorName}</span>
                          <time className="text-sm text-[#232326]/70" dateTime={review.date}>
                            {review.date}
                          </time>
                        </div>
                        <div className="mt-2">
                          <StarsFilled count={review.rating} suffix={review.id} />
                        </div>
                      </div>
                    </div>

                    <p className="mt-4 text-sm leading-relaxed text-black sm:text-[15px]">{review.text}</p>

                    {review.replyText ? (
                      <div className="ml-8 mt-5 rounded-lg border border-[#D2B48C]/80 bg-[#FFF6E7] p-4 sm:ml-12 sm:p-5 lg:ml-14">
                        <div className="flex flex-wrap items-start gap-3">
                          <ReviewAccountAvatar size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="text-sm font-medium text-black">
                                {homeContent.reviews.replyAuthorLabel}
                              </span>
                              {review.replyDate ? (
                                <time className="text-sm text-[#232326]/70" dateTime={review.replyDate}>
                                  {review.replyDate}
                                </time>
                              ) : null}
                            </div>
                            <p className="mt-2 text-sm leading-relaxed text-black sm:text-[15px]">
                              {review.replyText}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </article>
                ))
              )}
            </div>

            <aside className="lg:col-span-4">
              <div className="lg:sticky lg:top-28">
                <div className="overflow-hidden rounded-xl border border-[#D2B48C] bg-[#FFF8E7] p-5 sm:p-6">
                  <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[#F5F0E8]">
                    <Image
                      src={mainImage}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 320px"
                    />
                  </div>
                  <h2 className="mt-5 text-xl font-bold leading-tight text-black sm:text-2xl">{product.name}</h2>
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <span className="text-base text-black">
                      {rating > 0 ? `Рейтинг ${rating}` : 'Нет оценок'}
                    </span>
                    {rating > 0 ? (
                      <span className="text-2xl leading-none text-[#C88C39]" aria-hidden>
                        {formatStarString(rating)}
                      </span>
                    ) : null}
                  </div>
                  <Link
                    href={productPublicPath(product)}
                    className="mt-6 inline-block text-sm font-medium text-[#3D8C13] underline-offset-2 hover:underline"
                  >
                    ← К товару
                  </Link>
                  <Link
                    href={productReviewsHref(product)}
                    className="mt-3 block text-sm text-[#707070] hover:text-[#3D8C13]"
                  >
                    Все отзывы о товаре
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </div>
  )
}
