import type { NextFunction, Request, Response } from 'express'
import { AdminModel } from '../models/Admin'
import { verifyAuthToken } from '../utils/jwt'
import { unauthorized } from '../utils/http-error'
import { AUTH_COOKIE_NAME } from '../utils/cookies'
import { asyncHandler } from '../utils/async-handler'

/**
 * Protects admin routes end to end:
 *  1. extract token (httpOnly cookie)
 *  2. verify the token's signature/expiry
 *  3. re-check the admin still exists and is active (covers revoked access)
 *  4. attach the authenticated claims to req.admin
 * Rejects with 401 at any failure point — never leaks which step failed.
 */
export const authenticate = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
  const token = req.cookies?.[AUTH_COOKIE_NAME]
  if (!token) throw unauthorized()

  let payload
  try {
    payload = verifyAuthToken(token)
  } catch {
    throw unauthorized()
  }

  const admin = await AdminModel.findById(payload.sub)
  if (!admin || !admin.isActive) throw unauthorized()

  req.admin = payload
  next()
})
