'use client'

import { FormEvent, useState } from 'react'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

type Step = 'email' | 'code'

export default function AccountLoginForm() {
  const { requestLoginCode, confirmLoginCode } = useAuth()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await requestLoginCode(email.trim().toLowerCase())
      setStep('code')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить код')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await confirmLoginCode(email.trim().toLowerCase(), code.trim())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось подтвердить код')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="rounded-2xl border border-[#D2B48C]/60 bg-white p-6 sm:p-8">
      <h1 className="mb-2 text-2xl font-semibold text-black sm:text-[28px]">Вход в личный кабинет</h1>
      <p className="mb-8 text-sm text-[#707070] sm:text-[15px]">
        {step === 'email'
          ? 'Введите почту — мы отправим код для входа.'
          : `Код отправлен на ${email}. Введите его ниже.`}
      </p>

      {step === 'email' ? (
        <form onSubmit={handleEmailSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-[#707070]">Email</span>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-[#D2B48C] px-4 py-3 text-sm outline-none transition-colors focus:border-[#3D8C13]"
              placeholder="example@mail.ru"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
            {submitting ? 'Отправляем...' : 'Получить код'}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleCodeSubmit} className="space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm text-[#707070]">Код из письма</span>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={6}
              value={code}
              onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))}
              className="w-full rounded-lg border border-[#D2B48C] px-4 py-3 text-sm tracking-[0.3em] outline-none transition-colors focus:border-[#3D8C13]"
              placeholder="000000"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="submit" disabled={submitting}>
              {submitting ? 'Проверяем...' : 'Войти'}
            </Button>
            <button
              type="button"
              onClick={() => {
                setStep('email')
                setCode('')
                setError('')
              }}
              className="text-sm text-[#3D8C13] transition-colors hover:text-[#347710]"
            >
              Изменить почту
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
