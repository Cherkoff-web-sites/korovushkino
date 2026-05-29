'use client'

import type { ReactNode } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import AccountLoginForm from './AccountLoginForm'

export default function AccountAuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#D2B48C]/60 bg-white p-8 text-sm text-[#707070]">
        Загрузка...
      </div>
    )
  }

  if (!user) {
    return <AccountLoginForm />
  }

  return <>{children}</>
}
