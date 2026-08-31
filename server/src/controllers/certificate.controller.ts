import { CertificateModel } from '../models/Certificate'
import * as crud from '../utils/crud-factory'

export const listCertificates = crud.publicList(CertificateModel, { defaultSort: { issueDate: -1 } })
export const getCertificateById = crud.publicGetById(CertificateModel)

export const listAllCertificates = crud.adminList(CertificateModel, { defaultSort: { issueDate: -1 } })
export const createCertificate = crud.adminCreate(CertificateModel)
export const updateCertificate = crud.adminUpdate(CertificateModel)
export const deleteCertificate = crud.adminDelete(CertificateModel)
