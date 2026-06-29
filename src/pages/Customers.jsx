import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

  .cus-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; }

  .cus-root {
    min-height: 100vh;
    background: #F4F7F6;
  }

  /* Header */
  .cus-header {
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
  .cus-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .cus-back-btn {
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
  .cus-back-btn:hover { background: #DCF0E9; }
  .cus-header-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #0D2B20;
  }
  .cus-header-sub {
    font-size: 11px;
    color: #8AADA0;
    margin-top: 1px;
  }
  .cus-add-btn {
    background: #1D9E75;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 7px 13px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .cus-add-btn:hover { background: #0F7A5A; }
  .cus-add-btn.open {
    background: #F0F7F4;
    color: #0D2B20;
    border: 0.5px solid #D4E5DE;
  }
  .cus-add-btn.open:hover { background: #DCF0E9; }

  /* Body */
  .cus-body { padding: 16px; }

  /* Search */
  .cus-search-wrap {
    position: relative;
    margin-bottom: 14px;
  }
  .cus-search-icon {
    position: absolute;
    left: 11px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    color: #8AADA0;
    pointer-events: none;
  }
  .cus-search {
    width: 100%;
    padding: 10px 14px 10px 34px;
    font-size: 13px;
    border-radius: 14px;
    border: 0.5px solid #D4E5DE;
    background: #fff;
    color: #0D2B20;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .cus-search:focus { border-color: #1D9E75; }

  /* Add form */
  .cus-add-form {
    background: #fff;
    border-bottom: 0.5px solid #E6EDEA;
    padding: 16px;
  }
  .cus-form-title {
    font-size: 13px;
    font-weight: 500;
    color: #0D2B20;
    margin-bottom: 10px;
  }
  .cus-input-wrap {
    position: relative;
    margin-bottom: 8px;
  }
  .cus-input-icon {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 15px;
    color: #8AADA0;
    pointer-events: none;
  }
  .cus-input {
    width: 100%;
    padding: 9px 10px 9px 34px;
    font-size: 13px;
    border-radius: 10px;
    border: 0.5px solid #D4E5DE;
    background: #F4F7F6;
    color: #0D2B20;
    font-family: 'DM Sans', sans-serif;
    outline: none;
    transition: border-color 0.15s;
  }
  .cus-input:focus { border-color: #1D9E75; background: #fff; }
  .cus-form-error {
    font-size: 12px;
    color: #A32D2D;
    margin-bottom: 8px;
  }
  .cus-save-btn {
    width: 100%;
    background: #1D9E75;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 10px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .cus-save-btn:hover { background: #0F7A5A; }
  .cus-save-btn:disabled { opacity: 0.6; cursor: not-allowed; }

  /* Customer card */
  .cus-card {
    background: #fff;
    border: 0.5px solid #E6EDEA;
    border-radius: 14px;
    margin-bottom: 10px;
    overflow: hidden;
    transition: box-shadow 0.15s;
  }
  .cus-card:hover { box-shadow: 0 2px 8px rgba(29,158,117,0.08); }
  .cus-card-top {
    padding: 14px 14px 10px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cus-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 500;
    font-size: 14px;
    flex-shrink: 0;
  }
  .cus-info { flex: 1; min-width: 0; }
  .cus-name {
    font-size: 14px;
    font-weight: 500;
    color: #0D2B20;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .cus-meta {
    font-size: 12px;
    color: #8AADA0;
    margin-top: 2px;
  }
  .cus-last-visit { text-align: right; flex-shrink: 0; }
  .cus-lv-label {
    font-size: 11px;
    color: #8AADA0;
    margin-bottom: 2px;
  }
  .cus-lv-val {
    font-size: 12px;
    color: #5A7A6D;
  }
  .cus-card-bottom {
    border-top: 0.5px solid #EEF3F1;
    padding: 10px 14px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #FAFCFB;
  }
  .cus-punch-label {
    font-size: 11px;
    color: #8AADA0;
    margin-bottom: 4px;
  }
  .cus-dots {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
  }
  .cus-dot {
    width: 13px;
    height: 13px;
    border-radius: 50%;
    display: inline-block;
  }
  .cus-dot-filled { background: #1D9E75; border: 0.5px solid #1D9E75; }
  .cus-dot-empty { background: #F0F7F4; border: 0.5px solid #D4E5DE; }
  .cus-punch-btn {
    background: #F0F7F4;
    color: #1D9E75;
    border: 0.5px solid #B4D9CA;
    border-radius: 10px;
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .cus-punch-btn:hover { background: #DCF0E9; }
  .cus-redeem-btn {
    background: #1D9E75;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 7px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: background 0.15s;
  }
  .cus-redeem-btn:hover { background: #0F7A5A; }

  /* Empty / loading states */
  .cus-empty {
    text-align: center;
    padding: 40px 0;
    color: #8AADA0;
    font-size: 13px;
  }
  .cus-empty-icon { font-size: 32px; margin-bottom: 8px; }
  .cus-loading {
    text-align: center;
    color: #8AADA0;
    font-size: 13px;
    padding: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .cus-spinner {
    width: 14px;
    height: 14px;
    border: 2px solid #E6EDEA;
    border-top-color: #1D9E75;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
`

const AVATAR_COLORS = [
  { bg: '#E1F5EE', color: '#085041' },
  { bg: '#E6F1FB', color: '#0C447C' },
  { bg: '#EEEDFE', color: '#3C3489' },
  { bg: '#FAEEDA', color: '#633806' },
  { bg: '#FBEAF0', color: '#72243E' },
]

function getAvatarColor(name) {
  let hash = 0
  for (const c of name) hash += c.charCodeAt(0)
  return AVATAR_COLORS[hash % AVATAR_COLORS.length]
}

function getInitials(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase()
}

function relativeDate(dateStr) {
  if (!dateStr) return 'Belum pernah'
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000)
  if (diff === 0) return 'Hari ini'
  if (diff === 1) return 'Kemarin'
  return `${diff} hari lalu`
}

function PunchDots({ count, max = 10 }) {
  return (
    <div className="cus-dots">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={`cus-dot ${i < count ? 'cus-dot-filled' : 'cus-dot-empty'}`}
        />
      ))}
    </div>
  )
}

function CustomerCard({ customer, onPunch }) {
  const av = getAvatarColor(customer.name)
  const isFull = (customer.loyalty_punches || 0) >= 10

  return (
    <div className="cus-card">
      <div className="cus-card-top">
        <div
          className="cus-avatar"
          style={{ background: av.bg, color: av.color }}
        >
          {getInitials(customer.name)}
        </div>
        <div className="cus-info">
          <p className="cus-name">{customer.name}</p>
          <p className="cus-meta">
            {customer.phone || 'Tanpa nomor HP'} · {customer.visit_count} kunjungan
          </p>
        </div>
        <div className="cus-last-visit">
          <p className="cus-lv-label">terakhir</p>
          <p className="cus-lv-val">{relativeDate(customer.last_visit)}</p>
        </div>
      </div>

      <div className="cus-card-bottom">
        <div>
          <p className="cus-punch-label">kartu poin {customer.loyalty_punches || 0}/10</p>
          <PunchDots count={customer.loyalty_punches || 0} />
        </div>
        {isFull ? (
          <button className="cus-redeem-btn" onClick={() => onPunch(customer.id, true)}>
            🎁 Tukar hadiah
          </button>
        ) : (
          <button className="cus-punch-btn" onClick={() => onPunch(customer.id, false)}>
            + Poin
          </button>
        )}
      </div>
    </div>
  )
}

function AddCustomerForm({ ownerId, onSuccess }) {
  const [form, setForm] = useState({ name: '', phone: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.from('customers').insert({
      owner_id: ownerId,
      name: form.name,
      phone: form.phone || null,
      visit_count: 0,
      loyalty_punches: 0,
    })
    if (error) {
      setError(error.message)
    } else {
      setForm({ name: '', phone: '' })
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="cus-add-form">
      <p className="cus-form-title">Tambah pelanggan baru</p>
      <div className="cus-input-wrap">
        <span className="cus-input-icon">👤</span>
        <input
          className="cus-input"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nama pelanggan *"
          required
        />
      </div>
      <div className="cus-input-wrap">
        <span className="cus-input-icon">📱</span>
        <input
          className="cus-input"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Nomor HP (opsional)"
        />
      </div>
      {error && <p className="cus-form-error">{error}</p>}
      <button
        className="cus-save-btn"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Menyimpan...' : 'Simpan pelanggan'}
      </button>
    </div>
  )
}

export default function Customers() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading])

  useEffect(() => {
    if (user) fetchCustomers()
  }, [user])

  async function fetchCustomers() {
    setLoading(true)
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('owner_id', user.id)
      .order('visit_count', { ascending: false })
    setCustomers(data || [])
    setLoading(false)
  }

  async function handlePunch(customerId, redeem = false) {
    const customer = customers.find(c => c.id === customerId)
    if (!customer) return

    if (redeem) {
      const { error } = await supabase
        .from('customers')
        .update({ loyalty_punches: 0 })
        .eq('id', customerId)
      if (!error) {
        setCustomers(prev =>
          prev.map(c => c.id === customerId ? { ...c, loyalty_punches: 0 } : c)
        )
      }
      return
    }

    const newPunches = Math.min((customer.loyalty_punches || 0) + 1, 10)
    const newVisits = (customer.visit_count || 0) + 1

    const { error } = await supabase
      .from('customers')
      .update({
        loyalty_punches: newPunches,
        visit_count: newVisits,
        last_visit: new Date().toISOString(),
      })
      .eq('id', customerId)

    if (!error) {
      setCustomers(prev =>
        prev.map(c =>
          c.id === customerId
            ? { ...c, loyalty_punches: newPunches, visit_count: newVisits, last_visit: new Date().toISOString() }
            : c
        )
      )
    }
  }

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.phone && c.phone.includes(search))
  )

  if (authLoading || !user) return null

  return (
    <>
      <style>{styles}</style>
      <div className="cus-root">

        {/* Header */}
        <div className="cus-header">
          <div className="cus-header-left">
            <button className="cus-back-btn" onClick={() => navigate('/dashboard')}>←</button>
            <div>
              <p className="cus-header-title">Pelanggan</p>
              <p className="cus-header-sub">{filtered.length} pelanggan</p>
            </div>
          </div>
          <button
            className={`cus-add-btn${showForm ? ' open' : ''}`}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? '✕ Tutup' : '+ Pelanggan'}
          </button>
        </div>

        {/* Add form (toggle) */}
        {showForm && (
          <AddCustomerForm
            ownerId={user.id}
            onSuccess={() => { fetchCustomers(); setShowForm(false) }}
          />
        )}

        <div className="cus-body">

          {/* Search */}
          <div className="cus-search-wrap">
            <span className="cus-search-icon">🔍</span>
            <input
              className="cus-search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Cari nama atau nomor HP..."
            />
          </div>

          {/* List */}
          {loading ? (
            <div className="cus-loading">
              <span className="cus-spinner" />
              Memuat...
            </div>
          ) : filtered.length === 0 ? (
            <div className="cus-empty">
              <p className="cus-empty-icon">👥</p>
              {search ? 'Tidak ada pelanggan yang cocok.' : 'Belum ada pelanggan.'}
            </div>
          ) : (
            filtered.map(customer => (
              <CustomerCard
                key={customer.id}
                customer={customer}
                onPunch={handlePunch}
              />
            ))
          )}

        </div>
      </div>
    </>
  )
}
