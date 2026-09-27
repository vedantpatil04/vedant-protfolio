import type { Request, Response } from 'express'
import { MessageModel } from '../models/Message'
import { asyncHandler } from '../utils/async-handler'
import { notFound } from '../utils/http-error'
import { ok } from '../types/api'
import type { MessageInput } from '../types/validation'
import { sendContactNotification } from '../services/email.service'
import * as crud from '../utils/crud-factory'

const SUCCESS_MESSAGE = "Message sent — we'll get back to you soon."

/**
 * Public — the contact form submits here. No auth required to create.
 *
 * Flow: honeypot check → save to MongoDB → attempt email notification.
 * The email step can fail (missing config, provider outage, network
 * error) without the visitor's message ever being lost or the request
 * failing — see services/email.service.ts, which never throws.
 */
export const createMessage = asyncHandler(async (req: Request, res: Response) => {
  const { website, ...payload } = req.body as MessageInput

  // Honeypot: a real visitor never sees or fills this field. A bot that
  // fills every field gets an identical success response — telling it
  // "rejected" would just teach it to leave the field blank next time —
  // but nothing is persisted and no notification is sent.
  if (website) {
    console.warn('[contact] honeypot triggered — submission silently discarded')
    res.status(201).json(ok({ id: '' }, SUCCESS_MESSAGE))
    return
  }

  const doc = await MessageModel.create(payload)

  const result = await sendContactNotification({
    name: payload.name,
    email: payload.email,
    subject: payload.subject,
    message: payload.message,
    messageId: String(doc._id),
  })
  if (!result.sent) {
    // Safe to log — no message content, no secrets. The message is already
    // stored, so the visitor still gets a normal success response below;
    // the admin will simply see it in the inbox instead of their inbox.
    console.warn(`[email] contact notification not sent (${result.reason ?? 'unknown reason'})`)
  }

  res.status(201).json(ok({ id: String(doc._id) }, SUCCESS_MESSAGE))
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
