import type { NextFunction, Request, Response } from 'express'
import type { ZodSchema } from 'zod'
import { badRequest } from '../utils/http-error'

/**
 * Validates req.body against a Zod schema and replaces it with the
 * parsed (and type-coerced) result. Rejects with a single, readable
 * 400 rather than letting a malformed body reach the controller/model.
 */
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)
    if (!result.success) {
      const message = result.error.issues
        .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
        .join('; ')
      return next(badRequest(message))
    }
    req.body = result.data
    next()
  }
}
