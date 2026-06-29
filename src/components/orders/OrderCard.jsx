const STATUS_CONFIG = {
  pending:    { label: 'Pending',     bg: '#FAEEDA', color: '#633806' },
  processing: { label: 'Diproses',   bg: '#E6F1FB', color: '#0C447C' },
  done:       { label: 'Selesai',    bg: '#E1F5EE', color: '#0F6E56' },
  cancelled:  { label: 'Dibatalkan', bg: '#FCEBEB', color: '#A32D2D' },
}

const SOURCE_LABEL = {
  manual:    'Manual',
  whatsapp:  'WhatsApp',
  shopee:    'Shopee',
  tokopedia: 'Tokopedia',
  instagram: 'Instagram',
}

export default function OrderCard({ order, onStatusChange }) {
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const formatRp = (n) => n ? `Rp ${n.toLocaleString('id-ID')}` : '-'
  const formatTime = (iso) => new Date(iso).toLocaleString('id-ID', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
  })

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: '0.5px solid var(--color-border-tertiary)',
      borderRadius: 'var(--border-radius-lg)',
      padding: '14px 16px',
      marginBottom: 10
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
        <div>
          <p style={{ fontSize: 14, fontWeight: 500 }}>
            {order.customer_name || 'Pelanggan tidak dikenal'}
          </p>
          <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 2 }}>
            {SOURCE_LABEL[order.source] || order.source} · {formatTime(order.created_at)}
          </p>
        </div>
        <span style={{
          background: cfg.bg, color: cfg.color,
          padding: '3px 10px', borderRadius: 20,
          fontSize: 12, fontWeight: 500, flexShrink: 0
        }}>
          {cfg.label}
        </span>
      </div>

      {order.notes && (
        <p style={{
          fontSize: 12, color: 'var(--color-text-secondary)',
          background: 'var(--color-background-secondary)',
          borderRadius: 'var(--border-radius-md)',
          padding: '6px 10px', marginBottom: 10
        }}>
          {order.notes}
        </p>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 14, fontWeight: 500, color: '#0F6E56' }}>
          {formatRp(order.total)}
        </p>
        <select
          value={order.status}
          onChange={e => onStatusChange(order.id, e.target.value)}
          style={{
            fontSize: 12, padding: '4px 8px', borderRadius: 'var(--border-radius-md)',
            border: '0.5px solid var(--color-border-secondary)',
            background: 'var(--color-background-primary)',
            color: 'var(--color-text-primary)', cursor: 'pointer'
          }}
        >
          <option value="pending">Pending</option>
          <option value="processing">Diproses</option>
          <option value="done">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>
    </div>
  )
}