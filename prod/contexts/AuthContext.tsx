'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  apiGetMe,
  apiLoginConfirmCode,
  apiLoginRequestCode,
  apiLogout,
  type AuthUser,
} from '@/lib/api/authApi'

type AuthContextValue = {
  user: AuthUser | null
  loading: boolean
  requestLoginCode: (email: string) => Promise<void>
  confirmLoginCode: (email: string, code: string) => Promise<AuthUser>
  logout: () => void
  refreshUser: () => Promise<AuthUser | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const nextUser = await apiGetMe()
      setUser(nextUser)
      return nextUser
    } catch {
      setUser(null)
      return null
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      try {
        const nextUser = await apiGetMe()
        if (!cancelled) setUser(nextUser)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const requestLoginCode = useCallback(async (email: string) => {
    await apiLoginRequestCode(email)
  }, [])

  const confirmLoginCode = useCallback(async (email: string, code: string) => {
    const nextUser = await apiLoginConfirmCode(email, code)
    setUser(nextUser)
    return nextUser
  }, [])

  const logout = useCallback(() => {
    apiLogout()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      loading,
      requestLoginCode,
      confirmLoginCode,
      logout,
      refreshUser,
    }),
    [user, loading, requestLoginCode, confirmLoginCode, logout, refreshUser]
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
