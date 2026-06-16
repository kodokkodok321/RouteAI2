import { useState, useEffect } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || ''

export default function WaitlistForm({ onCountUpdate, waitlistCount }) {
  const [form, setForm] = useState({ name: '', email: '' })
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState('')
  const [count, setCount] = useState(0)

  // Fetch count on mount
  useEffect(() => {
    fetchCount()
  }, [])

  const fetchCount = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/waitlist/count`)
      const total = res.data.count || 0
      setCount(total)
      onCountUpdate(total)
    } catch {
      // Silently fail for count
    }
  }

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (status === 'error') {
      setStatus('idle')
      setErrorMsg('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate
    if (!form.name.trim()) {
      setStatus('error')
      setErrorMsg('Nama tidak boleh kosong.')
      return
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setStatus('error')
      setErrorMsg('Masukkan email yang valid.')
      return
    }

    try {
      setStatus('loading')
      await axios.post(`${API_URL}/api/waitlist`, {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
      })

      setStatus('success')
      setForm({ name: '', email: '' })
      fetchCount()
    } catch (err) {
      setStatus('error')
      if (err.response?.status === 409) {
        setErrorMsg('Email ini sudah terdaftar di waitlist!')
      } else if (err.response?.data?.message) {
        setErrorMsg(err.response.data.message)
      } else {
        setErrorMsg('Terjadi kesalahan. Silakan coba lagi.')
      }
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '10px',
    background: 'rgba(26,26,46,0.9)',
    border: '1px solid rgba(124,58,237,0.2)',
    color: '#f0f0ff',
    fontSize: '15px',
    fontFamily: 'Poppins, sans-serif',
    outline: 'none',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
  }

  return (
    <section
      id="waitlist"
      style={{
        padding: '5rem 1rem',
        background: 'linear-gradient(180deg, #0d0d18 0%, #0a0a0f 100%)',
      }}
    >
      <div style={{ maxWidth: '540px', margin: '0 auto' }}>
        {/* Header */}
        <div className="reveal" style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
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
            🚀 Join Waitlist
          </div>
          <h2
            style={{
              fontSize: 'clamp(1.8rem, 5vw, 2.5rem)',
              fontWeight: '800',
              color: '#f0f0ff',
              marginBottom: '1rem',
              lineHeight: 1.2,
            }}
          >
            Dapatkan Akses{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #9d5cff, #3b82f6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Pertama
            </span>
          </h2>
          <p style={{ color: '#a0a0c0', fontSize: '15px', lineHeight: 1.6 }}>
            Daftar sekarang dan jadilah yang pertama merasakan RouteAI saat launch. Gratis!
          </p>

          {/* Counter */}
          {count > 0 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '1rem',
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.15)',
              }}
            >
              <span style={{ fontSize: '16px' }}>👥</span>
              <span style={{ fontSize: '14px', color: '#86efac', fontWeight: '600' }}>
                {count.toLocaleString('id-ID')} orang sudah mendaftar
              </span>
            </div>
          )}
        </div>

        {/* Form card */}
        <div
          className="reveal glass-card"
          style={{
            padding: '2rem',
            background: 'rgba(18,18,26,0.9)',
            border: '1px solid rgba(124,58,237,0.15)',
            borderRadius: '20px',
            backdropFilter: 'blur(12px)',
          }}
        >
          {status === 'success' ? (
            /* Success state */
            <div
              style={{
                textAlign: 'center',
                padding: '2rem 0',
              }}
            >
              <div style={{ fontSize: '56px', marginBottom: '1rem' }}>🎉</div>
              <h3
                style={{
                  fontSize: '1.5rem',
                  fontWeight: '700',
                  color: '#4ade80',
                  marginBottom: '0.5rem',
                }}
              >
                Kamu Berhasil Mendaftar!
              </h3>
              <p style={{ color: '#a0a0c0', fontSize: '14px', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Terima kasih telah bergabung di waitlist RouteAI.
                Kami akan menghubungi kamu saat akses tersedia.
              </p>
              {count > 0 && (
                <div
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    background: 'rgba(74,222,128,0.08)',
                    border: '1px solid rgba(74,222,128,0.15)',
                    fontSize: '14px',
                    color: '#86efac',
                    fontWeight: '600',
                    marginBottom: '1.5rem',
                  }}
                >
                  Kamu adalah pendaftar ke-{count.toLocaleString('id-ID')}!
                </div>
              )}
              <button
                onClick={() => setStatus('idle')}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  color: '#a78bfa',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  fontWeight: '600',
                }}
              >
                Daftarkan Email Lain
              </button>
            </div>
          ) : (
            /* Form state */
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#a0a0c0',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Masukkan nama lengkap Anda"
                  style={{
                    ...inputStyle,
                    borderColor:
                      status === 'error' && !form.name.trim()
                        ? 'rgba(248,113,113,0.5)'
                        : 'rgba(124,58,237,0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(124,58,237,0.2)'
                    e.target.style.boxShadow = 'none'
                  }}
                  disabled={status === 'loading'}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#a0a0c0',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="nama@email.com"
                  style={{
                    ...inputStyle,
                    borderColor:
                      status === 'error' && form.name.trim()
                        ? 'rgba(248,113,113,0.5)'
                        : 'rgba(124,58,237,0.2)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(124,58,237,0.6)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(124,58,237,0.2)'
                    e.target.style.boxShadow = 'none'
                  }}
                  disabled={status === 'loading'}
                />
              </div>

              {/* Error message */}
              {status === 'error' && errorMsg && (
                <div
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(248,113,113,0.1)',
                    border: '1px solid rgba(248,113,113,0.25)',
                    color: '#fca5a5',
                    fontSize: '13px',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <span>⚠️</span>
                  {errorMsg}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '10px',
                  border: 'none',
                  background:
                    status === 'loading'
                      ? 'rgba(124,58,237,0.5)'
                      : 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
                  color: '#fff',
                  fontSize: '15px',
                  fontWeight: '700',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  fontFamily: 'Poppins, sans-serif',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  boxShadow:
                    status === 'loading' ? 'none' : '0 8px 24px rgba(124,58,237,0.35)',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  if (status !== 'loading') {
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 12px 32px rgba(124,58,237,0.45)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow =
                    status === 'loading' ? 'none' : '0 8px 24px rgba(124,58,237,0.35)'
                }}
              >
                {status === 'loading' ? (
                  <>
                    <div className="spinner" />
                    Mendaftarkan...
                  </>
                ) : (
                  <>
                    <span>🚀</span>
                    Daftar Waitlist Gratis
                  </>
                )}
              </button>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: '12px',
                  color: '#60607a',
                  marginTop: '12px',
                }}
              >
                🔒 Data kamu aman. Kami tidak akan spam atau jual data kamu.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
