import type { NextFunction, Request, Response } from 'express'
import { HttpError } from '../utils/http-error'
import type { ApiFailure } from '../types/api'

/** Centralized error formatter — keeps error shape consistent across every route. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  const status = err instanceof HttpError ? err.status : 500
  const message = err instanceof Error ? err.message : 'Internal server error'
  const code = err instanceof HttpError ? err.code : 'INTERNAL_ERROR'

  if (status === 500) {
    console.error(err)
  }

  const body: ApiFailure = { success: false, error: { message, code } }
  res.status(status).json(body)
}

export function notFoundHandler(_req: Request, res: Response) {
  const body: ApiFailure = { success: false, error: { message: 'Route not found', code: 'NOT_FOUND' } }
  res.status(404).json(body)
}
