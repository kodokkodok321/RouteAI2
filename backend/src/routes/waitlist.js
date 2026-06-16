const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// ─── POST /api/waitlist ─────────────────────────────────────────────────────
// Register a new waitlist entry
router.post('/', async (req, res) => {
  try {
    const { name, email } = req.body

    // Validate inputs
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Name is required.',
      })
    }

    if (!email || typeof email !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Email is required.',
      })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format.',
      })
    }

    const sanitizedName = name.trim().slice(0, 100)
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 200)

    // Check duplicate
    const existing = await prisma.waitlist.findUnique({
      where: { email: sanitizedEmail },
    })

    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered in the waitlist.',
      })
    }

    // Create entry
    const entry = await prisma.waitlist.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
      },
    })

    // Get current count
    const count = await prisma.waitlist.count()

    return res.status(201).json({
      success: true,
      message: 'Successfully joined the waitlist!',
      data: {
        id: entry.id,
        name: entry.name,
        email: entry.email,
        position: count,
        createdAt: entry.createdAt,
      },
    })
  } catch (err) {
    console.error('[POST /api/waitlist] Error:', err)

    // Handle Prisma unique constraint error
    if (err.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Email already registered in the waitlist.',
      })
    }

    return res.status(500).json({
      success: false,
      message: 'Internal server error. Please try again.',
    })
  }
})

// ─── GET /api/waitlist/count ────────────────────────────────────────────────
// Get total waitlist registrations
router.get('/count', async (req, res) => {
  try {
    const count = await prisma.waitlist.count()

    return res.json({
      success: true,
      count,
    })
  } catch (err) {
    console.error('[GET /api/waitlist/count] Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
})

// ─── GET /api/waitlist ──────────────────────────────────────────────────────
// Get all waitlist entries (paginated, admin use)
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1)
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 20))
    const skip = (page - 1) * limit

    const [entries, total] = await Promise.all([
      prisma.waitlist.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
        },
      }),
      prisma.waitlist.count(),
    ])

    return res.json({
      success: true,
      data: entries,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (err) {
    console.error('[GET /api/waitlist] Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
})

module.exports = router
