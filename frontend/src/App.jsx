import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import WaitlistForm from './components/WaitlistForm'
import Leaderboard from './components/Leaderboard'
import FeatureCards from './components/FeatureCards'
import Footer from './components/Footer'

function App() {
  const [userLocation, setUserLocation] = useState(null)
  const [locationError, setLocationError] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [waitlistCount, setWaitlistCount] = useState(0)

  // Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Browser Anda tidak mendukung geolocation.')
      return
    }

    setIsLocating(true)
    setLocationError(null)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        })
        setIsLocating(false)
      },
      (error) => {
        setIsLocating(false)
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Akses lokasi ditolak. Izinkan akses lokasi di browser Anda.')
            break
          case error.POSITION_UNAVAILABLE:
            setLocationError('Informasi lokasi tidak tersedia.')
            break
          case error.TIMEOUT:
            setLocationError('Permintaan lokasi timeout. Coba lagi.')
            break
          default:
            setLocationError('Terjadi kesalahan saat mendeteksi lokasi.')
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0f', fontFamily: 'Poppins, sans-serif' }}>
      {/* Noise texture overlay */}
      <div className="noise-overlay" />

      {/* Hero Section */}
      <Hero
        onDetectLocation={handleDetectLocation}
        isLocating={isLocating}
        userLocation={userLocation}
        locationError={locationError}
        waitlistCount={waitlistCount}
      />

      {/* Leaderboard Section */}
      {(userLocation || true) && (
        <Leaderboard userLocation={userLocation} />
      )}

      {/* Feature Cards */}
      <FeatureCards />

      {/* Waitlist Form */}
      <WaitlistForm
        onCountUpdate={setWaitlistCount}
        waitlistCount={waitlistCount}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App
