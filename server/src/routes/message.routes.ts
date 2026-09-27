import { Router } from 'express'
import { createMessage, listMessages, updateMessageStatus, deleteMessage } from '../controllers/message.controller'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { messageRateLimiter } from '../middleware/rate-limit'
import { messageSchema } from '../types/validation'

export const messageRouter = Router()

// Public — rate-limited ahead of validation so an abusive client gets 429s
// before spending any DB/validation work.
messageRouter.post('/', messageRateLimiter, validate(messageSchema), createMessage)

// Admin
messageRouter.get('/', authenticate, listMessages)
messageRouter.patch('/:id', authenticate, updateMessageStatus)
messageRouter.delete('/:id', authenticate, deleteMessage)
