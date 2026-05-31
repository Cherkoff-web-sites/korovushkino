'use client'

import { useEffect } from 'react'
import type { ReactNode } from 'react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

export default function AdminAuthGateInner({ children }: { children: ReactNode }) {
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

  if (user.role !== 'admin') {
    return (
      <div className="rounded-2xl border border-[#D2B48C]/60 bg-white p-8">
        <h1 className="text-xl font-bold text-black">Доступ запрещён</h1>
        <p className="mt-3 text-sm text-[#707070]">
          Админ-панель доступна только пользователям с ролью администратора.
        </p>
        <Link href="/" className="mt-6 inline-block text-sm text-[#3D8C13] hover:underline">
          Вернуться на сайт
        </Link>
      </div>
    )
  }

  return <>{children}</>
}
