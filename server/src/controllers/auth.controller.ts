import type { Request, Response } from 'express'
import { AdminModel, toSafeAdmin } from '../models/Admin'
import { verifyPassword } from '../utils/password'
import { signAuthToken } from '../utils/jwt'
import { setAuthCookie, clearAuthCookie } from '../utils/cookies'
import { asyncHandler } from '../utils/async-handler'
import { unauthorized } from '../utils/http-error'
import { ok } from '../types/api'
import type { LoginInput } from '../types/validation'

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body as LoginInput

  // Same generic failure for "no such email" and "wrong password" —
  // never reveal which one it was.
  const admin = await AdminModel.findOne({ email }).select('+passwordHash')
  if (!admin || !admin.isActive) throw unauthorized('Invalid email or password')

  const valid = await verifyPassword(password, admin.passwordHash)
  if (!valid) throw unauthorized('Invalid email or password')

  admin.lastLoginAt = new Date()
  await admin.save()

  const token = signAuthToken({ sub: String(admin._id), role: 'admin' })
  setAuthCookie(res, token)

  res.json(ok(toSafeAdmin(admin), 'Signed in'))
})

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  clearAuthCookie(res)
  res.json(ok(null, 'Signed out'))
})

export const me = asyncHandler(async (req: Request, res: Response) => {
  // `authenticate` middleware guarantees req.admin exists on this route.
  const admin = await AdminModel.findById(req.admin!.sub)
  if (!admin || !admin.isActive) throw unauthorized()

  res.json(ok(toSafeAdmin(admin)))
})
