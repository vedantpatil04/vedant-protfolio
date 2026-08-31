import mongoose from 'mongoose'
import { env } from './env'

let connected = false

/** Redacts credentials from a Mongo URI before it ever hits a log line. */
function maskUri(uri: string): string {
  try {
    const url = new URL(uri)
    if (url.username || url.password) {
      url.username = url.username ? '***' : ''
      url.password = url.password ? '***' : ''
    }
    return url.toString()
  } catch {
    return uri.replace(/\/\/.*@/, '//***:***@')
  }
}

/**
 * Connects to MongoDB via Mongoose. Safe to call more than once — it
 * no-ops if already connected, so callers don't need to guard it.
 */
export async function connectDatabase(): Promise<void> {
  if (connected || mongoose.connection.readyState === 1) return

  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(env.mongodbUri, { serverSelectionTimeoutMS: 5000 })
    connected = true
    console.log(`[database] connected — ${maskUri(env.mongodbUri)}`)
  } catch (err) {
    console.error('[database] connection failed:', err instanceof Error ? err.message : err)
    throw err
  }

  mongoose.connection.on('error', (err) => {
    console.error('[database] connection error:', err instanceof Error ? err.message : err)
  })

  mongoose.connection.on('disconnected', () => {
    connected = false
    console.warn('[database] disconnected')
  })
}

export async function disconnectDatabase(): Promise<void> {
  if (!connected) return
  await mongoose.disconnect()
  connected = false
  console.log('[database] disconnected gracefully')
}
