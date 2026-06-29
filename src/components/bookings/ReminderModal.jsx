import { format } from 'date-fns'
import { id } from 'date-fns/locale'

export default function ReminderModal({ booking, businessName, onClose }) {
  if (!booking) return null

  const scheduledDate = new Date(booking.scheduled_at)
  const formattedDate = format(scheduledDate, "EEEE, d MMMM yyyy 'pukul' HH:mm", { locale: id })

  const message = `Halo ${booking.customers?.name || 'Pelanggan'}! 👋

Reminder dari *${businessName}*:

📅 Jadwal: *${booking.service_name}*
🕐 Waktu: ${formattedDate}

Mohon hadir tepat waktu. Jika ada perubahan, segera hubungi kami.

Terima kasih! 🙏`

  const phone = booking.customers?.phone?.replace(/\D/g, '') || ''
  const waLink = `https://wa.me/62${phone.replace(/^0/, '')}?text=${encodeURIComponent(message)}`

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50, padding: 16,
      minHeight: 400
    }}>
      <div style={{
        background: 'var(--color-background-primary)',
        borderRadius: 'var(--border-radius-lg)',
        width: '100%', maxWidth: 360,
        overflow: 'hidden'
      }}>
        <div style={{
          background: '#1D9E75', color: 'white',
          padding: '12px 16px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <p style={{ fontWeight: 500, fontSize: 14 }}>Preview Reminder WhatsApp</p>
          <button onClick={onClose} style={{ background:'none', border:'none', color:'white', fontSize:20, cursor:'pointer' }}>×</button>
        </div>

        <div style={{ padding: 16 }}>
          <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)', marginBottom: 8 }}>
            Pesan yang akan dikirim ke: {booking.customers?.phone || '-'}
          </p>

          <div style={{
            background: '#E1F5EE',
            borderRadius: 'var(--border-radius-md)',
            padding: '12px 14px',
            fontSize: 13,
            color: '#085041',
            lineHeight: 1.7,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            marginBottom: 16
          }}>
            {message}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={{
              flex: 1, padding: '10px',
              background: 'var(--color-background-secondary)',
              border: '0.5px solid var(--color-border-secondary)',
              borderRadius: 'var(--border-radius-md)',
              fontSize: 13, cursor: 'pointer',
              color: 'var(--color-text-primary)'
            }}>Tutup</button>

            {phone && (
              <a href={waLink} target="_blank" rel="noreferrer" style={{
                flex: 1, padding: '10px',
                background: '#25D366', color: 'white',
                border: 'none', borderRadius: 'var(--border-radius-md)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                textAlign: 'center', textDecoration: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
              }}>
                Buka WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}