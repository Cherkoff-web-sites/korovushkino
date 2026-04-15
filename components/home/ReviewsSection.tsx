'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

type ReviewItem = {
  id: string
  productLabel: string
  authorName: string
  date: string
  rating: number
  text: string
  reply: {
    authorLabel: string
    date: string
    text: string
  }
  tabLine: string
}

const REVIEW_TEMPLATE = {
  productLabel: 'Козье молоко',
  rating: 5,
  text: 'Очень вкусное, натуральное молоко. Без запаха, очень приятно пить его. Буду заказывать еще!',
  replyAuthorLabel: 'Семейная ферма «Коровушкино»',
} as const

function replyTextForAuthor(name: string) {
  return `Здравствуйте, ${name}! Большое спасибо за положительный отзыв)`
}

const REVIEW_VARIANTS = [
  { id: '1', authorName: 'Наталья', date: '15.03.2026', replyDate: '16.03.2026' },
  { id: '2', authorName: 'Яна', date: '19.10.2025', replyDate: '20.10.2025' },
  { id: '3', authorName: 'Елена', date: '08.11.2025', replyDate: '09.11.2025' },
  { id: '4', authorName: 'Евгения', date: '10.01.2026', replyDate: '11.01.2026' },
  { id: '5', authorName: 'Виктор', date: '19.02.2026', replyDate: '20.02.2026' },
  { id: '6', authorName: 'Ольга', date: '25.02.2026', replyDate: '26.02.2026' },
] as const

const REVIEWS: ReviewItem[] = REVIEW_VARIANTS.map((v) => ({
  id: v.id,
  productLabel: REVIEW_TEMPLATE.productLabel,
  authorName: v.authorName,
  date: v.date,
  rating: REVIEW_TEMPLATE.rating,
  text: REVIEW_TEMPLATE.text,
  reply: {
    authorLabel: REVIEW_TEMPLATE.replyAuthorLabel,
    date: v.replyDate,
    text: replyTextForAuthor(v.authorName),
  },
  tabLine: `${v.authorName} ${v.date}`,
}))

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
  const [index, setIndex] = useState(0)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const prevClampedRef = useRef<number | null>(null)

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

  useEffect(() => {
    if (prevClampedRef.current === null) {
      prevClampedRef.current = clamped
      return
    }
    if (prevClampedRef.current === clamped) return
    prevClampedRef.current = clamped
    const el = tabRefs.current[clamped]
    if (!el) return
    const t = window.setTimeout(() => {
      try {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      } catch {
        el.scrollIntoView({ block: 'nearest' })
      }
    }, 0)
    return () => window.clearTimeout(t)
  }, [clamped])

  return (
    <section className="relative z-10 bg-[#fdfbf6] py-10 sm:py-12 lg:py-14">
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
                    ref={(el) => {
                      tabRefs.current[i] = el
                    }}
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
              className="pointer-events-auto mt-1 w-full rounded-lg bg-[#3D8C13] py-3 text-center text-[20px] font-normal text-white shadow-sm transition-all duration-200 hover:bg-[#367c11] hover:shadow-md active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C88C39] focus-visible:ring-offset-2"
            >
              Оставить отзыв
            </button>
          </aside>
        </div>
      </div>
    </section>
  )
}
