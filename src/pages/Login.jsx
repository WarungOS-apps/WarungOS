import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

  .login-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(145deg, #e8f5e9 0%, #e3f2fd 100%);
    padding: 2rem 1rem;
    font-family: 'DM Sans', sans-serif;
  }

  .login-card {
    background: #fff;
    border-radius: 24px;
    padding: 2rem 1.5rem 1.75rem;
    width: 100%;
    max-width: 340px;
    box-shadow:
      0 4px 32px rgba(16, 120, 60, 0.10),
      0 1px 4px rgba(16, 120, 60, 0.06);
  }

  .logo-ring {
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
  }

  .logo-ring svg {
    width: 28px;
    height: 28px;
    stroke: #fff;
    fill: none;
    stroke-width: 2.2;
    stroke-linecap: round;
    stroke-linejoin: round;
  }

  .badge-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 1.25rem;
  }

  .trust-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: #e8f5e9;
    color: #15803d;
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    letter-spacing: 0.03em;
  }

  .app-title {
    font-family: 'Sora', sans-serif;
    font-size: 22px;
    font-weight: 700;
    color: #111827;
    text-align: center;
    margin: 0 0 4px;
  }

  .app-sub {
    font-size: 13px;
    color: #6b7280;
    text-align: center;
    margin: 0 0 1.75rem;
  }

  .field-wrap {
    margin-bottom: 14px;
  }

  .field-label {
    font-size: 12px;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    margin-bottom: 6px;
    display: block;
  }

  .input-group {
    position: relative;
    display: flex;
    align-items: center;
  }

  .input-icon {
    position: absolute;
    left: 13px;
    font-size: 17px;
    color: #9ca3af;
    pointer-events: none;
  }

  .inp {
    width: 100%;
    padding: 11px 12px 11px 40px;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    color: #111827;
    background: #f9fafb;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;
  }

  .inp:focus {
    border-color: #22c55e;
    background: #fff;
  }

  .inp::placeholder {
    color: #c4c9d4;
  }

  .inp-with-toggle {
    padding-right: 40px;
  }

  .toggle-pw-btn {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    color: #9ca3af;
    font-size: 17px;
    display: flex;
    align-items: center;
  }

  .forgot-link {
    display: block;
    text-align: right;
    margin-top: 5px;
    font-size: 12px;
    color: #16a34a;
    font-weight: 500;
    text-decoration: none;
  }

  .error-box {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 9px 12px;
    font-size: 13px;
    color: #b91c1c;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 7px;
  }

  .btn-main {
    width: 100%;
    background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 13px;
    font-size: 15px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    letter-spacing: 0.01em;
    margin-top: 8px;
    transition: opacity 0.2s, transform 0.1s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-main:hover:not(:disabled) {
    opacity: 0.93;
  }

  .btn-main:active:not(:disabled) {
    transform: scale(0.98);
  }

  .btn-main:disabled {
    opacity: 0.75;
    cursor: not-allowed;
  }

  .divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 1.25rem 0;
  }

  .divider-line {
    flex: 1;
    height: 1px;
    background: #f0f0f0;
  }

  .divider-text {
    font-size: 12px;
    color: #c4c9d4;
    font-weight: 500;
  }

  .btn-google {
    width: 100%;
    background: #fff;
    border: 1.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 11px;
    font-size: 14px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    color: #374151;
    transition: border-color 0.2s, background 0.2s;
  }

  .btn-google:hover {
    border-color: #bbb;
    background: #fafafa;
  }

  .footer-text {
    text-align: center;
    font-size: 13px;
    color: #9ca3af;
    margin-top: 1.25rem;
  }

  .footer-text a {
    color: #16a34a;
    font-weight: 600;
    text-decoration: none;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spin {
    animation: spin 0.8s linear infinite;
    display: inline-block;
  }
`

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.35-8.16 2.35-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
    } else {
      navigate('/dashboard')
    }
    setLoading(false)
  }

  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    if (error) setError(error.message)
  }

  return (
    <>
      <style>{styles}</style>
      <div className="login-wrapper">
        <div className="login-card">

          {/* Logo */}
          <div className="logo-ring">
            <svg viewBox="0 0 24 24">
              <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>

          {/* Trust badge */}
          <div className="badge-wrap">
            <span className="trust-badge">
              <i className="ti ti-shield-check" aria-hidden="true" style={{ fontSize: 13 }} />
              Aman &amp; Terenkripsi
            </span>
          </div>

          <h1 className="app-title">WarungOS</h1>
          <p className="app-sub">Masuk ke akun Anda</p>

          <form onSubmit={handleLogin}>
            {/* Email */}
            <div className="field-wrap">
              <label className="field-label" htmlFor="email">Email</label>
              <div className="input-group">
                <i className="ti ti-mail input-icon" aria-hidden="true" />
                <input
                  id="email"
                  className="inp"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@contoh.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="field-wrap">
              <label className="field-label" htmlFor="password">Password</label>
              <div className="input-group">
                <i className="ti ti-lock input-icon" aria-hidden="true" />
                <input
                  id="password"
                  className="inp inp-with-toggle"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="toggle-pw-btn"
                  onClick={() => setShowPassword(v => !v)}
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                >
                  <i className={`ti ${showPassword ? 'ti-eye-off' : 'ti-eye'}`} aria-hidden="true" />
                </button>
              </div>
              <a href="/forgot-password" className="forgot-link">Lupa password?</a>
            </div>

            {/* Error */}
            {error && (
              <div className="error-box">
                <i className="ti ti-alert-circle" aria-hidden="true" style={{ fontSize: 15, flexShrink: 0 }} />
                {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" className="btn-main" disabled={loading}>
              {loading
                ? <><i className="ti ti-loader spin" aria-hidden="true" style={{ fontSize: 17 }} /> Memuat...</>
                : <><i className="ti ti-login" aria-hidden="true" style={{ fontSize: 17 }} /> Masuk</>
              }
            </button>
          </form>

          {/* Divider */}
          <div className="divider">
            <span className="divider-line" />
            <span className="divider-text">atau</span>
            <span className="divider-line" />
          </div>

          {/* Google */}
          <button className="btn-google" type="button" onClick={handleGoogleLogin}>
            <GoogleIcon />
            Lanjutkan dengan Google
          </button>

          <p className="footer-text">
            Belum punya akun?{' '}
            <a href="/register">Daftar sekarang</a>
          </p>
        </div>
      </div>
    </>
  )
}
