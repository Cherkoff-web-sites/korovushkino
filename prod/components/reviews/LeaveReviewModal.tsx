'use client'

import { FormEvent, useEffect, useState } from 'react'
import ModalOverlay, { ModalPanel } from '@/components/ui/ModalOverlay'
import { useScrollLock } from '@/lib/useScrollLock'

type LeaveReviewModalProps = {
  open: boolean
  onClose: () => void
  productName: string
  onSubmit?: (text: string) => void | Promise<void>
}

export default function LeaveReviewModal({
  open,
  onClose,
  productName,
  onSubmit,
}: LeaveReviewModalProps) {
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useScrollLock(open)

  useEffect(() => {
    if (!open) {
      setText('')
      setSubmitting(false)
    }
  }, [open])

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return

    setSubmitting(true)
    try {
      if (onSubmit) {
        await onSubmit(trimmed)
      }
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ModalOverlay onClose={onClose}>
      <ModalPanel
        aria-labelledby="leave-review-title"
        className="w-full max-w-[640px] rounded-2xl border border-[#E5DECF] bg-[#FFF8ED] px-5 py-6 shadow-xl sm:px-8 sm:py-8"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-[#707070] transition-colors hover:text-black"
          aria-label="Закрыть"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <h2
          id="leave-review-title"
          className="pr-8 text-xl font-normal leading-snug sm:text-2xl"
        >
          <span className="text-[#707070]">Отзыв на </span>
          <span className="text-black">{productName}</span>
        </h2>

        <form onSubmit={handleSubmit} className="mt-5 sm:mt-6">
          <label htmlFor="review-text" className="sr-only">
            Текст отзыва
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            placeholder="Здравствуйте..."
            rows={6}
            className="w-full resize-none rounded-xl border border-[#E5DECF] bg-white px-4 py-3 text-base leading-relaxed text-[#1F1F1F] outline-none transition-[box-shadow] placeholder:text-[#232326]/35 focus:border-[#438E1B] focus:ring-2 focus:ring-[#438E1B]/20 sm:min-h-[180px] sm:px-5 sm:py-4"
          />

          <div className="mt-5 flex justify-end sm:mt-6">
            <button
              type="submit"
              disabled={submitting || !text.trim()}
              className="rounded-full bg-[#3D8C13] px-8 py-2.5 text-base font-medium text-white transition-colors hover:bg-[#367c11] disabled:cursor-not-allowed disabled:opacity-60 sm:px-10 sm:py-3"
            >
              {submitting ? 'Отправляем...' : 'Отправить'}
            </button>
          </div>
        </form>
      </ModalPanel>
    </ModalOverlay>
  )
}
