import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getDemandForecast } from '../lib/claude'
import ForecastCard from '../components/ai/ForecastCard'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

  .fc-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; }

  .fc-root {
    min-height: 100vh;
    background: #F4F7F6;
  }

  /* Header */
  .fc-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    border-bottom: 0.5px solid #E6EDEA;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fc-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .fc-back-btn {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: #F0F7F4;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1D9E75;
    font-size: 15px;
    transition: background 0.15s;
    flex-shrink: 0;
  }
  .fc-back-btn:hover { background: #DCF0E9; }
  .fc-header-text {}
  .fc-header-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #0D2B20;
    line-height: 1.2;
  }
  .fc-header-sub {
    font-size: 11px;
    color: #9DB5AC;
    margin-top: 2px;
  }
  .fc-refresh-btn {
    padding: 6px 14px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    border: 0.5px solid #D4E5DE;
    background: #fff;
    color: #1D9E75;
    transition: all 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .fc-refresh-btn:hover:not(:disabled) { background: #F0F7F4; border-color: #1D9E75; }
  .fc-refresh-btn:disabled {
    color: #A0B5AD;
    border-color: #E6EDEA;
    cursor: default;
  }

  /* Body */
  .fc-body { padding: 16px; }

  /* Data source card */
  .fc-source-card {
    background: #fff;
    border: 0.5px solid #E6EDEA;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fc-source-label {
    font-size: 11px;
    color: #8AADA0;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    margin-bottom: 4px;
  }
  .fc-source-value {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #0D2B20;
  }
  .fc-source-badge {
    font-size: 11px;
    font-weight: 500;
    color: #1D9E75;
    background: #EAF7F2;
    padding: 4px 10px;
    border-radius: 20px;
  }

  /* Stats grid */
  .fc-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
  .fc-stat-card {
    background: #fff;
    border: 0.5px solid #E6EDEA;
    border-radius: 14px;
    padding: 14px;
    transition: box-shadow 0.15s;
  }
  .fc-stat-card:hover { box-shadow: 0 2px 8px rgba(29,158,117,0.08); }
  .fc-stat-card.highlight {
    background: linear-gradient(135deg, #1D9E75 0%, #0F7A5A 100%);
    border-color: transparent;
  }
  .fc-stat-label {
    font-size: 11px;
    color: #8AADA0;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .fc-stat-card.highlight .fc-stat-label { color: rgba(255,255,255,0.7); }
  .fc-stat-value {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #0D2B20;
    line-height: 1.1;
  }
  .fc-stat-card.highlight .fc-stat-value { color: #fff; }

  /* AI badge */
  .fc-ai-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 11px;
    font-weight: 500;
    color: #3C3489;
    background: #EEEDFE;
    border: 0.5px solid #AFA9EC;
    padding: 4px 10px;
    border-radius: 20px;
    margin-bottom: 12px;
  }
  .fc-ai-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #7B6EF0;
    animation: fc-pulse 1.5s ease-in-out infinite;
  }
  @keyframes fc-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  /* Forecast wrapper */
  .fc-forecast-wrapper {
    background: #fff;
    border: 0.5px solid #E6EDEA;
    border-radius: 14px;
    overflow: hidden;
  }
  .fc-forecast-header {
    padding: 12px 16px;
    border-bottom: 0.5px solid #EEF3F1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .fc-forecast-header-title {
    font-size: 13px;
    font-weight: 600;
    color: #0D2B20;
  }

  /* Loading state */
  .fc-loading {
    padding: 24px 16px;
    font-size: 13px;
    color: #A0B5AD;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .fc-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #E6EDEA;
    border-top-color: #1D9E75;
    border-radius: 50%;
    animation: fc-spin 0.7s linear infinite;
    display: inline-block;
    flex-shrink: 0;
  }
  @keyframes fc-spin { to { transform: rotate(360deg); } }

  /* No data state */
  .fc-empty {
    padding: 40px 16px;
    text-align: center;
  }
  .fc-empty-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }
  .fc-empty-title {
    font-family: 'Sora', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: #0D2B20;
    margin-bottom: 6px;
  }
  .fc-empty-desc {
    font-size: 13px;
    color: #9DB5AC;
    margin-bottom: 20px;
    line-height: 1.5;
  }
  .fc-cta-btn {
    display: inline-block;
    background: #1D9E75;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 10px 22px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .fc-cta-btn:hover { background: #188A65; }

  /* Forecast card content */
  .fc-forecast-body {
    padding: 0;
  }
`

const DAY_NAMES = ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu']

async function fetchSalesData(userId) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { data } = await supabase
    .from('transaction_items')
    .select(`
      quantity,
      product_id,
      products ( name ),
      transactions!transaction_items_transaction_id_fkey (
        owner_id,
        created_at
      )
    `)
    .eq('transactions.owner_id', userId)
    .gte('transactions.created_at', sevenDaysAgo.toISOString())

  if (!data) return []

  const productMap = {}
  data.forEach(item => {
    const name = item.products?.name
    const date = new Date(item.transactions?.created_at)
    const dayName = DAY_NAMES[date.getDay()]
    if (!name) return
    if (!productMap[name]) productMap[name] = {}
    productMap[name][dayName] = (productMap[name][dayName] || 0) + item.quantity
  })

  return Object.entries(productMap).map(([name, days]) => ({
    name, penjualan_per_hari: days
  }))
}

function parseGeminiForecast(raw) {
  if (!raw) return null
  try {
    const cleaned = raw.replace(/```json/g, '').replace(/```/g, '').trim()
    return JSON.parse(cleaned)
  } catch {
    return null
  }
}

export default function AiForecast() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [forecast, setForecast] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [noData, setNoData] = useState(false)
  const [salesData, setSalesData] = useState([])

  const today = new Date()
  const dayName = DAY_NAMES[today.getDay()]
  const dateStr = today.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading])

  useEffect(() => {
    if (user) loadAndForecast()
  }, [user])

  async function loadAndForecast() {
    setAiLoading(true)
    setForecast(null)
    setNoData(false)

    const data = await fetchSalesData(user.id)
    setSalesData(data)

    if (data.length === 0) {
      setNoData(true)
      setAiLoading(false)
      return
    }

    const raw = await getDemandForecast(data, dayName, dateStr)
    const parsed = parseGeminiForecast(raw)
    setForecast(parsed)
    setAiLoading(false)
  }

  // Derive some stats from salesData for the stat cards
  const totalProducts = salesData.length
  const totalUnitsSold = salesData.reduce((sum, p) => {
    return sum + Object.values(p.penjualan_per_hari || {}).reduce((s, v) => s + v, 0)
  }, 0)
  const topProduct = salesData.length
    ? salesData.reduce((top, p) => {
        const total = Object.values(p.penjualan_per_hari || {}).reduce((s, v) => s + v, 0)
        return total > (top.total || 0) ? { name: p.name, total } : top
      }, {}).name || '-'
    : '-'

  if (authLoading || !user) return null

  return (
    <>
      <style>{styles}</style>
      <div className="fc-root">

        {/* Header */}
        <div className="fc-header">
          <div className="fc-header-left">
            <button className="fc-back-btn" onClick={() => navigate('/dashboard')}>←</button>
            <div className="fc-header-text">
              <h1 className="fc-header-title">Prediksi AI</h1>
              <p className="fc-header-sub">{dayName}, {dateStr}</p>
            </div>
          </div>
          <button
            className="fc-refresh-btn"
            onClick={loadAndForecast}
            disabled={aiLoading}
          >
            {aiLoading ? 'Menganalisis...' : '↻ Refresh'}
          </button>
        </div>

        <div className="fc-body">

          {/* Data source card */}
          <div className="fc-source-card">
            <div>
              <p className="fc-stat-label">Data Analisis</p>
              <p className="fc-stat-value">7 hari terakhir</p>
            </div>
            <span className="fc-source-badge">{totalProducts} produk</span>
          </div>

          {/* Stat cards */}
          {!noData && (
            <div className="fc-stats-grid">
              <div className="fc-stat-card highlight" style={{ gridColumn: 'span 2' }}>
                <p className="fc-stat-label">Produk Terlaris</p>
                <p className="fc-stat-value">{aiLoading ? '—' : (topProduct || '—')}</p>
              </div>
              <div className="fc-stat-card">
                <p className="fc-stat-label">Total Produk</p>
                <p className="fc-stat-value">{totalProducts}x</p>
              </div>
              <div className="fc-stat-card">
                <p className="fc-stat-label">Unit Terjual</p>
                <p className="fc-stat-value">{totalUnitsSold}</p>
              </div>
            </div>
          )}

          {/* Forecast section */}
          {noData ? (
            <div className="fc-forecast-wrapper">
              <div className="fc-empty">
                <div className="fc-empty-icon">📦</div>
                <p className="fc-empty-title">Belum ada data penjualan</p>
                <p className="fc-empty-desc">
                  Lakukan beberapa transaksi di Kasir dulu,<br />lalu kembali ke sini.
                </p>
                <button className="fc-cta-btn" onClick={() => navigate('/kasir')}>
                  Buka Kasir →
                </button>
              </div>
            </div>
          ) : (
            <div className="fc-forecast-wrapper">
              <div className="fc-forecast-header">
                <p className="fc-forecast-header-title">Hasil Prediksi</p>
                {!aiLoading && forecast && (
                  <span className="fc-ai-badge">
                    <span className="fc-ai-dot" />
                    AI · Claude
                  </span>
                )}
              </div>

              {aiLoading ? (
                <div className="fc-loading">
                  <span className="fc-spinner" />
                  AI sedang menganalisis pola penjualan...
                </div>
              ) : (
                <div className="fc-forecast-body">
                  <ForecastCard forecast={forecast} loading={aiLoading} />
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
