const features = [
  {
    icon: '📍',
    title: 'GPS Precision',
    description:
      'Deteksi lokasi Anda secara real-time dengan akurasi tinggi menggunakan browser Geolocation API. Tidak perlu input manual.',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(124,58,237,0.05))',
    border: 'rgba(124,58,237,0.2)',
    accent: '#9d5cff',
  },
  {
    icon: '🤖',
    title: 'AI Sorting',
    description:
      'Algoritma Haversine Formula dikombinasikan dengan AI untuk mengurutkan alamat dari terdekat ke terjauh secara instan.',
    gradient: 'linear-gradient(135deg, rgba(37,99,235,0.15), rgba(37,99,235,0.05))',
    border: 'rgba(37,99,235,0.2)',
    accent: '#3b82f6',
  },
  {
    icon: '🗺️',
    title: 'Google Maps Integration',
    description:
      'Klik alamat mana saja langsung membuka Google Maps dengan navigasi turn-by-turn siap dipakai.',
    gradient: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(16,185,129,0.05))',
    border: 'rgba(16,185,129,0.2)',
    accent: '#10b981',
  },
  {
    icon: '⚡',
    title: 'Real-time Updates',
    description:
      'Data alamat diperbarui secara real-time dari database. Tambah alamat baru langsung terlihat di leaderboard.',
    gradient: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
    border: 'rgba(245,158,11,0.2)',
    accent: '#f59e0b',
  },
  {
    icon: '📱',
    title: 'Mobile First',
    description:
      'Dioptimalkan untuk penggunaan mobile. Antarmuka responsif yang bekerja sempurna di semua ukuran layar.',
    gradient: 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))',
    border: 'rgba(239,68,68,0.2)',
    accent: '#ef4444',
  },
  {
    icon: '🔒',
    title: 'Privacy First',
    description:
      'Lokasi GPS Anda hanya diproses di browser — tidak disimpan di server kami. Data Anda, kendali Anda.',
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(168,85,247,0.05))',
    border: 'rgba(168,85,247,0.2)',
    accent: '#a855f7',
  },
]

export default function FeatureCards() {
  return (
    <section
      style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(180deg, #0a0a0f 0%, #0d0d18 100%)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
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
            ✨ Fitur Unggulan
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
            Kenapa Pilih{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #9d5cff, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              RouteAI?
            </span>
          </h2>
          <p
            style={{
              color: '#a0a0c0',
              fontSize: '15px',
              maxWidth: '540px',
              margin: '0 auto',
              lineHeight: 1.6,
            }}
          >
            Teknologi modern yang memudahkan pengelolaan rute dan alamat untuk bisnis Anda.
          </p>
        </div>

        {/* Cards grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="reveal"
              style={{
                padding: '28px',
                borderRadius: '16px',
                background: feature.gradient,
                border: `1px solid ${feature.border}`,
                transition: 'all 0.3s ease',
                animationDelay: `${index * 0.1}s`,
                cursor: 'default',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = `0 12px 40px ${feature.border}`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: `${feature.border.replace('0.2)', '0.15)')}`,
                  border: `1px solid ${feature.border}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  marginBottom: '16px',
                }}
              >
                {feature.icon}
              </div>

              {/* Title */}
              <h3
                style={{
                  fontSize: '17px',
                  fontWeight: '700',
                  color: '#f0f0ff',
                  marginBottom: '10px',
                }}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p
                style={{
                  fontSize: '14px',
                  color: '#a0a0c0',
                  lineHeight: 1.65,
                }}
              >
                {feature.description}
              </p>

              {/* Accent line */}
              <div
                style={{
                  height: '2px',
                  borderRadius: '1px',
                  background: `linear-gradient(90deg, ${feature.accent}, transparent)`,
                  marginTop: '20px',
                  opacity: 0.6,
                }}
              />
            </div>
          ))}
        </div>

        {/* Tech stack row */}
        <div
          className="reveal"
          style={{
            marginTop: '3rem',
            padding: '24px 32px',
            borderRadius: '16px',
            background: 'rgba(18,18,26,0.8)',
            border: '1px solid rgba(124,58,237,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          <span style={{ fontSize: '13px', color: '#60607a', fontWeight: '600' }}>
            BUILT WITH:
          </span>
          {[
            { label: 'React', color: '#61dafb' },
            { label: 'Vite', color: '#646cff' },
            { label: 'Tailwind CSS', color: '#06b6d4' },
            { label: 'Node.js', color: '#68a063' },
            { label: 'Express', color: '#a0a0c0' },
            { label: 'PostgreSQL', color: '#336791' },
            { label: 'Prisma', color: '#5a67d8' },
          ].map((tech) => (
            <span
              key={tech.label}
              style={{
                padding: '4px 12px',
                borderRadius: '6px',
                background: `${tech.color}15`,
                border: `1px solid ${tech.color}30`,
                color: tech.color,
                fontSize: '12px',
                fontWeight: '600',
              }}
            >
              {tech.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
