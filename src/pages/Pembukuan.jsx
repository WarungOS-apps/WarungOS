import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import { getPembukuanSummary } from '../lib/claude'
import AISummaryCard from '../components/pembukuan/AISummaryCard'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

  .pem-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; }

  .pem-root {
    min-height: 100vh;
    background: #F4F7F6;
  }

  /* Header */
  .pem-header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: #fff;
    border-bottom: 0.5px solid #E6EDEA;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .pem-back-btn {
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
  .pem-back-btn:hover { background: #DCF0E9; }
  .pem-header-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #0D2B20;
  }

  /* Body */
  .pem-body { padding: 16px; }

  /* Period pills */
  .pem-period-row {
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
  }
  .pem-pill {
    padding: 6px 16px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    border: 0.5px solid #D4E5DE;
    background: #fff;
    color: #5A7A6D;
    transition: all 0.15s;
  }
  .pem-pill:hover { background: #F0F7F4; }
  .pem-pill.active {
    background: #1D9E75;
    color: #fff;
    border-color: #1D9E75;
  }

  /* Stat cards grid */
  .pem-stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 16px;
  }
  .pem-stat-card {
    background: #fff;
    border: 0.5px solid #E6EDEA;
    border-radius: 14px;
    padding: 14px;
    transition: box-shadow 0.15s;
  }
  .pem-stat-card:hover { box-shadow: 0 2px 8px rgba(29,158,117,0.08); }
  .pem-stat-card.highlight {
    background: linear-gradient(135deg, #1D9E75 0%, #0F7A5A 100%);
    border-color: transparent;
  }
  .pem-stat-label {
    font-size: 11px;
    color: #8AADA0;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .pem-stat-card.highlight .pem-stat-label { color: rgba(255,255,255,0.7); }
  .pem-stat-value {
    font-family: 'Sora', sans-serif;
    font-size: 17px;
    font-weight: 700;
    color: #0D2B20;
    line-height: 1.1;
  }
  .pem-stat-card.highlight .pem-stat-value { color: #fff; }
  .pem-stat-value.green { color: #0F6E56; }

  /* AI Summary Card wrapper */
  .pem-ai-wrapper { margin-bottom: 16px; }

  /* Transaction list */
  .pem-tx-card {
    background: #fff;
    border: 0.5px solid #E6EDEA;
    border-radius: 14px;
    overflow: hidden;
  }
  .pem-tx-header {
    padding: 12px 16px;
    border-bottom: 0.5px solid #EEF3F1;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .pem-tx-header-title {
    font-size: 13px;
    font-weight: 600;
    color: #0D2B20;
  }
  .pem-tx-count-badge {
    font-size: 11px;
    font-weight: 500;
    color: #1D9E75;
    background: #EAF7F2;
    padding: 3px 8px;
    border-radius: 20px;
  }
  .pem-tx-empty {
    padding: 24px 16px;
    font-size: 13px;
    color: #A0B5AD;
    text-align: center;
  }
  .pem-tx-loading {
    padding: 20px 16px;
    font-size: 13px;
    color: #A0B5AD;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .pem-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #E6EDEA;
    border-top-color: #1D9E75;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  .pem-tx-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    border-top: 0.5px solid #EEF3F1;
    transition: background 0.12s;
    cursor: default;
  }
  .pem-tx-row:hover { background: #FAFCFB; }
  .pem-tx-amount {
    font-size: 14px;
    font-weight: 600;
    color: #0D2B20;
  }
  .pem-tx-meta {
    font-size: 11px;
    color: #9DB5AC;
    margin-top: 3px;
  }
  .pem-tx-meta-dot { margin: 0 4px; }
  .pem-tx-badge {
    font-size: 11px;
    font-weight: 500;
    color: #5A7A6D;
    background: #F0F7F4;
    padding: 3px 8px;
    border-radius: 8px;
    white-space: nowrap;
  }
  .pem-tx-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
  }
  .pem-tx-method {
    font-size: 11px;
    color: #9DB5AC;
  }
`

const PERIODS = [
  { label: 'Hari ini', days: 0 },
  { label: '7 hari', days: 7 },
  { label: '30 hari', days: 30 },
]

export default function Pembukuan() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [period, setPeriod] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [aiSummary, setAiSummary] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading])

  useEffect(() => {
    if (user) fetchTransactions()
  }, [user, period])

  async function fetchTransactions() {
    setDataLoading(true)
    setAiSummary(null)

    const from = new Date()
    if (PERIODS[period].days === 0) {
      from.setHours(0, 0, 0, 0)
    } else {
      from.setDate(from.getDate() - PERIODS[period].days)
    }

    const { data } = await supabase
      .from('transactions')
      .select(`
        id,
        total,
        payment_method,
        notes,
        created_at,
        transaction_items (
          quantity,
          price_at_sale,
          product_id,
          products ( name )
        )
      `)
      .eq('owner_id', user.id)
      .gte('created_at', from.toISOString())
      .order('created_at', { ascending: false })

    setTransactions(data || [])
    setDataLoading(false)

    if (data && data.length > 0) {
      setAiLoading(true)
      const summary = await getPembukuanSummary(data)
      setAiSummary(summary)
      setAiLoading(false)
    }
  }

  const totalRevenue = transactions.reduce((s, t) => s + t.total, 0)
  const avgTransaction = transactions.length
    ? Math.round(totalRevenue / transactions.length)
    : 0

  // Most common payment method
  const topMethod = transactions.length
    ? Object.entries(
        transactions.reduce((acc, t) => {
          acc[t.payment_method] = (acc[t.payment_method] || 0) + 1
          return acc
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'
    : '-'

  const formatRp = (n) => `Rp ${n.toLocaleString('id-ID')}`
  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })

  if (authLoading) return null

  return (
    <>
      <style>{styles}</style>
      <div className="pem-root">

        {/* Header */}
        <div className="pem-header">
          <button className="pem-back-btn" onClick={() => navigate('/dashboard')}>←</button>
          <h1 className="pem-header-title">Pembukuan</h1>
        </div>

        <div className="pem-body">

          {/* Period selector */}
          <div className="pem-period-row">
            {PERIODS.map((p, i) => (
              <button
                key={i}
                className={`pem-pill${period === i ? ' active' : ''}`}
                onClick={() => setPeriod(i)}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Stat cards */}
          <div className="pem-stats-grid">
            <div className="pem-stat-card highlight" style={{ gridColumn: 'span 2' }}>
              <p className="pem-stat-label">Total Pemasukan</p>
              <p className="pem-stat-value">{formatRp(totalRevenue)}</p>
            </div>
            <div className="pem-stat-card">
              <p className="pem-stat-label">Jumlah Transaksi</p>
              <p className="pem-stat-value">{transactions.length}x</p>
            </div>
            <div className="pem-stat-card">
              <p className="pem-stat-label">Rata-rata Transaksi</p>
              <p className="pem-stat-value">{formatRp(avgTransaction)}</p>
            </div>
            <div className="pem-stat-card" style={{ gridColumn: 'span 2' }}>
              <p className="pem-stat-label">Metode Terbanyak</p>
              <p className="pem-stat-value">{topMethod}</p>
            </div>
          </div>

          {/* AI Summary */}
          <div className="pem-ai-wrapper">
            <AISummaryCard summary={aiSummary} loading={aiLoading} />
          </div>

          {/* Transaction list */}
          <div className="pem-tx-card">
            <div className="pem-tx-header">
              <p className="pem-tx-header-title">Riwayat Transaksi</p>
              {!dataLoading && transactions.length > 0 && (
                <span className="pem-tx-count-badge">{transactions.length} transaksi</span>
              )}
            </div>

            {dataLoading ? (
              <div className="pem-tx-loading">
                <span className="pem-spinner" />
                Memuat...
              </div>
            ) : transactions.length === 0 ? (
              <p className="pem-tx-empty">Belum ada transaksi di periode ini.</p>
            ) : (
              transactions.map((tx, i) => (
                <div key={tx.id} className="pem-tx-row">
                  <div>
                    <p className="pem-tx-amount">{formatRp(tx.total)}</p>
                    <p className="pem-tx-meta">
                      {formatDate(tx.created_at)}
                      <span className="pem-tx-meta-dot">·</span>
                      {formatTime(tx.created_at)}
                    </p>
                  </div>
                  <div className="pem-tx-right">
                    <span className="pem-tx-badge">
                      {tx.transaction_items?.length || 0} item
                    </span>
                    <p className="pem-tx-method">{tx.payment_method}</p>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </>
  )
}
