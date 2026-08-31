import type { NextFunction, Request, Response } from 'express'

type AsyncRouteHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

/**
 * Wraps an async controller so a rejected promise reaches the global
 * error middleware instead of crashing the process / hanging the
 * request — avoids try/catch boilerplate in every controller.
 */
export function asyncHandler(handler: AsyncRouteHandler) {
  return (req: Request, res: Response, next: NextFunction) => {
    handler(req, res, next).catch(next)
  }
}
