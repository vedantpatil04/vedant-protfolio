import type { AuthTokenPayload } from '../utils/jwt'

declare global {
  namespace Express {
    interface Request {
      /** Populated by the `authenticate` middleware once a valid token is verified. */
      admin?: AuthTokenPayload
    }
  }
}

export {}
