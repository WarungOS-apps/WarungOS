import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function EditProductModal({ product, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: '', price: '', stock: '', unit: 'pcs', expiry_date: ''
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name,
        price: product.price,
        stock: product.stock,
        unit: product.unit || 'pcs',
        expiry_date: product.expiry_date || ''
      })
    }
  }, [product])

  if (!product) return null

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('products')
      .update({
        name: form.name,
        price: parseInt(form.price),
        stock: parseInt(form.stock),
        unit: form.unit,
        expiry_date: form.expiry_date || null
      })
      .eq('id', product.id)

    if (!error) {
      onSuccess()
      onClose()
    }
    setLoading(false)
  }

  return (
    <div style={{
      position:'absolute', inset:0,
      background:'rgba(0,0,0,0.4)',
      display:'flex', alignItems:'center', justifyContent:'center',
      zIndex:50, padding:'1rem'
    }}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-5 space-y-3">
        <div className="flex justify-between items-center">
          <p className="font-medium">Edit Produk</p>
          <button onClick={onClose} className="text-gray-400 text-lg">×</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input name="name" value={form.name} onChange={handleChange}
            placeholder="Nama produk" required
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <input name="price" value={form.price} onChange={handleChange}
              type="number" placeholder="Harga"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
            <input name="stock" value={form.stock} onChange={handleChange}
              type="number" placeholder="Stok"
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          </div>
          <input name="expiry_date" value={form.expiry_date} onChange={handleChange}
            type="date"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white rounded-lg py-2 text-sm font-medium">
            {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>
    </div>
  )
}