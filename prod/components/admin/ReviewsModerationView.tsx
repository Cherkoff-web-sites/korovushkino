'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  moderateReviewOnApi,
  REVIEW_STATUS_LABELS,
  syncReviewsFromApi,
  type ReviewModerationStatus,
  type UserReview,
} from '@/lib/userReviewsStore'
import { adminInputClass, adminPanelClass, adminTableHeadClass } from './adminStyles'

const FILTERS: Array<{ id: 'all' | ReviewModerationStatus; label: string }> = [
  { id: 'pending', label: 'На модерации' },
  { id: 'approved', label: 'Опубликованные' },
  { id: 'rejected', label: 'Отклонённые' },
  { id: 'all', label: 'Все' },
]

function StarRow({ count }: { count: number }) {
  return (
    <span className="text-[#C88C39]">
      {Array.from({ length: 5 }, (_, index) => (index < count ? '★' : '☆')).join('')}
    </span>
  )
}

export default function ReviewsModerationView() {
  const [reviews, setReviews] = useState<UserReview[]>([])
  const [filter, setFilter] = useState<'all' | ReviewModerationStatus>('pending')
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({})

  const reload = useCallback(async () => {
    const merged = await syncReviewsFromApi()
    setReviews(merged)
  }, [])

  useEffect(() => {
    void reload()
    window.addEventListener('user-reviews-updated', reload)
    return () => {
      window.removeEventListener('user-reviews-updated', reload)
    }
  }, [reload])

  const filtered = useMemo(() => {
    if (filter === 'all') return reviews
    return reviews.filter((item) => item.status === filter)
  }, [filter, reviews])

  async function handleModerate(id: string, status: ReviewModerationStatus) {
    await moderateReviewOnApi(id, status, {
      replyText: replyDrafts[id] || '',
    })
    await reload()
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Удалить этот отзыв?')) return
    const { request } = await import('@/lib/api/httpClient')
    await request(`/api/admin/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' })
    await reload()
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-semibold text-[#1F1F1F] sm:text-[28px]">Модерация отзывов</h1>
        <p className="mt-1 text-sm text-[#707070]">
          Отзывы пользователей после оформления заказа. Опубликованные появляются на главной странице.
        </p>
      </div>

      <div className={`${adminPanelClass} mb-4 flex flex-wrap gap-2 p-3`}>
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setFilter(item.id)}
            className={`rounded-lg px-3 py-2 text-sm transition-colors ${
              filter === item.id
                ? 'bg-[#3D8C13] text-white'
                : 'bg-[#f7f8fa] text-[#707070] hover:bg-[#eef0f4]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className={`${adminPanelClass} px-4 py-12 text-center text-[#707070]`}>
            Отзывов в этой категории нет
          </div>
        ) : (
          filtered.map((review) => (
            <article key={review.id} className={`${adminPanelClass} p-4 sm:p-5`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-medium text-[#1F1F1F]">{review.authorName}</p>
                  <p className="text-sm text-[#707070]">{review.authorEmail}</p>
                  <p className="mt-1 text-sm text-[#707070]">{review.date}</p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
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

              <p className="mt-3 text-sm font-medium text-black">Товар: {review.productLabel}</p>
              {review.orderId ? (
                <p className="text-xs text-[#707070]">Заказ: {review.orderId}</p>
              ) : null}
              <p className="mt-3 text-sm leading-relaxed text-[#232326]">{review.text}</p>

              <label className="mt-4 block">
                <span className="mb-1.5 block text-xs text-[#707070]">Ответ магазина (необязательно)</span>
                <textarea
                  rows={2}
                  value={replyDrafts[review.id] ?? review.replyText ?? ''}
                  onChange={(event) =>
                    setReplyDrafts((prev) => ({ ...prev, [review.id]: event.target.value }))
                  }
                  className={`${adminInputClass} resize-y`}
                  placeholder="Спасибо за отзыв!"
                />
              </label>

              <div className="mt-4 flex flex-wrap gap-2">
                {review.status !== 'approved' ? (
                  <button
                    type="button"
                    onClick={() => void handleModerate(review.id, 'approved')}
                    className="rounded-lg bg-[#3D8C13] px-4 py-2 text-sm font-medium text-white hover:bg-[#367c11]"
                  >
                    Опубликовать
                  </button>
                ) : null}
                {review.status !== 'rejected' ? (
                  <button
                    type="button"
                    onClick={() => void handleModerate(review.id, 'rejected')}
                    className="rounded-lg border border-[#e2e4ea] px-4 py-2 text-sm text-[#707070] hover:bg-[#f7f8fa]"
                  >
                    Отклонить
                  </button>
                ) : null}
                {review.status !== 'pending' ? (
                  <button
                    type="button"
                    onClick={() => void handleModerate(review.id, 'pending')}
                    className="rounded-lg border border-[#e2e4ea] px-4 py-2 text-sm text-[#707070] hover:bg-[#f7f8fa]"
                  >
                    Вернуть на модерацию
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => void handleDelete(review.id)}
                  className="rounded-lg border border-red-200 px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                >
                  Удалить
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  )
}
