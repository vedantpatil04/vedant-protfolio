/** Thrown by controllers/services; caught and formatted by the error middleware. */
export class HttpError extends Error {
  status: number
  code?: string

  constructor(status: number, message: string, code?: string) {
    super(message)
    this.name = 'HttpError'
    this.status = status
    this.code = code
  }
}

export const notFound = (message = 'Not found') => new HttpError(404, message, 'NOT_FOUND')
export const badRequest = (message = 'Bad request') => new HttpError(400, message, 'BAD_REQUEST')
export const unauthorized = (message = 'Unauthorized') => new HttpError(401, message, 'UNAUTHORIZED')
