import { Router } from 'express'
import {
  listCertificates,
  getCertificateById,
  listAllCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
} from '../controllers/certificate.controller'
import { authenticate } from '../middleware/authenticate'

export const certificateRouter = Router()

certificateRouter.get('/', listCertificates)
certificateRouter.get('/admin/all', authenticate, listAllCertificates)
certificateRouter.get('/:id', getCertificateById)
certificateRouter.post('/', authenticate, createCertificate)
certificateRouter.put('/:id', authenticate, updateCertificate)
certificateRouter.patch('/:id', authenticate, updateCertificate)
certificateRouter.delete('/:id', authenticate, deleteCertificate)
