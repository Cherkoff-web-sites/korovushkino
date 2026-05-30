'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

type ToastItem = {
  id: string
  message: string
}

export default function ToastViewport({ toasts }: { toasts: ToastItem[] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || toasts.length === 0) return null

  return createPortal(
    <div
      className="pointer-events-none fixed inset-x-0 bottom-14 z-[9999] flex flex-col items-center gap-2 px-4 sm:bottom-18"
      aria-live="polite"
      aria-atomic="true"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="toast-enter w-full max-w-md rounded-xl border border-[#E5DECF] bg-[#FFF8ED] px-4 py-3 text-center text-sm font-normal text-[#1F1F1F] shadow-xl sm:text-[15px]"
          role="status"
        >
          {toast.message}
        </div>
      ))}
    </div>,
    document.body,
  )
}
