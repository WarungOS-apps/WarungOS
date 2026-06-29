import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import OrderCard from '../components/orders/OrderCard'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

  .ord-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; }

  .ord-root {
    min-height: 100vh;
    background: #F4F7F6;
  }

  /* Header */
  .ord-header {
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
  .ord-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .ord-back-btn {
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
  .ord-back-btn:hover { background: #DCF0E9; }
  .ord-header-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #0D2B20;
  }
  .ord-add-btn {
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    border: none;
    transition: all 0.15s;
  }
  .ord-add-btn.open {
    background: #F0F7F4;
    color: #1D9E75;
    border: 0.5px solid #C5E0D6;
  }
  .ord-add-btn.closed {
    background: #1D9E75;
    color: #fff;
  }
  .ord-add-btn:hover { opacity: 0.88; }

  /* Body */
  .ord-body { padding: 16px; }

  /* Add Order Form */
  .ord-form-card {
    background: #fff;
    border: 0.5px solid #E6EDEA;
    border-radius: 14px;
    padding: 16px;
    margin-bottom: 16px;
  }
  .ord-form-title {
    font-size: 13px;
    font-weight: 600;
    color: #0D2B20;
    margin-bottom: 12px;
  }
  .ord-form-fields {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .ord-input, .ord-select, .ord-textarea {
    padding: 9px 12px;
    border-radius: 10px;
    border: 0.5px solid #D4E5DE;
    background: #F8FAFA;
    font-size: 13px;
    color: #0D2B20;
    width: 100%;
    outline: none;
    transition: border-color 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .ord-input:focus, .ord-select:focus, .ord-textarea:focus {
    border-color: #1D9E75;
    background: #fff;
  }
  .ord-input::placeholder, .ord-textarea::placeholder { color: #A0B5AD; }
  .ord-textarea { resize: none; }
  .ord-two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
  }
  .ord-form-error {
    font-size: 12px;
    color: #A32D2D;
    padding: 6px 10px;
    background: #FCEBEB;
    border-radius: 8px;
  }
  .ord-form-submit {
    width: 100%;
    background: #1D9E75;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 11px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: opacity 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .ord-form-submit:disabled { opacity: 0.6; cursor: not-allowed; }
  .ord-form-submit:hover:not(:disabled) { opacity: 0.88; }

  /* Filter pills */
  .ord-filter-row {
    display: flex;
    gap: 6px;
    overflow-x: auto;
    padding-bottom: 4px;
    margin-bottom: 16px;
    scrollbar-width: none;
  }
  .ord-filter-row::-webkit-scrollbar { display: none; }
  .ord-pill {
    flex-shrink: 0;
    padding: 6px 14px;
    font-size: 12px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    border: 0.5px solid #D4E5DE;
    background: #fff;
    color: #5A7A6D;
    white-space: nowrap;
    transition: all 0.15s;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .ord-pill:hover { background: #F0F7F4; }
  .ord-pill.active {
    background: #1D9E75;
    color: #fff;
    border-color: #1D9E75;
  }
  .ord-pill-count {
    font-size: 11px;
    opacity: 0.75;
  }

  /* States */
  .ord-loading, .ord-empty {
    text-align: center;
    padding: 40px 24px;
    font-size: 13px;
    color: #A0B5AD;
  }
  .ord-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #E6EDEA;
    border-top-color: #1D9E75;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    display: inline-block;
    margin-bottom: 8px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* Order cards list */
  .ord-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
`

const STATUS_FILTERS = [
  { value: 'all',        label: 'Semua' },
  { value: 'pending',    label: 'Pending' },
  { value: 'processing', label: 'Diproses' },
  { value: 'done',       label: 'Selesai' },
  { value: 'cancelled',  label: 'Dibatalkan' },
]

function AddOrderForm({ ownerId, onSuccess }) {
  const [form, setForm] = useState({
    customer_name: '', customer_phone: '',
    source: 'manual', notes: '', total: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: err } = await supabase.from('orders').insert({
      owner_id: ownerId,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone || null,
      source: form.source,
      notes: form.notes || null,
      total: form.total ? parseInt(form.total) : null,
      status: 'pending'
    })

    if (err) {
      setError(err.message)
    } else {
      setForm({ customer_name: '', customer_phone: '', source: 'manual', notes: '', total: '' })
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <div className="ord-form-card">
      <p className="ord-form-title">Pesanan Baru</p>
      <div className="ord-form-fields">
        <input
          className="ord-input"
          name="customer_name"
          value={form.customer_name}
          onChange={handleChange}
          placeholder="Nama pelanggan *"
          required
        />
        <input
          className="ord-input"
          name="customer_phone"
          value={form.customer_phone}
          onChange={handleChange}
          placeholder="Nomor HP (opsional)"
        />
        <div className="ord-two-col">
          <select
            className="ord-select"
            name="source"
            value={form.source}
            onChange={handleChange}
          >
            <option value="manual">Manual</option>
            <option value="whatsapp">WhatsApp</option>
            <option value="shopee">Shopee</option>
            <option value="tokopedia">Tokopedia</option>
            <option value="instagram">Instagram</option>
          </select>
          <input
            className="ord-input"
            name="total"
            value={form.total}
            onChange={handleChange}
            type="number"
            placeholder="Total (Rp)"
          />
        </div>
        <textarea
          className="ord-textarea"
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Catatan pesanan (opsional)"
          rows={2}
        />
        {error && <p className="ord-form-error">Error: {error}</p>}
        <button
          className="ord-form-submit"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Menyimpan...' : '+ Simpan Pesanan'}
        </button>
      </div>
    </div>
  )
}

export default function Orders() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading])

  useEffect(() => {
    if (user) fetchOrders()
  }, [user])

  async function fetchOrders() {
    setLoading(true)
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('owner_id', user.id)
      .order('created_at', { ascending: false })
    setOrders(data || [])
    setLoading(false)
  }

  async function handleStatusChange(orderId, newStatus) {
    await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    setOrders(prev =>
      prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    )
  }

  const filtered = filter === 'all'
    ? orders
    : orders.filter(o => o.status === filter)

  const countByStatus = (s) => orders.filter(o => o.status === s).length

  if (authLoading || !user) return null

  return (
    <>
      <style>{styles}</style>
      <div className="ord-root">

        {/* Header */}
        <div className="ord-header">
          <div className="ord-header-left">
            <button className="ord-back-btn" onClick={() => navigate('/dashboard')}>←</button>
            <h1 className="ord-header-title">Pesanan</h1>
          </div>
          <button
            className={`ord-add-btn ${showForm ? 'open' : 'closed'}`}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? 'Tutup' : '+ Pesanan'}
          </button>
        </div>

        <div className="ord-body">

          {/* Add Order Form */}
          {showForm && (
            <AddOrderForm
              ownerId={user.id}
              onSuccess={() => { fetchOrders(); setShowForm(false) }}
            />
          )}

          {/* Status filter pills */}
          <div className="ord-filter-row">
            {STATUS_FILTERS.map(sf => {
              const count = sf.value === 'all' ? orders.length : countByStatus(sf.value)
              return (
                <button
                  key={sf.value}
                  className={`ord-pill${filter === sf.value ? ' active' : ''}`}
                  onClick={() => setFilter(sf.value)}
                >
                  {sf.label}
                  {count > 0 && <span className="ord-pill-count">({count})</span>}
                </button>
              )
            })}
          </div>

          {/* List */}
          {loading ? (
            <div className="ord-loading">
              <div><span className="ord-spinner" /></div>
              Memuat pesanan...
            </div>
          ) : filtered.length === 0 ? (
            <p className="ord-empty">
              {filter === 'all'
                ? 'Belum ada pesanan. Tap "+ Pesanan" untuk tambah.'
                : 'Tidak ada pesanan dengan status ini.'}
            </p>
          ) : (
            <div className="ord-list">
              {filtered.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

        </div>
      </div>
    </>
  )
}
