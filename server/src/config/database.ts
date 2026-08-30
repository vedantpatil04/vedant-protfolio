import mongoose from 'mongoose'
import { env } from './env'

let connected = false

/**
 * Connects to MongoDB via Mongoose. Not called automatically in Phase 1
 * (no models are persisted yet) — wire this into server.ts once the
 * first real model/route lands.
 */
export async function connectDatabase() {
  if (connected) return

  mongoose.set('strictQuery', true)
  await mongoose.connect(env.mongodbUri)
  connected = true
  console.log('[database] connected')
}

export async function disconnectDatabase() {
  if (!connected) return
  await mongoose.disconnect()
  connected = false
}
