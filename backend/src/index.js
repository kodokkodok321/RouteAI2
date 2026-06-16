require('dotenv').config()

const express = require('express')
const corsMiddleware = require('./middleware/cors')
const waitlistRouter = require('./routes/waitlist')
const addressesRouter = require('./routes/addresses')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Middleware ──────────────────────────────────────────────────────────────
app.use(corsMiddleware)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// Request logger (development only)
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`)
    next()
  })
}

// ─── Health check ────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    env: process.env.NODE_ENV || 'development',
  })
})

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/waitlist', waitlistRouter)
app.use('/api/addresses', addressesRouter)

// API root
app.get('/api', (_req, res) => {
  res.json({
    name: 'RouteAI API',
    version: '1.0.0',
    description: 'AI-powered address sorting by GPS distance',
    endpoints: {
      waitlist: {
        'POST /api/waitlist': 'Register to waitlist',
        'GET  /api/waitlist/count': 'Get total registrations',
        'GET  /api/waitlist': 'List all registrations (paginated)',
      },
      addresses: {
        'GET  /api/addresses': 'Get all addresses',
        'POST /api/addresses': 'Add new address',
        'GET  /api/addresses/sort?lat=xx&lng=xx': 'Get addresses sorted by distance',
        'GET  /api/addresses/:id': 'Get address by ID',
        'DELETE /api/addresses/:id': 'Delete address',
      },
    },
  })
})

// ─── 404 handler ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  })
})

// ─── Global error handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Global Error Handler]', err)

  if (err.message && err.message.startsWith('CORS')) {
    return res.status(403).json({ success: false, message: err.message })
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production'
      ? 'Internal server error.'
      : err.message,
  })
})

// ─── Start server ────────────────────────────────────────────────────────────
app.listen(PORT, '0.0.0.0', () => {
  console.log(`
╔════════════════════════════════════════╗
║          RouteAI Backend               ║
╠════════════════════════════════════════╣
║  Port    : ${PORT}                          ║
║  Env     : ${(process.env.NODE_ENV || 'development').padEnd(12)}              ║
║  Health  : http://localhost:${PORT}/health  ║
║  API     : http://localhost:${PORT}/api     ║
╚════════════════════════════════════════╝
  `)
})

module.exports = app
