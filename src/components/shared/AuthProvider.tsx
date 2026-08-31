import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react'
import { authService, ApiError, type LoginInput } from '@/services'
import type { SafeAdmin } from '@/types'

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

interface AuthContextValue {
  status: AuthStatus
  admin: SafeAdmin | null
  login: (input: LoginInput) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

/**
 * Single source of truth for admin session state. Checks
 * GET /api/auth/me once on mount (the httpOnly cookie, if valid, does
 * the rest) so every consumer — the login page, the protected route
 * guard, the dashboard — reads the same status instead of each component
 * running its own auth check.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading')
  const [admin, setAdmin] = useState<SafeAdmin | null>(null)

  const checkSession = useCallback(async () => {
    try {
      const me = await authService.me()
      setAdmin(me)
      setStatus('authenticated')
    } catch {
      setAdmin(null)
      setStatus('unauthenticated')
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = useCallback(async (input: LoginInput) => {
    const me = await authService.login(input)
    setAdmin(me)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(async () => {
    try {
      await authService.logout()
    } catch (err) {
      // Even if the network call fails, clear local state so the UI
      // doesn't strand the user in a falsely-authenticated view.
      if (!(err instanceof ApiError)) throw err
    } finally {
      setAdmin(null)
      setStatus('unauthenticated')
    }
  }, [])

  const value = useMemo(() => ({ status, admin, login, logout }), [status, admin, login, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
