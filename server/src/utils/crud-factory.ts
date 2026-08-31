import type { Request, Response } from 'express'
import type { FilterQuery, Model } from 'mongoose'
import { asyncHandler } from './async-handler'
import { notFound } from './http-error'
import { ok } from '../types/api'

export interface CrudOptions<T> {
  /** Applied to every public read so unpublished/draft content never leaks. */
  publicFilter?: FilterQuery<T>
  defaultSort?: Record<string, 1 | -1>
}

/**
 * Generates the standard read/write handlers shared by every content
 * resource (Project, Certificate, Achievement, Skill, Education,
 * Experience). Resource-specific behaviour (extra query params,
 * projections) can still be layered on top in that resource's own
 * controller — this only covers the repeated 80%.
 */

export function publicList<T>(model: Model<T>, options: CrudOptions<T> = {}) {
  return asyncHandler(async (req: Request, res: Response) => {
    const filter = { ...(options.publicFilter as object) } as FilterQuery<T>
    if (req.query.featured === 'true') {
      Object.assign(filter as object, { featured: true })
    }
    const docs = await model
      .find(filter)
      .sort(options.defaultSort ?? { createdAt: -1 })
    res.json(ok(docs))
  })
}

export function publicGetById<T>(model: Model<T>, options: CrudOptions<T> = {}) {
  return asyncHandler(async (req: Request, res: Response) => {
    const filter = { ...(options.publicFilter as object), _id: req.params.id } as FilterQuery<T>
    const doc = await model.findOne(filter)
    if (!doc) throw notFound()
    res.json(ok(doc))
  })
}

export function publicGetBySlug<T>(model: Model<T>, options: CrudOptions<T> = {}) {
  return asyncHandler(async (req: Request, res: Response) => {
    const filter = { ...(options.publicFilter as object), slug: req.params.slug } as FilterQuery<T>
    const doc = await model.findOne(filter)
    if (!doc) throw notFound()
    res.json(ok(doc))
  })
}

export function adminList<T>(model: Model<T>, options: CrudOptions<T> = {}) {
  return asyncHandler(async (_req: Request, res: Response) => {
    const docs = await model.find().sort(options.defaultSort ?? { createdAt: -1 })
    res.json(ok(docs))
  })
}

export function adminCreate<T>(model: Model<T>) {
  return asyncHandler(async (req: Request, res: Response) => {
    const doc = await model.create(req.body)
    res.status(201).json(ok(doc, 'Created'))
  })
}

export function adminUpdate<T>(model: Model<T>) {
  return asyncHandler(async (req: Request, res: Response) => {
    const doc = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) throw notFound()
    res.json(ok(doc, 'Updated'))
  })
}

export function adminDelete<T>(model: Model<T>) {
  return asyncHandler(async (req: Request, res: Response) => {
    const doc = await model.findByIdAndDelete(req.params.id)
    if (!doc) throw notFound()
    res.json(ok(null, 'Deleted'))
  })
}
