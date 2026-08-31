import { Router } from 'express'
import { login, logout, me } from '../controllers/auth.controller'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { loginRateLimiter } from '../middleware/rate-limit'
import { loginSchema } from '../types/validation'

export const authRouter = Router()

authRouter.post('/login', loginRateLimiter, validate(loginSchema), login)
authRouter.post('/logout', logout)
authRouter.get('/me', authenticate, me)
