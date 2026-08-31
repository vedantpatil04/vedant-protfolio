import type { Response } from 'express'
import { isProduction } from '../config/env'

export const AUTH_COOKIE_NAME = 'vp_admin_token'

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days — keep in sync with JWT_EXPIRES_IN default

export function setAuthCookie(res: Response, token: string) {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    maxAge: MAX_AGE_MS,
    path: '/',
  })
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isProduction,
    path: '/',
  })
}
