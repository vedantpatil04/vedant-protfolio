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

/**
 * Contact form is public and unauthenticated, so it's the easiest target
 * for scripted abuse/spam on the whole API. More restrictive than the
 * login limiter above since there's no legitimate reason for one visitor
 * to submit more than a handful of messages in a 15-minute window.
 */
export const messageRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res
      .status(429)
      .json(fail("You're sending messages too quickly. Please wait a bit and try again.", 'RATE_LIMITED'))
  },
})
