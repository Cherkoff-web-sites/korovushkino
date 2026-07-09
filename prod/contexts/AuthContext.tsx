'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  apiGetAuthConfig,
  apiGetMe,
  apiLoginConfirmCode,
  apiLoginRequestCode,
  apiLogout,
  type AuthUser,
} from '@/lib/api/authApi'
import { syncClientFromUser } from '@/lib/clientsSync'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  emailCodeRequired: boolean
  loginModalOpen: boolean
  openLoginModal: () => void
  closeLoginModal: () => void
  /** Returns true if email code step is needed */
  loginWithEmail: (email: string) => Promise<boolean>
  confirmLoginCode: (email: string, code: string) => Promise<AuthUser>
  /** Демо-вход без API (локальная вёрстка) */
  loginWithDemo: (email: string) => void
  logout: () => void
  consumeLogoutRedirect: () => boolean
  refreshUser: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [emailCodeRequired, setEmailCodeRequired] = useState(true)
  const [loginModalOpen, setLoginModalOpen] = useState(false)
  const skipLoginPromptRef = useRef(false)

  const applyUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser)
    if (nextUser) syncClientFromUser(nextUser)
  }, [])

  const refreshUser = useCallback(async () => {
    try {
      const nextUser = await apiGetMe()
      applyUser(nextUser)
      return nextUser
    } catch {
      applyUser(null)
      return null
    }
  }, [applyUser])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const [config, nextUser] = await Promise.all([
          apiGetAuthConfig().catch(() => ({ emailCodeRequired: true })),
          apiGetMe().catch(() => null),
        ])
        if (!cancelled) {
          setEmailCodeRequired(config.emailCodeRequired)
          if (nextUser) {
            applyUser(nextUser)
          } else {
            setUser(null)
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [applyUser])

  const openLoginModal = useCallback(() => setLoginModalOpen(true), [])
  const closeLoginModal = useCallback(() => setLoginModalOpen(false), [])

  const loginWithEmail = useCallback(async (email: string) => {
    const result = await apiLoginRequestCode(email)
    if (result.user && result.accessToken) {
      applyUser(result.user)
      return false
    }
    return result.emailCodeRequired === true
  }, [applyUser])

  const confirmLoginCode = useCallback(async (email: string, code: string) => {
    const nextUser = await apiLoginConfirmCode(email, code)
    applyUser(nextUser)
    return nextUser
  }, [applyUser])

  const loginWithDemo = useCallback((email: string) => {
    const normalizedEmail = email.trim().toLowerCase()
    const demoUser: AuthUser = {
      id: 0,
      login: normalizedEmail || 'demo-user',
      email: normalizedEmail || null,
      role: 'user',
      surname: '',
      firstName: '',
      phone: '',
      createdAt: null,
      updatedAt: null,
    }
    applyUser(demoUser)
  }, [applyUser])

  const logout = useCallback(() => {
    skipLoginPromptRef.current = true
    apiLogout()
    setUser(null)
    setLoginModalOpen(false)
  }, [])

  const consumeLogoutRedirect = useCallback(() => {
    if (!skipLoginPromptRef.current) return false
    skipLoginPromptRef.current = false
    return true
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      emailCodeRequired,
      loginModalOpen,
      openLoginModal,
      closeLoginModal,
      loginWithEmail,
      confirmLoginCode,
      loginWithDemo,
      logout,
      consumeLogoutRedirect,
      refreshUser,
    }),
    [
      user,
      loading,
      emailCodeRequired,
      loginModalOpen,
      openLoginModal,
      closeLoginModal,
      loginWithEmail,
      confirmLoginCode,
      loginWithDemo,
      logout,
      consumeLogoutRedirect,
      refreshUser,
    ]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
