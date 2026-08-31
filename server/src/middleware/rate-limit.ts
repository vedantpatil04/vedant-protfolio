import rateLimit from 'express-rate-limit'
import { fail } from '../types/api'

/** Slows down credential-guessing against the login endpoint specifically. */
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json(fail('Too many login attempts. Try again later.', 'RATE_LIMITED'))
  },
})
