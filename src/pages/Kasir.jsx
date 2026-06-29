import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useCartStore } from '../store/cartStore'
import ProductGrid from '../components/kasir/ProductGrid'
import { processCheckout } from '../lib/checkout'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

  /* ── Layout ───────────────────────────────────── */
  .ks-wrap {
    min-height: 100vh;
    background: #f3f4f6;
    display: flex;
    flex-direction: column;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Header ───────────────────────────────────── */
  .ks-header {
    background: #fff;
    border-bottom: 0.5px solid #e5e7eb;
    padding: 13px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .ks-back-btn {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 8px;
    transition: background 0.15s;
  }

  .ks-back-btn:hover {
    background: #f3f4f6;
  }

  .ks-title {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #111827;
    flex: 1;
    margin: 0;
  }

  .ks-cart-badge {
    background: #E1F5EE;
    color: #085041;
    font-size: 12px;
    font-weight: 500;
    padding: 3px 10px;
    border-radius: 20px;
  }

  /* ── Search ───────────────────────────────────── */
  .ks-search {
    padding: 12px 16px 8px;
    background: #fff;
  }

  .ks-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .ks-search-icon {
    position: absolute;
    left: 11px;
    font-size: 16px;
    color: #9ca3af;
    pointer-events: none;
  }

  .ks-search-inp {
    width: 100%;
    padding: 9px 12px 9px 34px;
    border: 0.5px solid #d1d5db;
    border-radius: 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    background: #f9fafb;
    color: #111827;
    outline: none;
    transition: border-color 0.2s;
  }

  .ks-search-inp:focus {
    border-color: #22c55e;
    background: #fff;
  }

  .ks-search-inp::placeholder {
    color: #c4c9d4;
  }

  /* ── Product grid (wraps ProductGrid) ─────────── */
  .ks-grid-wrap {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 8px;
  }

  /* ── Cart panel ───────────────────────────────── */
  .ks-cart-panel {
    background: #fff;
    border-top: 0.5px solid #d1d5db;
    padding: 14px 16px;
  }

  .ks-cart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 10px;
  }

  .ks-cart-title {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    display: flex;
    align-items: center;
    gap: 6px;
    margin: 0;
  }

  .ks-cart-clear {
    font-size: 12px;
    color: #9ca3af;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
  }

  .ks-cart-items {
    max-height: 140px;
    overflow-y: auto;
    margin-bottom: 10px;
  }

  .ks-cart-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
  }

  .ks-cart-row + .ks-cart-row {
    border-top: 0.5px solid #e5e7eb;
  }

  .ks-cart-name {
    font-size: 13px;
    color: #111827;
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .ks-qty-btn {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    border: 0.5px solid #d1d5db;
    background: #f3f4f6;
    color: #111827;
    font-size: 16px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    line-height: 1;
    font-family: 'DM Sans', sans-serif;
  }

  .ks-qty-num {
    font-size: 13px;
    font-weight: 500;
    width: 18px;
    text-align: center;
    color: #111827;
  }

  .ks-cart-price {
    font-size: 13px;
    font-weight: 500;
    color: #111827;
    width: 76px;
    text-align: right;
    flex-shrink: 0;
  }

  /* ── Total row ────────────────────────────────── */
  .ks-total-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 0.5px solid #e5e7eb;
    padding-top: 10px;
    margin-bottom: 12px;
  }

  .ks-total-label {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
  }

  .ks-total-val {
    font-size: 20px;
    font-weight: 500;
    color: #0F6E56;
  }

  /* ── Pay button ───────────────────────────────── */
  .ks-pay-btn {
    width: 100%;
    background: #1D9E75;
    color: #fff;
    border: none;
    border-radius: 12px;
    padding: 13px;
    font-size: 15px;
    font-weight: 500;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: opacity 0.15s, transform 0.1s;
  }

  .ks-pay-btn:hover:not(:disabled) {
    opacity: 0.9;
  }

  .ks-pay-btn:active:not(:disabled) {
    transform: scale(0.98);
  }

  .ks-pay-btn:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }

  @keyframes ks-spin {
    to { transform: rotate(360deg); }
  }

  .ks-spin {
    animation: ks-spin 0.8s linear infinite;
    display: inline-block;
  }
`

export default function Kasir() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const { items, removeItem, updateQuantity, getTotal, clearCart } = useCartStore()
  const [paying, setPaying] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading])

  if (loading || !user) return null

  async function handleCheckout() {
    setPaying(true)
    try {
      await processCheckout(user.id, items)
      clearCart()
      alert('Pembayaran berhasil! ✓')
    } catch (err) {
      alert('Gagal: ' + err.message)
    }
    setPaying(false)
  }

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <>
      <style>{styles}</style>
      <div className="ks-wrap">

        {/* ── Header ── */}
        <div className="ks-header">
          <button className="ks-back-btn" onClick={() => navigate('/dashboard')} aria-label="Kembali">
            <i className="ti ti-arrow-left" aria-hidden="true" style={{ fontSize: 18 }} />
          </button>
          <p className="ks-title">Kasir</p>
          {totalItems > 0 && (
            <span className="ks-cart-badge">{totalItems} item</span>
          )}
        </div>

        {/* ── Search ── */}
        <div className="ks-search">
          <div className="ks-search-wrap">
            <i className="ti ti-search ks-search-icon" aria-hidden="true" />
            <input
              className="ks-search-inp"
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Product grid ── */}
        <div className="ks-grid-wrap">
          <ProductGrid ownerId={user.id} search={search} />
        </div>

        {/* ── Cart panel ── */}
        {items.length > 0 && (
          <div className="ks-cart-panel">
            <div className="ks-cart-header">
              <p className="ks-cart-title">
                <i className="ti ti-shopping-cart" aria-hidden="true" style={{ fontSize: 16, color: '#1D9E75' }} />
                Pesanan
              </p>
              <button className="ks-cart-clear" onClick={clearCart}>Hapus semua</button>
            </div>

            <div className="ks-cart-items">
              {items.map(item => (
                <div key={item.id} className="ks-cart-row">
                  <span className="ks-cart-name">{item.name}</span>
                  <button
                    className="ks-qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >−</button>
                  <span className="ks-qty-num">{item.quantity}</span>
                  <button
                    className="ks-qty-btn"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >+</button>
                  <span className="ks-cart-price">
                    Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                  </span>
                </div>
              ))}
            </div>

            <div className="ks-total-row">
              <span className="ks-total-label">Total</span>
              <span className="ks-total-val">Rp {getTotal().toLocaleString('id-ID')}</span>
            </div>

            <button
              className="ks-pay-btn"
              onClick={handleCheckout}
              disabled={paying}
            >
              {paying ? (
                <>
                  <i className="ti ti-loader ks-spin" aria-hidden="true" style={{ fontSize: 17 }} />
                  Memproses...
                </>
              ) : (
                <>
                  <i className="ti ti-credit-card" aria-hidden="true" style={{ fontSize: 17 }} />
                  Bayar Rp {getTotal().toLocaleString('id-ID')}
                </>
              )}
            </button>
          </div>
        )}

      </div>
    </>
  )
}
