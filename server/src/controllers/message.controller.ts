import type { Request, Response } from 'express'
import { MessageModel } from '../models/Message'
import { asyncHandler } from '../utils/async-handler'
import { notFound } from '../utils/http-error'
import { ok } from '../types/api'
import type { MessageInput } from '../types/validation'
import * as crud from '../utils/crud-factory'

/** Public — the contact form submits here. No auth required to create. */
export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const payload = req.body as MessageInput
  const doc = await MessageModel.create(payload)
  res.status(201).json(ok({ id: String(doc._id) }, "Message sent — we'll get back to you soon."))
})

// Admin — inbox management.
export const listMessages = crud.adminList(MessageModel)

export const updateMessageStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.body as { status: string }
  const doc = await MessageModel.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })
  if (!doc) throw notFound()
  res.json(ok(doc, 'Updated'))
})

export const deleteMessage = crud.adminDelete(MessageModel)
