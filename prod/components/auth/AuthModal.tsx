'use client'

import { FormEvent, useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

type ModalView = 'email' | 'code'

const inputClassName =
  'w-full rounded-lg border border-[#D2B48C] px-4 py-3 text-sm outline-none transition-colors focus:border-[#3D8C13]'

export default function AuthModal() {
  const router = useRouter()
  const pathname = usePathname()
  const { loginModalOpen, closeLoginModal, emailCodeRequired, loginWithEmail, confirmLoginCode } =
    useAuth()

  const [view, setView] = useState<ModalView>('email')
  const [email, setEmail] = useState('')
  const [codeDigits, setCodeDigits] = useState(['', '', '', '', '', ''])
  const codeInputsRef = useRef<Array<HTMLInputElement | null>>([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loginModalOpen) return

    function onKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') closeLoginModal()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [loginModalOpen, closeLoginModal])

  useEffect(() => {
    if (!loginModalOpen) {
      setView('email')
      setEmail('')
      setCodeDigits(['', '', '', '', '', ''])
      setError('')
      setSubmitting(false)
    }
  }, [loginModalOpen])

  useEffect(() => {
    if (view === 'code') {
      setCodeDigits(['', '', '', '', '', ''])
      setError('')
      codeInputsRef.current[0]?.focus()
    }
  }, [view])

  if (!loginModalOpen) return null

  function handleSuccess() {
    closeLoginModal()
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

    if (digit && index < 5) {
      codeInputsRef.current[index + 1]?.focus()
    }
  }

  function handleCodeKeyDown(index: number, event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Backspace' && !codeDigits[index] && index > 0) {
      codeInputsRef.current[index - 1]?.focus()
    }
  }

  async function handleEmailSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const normalizedEmail = email.trim().toLowerCase()
      const needsCode = await loginWithEmail(normalizedEmail)
      if (needsCode) {
        setView('code')
      } else {
        handleSuccess()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не удалось войти')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleCodeSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')

    const code = codeDigits.join('')
    if (code.length !== 6) {
      setError('Введите 6-значный код')
      return
    }

    setSubmitting(true)
    try {
      await confirmLoginCode(email.trim().toLowerCase(), code)
      handleSuccess()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неверный код')
    } finally {
      setSubmitting(false)
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
        className="relative z-10 w-full max-w-md rounded-2xl border border-[#D2B48C]/60 bg-white p-6 shadow-xl sm:p-8"
      >
        <button
          type="button"
          onClick={closeLoginModal}
          className="absolute right-4 top-4 text-[#707070] transition-colors hover:text-black"
          aria-label="Закрыть"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {view === 'email' ? (
          <>
            <div className="mb-6 text-center">
              <h2 className="text-xl font-semibold text-black sm:text-2xl">Вход</h2>
              <p className="mt-2 text-sm text-[#707070]">
                {emailCodeRequired
                  ? 'Введите почту — отправим код. Если аккаунта нет, он создастся автоматически.'
                  : 'Введите почту для входа в личный кабинет.'}
              </p>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm text-[#707070]">Email</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputClassName}
                  placeholder="example@mail.ru"
                />
              </label>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <Button type="submit" disabled={submitting} className="w-full">
                {submitting ? 'Отправляем...' : emailCodeRequired ? 'Получить код' : 'Войти'}
              </Button>
            </form>
          </>
        ) : (
          <form onSubmit={handleCodeSubmit} className="space-y-5">
            <div className="mb-2 text-center">
              <h2 className="text-xl font-semibold text-black sm:text-2xl">Введите код</h2>
              <p className="mt-2 text-sm text-[#707070]">Код отправлен на {email}</p>
            </div>

            <div className="flex justify-between gap-2">
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
                  className={`h-12 w-10 rounded-lg border text-center text-lg outline-none sm:h-14 sm:w-12 ${
                    error
                      ? 'border-red-400 bg-red-50'
                      : 'border-[#D2B48C] focus:border-[#3D8C13]'
                  }`}
                />
              ))}
            </div>

            {error && <p className="text-center text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={submitting} className="w-full">
              {submitting ? 'Проверяем...' : 'Войти'}
            </Button>

            <button
              type="button"
              onClick={() => {
                setView('email')
                setError('')
              }}
              className="mx-auto block text-sm text-[#3D8C13] transition-colors hover:text-[#347710]"
            >
              Изменить почту
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
