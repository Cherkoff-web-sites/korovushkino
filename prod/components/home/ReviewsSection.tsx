'use client'

import { useCallback, useState } from 'react'
import LeaveReviewModal from '@/components/reviews/LeaveReviewModal'
import { useAuth } from '@/contexts/AuthContext'
import {
  HOME_REVIEW_BODY,
  HOME_REVIEW_VARIANTS,
  buildReviewCards,
} from '@/lib/reviewsData'

type ReviewItem = ReturnType<typeof buildReviewCards>[number] & {
  tabLine: string
  productLabel: string
}

function buildHomeReviews(): ReviewItem[] {
  const cards = buildReviewCards([...HOME_REVIEW_VARIANTS], HOME_REVIEW_BODY)
  return HOME_REVIEW_VARIANTS.map((v, i) => ({
    ...cards[i]!,
    tabLine: `${v.authorName} ${v.date}`,
    productLabel: 'Козье молоко',
  }))
}

const REVIEWS = buildHomeReviews()

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
  const [index, setIndex] = useState(0)
  const [reviewModalOpen, setReviewModalOpen] = useState(false)

  const total = REVIEWS.length
  const clamped = ((index % total) + total) % total
  const active = REVIEWS[clamped]!

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + total) % total)
  }, [total])

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % total)
  }, [total])

  const selectTab = useCallback((i: number) => {
    setIndex(i)
  }, [])

  const handleLeaveReview = useCallback(() => {
    if (loading) return
    if (!user) {
      openLoginModal()
      return
    }
    setReviewModalOpen(true)
  }, [loading, user, openLoginModal])

  return (
    <section id="reviews" className="relative z-10 bg-[#fdfbf6] py-10 sm:py-12 lg:py-14">
      <div className="container">
        <h2 className="mb-[40px] text-[36px] font-normal leading-tight text-black">Отзывы</h2>

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
                  <div
                    key={active.id}
                    className="review-content-animate space-y-4"
                  >
                    <div className="flex flex-wrap items-start gap-3">
                      <div
                        className="h-14 w-14 shrink-0 rounded bg-[#c4c4c4]"
                        aria-hidden
                      />
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

                    <div className="border-t border-[#C88C39]/40 pt-4">
                      <div className="flex flex-wrap items-start gap-3">
                        <div
                          className="h-10 w-10 shrink-0 rounded bg-[#c4c4c4]"
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <span className="font-normal">{active.reply.authorLabel}</span>
                            <span className="text-black/80">{active.reply.date}</span>
                          </div>
                          <p className="mt-2">{active.reply.text}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <aside className="relative z-10 flex min-w-0 flex-col gap-3 lg:col-span-4">
            <nav className="flex flex-col gap-3" aria-label="Список отзывов">
              {REVIEWS.map((r, i) => {
                const isActive = i === clamped
                return (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => selectTab(i)}
                    aria-pressed={isActive}
                    className={`pointer-events-auto w-full rounded-lg border-2 px-4 py-3 text-center font-normal outline-none transition-all duration-200 ease-out focus-visible:ring-2 focus-visible:ring-[#3D8C13] focus-visible:ring-offset-2 active:scale-[0.98] ${
                      isActive
                        ? 'scale-[1.02] border-[#C88C39] bg-[#FFF6E7] text-[20px] font-medium text-[#C88C39] shadow-md shadow-[#C88C39]/15'
                        : 'border-[#C88C39]/45 bg-white text-[16px] text-black shadow-sm hover:border-[#C88C39] hover:bg-[#FFF6E7]/80 hover:text-[#C88C39]/90'
                    }`}
                  >
                    {r.tabLine}
                  </button>
                )
              })}
            </nav>
            <button
              type="button"
              onClick={handleLeaveReview}
              className="pointer-events-auto mt-1 w-full rounded-lg bg-[#3D8C13] py-3 text-center text-[20px] font-normal text-white shadow-sm transition-all duration-200 hover:bg-[#367c11] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C39] focus-visible:ring-offset-2"
            >
              Оставить отзыв
            </button>
          </aside>
        </div>
      </div>

      <LeaveReviewModal
        open={reviewModalOpen}
        onClose={() => setReviewModalOpen(false)}
        productName={active.productLabel}
      />
    </section>
  )
}
