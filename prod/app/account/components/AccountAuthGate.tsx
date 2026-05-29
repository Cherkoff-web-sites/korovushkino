'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'

export default function AccountAuthGate({ children }: { children: ReactNode }) {
  const { user, loading, openLoginModal, loginModalOpen } = useAuth()

  useEffect(() => {
    if (loading || user || loginModalOpen) return
    openLoginModal()
  }, [loading, user, loginModalOpen, openLoginModal])

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
