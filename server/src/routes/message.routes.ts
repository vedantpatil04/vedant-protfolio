import { Router } from 'express'
import { createMessage, listMessages, updateMessageStatus, deleteMessage } from '../controllers/message.controller'
import { authenticate } from '../middleware/authenticate'
import { validate } from '../middleware/validate'
import { messageSchema } from '../types/validation'

export const messageRouter = Router()

// Public
messageRouter.post('/', validate(messageSchema), createMessage)

// Admin
messageRouter.get('/', authenticate, listMessages)
messageRouter.patch('/:id', authenticate, updateMessageStatus)
messageRouter.delete('/:id', authenticate, deleteMessage)
