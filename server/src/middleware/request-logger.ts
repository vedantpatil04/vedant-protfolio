import type { NextFunction, Request, Response } from 'express'

/** Minimal request logger — swap for pino/morgan later if needed. */
export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  console.log(`[${req.method}] ${req.originalUrl}`)
  next()
}
