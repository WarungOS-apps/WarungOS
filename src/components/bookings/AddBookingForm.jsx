import { useState } from 'react'
import { supabase } from '../../lib/supabase'

export default function AddBookingForm({ ownerId, onSuccess }) {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const defaultDate = tomorrow.toISOString().slice(0, 16)

  const [form, setForm] = useState({
    customer_name: '', customer_phone: '',
    service_name: '', scheduled_at: defaultDate,
    notes: ''
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

    // Cek dulu apakah customer sudah ada di tabel customers
    let customerId = null
    if (form.customer_phone) {
      const { data: existing } = await supabase
        .from('customers')
        .select('id')
        .eq('owner_id', ownerId)
        .eq('phone', form.customer_phone)
        .single()

      if (existing) {
        customerId = existing.id
      } else {
        // Buat customer baru otomatis
        const { data: newCustomer } = await supabase
          .from('customers')
          .insert({ owner_id: ownerId, name: form.customer_name, phone: form.customer_phone })
          .select('id')
          .single()
        customerId = newCustomer?.id
      }
    }

    const { error: err } = await supabase.from('bookings').insert({
      owner_id: ownerId,
      customer_id: customerId,
      service_name: form.service_name,
      scheduled_at: new Date(form.scheduled_at).toISOString(),
      notes: form.notes || null,
      status: 'confirmed'
    })

    if (err) { setError(err.message) }
    else {
      setForm({ customer_name:'', customer_phone:'', service_name:'', scheduled_at: defaultDate, notes:'' })
      onSuccess()
    }
    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '8px 12px', fontSize: 13,
    borderRadius: 'var(--border-radius-md)',
    border: '0.5px solid var(--color-border-secondary)',
    background: 'var(--color-background-primary)',
    color: 'var(--color-text-primary)', fontFamily: 'inherit'
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--color-background-secondary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: 16, marginBottom: 16
    }}>
      <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 12 }}>Tambah booking baru</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <input name="customer_name" value={form.customer_name} onChange={handleChange}
          placeholder="Nama pelanggan *" required style={inputStyle} />
        <input name="customer_phone" value={form.customer_phone} onChange={handleChange}
          placeholder="Nomor HP (untuk reminder WA)" style={inputStyle} />
        <input name="service_name" value={form.service_name} onChange={handleChange}
          placeholder="Nama layanan (misal: Potong Rambut) *" required style={inputStyle} />
        <input name="scheduled_at" value={form.scheduled_at} onChange={handleChange}
          type="datetime-local" required style={inputStyle} />
        <textarea name="notes" value={form.notes} onChange={handleChange}
          placeholder="Catatan (opsional)" rows={2}
          style={{ ...inputStyle, resize: 'none' }} />
        {error && <p style={{ fontSize: 12, color: '#A32D2D' }}>{error}</p>}
        <button type="submit" disabled={loading} style={{
          background: '#1D9E75', color: 'white', border: 'none',
          borderRadius: 'var(--border-radius-md)', padding: '10px',
          fontSize: 13, fontWeight: 500, cursor: 'pointer'
        }}>
          {loading ? 'Menyimpan...' : '+ Simpan Booking'}
        </button>
      </div>
    </form>
  )
}