'use client'

import { FormEvent, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useScrollLock } from '@/lib/useScrollLock'

type ModalView = 'phone' | 'sms' | 'email'

const inputClassName =
  'w-full rounded-lg border border-[#D2B48C] bg-white px-4 py-3.5 text-base text-[#1F1F1F] outline-none transition-colors placeholder:text-[#232326]/40 focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/15'

const outlineButtonClassName =
  'flex w-full items-center justify-center rounded-lg border border-[#D2B48C] bg-white px-4 py-3.5 text-base font-normal text-[#1F1F1F] transition-colors hover:bg-[#FFF6E7]'

const primaryButtonClassName =
  'flex w-full items-center justify-center rounded-lg bg-[#3D8C13] px-4 py-3.5 text-base font-normal text-white transition-colors hover:bg-[#367c11] disabled:cursor-not-allowed disabled:opacity-60'

function formatPhoneInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (!digits) return ''

  let normalized = digits
  if (normalized.startsWith('8')) normalized = `7${normalized.slice(1)}`
  if (!normalized.startsWith('7')) normalized = `7${normalized}`

  const parts = [
    normalized.slice(1, 4),
    normalized.slice(4, 7),
    normalized.slice(7, 9),
    normalized.slice(9, 11),
  ]

  let result = '+7'
  if (parts[0]) result += ` (${parts[0]}`
  if (parts[0]?.length === 3) result += ')'
  if (parts[1]) result += ` ${parts[1]}`
  if (parts[2]) result += `-${parts[2]}`
  if (parts[3]) result += `-${parts[3]}`
  return result
}

function phoneDigits(value: string) {
  const digits = value.replace(/\D/g, '')
  if (digits.startsWith('8')) return `7${digits.slice(1)}`
  if (digits.startsWith('7')) return digits
  return `7${digits}`
}

export default function AuthModal() {
  const router = useRouter()
  const pathname = usePathname()
  const { loginModalOpen, closeLoginModal, loginWithDemo } = useAuth()

  const [view, setView] = useState<ModalView>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [consent, setConsent] = useState(false)
  const [codeDigits, setCodeDigits] = useState(['', '', '', ''])
  const codeInputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [submitting, setSubmitting] = useState(false)
  const smsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useScrollLock(loginModalOpen)

  useEffect(() => {
    if (!loginModalOpen) return
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') closeLoginModal()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [loginModalOpen, closeLoginModal])

  useEffect(() => {
    if (!loginModalOpen) {
      if (smsTimerRef.current) clearTimeout(smsTimerRef.current)
      setView('phone')
      setPhone('')
      setEmail('')
      setPassword('')
      setConsent(false)
      setCodeDigits(['', '', '', ''])
      setSubmitting(false)
    }
  }, [loginModalOpen])

  useEffect(() => {
    if (view !== 'sms' || !loginModalOpen) return

    setCodeDigits(['1', '2', '3', '4'])
    smsTimerRef.current = setTimeout(() => {
      loginWithDemo({ phone: formatPhoneInput(phone) })
      closeLoginModal()
      if (pathname !== '/account' && !pathname.startsWith('/account/')) {
        router.push('/account')
      }
    }, 2000)

    return () => {
      if (smsTimerRef.current) clearTimeout(smsTimerRef.current)
    }
  }, [view, loginModalOpen, loginWithDemo, closeLoginModal, pathname, phone, router])

  if (!loginModalOpen) return null

  function handlePhoneSubmit(event: FormEvent) {
    event.preventDefault()
    if (!consent) return
    if (phoneDigits(phone).length < 11) return
    setView('sms')
  }

  function handleEmailSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    loginWithDemo({ email })
    closeLoginModal()
    setSubmitting(false)
    if (pathname !== '/account' && !pathname.startsWith('/account/')) {
      router.push('/account')
    }
  }

  function handleCodeChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1)
    if (value && !digit) return
    setCodeDigits((prev) => {
      const next = [...prev]
      next[index] = digit
      return next
    })
    if (digit && index < 3) codeInputsRef.current[index + 1]?.focus()
  }

  function handleCodeKeyDown(index: number, event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus()
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Закрыть"
        onClick={closeLoginModal}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-[420px] rounded-2xl border border-[#D2B48C]/60 bg-[#FFF6E7] px-6 py-8 shadow-xl sm:px-8 sm:py-10"
      >
        {view === 'phone' ? (
          <form onSubmit={handlePhoneSubmit} className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-normal text-[#1F1F1F]">Авторизация</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#232326]/80">
                Введите номер телефона, чтобы войти, либо зарегистрироваться, если у вас нет аккаунта.
              </p>
            </div>

            <input
              type="tel"
              required
              value={phone}
              onChange={(event) => setPhone(formatPhoneInput(event.target.value))}
              className={inputClassName}
              placeholder="8 (925) 140-48-05"
              autoComplete="tel"
            />

            <button type="submit" disabled={!consent} className={primaryButtonClassName}>
              Продолжить
            </button>

            <button type="button" onClick={() => setView('email')} className={outlineButtonClassName}>
              Войти по почте
            </button>

            <label className="flex items-start gap-2 text-xs leading-relaxed text-[#232326]/70">
              <input
                type="checkbox"
                checked={consent}
                onChange={(event) => setConsent(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 rounded border-[#D2B48C] text-[#3D8C13] focus:ring-[#3D8C13]"
              />
              <span>
                Входя или регистрируясь, вы соглашаетесь с условиями оферты и политикой конфиденциальности.
              </span>
            </label>
          </form>
        ) : null}

        {view === 'sms' ? (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-normal text-[#1F1F1F]">Авторизация</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#232326]/80">
                Мы отправили вам код подтверждения на номер {formatPhoneInput(phone)}.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              {codeDigits.map((digit, index) => (
                <input
                  key={index}
                  ref={(element) => {
                    codeInputsRef.current[index] = element
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  readOnly
                  onChange={(event) => handleCodeChange(index, event.target.value)}
                  onKeyDown={(event) => handleCodeKeyDown(index, event)}
                  className="h-14 w-14 rounded-lg border border-[#D2B48C] bg-white text-center text-xl text-[#1F1F1F] outline-none focus:border-[#3D8C13]"
                />
              ))}
            </div>

            <button type="button" disabled className={primaryButtonClassName}>
              Войти
            </button>

            <button type="button" disabled className={outlineButtonClassName}>
              Отправить код повторно
            </button>

            <button type="button" onClick={() => setView('phone')} className={outlineButtonClassName}>
              Вернуться
            </button>
          </div>
        ) : null}

        {view === 'email' ? (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-normal text-[#1F1F1F]">Войти по почте</h2>
            </div>

            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className={inputClassName}
              placeholder="Ваш e-mail"
              autoComplete="email"
            />

            <input
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className={inputClassName}
              placeholder="Пароль"
              autoComplete="current-password"
            />

            <button type="submit" disabled={submitting} className={primaryButtonClassName}>
              {submitting ? 'Входим...' : 'Войти'}
            </button>

            <button type="button" disabled className={outlineButtonClassName}>
              Восстановить пароль
            </button>

            <button type="button" onClick={() => setView('phone')} className={outlineButtonClassName}>
              Вернуться
            </button>
          </form>
        ) : null}
      </div>
    </div>
  )
}
