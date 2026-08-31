import jwt from 'jsonwebtoken'
import { env } from '../config/env'

/** Only the claims strictly needed to identify and authorize the caller. */
export interface AuthTokenPayload {
  sub: string
  role: 'admin'
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'] })
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.jwtSecret) as AuthTokenPayload
}
