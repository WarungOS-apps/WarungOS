import { startOfWeek, addDays, isSameDay, format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function WeekCalendar({ bookings, selectedDate, onSelectDate }) {
  const today = new Date()
  const weekStart = startOfWeek(today, { weekStartsOn: 1 })
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  function hasBooking(day) {
    return bookings.some(b => isSameDay(new Date(b.scheduled_at), day))
  }

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '12px 8px',
      marginBottom: 16
    }}>
      <p style={{ fontSize: 13, fontWeight: 500, textAlign: 'center', marginBottom: 10 }}>
        {format(weekStart, 'MMMM yyyy', { locale: id })}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
        {days.map(day => {
          const isToday = isSameDay(day, today)
          const isSelected = isSameDay(day, selectedDate)
          const hasBkg = hasBooking(day)

          return (
            <button
              key={day.toISOString()}
              onClick={() => onSelectDate(day)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 4,
                padding: '8px 4px',
                borderRadius: 'var(--border-radius-md)',
                border: isToday ? '0.5px solid #1D9E75' : '0.5px solid transparent',
                background: isSelected ? '#1D9E75' : 'transparent',
                cursor: 'pointer'
              }}
            >
              <span style={{ fontSize: 11, color: isSelected ? 'rgba(255,255,255,0.8)' : 'var(--color-text-tertiary)' }}>
                {format(day, 'EEE', { locale: id })}
              </span>
              <span style={{ fontSize: 15, fontWeight: 500, color: isSelected ? 'white' : 'var(--color-text-primary)' }}>
                {format(day, 'd')}
              </span>
              <div style={{
                width: 5, height: 5, borderRadius: '50%',
                background: hasBkg
                  ? (isSelected ? 'white' : '#1D9E75')
                  : 'transparent'
              }} />
            </button>
          )
        })}
      </div>
    </div>
  )
}