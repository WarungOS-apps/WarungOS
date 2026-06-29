import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import AddProductForm from '../components/stock/AddProductForm'
import EditProductModal from '../components/stock/EditProductModal'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@700&display=swap');
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');

  /* ── Layout ───────────────────────────────────── */
  .sk-wrap {
    min-height: 100vh;
    background: #f3f4f6;
    font-family: 'DM Sans', sans-serif;
  }

  /* ── Header ───────────────────────────────────── */
  .sk-header {
    background: #fff;
    border-bottom: 0.5px solid #e5e7eb;
    padding: 13px 16px;
    display: flex;
    align-items: center;
    gap: 10px;
    position: sticky;
    top: 0;
    z-index: 20;
  }

  .sk-back-btn {
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

  .sk-back-btn:hover { background: #f3f4f6; }

  .sk-title {
    font-family: 'Sora', sans-serif;
    font-weight: 700;
    font-size: 16px;
    color: #111827;
    flex: 1;
    margin: 0;
  }

  .sk-add-btn {
    display: flex;
    align-items: center;
    gap: 5px;
    background: #1D9E75;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s;
  }

  .sk-add-btn:hover { opacity: 0.9; }

  /* ── Alert ────────────────────────────────────── */
  .sk-alert {
    background: #FCEBEB;
    border-bottom: 0.5px solid #F09595;
    padding: 9px 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .sk-alert p {
    font-size: 13px;
    color: #A32D2D;
    font-weight: 500;
    margin: 0;
  }

  /* ── Stats ────────────────────────────────────── */
  .sk-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 14px 16px 0;
  }

  .sk-stat {
    background: #fff;
    border: 0.5px solid #e5e7eb;
    border-radius: 12px;
    padding: 12px 14px;
  }

  .sk-stat-label {
    font-size: 12px;
    color: #6b7280;
    margin-bottom: 4px;
  }

  .sk-stat-val {
    font-size: 20px;
    font-weight: 500;
    color: #111827;
  }

  .sk-stat-val--danger { color: #A32D2D; }

  /* ── Search ───────────────────────────────────── */
  .sk-search {
    padding: 12px 16px 8px;
  }

  .sk-search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .sk-search-icon {
    position: absolute;
    left: 11px;
    font-size: 16px;
    color: #9ca3af;
    pointer-events: none;
  }

  .sk-search-inp {
    width: 100%;
    padding: 9px 12px 9px 34px;
    border: 0.5px solid #d1d5db;
    border-radius: 12px;
    font-size: 14px;
    font-family: 'DM Sans', sans-serif;
    background: #fff;
    color: #111827;
    outline: none;
    transition: border-color 0.2s;
  }

  .sk-search-inp:focus { border-color: #22c55e; }
  .sk-search-inp::placeholder { color: #c4c9d4; }

  /* ── Section label ────────────────────────────── */
  .sk-section-label {
    font-size: 12px;
    font-weight: 500;
    color: #9ca3af;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    padding: 8px 16px 4px;
  }

  /* ── Product list ─────────────────────────────── */
  .sk-prod-item {
    background: #fff;
    border-bottom: 0.5px solid #e5e7eb;
    padding: 12px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sk-prod-icon {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #E1F5EE;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    flex-shrink: 0;
  }

  .sk-prod-icon--low { background: #FCEBEB; }

  .sk-prod-info {
    flex: 1;
    min-width: 0;
  }

  .sk-prod-name {
    font-size: 14px;
    font-weight: 500;
    color: #111827;
    margin-bottom: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .sk-prod-price {
    font-size: 12px;
    color: #6b7280;
  }

  .sk-prod-right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
  }

  .sk-stock-pill {
    font-size: 12px;
    font-weight: 500;
    padding: 3px 9px;
    border-radius: 20px;
  }

  .sk-stock-pill--ok { background: #E1F5EE; color: #085041; }
  .sk-stock-pill--low { background: #FCEBEB; color: #A32D2D; }

  .sk-prod-actions {
    display: flex;
    gap: 6px;
  }

  .sk-icon-btn {
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 0.5px solid #e5e7eb;
    background: #f3f4f6;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    font-size: 15px;
    transition: background 0.15s, color 0.15s, border-color 0.15s;
  }

  .sk-icon-btn:hover { border-color: #d1d5db; }

  .sk-icon-btn--danger:hover {
    background: #FCEBEB;
    color: #A32D2D;
    border-color: #F09595;
  }

  /* ── Empty state ──────────────────────────────── */
  .sk-empty {
    text-align: center;
    padding: 40px 16px;
    color: #9ca3af;
    font-size: 14px;
  }
`

function ProductItem({ product, onEdit, onDelete }) {
  const isLow = product.stock <= 5
  return (
    <div className="sk-prod-item">
      <div className={`sk-prod-icon${isLow ? ' sk-prod-icon--low' : ''}`}>
        <i className="ti ti-package" aria-hidden="true" style={{ fontSize: 18, color: isLow ? '#A32D2D' : '#0F6E56' }} />
      </div>
      <div className="sk-prod-info">
        <p className="sk-prod-name">{product.name}</p>
        <p className="sk-prod-price">Rp {product.price.toLocaleString('id-ID')}</p>
      </div>
      <div className="sk-prod-right">
        <span className={`sk-stock-pill ${isLow ? 'sk-stock-pill--low' : 'sk-stock-pill--ok'}`}>
          {isLow ? `Rendah: ${product.stock}` : `${product.stock} pcs`}
        </span>
        <div className="sk-prod-actions">
          <button className="sk-icon-btn" onClick={() => onEdit(product)} aria-label="Edit produk">
            <i className="ti ti-edit" aria-hidden="true" />
          </button>
          <button className="sk-icon-btn sk-icon-btn--danger" onClick={() => onDelete(product.id)} aria-label="Hapus produk">
            <i className="ti ti-trash" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Stock() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editProduct, setEditProduct] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!loading && !user) navigate('/login')
  }, [user, loading])

  useEffect(() => {
    if (user) fetchProducts()
  }, [user])

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('owner_id', user.id)
      .order('stock', { ascending: true })
    setProducts(data || [])
  }

  async function handleDelete(productId) {
    const ok = window.confirm('Hapus produk ini?')
    if (!ok) return
    await supabase.from('products').delete().eq('id', productId)
    fetchProducts()
  }

  if (loading || !user) return null

  const lowStockCount = products.filter(p => p.stock <= 5).length
  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <style>{styles}</style>
      <div className="sk-wrap">

        {/* ── Header ── */}
        <div className="sk-header">
          <button className="sk-back-btn" onClick={() => navigate('/dashboard')} aria-label="Kembali">
            <i className="ti ti-arrow-left" aria-hidden="true" style={{ fontSize: 18 }} />
          </button>
          <p className="sk-title">Stok Produk</p>
          <button className="sk-add-btn" onClick={() => setShowForm(v => !v)}>
            <i className={`ti ${showForm ? 'ti-x' : 'ti-plus'}`} aria-hidden="true" style={{ fontSize: 15 }} />
            {showForm ? 'Tutup' : 'Tambah'}
          </button>
        </div>

        {/* ── Low stock alert ── */}
        {lowStockCount > 0 && (
          <div className="sk-alert">
            <i className="ti ti-alert-triangle" aria-hidden="true" style={{ fontSize: 17, color: '#A32D2D', flexShrink: 0 }} />
            <p>{lowStockCount} produk stok rendah — segera restock</p>
          </div>
        )}

        {/* ── Stats ── */}
        <div className="sk-stats">
          <div className="sk-stat">
            <p className="sk-stat-label">Total produk</p>
            <p className="sk-stat-val">{products.length}</p>
          </div>
          <div className="sk-stat">
            <p className="sk-stat-label">Stok rendah</p>
            <p className={`sk-stat-val${lowStockCount > 0 ? ' sk-stat-val--danger' : ''}`}>{lowStockCount}</p>
          </div>
        </div>

        {/* ── Search ── */}
        <div className="sk-search">
          <div className="sk-search-wrap">
            <i className="ti ti-search sk-search-icon" aria-hidden="true" />
            <input
              className="sk-search-inp"
              type="text"
              placeholder="Cari produk..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ── Add form (inline toggle) ── */}
        {showForm && (
          <AddProductForm
            ownerId={user.id}
            onSuccess={() => { fetchProducts(); setShowForm(false) }}
          />
        )}

        {/* ── Product list ── */}
        <p className="sk-section-label">Semua produk</p>

        {filtered.length === 0 ? (
          <div className="sk-empty">
            <i className="ti ti-package" aria-hidden="true" style={{ fontSize: 32, display: 'block', marginBottom: 8, color: '#d1d5db' }} />
            {search ? 'Produk tidak ditemukan' : 'Belum ada produk — tambahkan sekarang'}
          </div>
        ) : (
          filtered.map(p => (
            <ProductItem
              key={p.id}
              product={p}
              onEdit={setEditProduct}
              onDelete={handleDelete}
            />
          ))
        )}

        {/* ── Edit modal ── */}
        <EditProductModal
          product={editProduct}
          onClose={() => setEditProduct(null)}
          onSuccess={fetchProducts}
        />

      </div>
    </>
  )
}
