'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import LeaveReviewModal from '@/components/reviews/LeaveReviewModal'
import ReviewAccountAvatar from '@/components/reviews/ReviewAccountAvatar'
import { useAuth } from '@/contexts/AuthContext'
import { useHomeContent } from '@/hooks/useHomeContent'
import { TaggedHeading } from '@/components/ui/RenderTaggedContent'
import { resolveHeadingTag } from '@/lib/contentBlocks'
import { useToast } from '@/contexts/ToastContext'
import type { HomeReviewItem } from '@/lib/homeContent'
import { getCatalogProducts } from '@/lib/api/productsData'
import { fetchCatalogProducts } from '@/lib/api/productsClient'
import type { ProductData } from '@/lib/api/productsData'
import { averageReviewRating } from '@/lib/reviewRating'
import { selectHomePageReviews } from '@/lib/reviewsDisplay'
import { fetchPublishedReviews, readApprovedReviews, submitUserReview } from '@/lib/userReviewsStore'

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-[#C88C39]" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < count ? 'opacity-100' : 'opacity-25'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function ReviewsSection() {
  const { user, loading, openLoginModal } = useAuth()
  const { content } = useHomeContent()
  const { showToast } = useToast()
  const [approvedUserReviews, setApprovedUserReviews] = useState(() => readApprovedReviews())
  const [products, setProducts] = useState<ProductData[]>(() => getCatalogProducts())
  const [index, setIndex] = useState(0)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  useEffect(() => {
    const reload = () => {
      void fetchPublishedReviews().then(setApprovedUserReviews)
    }
    void fetchPublishedReviews().then(setApprovedUserReviews)
    window.addEventListener('user-reviews-updated', reload)
    return () => {
      window.removeEventListener('user-reviews-updated', reload)
    }
  }, [])

  useEffect(() => {
    void fetchCatalogProducts().then((nextProducts) => {
      if (nextProducts.length > 0) {
        setProducts(nextProducts)
      }
    })
  }, [])

  const reviews: HomeReviewItem[] = useMemo(
    () =>
      selectHomePageReviews(
        content.reviews.items,
        approvedUserReviews,
        content.reviews.replyAuthorLabel,
        products
      ),
    [approvedUserReviews, content.reviews.items, content.reviews.replyAuthorLabel, products]
  )

  useEffect(() => {
    setIndex((current) => {
      if (reviews.length === 0) return 0
      return current >= reviews.length ? 0 : current
    })
  }, [reviews.length])

  const total = reviews.length
  const clamped = total > 0 ? ((index % total) + total) % total : 0
  const active = reviews[clamped]

  const goPrev = useCallback(() => {
    if (total === 0) return
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const goNext = useCallback(() => {
    if (total === 0) return
    setIndex((i) => (i + 1) % total)
  }, [total])

  const selectTab = useCallback((i: number) => {
    setIndex(i)
  }, [])

  const handleSubmitReview = useCallback(
    async ({ text, rating }: { text: string; rating: number }) => {
      const authorName =
        [user?.firstName, user?.surname].filter(Boolean).join(' ') || user?.email || 'Покупатель'
      const authorEmail = (user?.email || user?.login || '').trim().toLowerCase()
      const productLabel = active?.productLabel || 'нашу продукцию'

      if (!authorEmail) {
        showToast('Войдите в аккаунт, чтобы оставить отзыв')
        return
      }

      await submitUserReview({
        id: `review-${Date.now()}`,
        authorEmail,
        authorName,
        productId: productLabel.toLowerCase().replace(/\s+/g, '-'),
        productLabel,
        date: new Date().toLocaleDateString('ru-RU'),
        rating,
        text,
      })

      showToast('Спасибо! Отзыв отправлен на модерацию')
    },
    [active?.productLabel, showToast, user?.email, user?.firstName, user?.login, user?.surname]
  )

  const handleLeaveReview = useCallback(() => {
    if (loading) return
    if (!user) {
      openLoginModal()
      return
    }
    setReviewModalOpen(true)
  }, [loading, user, openLoginModal])

  const tabLines = useMemo(
    () => reviews.map((item) => `${item.authorName} ${item.date}`),
    [reviews]
  )

  if (!active) {
    return (
      <section id="reviews" className="relative z-10 bg-[#fdfbf6] py-10 sm:py-12 lg:py-14">
        <div className="container">
          <TaggedHeading
            tag={resolveHeadingTag(content.reviews.sectionTitleTag, 'h2')}
            className="mb-[40px] text-[36px] font-normal leading-tight text-black"
          >
            {content.reviews.sectionTitle}
          </TaggedHeading>
          <p className="text-[#707070]">Отзывов пока нет. Будьте первым!</p>
          <button
            type="button"
            onClick={handleLeaveReview}
            className="mt-6 rounded-lg bg-[#3D8C13] px-6 py-3 text-white hover:bg-[#367c11]"
          >
            {content.reviews.leaveReviewButton}
          </button>
          <LeaveReviewModal
            open={reviewModalOpen}
            onClose={() => setReviewModalOpen(false)}
            productName="нашу продукцию"
            onSubmit={handleSubmitReview}
          />
        </div>
      </section>
    )
  }

  const averageRating = averageReviewRating(reviews)

  return (
    <section id="reviews" className="relative z-10 bg-[#fdfbf6] py-10 sm:py-12 lg:py-14">
      <div className="container">
        <TaggedHeading
          tag={resolveHeadingTag(content.reviews.sectionTitleTag, 'h2')}
          className="mb-[40px] text-[36px] font-normal leading-tight text-black"
        >
          {content.reviews.sectionTitle}
          {reviews.length > 0 ? (
            <span className="ml-3 text-lg text-[#C88C39]">★ {averageRating.toFixed(1)}</span>
          ) : null}
        </TaggedHeading>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          <div className="min-w-0 lg:col-span-8">
            <div className="rounded-xl border border-[#C88C39] bg-[#FFF6E7] p-4 sm:p-5 lg:p-6">
              <div className="rounded-lg border border-[#C88C39] bg-[#FFF6E7] p-4 sm:p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span className="inline-flex w-fit rounded-md border border-[#C88C39] bg-white px-3 py-2 text-[20px] font-normal text-black">
                    Отзыв на {active.productLabel}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={goPrev}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#C88C39] bg-white text-black transition-colors hover:bg-[#FFF6E7]"
                      aria-label="Предыдущий отзыв"
                    >
                      <span className="text-lg leading-none" aria-hidden>
                        ‹
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={goNext}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded border border-[#C88C39] bg-white text-black transition-colors hover:bg-[#FFF6E7]"
                      aria-label="Следующий отзыв"
                    >
                      <span className="text-lg leading-none" aria-hidden>
                        ›
                      </span>
                    </button>
                  </div>
                </div>

                <div className="text-[20px] font-normal leading-relaxed text-black">
                  <div key={active.id} className="review-content-animate space-y-4">
                    <div className="flex flex-wrap items-start gap-3">
                      <ReviewAccountAvatar size="lg" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="font-normal">{active.authorName}</span>
                          <span className="text-black/80">{active.date}</span>
                        </div>
                        <div className="mt-1">
                          <StarRow count={active.rating} />
                        </div>
                      </div>
                    </div>
                    <p>{active.text}</p>

                    {active.replyText ? (
                      <div className="ml-10 border-t border-[#C88C39]/40 pt-4 sm:ml-14 lg:ml-16">
                        <div className="flex flex-wrap items-start gap-3">
                          <ReviewAccountAvatar size="sm" />
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-baseline justify-between gap-2">
                              <span className="font-normal">{content.reviews.replyAuthorLabel}</span>
                              <span className="text-black/80">{active.replyDate}</span>
                            </div>
                            <p className="mt-2">{active.replyText}</p>
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="relative z-10 flex min-w-0 flex-col gap-3 lg:col-span-4">
            <nav className="flex flex-col gap-3" aria-label="Список отзывов">
              {tabLines.map((line, i) => {
                const isActive = i === clamped
                return (
                  <button
                    key={reviews[i]!.id}
                    type="button"
                    onClick={() => selectTab(i)}
                    aria-pressed={isActive}
                    className={`pointer-events-auto w-full rounded-lg border-2 px-4 py-3 text-center font-normal outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[#3D8C13] focus-visible:ring-offset-2 active:scale-[0.98] ${
                      isActive
                        ? 'scale-[1.02] border-[#C88C39] bg-[#FFF6E7] text-[20px] font-medium text-[#C88C39] shadow-md shadow-[#C88C39]/15'
                        : 'border-[#C88C39]/45 bg-white text-[16px] text-black shadow-sm hover:border-[#C88C39] hover:bg-[#FFF6E7]/80 hover:text-[#C88C39]/90'
                    }`}
                  >
                    {line}
                  </button>
                )
              })}
            </nav>
            <button
              type="button"
              onClick={handleLeaveReview}
              className="pointer-events-auto mt-1 w-full rounded-lg bg-[#3D8C13] py-3 text-center text-[20px] font-normal text-white shadow-sm transition-all duration-200 hover:bg-[#367c11] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C39] focus-visible:ring-offset-2"
            >
              {content.reviews.leaveReviewButton}
            </button>
          </aside>
        </div>
      </div>

      <LeaveReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productName={active.productLabel}
        onSubmit={handleSubmitReview}
      />
    </section>
  )
}
