/**
 * Mirrors the backend Certificate model (server/src/models/Certificate.ts) —
 * the frontend and API have no shared-types package, so this is kept in
 * sync by hand, same convention as Project. Fields are exactly what the
 * API returns; nothing here should be invented on the client.
 */
export interface Certificate {
  id: string
  title: string
  issuer: string
  category?: string
  issueDate: string
  description?: string
  imageUrl?: string
  pdfUrl?: string
  credentialId?: string
  verificationUrl?: string
  featured: boolean
  createdAt: string
  updatedAt: string
}
