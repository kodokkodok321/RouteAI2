import { useEffect, useRef } from 'react'

// Particle system for background animation
function ParticleCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animationId
    let particles = []

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    class Particle {
      constructor() {
        this.reset()
      }

      reset() {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 2 + 0.5
        this.speedX = (Math.random() - 0.5) * 0.5
        this.speedY = (Math.random() - 0.5) * 0.5
        this.opacity = Math.random() * 0.5 + 0.1
        this.color = Math.random() > 0.5 ? '#7c3aed' : '#2563eb'
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1
      }

      draw() {
        ctx.save()
        ctx.globalAlpha = this.opacity
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }
    }

    const init = () => {
      resize()
      particles = Array.from({ length: 80 }, () => new Particle())
    }

    const drawConnections = () => {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 120) {
            ctx.save()
            ctx.globalAlpha = (1 - dist / 120) * 0.15
            ctx.strokeStyle = '#7c3aed'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.restore()
          }
        }
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach((p) => {
        p.update()
        p.draw()
      })
      drawConnections()
      animationId = requestAnimationFrame(animate)
    }

    init()
    animate()

    const handleResize = () => {
      resize()
      particles.forEach((p) => p.reset())
    }

    window.addEventListener('resize', handleResize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

export default function Hero({
  onDetectLocation,
  isLocating,
  userLocation,
  locationError,
  waitlistCount,
}) {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a0a2e 50%, #0a0a1f 100%)',
      }}
    >
      {/* Animated background blobs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(37,99,235,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 10s ease-in-out infinite reverse',
          zIndex: 0,
        }}
      />

      {/* Particle canvas */}
      <ParticleCanvas />

      {/* Grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(124,58,237,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(124,58,237,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          zIndex: 0,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          padding: '2rem 1rem',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        {/* Badge */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: '100px',
            background: 'rgba(124,58,237,0.15)',
            border: '1px solid rgba(124,58,237,0.3)',
            marginBottom: '1.5rem',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ fontSize: '14px' }}>⚡</span>
          <span
            style={{
              fontSize: '13px',
              fontWeight: '600',
              color: '#a78bfa',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Early Access
          </span>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: '#4ade80',
              boxShadow: '0 0 6px #4ade80',
              animation: 'pulse 2s infinite',
            }}
          />
        </div>

        {/* Main heading */}
        <h1
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(2.5rem, 7vw, 4.5rem)',
            fontWeight: '900',
            lineHeight: '1.1',
            marginBottom: '1.5rem',
            animationDelay: '0.1s',
          }}
        >
          <span style={{ display: 'block', color: '#f0f0ff' }}>Sortir Alamat</span>
          <span
            style={{
              display: 'block',
              background: 'linear-gradient(135deg, #9d5cff 0%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            dengan AI + GPS
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="animate-fade-in-up"
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
            color: '#a0a0c0',
            maxWidth: '560px',
            margin: '0 auto 2.5rem',
            lineHeight: '1.7',
            animationDelay: '0.2s',
          }}
        >
          RouteAI mengurutkan alamat secara cerdas berdasarkan jarak dari lokasi GPS Anda —
          dari terdekat ke terjauh. Optimalkan rute pengiriman Anda dengan teknologi AI.
        </p>

        {/* GPS Button */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
            animationDelay: '0.3s',
          }}
        >
          <button
            onClick={onDetectLocation}
            disabled={isLocating}
            className="btn-gradient"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 32px',
              borderRadius: '12px',
              border: 'none',
              cursor: isLocating ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              fontWeight: '600',
              fontFamily: 'Poppins, sans-serif',
              color: '#fff',
              background: isLocating
                ? 'rgba(124,58,237,0.5)'
                : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
              boxShadow: isLocating ? 'none' : '0 8px 32px rgba(124,58,237,0.4)',
              transition: 'all 0.3s ease',
              transform: 'translateZ(0)',
            }}
            onMouseEnter={(e) => {
              if (!isLocating) {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)'
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(124,58,237,0.5)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateZ(0)'
              e.currentTarget.style.boxShadow = isLocating
                ? 'none'
                : '0 8px 32px rgba(124,58,237,0.4)'
            }}
          >
            {isLocating ? (
              <>
                <div className="spinner" />
                <span>Mendeteksi Lokasi...</span>
              </>
            ) : userLocation ? (
              <>
                <span>✅</span>
                <span>Lokasi Terdeteksi — Ulangi?</span>
              </>
            ) : (
              <>
                <span style={{ fontSize: '20px' }}>📍</span>
                <span>Deteksi Lokasi Saya</span>
              </>
            )}
          </button>

          {/* Location status */}
          {userLocation && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(74,222,128,0.1)',
                border: '1px solid rgba(74,222,128,0.2)',
                fontSize: '13px',
                color: '#4ade80',
                fontWeight: '500',
              }}
            >
              <span>🌍</span>
              <span>
                {userLocation.lat.toFixed(4)}°, {userLocation.lng.toFixed(4)}° —{' '}
                Akurasi ±{Math.round(userLocation.accuracy)}m
              </span>
            </div>
          )}

          {/* Location error */}
          {locationError && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(248,113,113,0.1)',
                border: '1px solid rgba(248,113,113,0.2)',
                fontSize: '13px',
                color: '#f87171',
                fontWeight: '500',
                maxWidth: '400px',
                textAlign: 'center',
              }}
            >
              <span>⚠️</span>
              <span>{locationError}</span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div
          className="animate-fade-in-up"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            marginTop: '3rem',
            animationDelay: '0.4s',
            flexWrap: 'wrap',
          }}
        >
          {[
            { value: waitlistCount > 0 ? `${waitlistCount}+` : '—', label: 'Di Waitlist' },
            { value: '5', label: 'Kota di Jakarta' },
            { value: '100%', label: 'Gratis Saat Launch' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #9d5cff, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: '12px', color: '#a0a0c0', fontWeight: '500' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div
          style={{
            position: 'absolute',
            bottom: '-60px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            opacity: 0.5,
          }}
        >
          <span style={{ fontSize: '12px', color: '#a0a0c0', letterSpacing: '0.1em' }}>
            SCROLL
          </span>
          <div
            style={{
              width: '20px',
              height: '32px',
              border: '2px solid rgba(124,58,237,0.4)',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '4px',
            }}
          >
            <div
              style={{
                width: '4px',
                height: '8px',
                background: '#7c3aed',
                borderRadius: '2px',
                animation: 'scrollBounce 1.5s ease-in-out infinite',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
      `}</style>
    </section>
  )
}
