'use client'

import { useEffect, type ReactNode } from 'react'
import ModalOverlay, { ModalPanel } from '@/components/ui/ModalOverlay'
import { useScrollLock } from '@/lib/useScrollLock'

type InfoModalProps = {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  /** Компактная карточка как у уведомления о рассылке */
  variant?: 'default' | 'notice'
}

export default function InfoModal({
  open,
  onClose,
  title,
  children,
  variant = 'default',
}: InfoModalProps) {
  useScrollLock(open)

  useEffect(() => {
    if (!open) return

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) return null

  const isNotice = variant === 'notice'

  return (
    <ModalOverlay onClose={onClose}>
      <ModalPanel
        aria-labelledby="info-modal-title"
        className={`w-full shadow-xl ${
          isNotice
            ? 'max-w-lg rounded-2xl border border-[#E5DECF] bg-[#FFF8ED] px-6 py-8 sm:px-10 sm:py-10'
            : 'max-w-2xl rounded-2xl border border-[#D2B48C]/60 bg-white p-6 sm:p-8'
        }`}
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
          id="info-modal-title"
          className={`pr-8 font-bold text-[#1F1F1F] ${
            isNotice ? 'text-2xl sm:text-[28px]' : 'text-xl sm:text-2xl'
          }`}
        >
          {title}
        </h2>
        <div
          className={`mt-3 pr-2 ${
            isNotice
              ? 'text-base leading-relaxed text-[#232326]/70 sm:text-lg'
              : 'max-h-[70vh] overflow-y-auto text-sm leading-relaxed text-[#232326]/80 sm:text-[15px]'
          }`}
        >
          {children}
        </div>
      </ModalPanel>
    </ModalOverlay>
  )
}
