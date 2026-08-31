/**
 * Thin fetch wrapper the whole app funnels API calls through — nothing
 * elsewhere calls `fetch` directly. Sends cookies on every request
 * (`credentials: 'include'`) since the admin session lives in an
 * httpOnly cookie, not localStorage.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

export class ApiError extends Error {
  status: number
  code?: string
  constructor(message: string, status: number, code?: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
  }
}

interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

interface ApiFailure {
  success: false
  message: string
  code?: string
}

type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })

  // 204 No Content — nothing to parse.
  if (res.status === 204) return undefined as T

  const body = (await res.json()) as ApiEnvelope<T>

  if (!body.success) {
    throw new ApiError(body.message, res.status, body.code)
  }

  return body.data
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
