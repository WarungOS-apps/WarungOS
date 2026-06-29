import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [form, setForm] = useState({
    email: '', password: '', name: '',
    business_name: '', business_type: 'retail', phone: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleRegister(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Langkah 1: buat akun di Supabase Auth
    const { data, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (authError) { setError(authError.message); setLoading(false); return }

    // Langkah 2: simpan profil ke tabel owners
    const { error: dbError } = await supabase.from('owners').insert({
      id: data.user.id,
      name: form.name,
      business_name: form.business_name,
      business_type: form.business_type,
      phone: form.phone
    })

    if (dbError) { setError(dbError.message); setLoading(false); return }

    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm border border-gray-100">
        <h1 className="text-xl font-bold mb-6">Daftar WarungOS</h1>
        <form onSubmit={handleRegister} className="space-y-3">
          <input name="name" placeholder="Nama Anda" onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
          <input name="business_name" placeholder="Nama Warung/Bisnis" onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
          <select name="business_type" onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm">
            <option value="retail">Warung / Retail</option>
            <option value="ecommerce">E-Commerce</option>
            <option value="service">Jasa / Salon</option>
            <option value="food">Makanan / Kuliner</option>
          </select>
          <input name="phone" placeholder="Nomor HP" onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" />
          <input name="email" type="email" placeholder="Email" onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
          <input name="password" type="password" placeholder="Password (min 6 karakter)"
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm" required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white rounded-lg py-2 text-sm font-medium">
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          Sudah punya akun? <a href="/login" className="text-green-600">Masuk</a>
        </p>
      </div>
    </div>
  )
}