const express = require('express')
const { PrismaClient } = require('@prisma/client')

const router = express.Router()
const prisma = new PrismaClient()

// ─── Haversine distance formula ──────────────────────────────────────────────
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// ─── GET /api/addresses ─────────────────────────────────────────────────────
// Get all addresses (unsorted)
router.get('/', async (req, res) => {
  try {
    const addresses = await prisma.address.findMany({
      orderBy: { createdAt: 'asc' },
    })

    return res.json(addresses)
  } catch (err) {
    console.error('[GET /api/addresses] Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
})

// ─── GET /api/addresses/sort ─────────────────────────────────────────────────
// Get addresses sorted by distance from given coordinates
// Query: ?lat=<latitude>&lng=<longitude>
router.get('/sort', async (req, res) => {
  try {
    const { lat, lng } = req.query

    if (lat === undefined || lng === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Query params "lat" and "lng" are required.',
      })
    }

    const userLat = parseFloat(lat)
    const userLng = parseFloat(lng)

    if (isNaN(userLat) || isNaN(userLng)) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng must be valid numbers.',
      })
    }

    if (userLat < -90 || userLat > 90 || userLng < -180 || userLng > 180) {
      return res.status(400).json({
        success: false,
        message: 'lat must be -90..90 and lng must be -180..180.',
      })
    }

    // Fetch all addresses
    const addresses = await prisma.address.findMany({
      orderBy: { id: 'asc' },
    })

    // Compute distance for each
    const withDistance = addresses.map((addr) => ({
      ...addr,
      distance: haversineDistance(userLat, userLng, addr.lat, addr.lng),
    }))

    // Sort ascending by distance
    withDistance.sort((a, b) => a.distance - b.distance)

    return res.json(withDistance)
  } catch (err) {
    console.error('[GET /api/addresses/sort] Error:', err)
    return res.status(500).json({
      success: false,
      message: 'Internal server error.',
    })
  }
})

// ─── GET /api/addresses/:id ──────────────────────────────────────────────────
// Get single address by ID
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID.' })
    }

    const address = await prisma.address.findUnique({ where: { id } })

    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found.' })
    }

    return res.json(address)
  } catch (err) {
    console.error('[GET /api/addresses/:id] Error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error.' })
  }
})

// ─── POST /api/addresses ─────────────────────────────────────────────────────
// Add a new address
router.post('/', async (req, res) => {
  try {
    const { name, address, lat, lng } = req.body

    // Validate
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Name is required.' })
    }
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Address is required.' })
    }

    const parsedLat = parseFloat(lat)
    const parsedLng = parseFloat(lng)

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      return res.status(400).json({
        success: false,
        message: 'lat and lng must be valid numbers.',
      })
    }

    if (parsedLat < -90 || parsedLat > 90 || parsedLng < -180 || parsedLng > 180) {
      return res.status(400).json({
        success: false,
        message: 'Coordinates out of valid range.',
      })
    }

    const created = await prisma.address.create({
      data: {
        name: name.trim().slice(0, 100),
        address: address.trim().slice(0, 300),
        lat: parsedLat,
        lng: parsedLng,
      },
    })

    return res.status(201).json({
      success: true,
      message: 'Address added successfully.',
      data: created,
    })
  } catch (err) {
    console.error('[POST /api/addresses] Error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error.' })
  }
})

// ─── DELETE /api/addresses/:id ───────────────────────────────────────────────
// Delete an address by ID
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Invalid ID.' })
    }

    await prisma.address.delete({ where: { id } })

    return res.json({ success: true, message: 'Address deleted.' })
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Address not found.' })
    }
    console.error('[DELETE /api/addresses/:id] Error:', err)
    return res.status(500).json({ success: false, message: 'Internal server error.' })
  }
})

module.exports = router
