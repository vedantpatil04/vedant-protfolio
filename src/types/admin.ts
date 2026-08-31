export interface SafeAdmin {
  id: string
  name: string
  email: string
  role: 'admin'
  isActive: boolean
  lastLoginAt?: string
}
