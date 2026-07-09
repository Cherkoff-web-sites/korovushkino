'use client'

import { useCallback, useEffect, useState } from 'react'
import LeaveReviewModal from '@/components/reviews/LeaveReviewModal'
import ReviewAccountAvatar from '@/components/reviews/ReviewAccountAvatar'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/contexts/ToastContext'
import { useHomeContent } from '@/hooks/useHomeContent'
import { useUserOrders } from '@/hooks/useUserOrders'
import {
  fetchMyReviews,
  getReviewableProducts,
  REVIEW_STATUS_LABELS,
  submitUserReview,
  type UserReview,
} from '@/lib/userReviewsStore'
import AccountSectionCard from '../components/AccountSectionCard'

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5 text-[#C88C39]" aria-hidden>
      {Array.from({ length: 5 }, (_, index) => (
        <span key={index} className={index < count ? 'opacity-100' : 'opacity-25'}>
          ★
        </span>
      ))}
    </div>
  )
}

export default function AccountReviewsPage() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const { content: homeContent } = useHomeContent()
  const { orders, loading: ordersLoading } = useUserOrders()
  const email = user?.email || user?.login || ''

  const [reviews, setReviews] = useState<UserReview[]>([])
  const [reviewTarget, setReviewTarget] = useState<{ id: string; name: string; orderId: string } | null>(
    null
  )

  const reloadReviews = useCallback(async () => {
    if (!email) {
      setReviews([])
      return
    }
    setReviews(await fetchMyReviews())
  }, [email])

  useEffect(() => {
    void reloadReviews()
    const onUpdate = () => void reloadReviews()
    window.addEventListener('user-reviews-updated', onUpdate)
    return () => {
      window.removeEventListener('user-reviews-updated', onUpdate)
    }
  }, [reloadReviews])

  const reviewable = email ? getReviewableProducts(orders, email) : []

  async function handleSubmitReview({ text, rating }: { text: string; rating: number }) {
    if (!user || !reviewTarget) return

    const authorName =
      [user.firstName, user.surname].filter(Boolean).join(' ') || user.email || user.login || 'Покупатель'

    const review: Omit<UserReview, 'status'> = {
      id: `review-${Date.now()}`,
      authorEmail: email,
      authorName,
      productId: reviewTarget.id,
      productLabel: reviewTarget.name,
      orderId: reviewTarget.orderId,
      date: new Date().toLocaleDateString('ru-RU'),
      rating,
      text,
    }

    await submitUserReview(review)
    await reloadReviews()
    setReviewTarget(null)
    showToast('Отзыв отправлен на модерацию')
  }

  return (
    <AccountSectionCard title="Отзывы">
      {reviewable.length > 0 ? (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-semibold text-black">Оставить отзыв о покупке</h2>
          <ul className="space-y-3">
            {reviewable.map((product) => (
              <li
                key={product.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#D2B48C]/50 bg-white/70 px-4 py-3"
              >
                <div>
                  <p className="font-medium text-black">{product.name}</p>
                  <p className="text-xs text-[#707070]">Заказ {product.orderId}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setReviewTarget(product)}
                  className="rounded-full bg-[#3D8C13] px-4 py-2 text-sm font-medium text-white hover:bg-[#367c11]"
                >
                  Написать отзыв
                </button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section>
        <h2 className="mb-4 text-lg font-semibold text-black">Мои отзывы</h2>

        {ordersLoading ? (
          <p className="text-sm text-[#707070]">Загрузка...</p>
        ) : reviews.length === 0 ? (
          <div className="rounded-xl border border-[#D2B48C]/50 bg-white/60 px-6 py-12 text-center">
            <p className="text-lg text-[#232326]/80">Вы ещё не оставляли отзывов</p>
            <p className="mt-2 text-sm text-[#232326]/60">
              После заказа здесь появится возможность оценить купленные товары.
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {reviews.map((review) => (
              <li
                key={review.id}
                className="rounded-xl border border-[#D2B48C]/50 bg-white/70 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-black">{review.productLabel}</p>
                    <p className="mt-1 text-xs text-[#707070]">{review.date}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${
                        review.status === 'pending'
                          ? 'bg-[#FFF4E3] text-[#C88C39]'
                          : review.status === 'approved'
                            ? 'bg-[#E8F5E1] text-[#3D8C13]'
                            : 'bg-[#FCECEC] text-[#B42318]'
                      }`}
                    >
                      {REVIEW_STATUS_LABELS[review.status]}
                    </span>
                    <div className="mt-2">
                      <StarRow count={review.rating} />
                    </div>
                  </div>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#232326]">{review.text}</p>

                {review.replyText?.trim() ? (
                  <div className="ml-4 mt-5 rounded-lg border border-[#D2B48C]/80 bg-[#FFF6E7] p-4 sm:ml-6 sm:p-5">
                    <div className="flex flex-wrap items-start gap-3">
                      <ReviewAccountAvatar size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline justify-between gap-2">
                          <span className="text-sm font-medium text-black">
                            {homeContent.reviews.replyAuthorLabel}
                          </span>
                          {review.replyDate ? (
                            <time className="text-xs text-[#707070]" dateTime={review.replyDate}>
                              {review.replyDate}
                            </time>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm leading-relaxed text-[#232326]">{review.replyText}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <LeaveReviewModal
        open={reviewTarget !== null}
        onClose={() => setReviewTarget(null)}
        productName={reviewTarget?.name ?? ''}
        onSubmit={handleSubmitReview}
      />
    </AccountSectionCard>
  )
}
