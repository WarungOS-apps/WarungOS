import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useDashboard } from '../hooks/useDashboard'
import RevenueChart from '../components/dashboard/RevenueChart'
import { supabase } from '../lib/supabase'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

  .db-wrap {
    min-height: 100vh;
    background: #f3f4f6;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Header ─────────────────────────────────── */
  .db-header {
    background: #fff;
    border-bottom: 0.5px solid #e5e7eb;
    padding: 14px 16px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .db-header-title {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 17px;
    color: #111827;
    margin: 0;
  }

  .db-header-date {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 2px;
  }

  .db-logout-btn {
    font-size: 13px;
    color: #6b7280;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 6px 10px;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }

  .db-logout-btn:hover {
    background: #f3f4f6;
  }

  /* ── Content ─────────────────────────────────── */
  .db-content {
    padding: 16px;
  }

  /* ── Greeting chip ───────────────────────────── */
  .db-greeting {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: #fff;
    border: 0.5px solid #e5e7eb;
    border-radius: 20px;
    padding: 4px 12px;
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 14px;
  }

  .db-greeting-dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #22c55e;
    display: inline-block;
  }

  /* ── Alert banner ────────────────────────────── */
  .db-alert {
    background: #FCEBEB;
    border: 0.5px solid #F09595;
    border-radius: 8px;
    padding: 10px 14px;
    margin-bottom: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .db-alert p {
    font-size: 13px;
    color: #A32D2D;
    font-weight: 500;
    margin: 0;
  }

  /* ── Stat cards ──────────────────────────────── */
  .db-stat-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 14px;
  }

  .db-stat-card {
    background: #fff;
    border: 0.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
  }

  .db-stat-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 6px;
  }

  .db-stat-value {
    font-size: 22px;
    font-weight: 500;
    line-height: 1;
    color: #111827;
  }

  .db-stat-value--green {
    color: #0F6E56;
  }

  .db-stat-sub {
    font-size: 12px;
    color: #9ca3af;
    margin-top: 4px;
  }

  /* ── Section card ────────────────────────────── */
  .db-section-card {
    background: #fff;
    border: 0.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 14px 16px;
    margin-bottom: 14px;
  }

  .db-section-title {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    margin-bottom: 12px;
  }

  /* ── Product rows ────────────────────────────── */
  .db-product-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 7px 0;
  }

  .db-product-row + .db-product-row {
    border-top: 0.5px solid #e5e7eb;
  }

  .db-product-name {
    font-size: 13px;
    color: #111827;
  }

  .db-product-qty {
    font-size: 13px;
    color: #6b7280;
  }

  /* ── Action buttons ──────────────────────────── */
  .db-actions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .db-action-btn {
    border: 0.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 16px 12px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.15s, transform 0.1s;
  }

  .db-action-btn:hover { opacity: 0.9; }
  .db-action-btn:active { transform: scale(0.97); }

  .db-action-btn--kasir {
    background: #1D9E75;
    color: #fff;
    border-color: transparent;
  }

  .db-action-btn--ai {
    background: #EEEDFE;
    color: #3C3489;
    border-color: transparent;
    grid-column: span 2;
  }

  .db-action-btn--default {
    background: #fff;
    color: #111827;
  }

  /* ── Loading ─────────────────────────────────── */
  .db-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    font-size: 14px;
    color: #6b7280;
  }
`

function StatCard({ label, value, sub, green }) {
  return (
    <div className="db-stat-card">
      <p className="db-stat-label">{label}</p>
      <p className={`db-stat-value${green ? ' db-stat-value--green' : ''}`}>{value}</p>
      {sub && <p className="db-stat-sub">{sub}</p>}
    </div>
  )
}

const ACTIONS = [
  { label: 'Kasir',       path: '/kasir',       icon: 'ti-receipt',       cls: 'db-action-btn--kasir' },
  { label: 'Stok',        path: '/stock',        icon: 'ti-package',       cls: 'db-action-btn--default' },
  { label: 'Pembukuan',   path: '/pembukuan',    icon: 'ti-book',          cls: 'db-action-btn--default' },
  { label: 'Pesanan',     path: '/orders',       icon: 'ti-shopping-cart', cls: 'db-action-btn--default' },
  { label: 'Jadwal',      path: '/bookings',     icon: 'ti-calendar',      cls: 'db-action-btn--default' },
  { label: 'Pelanggan',   path: '/customers',    icon: 'ti-users',         cls: 'db-action-btn--default' },
  { label: 'Prediksi AI', path: '/ai-forecast',  icon: 'ti-sparkles',      cls: 'db-action-btn--ai' },
]

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const {
    revenue, txCount, topProducts,
    lowStockCount, hourlyRevenue, loading
  } = useDashboard(user?.id)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading])

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/login')
  }

  const today = new Date().toLocaleDateString('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long'
  })

  if (authLoading) {
    return (
      <>
        <style>{styles}</style>
        <div className="db-loading">Memuat...</div>
      </>
    )
  }

  return (
    <>
      <style>{styles}</style>
      <div className="db-wrap">

        {/* ── Header ── */}
        <div className="db-header">
          <div>
            <p className="db-header-title">WarungOS</p>
            <p className="db-header-date">{today}</p>
          </div>
          <button className="db-logout-btn" onClick={handleLogout}>
            <i className="ti ti-logout" aria-hidden="true" style={{ fontSize: 16 }} />
            Keluar
          </button>
        </div>

        <div className="db-content">

          {/* ── Greeting ── */}
          <div className="db-greeting">
            <span className="db-greeting-dot" />
            Selamat datang, {user?.email?.split('@')[0] ?? 'Pengguna'}!
          </div>

          {/* ── Low stock alert ── */}
          {lowStockCount > 0 && (
            <div className="db-alert" onClick={() => navigate('/stock')}>
              <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 17, color: '#A32D2D', flexShrink: 0 }} />
              <p>{lowStockCount} produk stok rendah — tap untuk lihat</p>
            </div>
          )}

          {/* ── Stat cards ── */}
          <div className="db-stat-grid">
            <StatCard
              label="Pendapatan hari ini"
              value={loading ? '...' : `Rp ${revenue.toLocaleString('id-ID')}`}
              green
            />
            <StatCard
              label="Transaksi"
              value={loading ? '...' : `${txCount}x`}
              sub="transaksi hari ini"
            />
          </div>

          {/* ── Revenue chart ── */}
          <div className="db-section-card">
            <p className="db-section-title">Pendapatan per jam</p>
            <RevenueChart data={hourlyRevenue} />
          </div>

          {/* ── Top products ── */}
          {topProducts.length > 0 && (
            <div className="db-section-card">
              <p className="db-section-title">Produk terlaris hari ini</p>
              {topProducts.map((p, i) => (
                <div key={p.name} className="db-product-row">
                  <span className="db-product-name">{i + 1}. {p.name}</span>
                  <span className="db-product-qty">{p.qty} terjual</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Quick actions ── */}
          <div className="db-actions-grid">
            {ACTIONS.map(a => (
              <button
                key={a.path}
                className={`db-action-btn ${a.cls}`}
                onClick={() => navigate(a.path)}
              >
                <i className={`ti ${a.icon}`} aria-hidden="true" style={{ fontSize: 17 }} />
                {a.label}
              </button>
            ))}
          </div>

        </div>
      </div>
    </>
  )
}
