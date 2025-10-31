#!/usr/bin/env node
// Minimal DB connection test script
// Usage: npm run db:test [--verbose]

import 'dotenv/config';
import mongoose from 'mongoose';

const verbose = process.argv.includes('--verbose');

function maskUri(uri) {
  if (!uri) return '';
  try {
    const u = new URL(uri);
    if (u.password) u.password = '***';
    if (u.username) {
      const name = u.username;
      u.username = name.length > 0 ? '***' : '';
    }
    return u.toString();
  } catch {
    return uri.replace(/:\/\/[^@]*@/, '://***:***@');
  }
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('ERROR: MONGODB_URI is not set. Create a .env file with MONGODB_URI=...');
    process.exit(1);
  }

  const start = Date.now();
  if (verbose) console.log(`[db-test] Connecting to ${maskUri(uri)}`);

  try {
    // Disable command buffering to fail fast if connection has issues
    await mongoose.connect(uri, { bufferCommands: false });

    const state = mongoose.connection.readyState; // 1 connected, 2 connecting, etc.
    let pingMs = null;
    try {
      const t0 = Date.now();
      // Use the underlying native driver to ping
      await mongoose.connection.db.admin().ping();
      pingMs = Date.now() - t0;
    } catch (e) {
      if (verbose) console.warn('[db-test] Ping failed:', e?.message || e);
    }

    const duration = Date.now() - start;
    const result = {
      ok: true,
      message: 'Database connection successful',
      readyState: state,
      pingMs,
      durationMs: duration,
      uri: maskUri(uri),
      serverTime: new Date().toISOString(),
      driver: 'mongoose@' + mongoose.version,
    };

    console.log(JSON.stringify(result, null, 2));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    const duration = Date.now() - start;
    const errorInfo = {
      ok: false,
      message: 'Database connection failed',
      error: err?.message || String(err),
      code: err?.code,
      name: err?.name,
      durationMs: duration,
      uri: maskUri(process.env.MONGODB_URI),
      serverTime: new Date().toISOString(),
    };
    console.error(JSON.stringify(errorInfo, null, 2));
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
}

main();
