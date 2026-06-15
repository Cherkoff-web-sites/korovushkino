'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AccountAuthGate({ children }: { children: ReactNode }) {
  const router = useRouter()
  const { user, loading, openLoginModal, consumeLogoutRedirect } = useAuth()

  useEffect(() => {
    if (loading || user) return

    if (consumeLogoutRedirect()) {
      router.replace('/')
      return
    }

    openLoginModal()
    router.replace('/')
  }, [loading, user, openLoginModal, consumeLogoutRedirect, router])

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#D2B48C]/60 bg-white p-8 text-sm text-[#707070]">
        Загрузка...
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
