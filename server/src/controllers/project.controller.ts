import type { Request, Response } from 'express'
import type { ApiSuccess } from '../types/api'

/**
 * Structural placeholder. Returns an empty list rather than fake data —
 * swap for `ProjectModel.find()` once the database is connected and
 * seeded in Phase 2.
 */
export async function listProjects(_req: Request, res: Response) {
  const body: ApiSuccess<unknown[]> = { success: true, data: [] }
  res.json(body)
}
