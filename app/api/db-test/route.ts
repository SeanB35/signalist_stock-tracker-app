import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import { connectToDatabase } from '@/database/mongoose'

export async function GET() {
  const startedAt = Date.now()
  try {
    await connectToDatabase()

    // Attempt a ping to verify the connection is alive
    let pingMs: number | null = null
    try {
      const t0 = Date.now()
      if (mongoose.connection?.db) {
        // Using the native driver to ping
        // @ts-ignore - command typing not exposed via mongoose
        await mongoose.connection.db.admin().command({ ping: 1 })
        pingMs = Date.now() - t0
      }
    } catch (e) {
      // ignore ping failure, still report connection status
    }

    const data = {
      ok: true,
      message: 'Database connection successful',
      readyState: mongoose.connection.readyState, // 1 connected
      pingMs,
      durationMs: Date.now() - startedAt,
      env: process.env.NODE_ENV,
      // Mask credentials in the URI if present
      uri: maskUri(process.env.MONGODB_URI || ''),
      driver: 'mongoose@' + mongoose.version,
      serverTime: new Date().toISOString(),
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err: any) {
    const error = {
      ok: false,
      message: 'Database connection failed',
      error: err?.message || String(err),
      code: err?.code,
      name: err?.name,
      durationMs: Date.now() - startedAt,
      env: process.env.NODE_ENV,
      uri: maskUri(process.env.MONGODB_URI || ''),
      serverTime: new Date().toISOString(),
    }
    return NextResponse.json(error, { status: 500 })
  }
}

function maskUri(uri: string): string {
  if (!uri) return ''
  try {
    const u = new URL(uri)
    if (u.password) u.password = '***'
    if (u.username) u.username = u.username.length > 0 ? '***' : ''
    return u.toString()
  } catch {
    return uri.replace(/:\/\/[^@]*@/, '://***:***@')
  }
}
