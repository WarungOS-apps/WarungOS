import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSameDay, format } from 'date-fns'
import { id } from 'date-fns/locale'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import WeekCalendar from '../components/bookings/WeekCalendar'
import AddBookingForm from '../components/bookings/AddBookingForm'
import ReminderModal from '../components/bookings/ReminderModal'

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&family=Sora:wght@600;700&display=swap');

  .bk-root * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'DM Sans', sans-serif; }

  .bk-root {
    min-height: 100vh;
    background: #F4F7F6;
  }

  /* Header */
  .bk-header {
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
  .bk-header-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .bk-back-btn {
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
  .bk-back-btn:hover { background: #DCF0E9; }
  .bk-header-title {
    font-family: 'Sora', sans-serif;
    font-size: 16px;
    font-weight: 600;
    color: #0D2B20;
  }
  .bk-add-btn {
    padding: 7px 14px;
    font-size: 13px;
    font-weight: 500;
    border-radius: 20px;
    cursor: pointer;
    border: none;
    transition: opacity 0.15s;
  }
  .bk-add-btn.open {
    background: #F0F7F4;
    color: #1D9E75;
    border: 0.5px solid #C5E0D6;
  }
  .bk-add-btn.closed {
    background: #1D9E75;
    color: #fff;
  }
  .bk-add-btn:hover { opacity: 0.88; }

  /* Body */
  .bk-body { padding: 16px; }

  /* Date label row */
  .bk-date-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }
  .bk-date-label {
    font-size: 13px;
    font-weight: 600;
    color: #0D2B20;
  }
  .bk-count-badge {
    font-size: 11px;
    font-weight: 500;
    color: #1D9E75;
    background: #EAF7F2;
    padding: 3px 10px;
    border-radius: 20px;
  }

  /* Booking card */
  .bk-card {
    background: #fff;
    border: 0.5px solid #E6EDEA;
    border-radius: 14px;
    padding: 14px 16px;
    margin-bottom: 10px;
    transition: box-shadow 0.15s;
  }
  .bk-card:hover { box-shadow: 0 2px 8px rgba(29,158,117,0.07); }
  .bk-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }
  .bk-customer-name {
    font-size: 14px;
    font-weight: 600;
    color: #0D2B20;
  }
  .bk-service-time {
    font-size: 12px;
    color: #8AADA0;
    margin-top: 3px;
  }
  .bk-status-badge {
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .bk-card-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }
  .bk-remind-btn {
    flex: 1;
    padding: 9px 12px;
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    background: #EAF7F2;
    color: #0F6E56;
    border: 0.5px solid #9FE1CB;
    border-radius: 10px;
    transition: background 0.15s;
    font-family: 'DM Sans', sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
  }
  .bk-remind-btn:hover { background: #D2F0E5; }
  .bk-status-select {
    font-size: 12px;
    font-weight: 500;
    padding: 9px 10px;
    border-radius: 10px;
    border: 0.5px solid #D4E5DE;
    background: #F8FAFA;
    color: #0D2B20;
    cursor: pointer;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.15s;
  }
  .bk-status-select:focus { border-color: #1D9E75; background: #fff; }

  /* States */
  .bk-loading, .bk-empty {
    text-align: center;
    padding: 40px 24px;
    font-size: 13px;
    color: #A0B5AD;
  }
  .bk-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid #E6EDEA;
    border-top-color: #1D9E75;
    border-radius: 50%;
    animation: bk-spin 0.7s linear infinite;
    display: inline-block;
    margin-bottom: 8px;
  }
  @keyframes bk-spin { to { transform: rotate(360deg); } }

  /* Calendar wrapper spacing */
  .bk-calendar-wrap { margin-bottom: 16px; }

  /* Form wrapper spacing */
  .bk-form-wrap { margin-bottom: 16px; }
`

const STATUS_CONFIG = {
  confirmed: { label: 'Terkonfirmasi', bg: '#E6F1FB', color: '#0C447C' },
  reminded:  { label: 'Diingatkan',    bg: '#EEEDFE', color: '#3C3489' },
  done:      { label: 'Selesai',       bg: '#E1F5EE', color: '#0F6E56' },
  cancelled: { label: 'Dibatalkan',    bg: '#FCEBEB', color: '#A32D2D' },
}

export default function Bookings() {
  const { user, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [owner, setOwner] = useState(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [reminderBooking, setReminderBooking] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) navigate('/login')
  }, [user, authLoading])

  useEffect(() => {
    if (user) {
      fetchBookings()
      fetchOwner()
    }
  }, [user])

  async function fetchBookings() {
    setLoading(true)
    const { data } = await supabase
      .from('bookings')
      .select('*, customers(name, phone)')
      .eq('owner_id', user.id)
      .order('scheduled_at', { ascending: true })
    setBookings(data || [])
    setLoading(false)
  }

  async function fetchOwner() {
    const { data } = await supabase
      .from('owners')
      .select('business_name')
      .eq('id', user.id)
      .single()
    setOwner(data)
  }

  async function handleStatusChange(bookingId, newStatus) {
    await supabase.from('bookings').update({ status: newStatus }).eq('id', bookingId)
    setBookings(prev =>
      prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
    )
  }

  const todayBookings = bookings.filter(b =>
    isSameDay(new Date(b.scheduled_at), selectedDate)
  )

  if (authLoading || !user) return null

  return (
    <>
      <style>{styles}</style>
      <div className="bk-root">

        {/* Header */}
        <div className="bk-header">
          <div className="bk-header-left">
            <button className="bk-back-btn" onClick={() => navigate('/dashboard')}>←</button>
            <h1 className="bk-header-title">Jadwal Booking</h1>
          </div>
          <button
            className={`bk-add-btn ${showForm ? 'open' : 'closed'}`}
            onClick={() => setShowForm(s => !s)}
          >
            {showForm ? 'Tutup' : '+ Booking'}
          </button>
        </div>

        <div className="bk-body">

          {/* Week calendar */}
          <div className="bk-calendar-wrap">
            <WeekCalendar
              bookings={bookings}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
            />
          </div>

          {/* Add booking form */}
          {showForm && (
            <div className="bk-form-wrap">
              <AddBookingForm
                ownerId={user.id}
                onSuccess={() => { fetchBookings(); setShowForm(false) }}
              />
            </div>
          )}

          {/* Date label + count */}
          <div className="bk-date-row">
            <p className="bk-date-label">
              {format(selectedDate, "EEEE, d MMMM", { locale: id })}
            </p>
            <span className="bk-count-badge">{todayBookings.length} booking</span>
          </div>

          {/* Booking list */}
          {loading ? (
            <div className="bk-loading">
              <div><span className="bk-spinner" /></div>
              Memuat jadwal...
            </div>
          ) : todayBookings.length === 0 ? (
            <p className="bk-empty">Tidak ada booking di hari ini.</p>
          ) : (
            todayBookings.map(booking => {
              const cfg = STATUS_CONFIG[booking.status] || STATUS_CONFIG.confirmed
              const time = format(new Date(booking.scheduled_at), 'HH:mm')
              return (
                <div key={booking.id} className="bk-card">
                  <div className="bk-card-top">
                    <div>
                      <p className="bk-customer-name">{booking.customers?.name || '-'}</p>
                      <p className="bk-service-time">{booking.service_name} · {time}</p>
                    </div>
                    <span
                      className="bk-status-badge"
                      style={{ background: cfg.bg, color: cfg.color }}
                    >
                      {cfg.label}
                    </span>
                  </div>
                  <div className="bk-card-actions">
                    <button
                      className="bk-remind-btn"
                      onClick={() => setReminderBooking(booking)}
                    >
                      📲 Kirim Reminder WA
                    </button>
                    <select
                      className="bk-status-select"
                      value={booking.status}
                      onChange={e => handleStatusChange(booking.id, e.target.value)}
                    >
                      <option value="confirmed">Terkonfirmasi</option>
                      <option value="reminded">Diingatkan</option>
                      <option value="done">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Reminder modal */}
        <ReminderModal
          booking={reminderBooking}
          businessName={owner?.business_name || 'Warung'}
          onClose={() => setReminderBooking(null)}
        />

      </div>
    </>
  )
}
