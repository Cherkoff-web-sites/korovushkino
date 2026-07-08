'use client'

import { useCallback, useEffect, useState, type ReactNode } from 'react'
import Link from 'next/link'
import { apiGetMe, type AuthUser } from '@/lib/api/authApi'
import AdminLoginModal from './AdminLoginModal'

export default function AdminAuthGateInner({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [loginOpen, setLoginOpen] = useState(false)

  const checkSession = useCallback(async () => {
    try {
      const nextUser = await apiGetMe()
      if (nextUser.role === 'admin') {
        setUser(nextUser)
        setLoginOpen(false)
      } else {
        setUser(null)
        setLoginOpen(true)
      }
    } catch {
      setUser(null)
      setLoginOpen(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void checkSession()
  }, [checkSession])

  if (loading) {
    return (
      <div className="rounded-2xl border border-[#D2B48C]/60 bg-white p-8 text-sm text-[#707070]">
        Загрузка...
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <AdminLoginModal
          open={loginOpen}
          onSuccess={(nextUser) => {
            setUser(nextUser)
            setLoginOpen(false)
          }}
        />
        {!loginOpen ? (
          <div className="rounded-2xl border border-[#D2B48C]/60 bg-white p-8">
            <h1 className="text-xl font-bold text-black">Требуется вход</h1>
            <button
              type="button"
              onClick={() => setLoginOpen(true)}
              className="mt-4 text-sm text-[#3D8C13] hover:underline"
            >
              Войти в админ-панель
            </button>
          </div>
        ) : null}
      </>
    )
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
