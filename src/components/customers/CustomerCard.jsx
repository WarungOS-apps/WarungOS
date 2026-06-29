export default function CustomerCard({ customer, onPunch }) {
  const punches = customer.loyalty_punches || 0
  const punchesInCycle = punches % 10
  const cyclesCompleted = Math.floor(punches / 10)
  const isRewardReady = punchesInCycle === 0 && punches > 0

  const formatDate = (iso) => iso
    ? new Date(iso).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })
    : 'Belum pernah'

  return (
    <div style={{
      background: 'var(--color-background-primary)',
      border: `0.5px solid ${isRewardReady ? '#1D9E75' : 'var(--color-border-tertiary)'}`,
      borderRadius: 'var(--border-radius-lg)',
      padding: '14px 16px',
      marginBottom: 10
    }}>

      {isRewardReady && (
        <div style={{
          background: '#E1F5EE', color: '#0F6E56',
          borderRadius: 'var(--border-radius-md)',
          padding: '8px 12px', marginBottom: 12,
          fontSize: 13, fontWeight: 500, textAlign: 'center'
        }}>
          Selamat! Pelanggan ini berhak dapat reward 🎉
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: '50%',
            background: '#E1F5EE', color: '#0F6E56',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 500, flexShrink: 0
          }}>
            {customer.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 500 }}>{customer.name}</p>
            <p style={{ fontSize: 12, color: 'var(--color-text-tertiary)', marginTop: 1 }}>
              {customer.phone || 'Tidak ada HP'} · {customer.visit_count || 0} kunjungan
            </p>
          </div>
        </div>
        <button
          onClick={() => onPunch(customer.id)}
          style={{
            background: '#1D9E75', color: 'white',
            border: 'none', borderRadius: 'var(--border-radius-md)',
            padding: '6px 12px', fontSize: 12, fontWeight: 500,
            cursor: 'pointer', flexShrink: 0
          }}
        >
          + Punch
        </button>
      </div>

      <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 8 }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{
            width: 26, height: 26,
            borderRadius: 6,
            background: i < punchesInCycle ? '#1D9E75' : 'var(--color-background-secondary)',
            border: `0.5px solid ${i < punchesInCycle ? '#1D9E75' : 'var(--color-border-tertiary)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, color: 'white',
            transition: 'background 0.2s'
          }}>
            {i < punchesInCycle ? '✓' : ''}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          {punchesInCycle}/10 punch · {cyclesCompleted} reward selesai
        </p>
        <p style={{ fontSize: 11, color: 'var(--color-text-tertiary)' }}>
          Terakhir: {formatDate(customer.last_visit)}
        </p>
      </div>
    </div>
  )
}