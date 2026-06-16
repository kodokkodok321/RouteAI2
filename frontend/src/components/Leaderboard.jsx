import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

// Haversine formula — calculates distance in km between two coordinates
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
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

function formatDistance(km) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(1)} km`
}

function getDistanceClass(km) {
  if (km < 5) return 'distance-close'
  if (km < 15) return 'distance-medium'
  return 'distance-far'
}

function getMedalEmoji(index) {
  if (index === 0) return '🥇'
  if (index === 1) return '🥈'
  if (index === 2) return '🥉'
  return `#${index + 1}`
}

function getMedalColor(index) {
  if (index === 0) return { color: '#ffd700', bg: 'rgba(255,215,0,0.08)', border: 'rgba(255,215,0,0.2)' }
  if (index === 1) return { color: '#c0c0c0', bg: 'rgba(192,192,192,0.08)', border: 'rgba(192,192,192,0.2)' }
  if (index === 2) return { color: '#cd7f32', bg: 'rgba(205,127,50,0.08)', border: 'rgba(205,127,50,0.2)' }
  return { color: '#a0a0c0', bg: 'rgba(160,160,192,0.05)', border: 'rgba(124,58,237,0.15)' }
}

function AddressRow({ item, index, onClick }) {
  const medal = getMedalColor(index)
  const distClass = getDistanceClass(item.distance)

  const distBg = {
    'distance-close': { color: '#4ade80', bg: 'rgba(74,222,128,0.1)', border: 'rgba(74,222,128,0.2)' },
    'distance-medium': { color: '#facc15', bg: 'rgba(250,204,21,0.1)', border: 'rgba(250,204,21,0.2)' },
    'distance-far': { color: '#f87171', bg: 'rgba(248,113,113,0.1)', border: 'rgba(248,113,113,0.2)' },
  }[distClass]

  return (
    <div
      className="leaderboard-row"
      onClick={() => onClick(item)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        borderRadius: '12px',
        background: medal.bg,
        border: `1px solid ${medal.border}`,
        marginBottom: '10px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Rank */}
      <div
        style={{
          minWidth: '44px',
          height: '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: index < 3 ? '22px' : '14px',
          fontWeight: '700',
          color: medal.color,
          borderRadius: '10px',
          background: medal.bg,
          border: `1px solid ${medal.border}`,
          flexShrink: 0,
        }}
      >
        {getMedalEmoji(index)}
      </div>

      {/* Name & address */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '700',
            color: '#f0f0ff',
            marginBottom: '3px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.name}
        </div>
        <div
          style={{
            fontSize: '12px',
            color: '#a0a0c0',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          📍 {item.address}
        </div>
      </div>

      {/* Distance badge */}
      <div
        style={{
          padding: '6px 12px',
          borderRadius: '8px',
          background: distBg.bg,
          border: `1px solid ${distBg.border}`,
          color: distBg.color,
          fontSize: '13px',
          fontWeight: '700',
          flexShrink: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {formatDistance(item.distance)}
      </div>

      {/* Maps icon */}
      <div
        style={{
          width: '32px',
          height: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '8px',
          background: 'rgba(37,99,235,0.1)',
          border: '1px solid rgba(37,99,235,0.2)',
          flexShrink: 0,
          fontSize: '16px',
        }}
        title="Buka di Google Maps"
      >
        🗺️
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 20px',
        borderRadius: '12px',
        background: 'rgba(18,18,26,0.8)',
        border: '1px solid rgba(124,58,237,0.1)',
        marginBottom: '10px',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '10px',
          background: 'rgba(124,58,237,0.1)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
      <div style={{ flex: 1 }}>
        <div
          style={{
            width: '40%',
            height: '14px',
            borderRadius: '4px',
            background: 'rgba(124,58,237,0.1)',
            marginBottom: '8px',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
        <div
          style={{
            width: '60%',
            height: '12px',
            borderRadius: '4px',
            background: 'rgba(124,58,237,0.07)',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}
        />
      </div>
      <div
        style={{
          width: '60px',
          height: '32px',
          borderRadius: '8px',
          background: 'rgba(124,58,237,0.1)',
          animation: 'pulse 1.5s ease-in-out infinite',
        }}
      />
    </div>
  )
}

export default function Leaderboard({ userLocation }) {
  const [addresses, setAddresses] = useState([])
  const [sortedAddresses, setSortedAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const fetchAddresses = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let data = []

      if (userLocation) {
        // Use backend sort endpoint when location is available
        try {
          const res = await axios.get(
            `${API_URL}/api/addresses/sort?lat=${userLocation.lat}&lng=${userLocation.lng}`
          )
          data = res.data
        } catch {
          // Fallback to all addresses if sort endpoint fails
          const res = await axios.get(`${API_URL}/api/addresses`)
          data = res.data
        }
      } else {
        const res = await axios.get(`${API_URL}/api/addresses`)
        data = res.data
      }

      setAddresses(data)
      setLastUpdated(new Date())
    } catch (err) {
      console.error('Failed to fetch addresses:', err)
      setError('Gagal memuat data alamat. Pastikan backend berjalan.')
      // Use demo data as fallback
      setAddresses([
        { id: 1, name: 'Monas', address: 'Monas, Jakarta Pusat', lat: -6.1754, lng: 106.8272 },
        { id: 2, name: 'Bundaran HI', address: 'Bundaran HI, Jakarta Pusat', lat: -6.1944, lng: 106.8229 },
        { id: 3, name: 'Kota Tua', address: 'Kota Tua, Jakarta Barat', lat: -6.1352, lng: 106.8133 },
        { id: 4, name: 'Ancol', address: 'Ancol, Jakarta Utara', lat: -6.1256, lng: 106.84 },
        { id: 5, name: 'Tanah Abang', address: 'Tanah Abang, Jakarta Pusat', lat: -6.1862, lng: 106.8136 },
      ])
    } finally {
      setLoading(false)
    }
  }, [userLocation])

  useEffect(() => {
    fetchAddresses()
  }, [fetchAddresses])

  // Client-side sort using Haversine when location changes
  useEffect(() => {
    if (addresses.length === 0) {
      setSortedAddresses([])
      return
    }

    if (userLocation) {
      const withDistance = addresses.map((addr) => ({
        ...addr,
        distance: haversineDistance(userLocation.lat, userLocation.lng, addr.lat, addr.lng),
      }))
      withDistance.sort((a, b) => a.distance - b.distance)
      setSortedAddresses(withDistance)
    } else {
      // No location: show in default order with distance as 0
      setSortedAddresses(
        addresses.map((addr) => ({
          ...addr,
          distance: null,
        }))
      )
    }
  }, [addresses, userLocation])

  const openInMaps = (item) => {
    const encoded = encodeURIComponent(item.address)
    const url = `https://www.google.com/maps/search/?api=1&query=${encoded}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <section
      id="leaderboard"
      style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d18 100%)',
      }}
    >
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        {/* Section header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '5px 14px',
              borderRadius: '100px',
              background: 'rgba(124,58,237,0.1)',
              border: '1px solid rgba(124,58,237,0.2)',
              marginBottom: '1rem',
              fontSize: '12px',
              fontWeight: '600',
              color: '#a78bfa',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            📊 AI Leaderboard
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: '800',
              color: '#f0f0ff',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            Alamat Terdekat{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #9d5cff, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              dari Lokasi Anda
            </span>
          </h2>
          <p style={{ color: '#a0a0c0', fontSize: '15px', lineHeight: 1.6 }}>
            {userLocation
              ? 'Alamat diurutkan berdasarkan jarak dari lokasi GPS Anda. Klik untuk buka di Google Maps.'
              : 'Aktifkan GPS di atas untuk melihat urutan berdasarkan jarak Anda. Klik untuk buka di Google Maps.'}
          </p>
        </div>

        {/* Status bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {userLocation ? (
              <span
                style={{
                  fontSize: '12px',
                  color: '#4ade80',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4ade80', display: 'inline-block', boxShadow: '0 0 6px #4ade80' }} />
                GPS Aktif — Diurutkan by Jarak
              </span>
            ) : (
              <span style={{ fontSize: '12px', color: '#a0a0c0' }}>
                📍 Aktifkan GPS untuk urutan jarak
              </span>
            )}
          </div>

          {!loading && (
            <button
              onClick={fetchAddresses}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(124,58,237,0.1)',
                border: '1px solid rgba(124,58,237,0.2)',
                color: '#a78bfa',
                fontSize: '12px',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontWeight: '500',
              }}
            >
              🔄 Refresh
            </button>
          )}
        </div>

        {/* Error banner */}
        {error && (
          <div
            style={{
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(248,113,113,0.08)',
              border: '1px solid rgba(248,113,113,0.2)',
              color: '#fca5a5',
              fontSize: '13px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <span>⚠️</span>
            <span>{error} — Menampilkan data demo.</span>
          </div>
        )}

        {/* Leaderboard list */}
        <div className="reveal">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
          ) : sortedAddresses.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#a0a0c0',
                fontSize: '15px',
              }}
            >
              Tidak ada alamat ditemukan.
            </div>
          ) : (
            sortedAddresses.map((item, index) => (
              <AddressRow
                key={item.id}
                item={item}
                index={index}
                onClick={openInMaps}
              />
            ))
          )}
        </div>

        {/* Footer hint */}
        {!loading && sortedAddresses.length > 0 && (
          <p
            style={{
              textAlign: 'center',
              fontSize: '12px',
              color: '#60607a',
              marginTop: '16px',
            }}
          >
            💡 Klik baris untuk membuka di Google Maps
            {lastUpdated && ` — Terakhir diperbarui: ${lastUpdated.toLocaleTimeString('id-ID')}`}
          </p>
        )}
      </div>
    </section>
  )
}
