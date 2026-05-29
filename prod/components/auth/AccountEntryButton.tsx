'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'

type AccountEntryButtonProps = {
  className?: string
  onNavigate?: () => void
}

export default function AccountEntryButton({ className, onNavigate }: AccountEntryButtonProps) {
  const { user, loading, openLoginModal } = useAuth()

  const icon = (
    <Image src="/images/header/icon-account.svg" alt="" width={22} height={22} />
  )

  if (loading) {
    return (
      <span
        className={className}
        aria-label="Личный кабинет"
        aria-busy="true"
      >
        {icon}
      </span>
    )
  }

  if (user) {
    return (
      <Link
        href="/account"
        onClick={onNavigate}
        className={className}
        aria-label="Личный кабинет"
      >
        {icon}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault()
        openLoginModal()
        onNavigate?.()
      }}
      className={className}
      aria-label="Войти в личный кабинет"
    >
      {icon}
    </button>
  )
}
