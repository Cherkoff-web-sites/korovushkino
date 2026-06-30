'use client'

import type { ReactNode } from 'react'

type ModalOverlayProps = {
  onClose: () => void
  children: ReactNode
  backdropClassName?: string
  className?: string
}

export default function ModalOverlay({
  onClose,
  children,
  backdropClassName = 'bg-black/40',
  className = '',
}: ModalOverlayProps) {
  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 ${className}`}
    >
      <button
        type="button"
        className={`modal-backdrop-enter absolute inset-0 ${backdropClassName}`}
        aria-label="Закрыть"
        onClick={onClose}
      />
      {children}
    </div>
  )
}

export function ModalPanel({
  children,
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      className={`modal-panel-enter relative z-10 ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}
