'use client'

import { FormEvent, useEffect, useState } from 'react'
import ModalOverlay, { ModalPanel } from '@/components/ui/ModalOverlay'
import { useScrollLock } from '@/lib/useScrollLock'
import { apiAdminConfirmCode, apiAdminRequestCode } from '@/lib/api/adminAuthApi'
import type { AuthUser } from '@/lib/api/authApi'

type AdminLoginModalProps = {
  open: boolean
  onSuccess: (user: AuthUser) => void
}

export default function AdminLoginModal({ open, onSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [step, setStep] = useState<'email' | 'code'>('email')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useScrollLock(open)

  useEffect(() => {
    if (!open) {
      setEmail('')
      setCode('')
      setStep('email')
      setError('')
      setSubmitting(false)
    }
  }, [open])

  if (!open) return null

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const result = await apiAdminRequestCode(email.trim())
      if (result.user) {
        onSuccess(result.user)
        return
      }
      setStep('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const user = await apiAdminConfirmCode(email.trim().toLowerCase(), code.trim())
      onSuccess(user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный код')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ModalOverlay onClose={() => {}}>
      <ModalPanel
        aria-labelledby="admin-login-title"
        className="w-full max-w-md rounded-2xl border border-[#E5DECF] bg-white px-6 py-8 shadow-xl"
      >
        <h1 id="admin-login-title" className="text-xl font-semibold text-[#1F1F1F]">
          Вход в админ-панель
        </h1>
        <p className="mt-2 text-sm text-[#707070]">
          {step === 'email'
            ? 'Введите почту из списка администраторов. Код придёт на email. Если почта недоступна — введите аварийный пароль в это же поле.'
            : `Код отправлен на ${email}`}
        </p>

        {step === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs text-[#707070]">Email или аварийный пароль</span>
              <input
                type="text"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-[#e2e4ea] px-3 py-2.5 text-sm outline-none focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20"
                placeholder="admin@example.com"
                required
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting || !email.trim()}
              className="w-full rounded-lg bg-[#3D8C13] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#367c11] disabled:opacity-60"
            >
              {submitting ? 'Отправляем...' : 'Получить код'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleCodeSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs text-[#707070]">Код из письма</span>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-lg border border-[#e2e4ea] px-3 py-2.5 text-sm outline-none focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/20"
                placeholder="123456"
                required
              />
            </label>
            {error ? <p className="text-sm text-red-600">{error}</p> : null}
            <button
              type="submit"
              disabled={submitting || !code.trim()}
              className="w-full rounded-lg bg-[#3D8C13] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#367c11] disabled:opacity-60"
            >
              {submitting ? 'Проверяем...' : 'Войти'}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep('email')
                setCode('')
                setError('')
              }}
              className="w-full text-sm text-[#707070] hover:text-black"
            >
              ← Другой email
            </button>
          </form>
        )}
      </ModalPanel>
    </ModalOverlay>
  )
}
