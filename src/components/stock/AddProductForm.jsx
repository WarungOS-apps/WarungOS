import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddProductForm({ ownerId, onSuccess }) {
  const [form, setForm] = useState({
    name: '', price: '', stock: '', unit: 'pcs', expiry_date: ''
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

    const { error } = await supabase.from('products').insert({
      owner_id: ownerId,
      name: form.name,
      price: parseInt(form.price),
      stock: parseInt(form.stock),
      unit: form.unit,
      expiry_date: form.expiry_date || null
    })

    if (error) {
      setError(error.message)
    } else {
      setForm({ name:'', price:'', stock:'', unit:'pcs', expiry_date:'' })
      onSuccess()
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-3 bg-gray-50 border-t border-gray-100">
      <p className="text-sm font-medium">Tambah Produk Baru</p>

      <input name="name" value={form.name} onChange={handleChange}
        placeholder="Nama produk" required
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />

      <div className="grid grid-cols-2 gap-2">
        <input name="price" value={form.price} onChange={handleChange}
          placeholder="Harga (Rp)" type="number" required
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
        <div className="flex gap-1">
          <input name="stock" value={form.stock} onChange={handleChange}
            placeholder="Stok" type="number" required
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
          <select name="unit" value={form.unit} onChange={handleChange}
            className="border border-gray-200 rounded-lg px-2 py-2 text-sm bg-white">
            <option>pcs</option>
            <option>kg</option>
            <option>liter</option>
            <option>pack</option>
            <option>botol</option>
          </select>
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 block mb-1">
          Tanggal kadaluarsa (opsional)
        </label>
        <input name="expiry_date" value={form.expiry_date} onChange={handleChange}
          type="date"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white" />
      </div>

      {error && <p className="text-red-500 text-xs">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full bg-green-600 text-white rounded-lg py-2 text-sm font-medium">
        {loading ? 'Menyimpan...' : '+ Simpan Produk'}
      </button>
    </form>
  )
}