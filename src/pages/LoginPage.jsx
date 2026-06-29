import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

// ─── Inline SVG Icons ────────────────────────────────────────────────────────
const WarungIcon = () => (
  <svg viewBox="0 0 40 40" fill="none" className="w-10 h-10">
    <rect width="40" height="40" rx="12" fill="#1D9E75" />
    <path
      d="M10 17h20M12 17V28h16V17M8 17l2.5-6h19L32 17"
      stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
    />
    <rect x="17" y="21" width="6" height="7" rx="1" fill="#fff" opacity="0.9" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

// ─── Component ───────────────────────────────────────────────────────────────
export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");

  // Field-level dirty tracking (show red border only after user has touched)
  const [touched, setTouched] = useState({ email: false, password: false });

  const handleBlur = (field) =>
    setTouched((prev) => ({ ...prev, [field]: true }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: sbError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (sbError) {
        // Map common Supabase errors to friendly Bahasa Indonesia messages
        const msg = sbError.message.toLowerCase();
        if (msg.includes("invalid login credentials") || msg.includes("invalid email or password")) {
          setError("Email atau password salah. Silakan coba lagi.");
        } else if (msg.includes("email not confirmed")) {
          setError("Email belum dikonfirmasi. Cek kotak masuk email Anda.");
        } else if (msg.includes("too many requests")) {
          setError("Terlalu banyak percobaan. Tunggu beberapa menit dan coba lagi.");
        } else {
          setError(sbError.message);
        }
        return;
      }

      navigate("/dashboard");
    } catch {
      setError("Terjadi kesalahan. Periksa koneksi internet Anda.");
    } finally {
      setLoading(false);
    }
  };

  const emailInvalid   = touched.email    && !email.includes("@");
  const passwordShort  = touched.password && password.length < 6;

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center px-5 py-10 page-enter">
      {/* ── Card ── */}
      <div
        className="w-full max-w-sm bg-white rounded-3xl p-7 animate-fade-in"
        style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.09), 0 2px 8px rgba(0,0,0,0.05)" }}
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <WarungIcon />
          <div className="text-center">
            <h1 className="text-xl font-bold text-neutral-900 tracking-tight">
              Masuk ke WarungOS
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Kelola bisnis UMKM Anda dengan mudah
            </p>
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

          {/* Email */}
          <div>
            <label htmlFor="email" className="label">
              Alamat Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              placeholder="contoh@email.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              onBlur={() => handleBlur("email")}
              className={`input ${emailInvalid ? "error" : ""}`}
              disabled={loading}
              required
            />
            {emailInvalid && (
              <p className="mt-1 text-xs text-danger-600 font-medium">
                Masukkan alamat email yang valid.
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="label">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPw ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                onBlur={() => handleBlur("password")}
                className={`input pr-11 ${passwordShort ? "error" : ""}`}
                disabled={loading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors tap-highlight-none"
                aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                tabIndex={-1}
              >
                <EyeIcon open={showPw} />
              </button>
            </div>
            {passwordShort && (
              <p className="mt-1 text-xs text-danger-600 font-medium">
                Password minimal 6 karakter.
              </p>
            )}
          </div>

          {/* ── Error Banner ── */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-danger-100 bg-danger-50 px-4 py-3 animate-fade-in"
            >
              {/* Error icon */}
              <svg
                className="mt-0.5 w-4 h-4 shrink-0 text-danger-500"
                viewBox="0 0 20 20" fill="currentColor"
              >
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd"/>
              </svg>
              <p className="text-xs font-medium text-danger-700 leading-snug">{error}</p>
            </div>
          )}

          {/* ── Submit Button ── */}
          <button
            type="submit"
            className="btn-primary mt-1"
            disabled={loading || !email || !password}
          >
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                <span>Masuk…</span>
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>

        {/* ── Footer Links ── */}
        <div className="mt-6 flex flex-col items-center gap-2 text-xs text-neutral-500">
          <a
            href="/forgot-password"
            className="font-medium text-primary-600 hover:underline tap-highlight-none"
          >
            Lupa password?
          </a>
          <p>
            Belum punya akun?{" "}
            <a
              href="/register"
              className="font-semibold text-primary-600 hover:underline tap-highlight-none"
            >
              Daftar sekarang
            </a>
          </p>
        </div>
      </div>

      {/* Bottom credit */}
      <p className="mt-6 text-2xs text-neutral-400 text-center">
        WarungOS — Solusi Digital untuk UMKM Indonesia 🇮🇩
      </p>
    </div>
  );
}
