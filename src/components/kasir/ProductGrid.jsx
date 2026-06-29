import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useCartStore } from '../../store/cartStore'

export default function ProductGrid({ ownerId }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const addItem = useCartStore(s => s.addItem)

  useEffect(() => {
    supabase
      .from('products')
      .select('*')
      .eq('owner_id', ownerId)
      .gt('stock', 0)
      .then(({ data }) => {
        setProducts(data || [])
        setLoading(false)
      })
  }, [ownerId])

  if (loading) return (
    <p className="text-center text-gray-400 py-8">Memuat produk...</p>
  )

  if (products.length === 0) return (
    <div className="text-center py-8">
      <p className="text-gray-400 text-sm">Belum ada produk.</p>
      <a href="/stock" className="text-green-600 text-sm">+ Tambah produk di halaman Stok</a>
    </div>
  )

  return (
    <div className="grid grid-cols-2 gap-2 p-3">
      {products.map(product => (
        <button
          key={product.id}
          onClick={() => addItem(product)}
          className="bg-white border border-gray-100 rounded-xl p-3 text-left active:scale-95 transition-transform"
        >
          <p className="text-sm font-medium leading-tight">{product.name}</p>
          <p className="text-green-700 font-semibold text-sm mt-1">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <p className="text-xs text-gray-400 mt-1">Stok: {product.stock}</p>
        </button>
      ))}
    </div>
  )
}