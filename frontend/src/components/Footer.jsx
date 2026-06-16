export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      style={{
        padding: '3rem 1rem 2rem',
        background: '#070710',
        borderTop: '1px solid rgba(124,58,237,0.1)',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Top section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '2rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Brand */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '12px',
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px',
                }}
              >
                🗺️
              </div>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #9d5cff, #3b82f6)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                RouteAI
              </span>
            </div>
            <p
              style={{
                color: '#60607a',
                fontSize: '13px',
                maxWidth: '240px',
                lineHeight: 1.6,
              }}
            >
              AI-powered address sorting berdasarkan GPS. Optimalkan rute Anda.
            </p>
          </div>

          {/* Links */}
          <div
            style={{
              display: 'flex',
              gap: '3rem',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <h4
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#a0a0c0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                }}
              >
                Product
              </h4>
              {['Fitur', 'Leaderboard', 'Waitlist', 'Roadmap'].map((item) => (
                <div key={item} style={{ marginBottom: '8px' }}>
                  <a
                    href="#"
                    style={{
                      color: '#60607a',
                      fontSize: '13px',
                      textDecoration: 'none',
                      transition: 'color 0.2s',
                    }}
                    onMouseEnter={(e) => (e.target.style.color = '#a78bfa')}
                    onMouseLeave={(e) => (e.target.style.color = '#60607a')}
                  >
                    {item}
                  </a>
                </div>
              ))}
            </div>

            <div>
              <h4
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#a0a0c0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                }}
              >
                Tech
              </h4>
              {['React + Vite', 'Node.js', 'PostgreSQL', 'Prisma ORM'].map((item) => (
                <div key={item} style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#60607a', fontSize: '13px' }}>{item}</span>
                </div>
              ))}
            </div>

            <div>
              <h4
                style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  color: '#a0a0c0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '12px',
                }}
              >
                Deploy
              </h4>
              {['Vercel (Frontend)', 'Railway (Backend)', 'Railway (Database)'].map((item) => (
                <div key={item} style={{ marginBottom: '8px' }}>
                  <span style={{ color: '#60607a', fontSize: '13px' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: '1px',
            background: 'rgba(124,58,237,0.08)',
            marginBottom: '1.5rem',
          }}
        />

        {/* Bottom section */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <p style={{ color: '#3a3a5c', fontSize: '13px' }}>
            © {year} RouteAI. Built with ❤️ and lots of ☕
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span
              style={{
                padding: '3px 10px',
                borderRadius: '6px',
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.15)',
                color: '#4ade80',
                fontSize: '11px',
                fontWeight: '600',
              }}
            >
              ● All Systems Operational
            </span>
            <span style={{ color: '#3a3a5c', fontSize: '12px' }}>v1.0.0</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
