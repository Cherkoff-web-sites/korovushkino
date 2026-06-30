'use client'

import { FormEvent, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import ModalOverlay, { ModalPanel } from '@/components/ui/ModalOverlay'
import { useAuth } from '@/contexts/AuthContext'
import { useScrollLock } from '@/lib/useScrollLock'

type ModalView = 'email' | 'code'

const CODE_LENGTH = 6

const inputClassName =
  'w-full rounded-lg border border-[#D2B48C] bg-white px-4 py-3.5 text-base text-[#1F1F1F] outline-none transition-colors placeholder:text-[#232326]/40 focus:border-[#3D8C13] focus:ring-2 focus:ring-[#3D8C13]/15'

const outlineButtonClassName =
  'flex w-full items-center justify-center rounded-lg border border-[#D2B48C] bg-white px-4 py-3.5 text-base font-normal text-[#1F1F1F] transition-colors hover:bg-[#FFF6E7]'

const primaryButtonClassName =
  'flex w-full items-center justify-center rounded-lg bg-[#3D8C13] px-4 py-3.5 text-base font-normal text-white transition-colors hover:bg-[#367c11] disabled:cursor-not-allowed disabled:opacity-60'

function emptyCodeDigits() {
  return Array.from({ length: CODE_LENGTH }, () => '')
}

export default function AuthModal() {
  const router = useRouter()
  const pathname = usePathname()
  const {
    loginModalOpen,
    closeLoginModal,
    loginWithEmail,
    confirmLoginCode,
    emailCodeRequired,
  } = useAuth()

  const [view, setView] = useState<ModalView>('email')
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [codeDigits, setCodeDigits] = useState(emptyCodeDigits)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const codeInputsRef = useRef<Array<HTMLInputElement | null>>([])

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
      setView('email')
      setEmail('')
      setConsent(false)
      setCodeDigits(emptyCodeDigits())
      setSubmitting(false)
      setError('')
    }
  }, [loginModalOpen])

  if (!loginModalOpen) return null

  function redirectAfterLogin() {
    if (pathname !== '/account' && !pathname.startsWith('/account/')) {
      router.push('/account')
    }
  }

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault()
    if (!consent) return

    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail) return

    setSubmitting(true)
    setError('')

    try {
      const codeRequired = await loginWithEmail(normalizedEmail)
      if (!codeRequired) {
        closeLoginModal()
        redirectAfterLogin()
        return
      }
      setEmail(normalizedEmail)
      setView('code')
      setCodeDigits(emptyCodeDigits())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти. Попробуйте позже.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault()
    const code = codeDigits.join('')
    if (code.length !== CODE_LENGTH) return

    setSubmitting(true)
    setError('')
    try {
      await confirmLoginCode(email, code)
      closeLoginModal()
      redirectAfterLogin()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный или просроченный код')
    } finally {
      setSubmitting(false)
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
    if (digit && index < CODE_LENGTH - 1) codeInputsRef.current[index + 1]?.focus()
  }

  function handleCodeKeyDown(index: number, event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus()
    }
  }

  async function handleResendCode() {
    setSubmitting(true)
    setError('')
    try {
      const codeRequired = await loginWithEmail(email)
      if (!codeRequired) {
        closeLoginModal()
        redirectAfterLogin()
        return
      }
      setCodeDigits(emptyCodeDigits())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось отправить код')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ModalOverlay onClose={closeLoginModal} backdropClassName="bg-black/50">
      <ModalPanel className="w-full max-w-[420px] rounded-2xl border border-[#D2B48C]/60 bg-[#FFF6E7] px-6 py-8 shadow-xl sm:px-8 sm:py-10">
        {view === 'email' ? (
          <form onSubmit={(event) => void handleEmailSubmit(event)} className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-normal text-[#1F1F1F]">Авторизация</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#232326]/80">
                {emailCodeRequired
                  ? 'Введите почту, чтобы войти или зарегистрироваться. Мы отправим код подтверждения на email.'
                  : 'Введите почту, чтобы войти или зарегистрироваться.'}
              </p>
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

            {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

            <button type="submit" disabled={!consent || submitting} className={primaryButtonClassName}>
              {submitting
                ? emailCodeRequired
                  ? 'Отправляем код...'
                  : 'Входим...'
                : emailCodeRequired
                  ? 'Получить код'
                  : 'Войти'}
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

        {view === 'code' && emailCodeRequired ? (
          <form onSubmit={(event) => void handleCodeSubmit(event)} className="space-y-5">
            <div className="text-center">
              <h2 className="text-2xl font-normal text-[#1F1F1F]">Код из письма</h2>
              <p className="mt-3 text-sm leading-relaxed text-[#232326]/80">
                Мы отправили код подтверждения на {email}.
              </p>
            </div>

            <div className="flex justify-center gap-2 sm:gap-3">
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
                  onChange={(event) => handleCodeChange(index, event.target.value)}
                  onKeyDown={(event) => handleCodeKeyDown(index, event)}
                  className="h-12 w-10 rounded-lg border border-[#D2B48C] bg-white text-center text-lg text-[#1F1F1F] outline-none focus:border-[#3D8C13] sm:h-14 sm:w-12 sm:text-xl"
                />
              ))}
            </div>

            {error ? <p className="text-center text-sm text-red-600">{error}</p> : null}

            <button
              type="submit"
              disabled={submitting || codeDigits.join('').length !== CODE_LENGTH}
              className={primaryButtonClassName}
            >
              {submitting ? 'Проверяем...' : 'Войти'}
            </button>

            <button
              type="button"
              disabled={submitting}
              onClick={() => void handleResendCode()}
              className={outlineButtonClassName}
            >
              Отправить код повторно
            </button>

            <button
              type="button"
              onClick={() => {
                setView('email')
                setCodeDigits(emptyCodeDigits())
                setError('')
              }}
              className={outlineButtonClassName}
            >
              Изменить почту
            </button>
          </form>
        ) : null}
      </ModalPanel>
    </ModalOverlay>
  )
}
