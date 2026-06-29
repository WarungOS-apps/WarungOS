import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient' // 1. PASTIKAN PATH INI SESUAI DENGAN FILE KONFIGURASI SUPABASE ANDA
import './App.css'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 2. Ambil session aktif saat aplikasi pertama kali dimuat
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 3. Dengarkan perubahan status auth (Login / Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Memuat Halaman...</div>
  }

  // 4. Jika user BELUM login, arahkan atau biarkan di halaman Login
  if (!session) {
    // Jika Anda memakai React Router, bagian ini biasanya di-handle oleh <Routes>
    // Namun untuk struktur simpel, Anda bisa me-return komponen Login Anda di sini:
    // return <LoginComponent />
    
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Anda Belum Login</h2>
        <p>Silakan kembali ke halaman login atau tunggu redirect.</p>
        <a href="/login" style={{ color: '#4caf50', textDecoration: 'underline' }}>Ke Halaman Login</a>
      </div>
    )
  }

  // 5. TAMPILAN JIKA USER BERHASIL LOGIN (Dashboard / Aplikasi Utama)
  return (
    <>
      <section id="center" style={{ paddingTop: '40px' }}>
        <div className="hero">
          {/* Menampilkan foto profil Google User */}
          <img 
            src={session.user.user_metadata.avatar_url} 
            style={{ borderRadius: '50%', border: '3px solid #2ecc71' }} 
            width="100" 
            height="100" 
            alt="Profile" 
          />
        </div>
        <div>
          <h1>Selamat Datang di WarungOS!</h1>
          <p>Halo, <strong>{session.user.user_metadata.full_name || session.user.email}</strong></p>
          <p>Anda berhasil login menggunakan Google Auth.</p>
        </div>
        
        {/* Tombol Keluar / Logout */}
        <button
          type="button"
          className="counter"
          style={{ backgroundColor: '#e74c3c', color: 'white', marginTop: '20px' }}
          onClick={async () => {
            await supabase.auth.signOut()
          }}
        >
          Keluar (Sign Out)
        </button>
      </section>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  )
}

export default App