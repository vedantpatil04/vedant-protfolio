import type { Response, Request, CookieOptions } from 'express'
import { isProduction, isRender } from '../config/env'

export const AUTH_COOKIE_NAME = 'vp_admin_token'

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000 // 7 days — keep in sync with JWT_EXPIRES_IN default

export function getAuthCookieOptions(req?: Request): CookieOptions {
  const isSecure =
    isProduction ||
    isRender ||
    Boolean(req?.secure) ||
    req?.headers?.['x-forwarded-proto'] === 'https' ||
    Boolean(process.env.RENDER)

  return {
    httpOnly: true,
    secure: isSecure,
    sameSite: (isSecure ? 'none' : 'lax') as 'none' | 'lax',
    ...(isSecure ? { partitioned: true } : {}),
    path: '/',
  }
}

export function setAuthCookie(res: Response, token: string, req?: Request) {
  const options = getAuthCookieOptions(req)
  res.cookie(AUTH_COOKIE_NAME, token, {
    ...options,
    maxAge: MAX_AGE_MS,
  })
}

export function clearAuthCookie(res: Response, req?: Request) {
  const options = getAuthCookieOptions(req)
  res.clearCookie(AUTH_COOKIE_NAME, options)
}
