import type { NextFunction, Request, Response } from 'express'
import mongoose from 'mongoose'
import { HttpError } from '../utils/http-error'
import { fail } from '../types/api'
import { isProduction } from '../config/env'

interface MongoDuplicateKeyError {
  code: number
  keyValue?: Record<string, unknown>
}

function isDuplicateKeyError(err: unknown): err is MongoDuplicateKeyError {
  return typeof err === 'object' && err !== null && (err as { code?: number }).code === 11000
}

/**
 * Single place every error in the app funnels through. Maps known
 * error shapes (HttpError, Mongoose validation/cast, duplicate key) to
 * the right status + a safe message, and never leaks stack traces or
 * internal details in production.
 */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  // Known, intentionally-thrown application errors.
  if (err instanceof HttpError) {
    return res.status(err.status).json(fail(err.message, err.code))
  }

  // Mongoose schema validation failures (e.g. from runValidators on update).
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ')
    return res.status(400).json(fail(message, 'VALIDATION_ERROR'))
  }

  // Malformed ObjectId in a route param.
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json(fail(`Invalid ${err.path}`, 'INVALID_ID'))
  }

  // Unique index violation (e.g. duplicate slug/email).
  if (isDuplicateKeyError(err)) {
    const field = err.keyValue ? Object.keys(err.keyValue)[0] : 'field'
    return res.status(409).json(fail(`${field} already in use`, 'DUPLICATE_KEY'))
  }

  // Anything unexpected — log full detail server-side, return a generic message to the client.
  console.error('[error]', err)
  const message = isProduction ? 'Internal server error' : err instanceof Error ? err.message : 'Internal server error'
  return res.status(500).json(fail(message, 'INTERNAL_ERROR'))
}

export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json(fail('Route not found', 'NOT_FOUND'))
}
