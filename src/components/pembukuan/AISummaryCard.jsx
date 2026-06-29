export default function AISummaryCard({ summary, loading }) {
  if (!loading && !summary) return null

  return (
    <div style={{
      background: '#EEEDFE',
      border: '0.5px solid #AFA9EC',
      borderRadius: 'var(--border-radius-lg)',
      padding: '14px 16px',
      marginBottom: 16
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <div style={{
          width: 24, height: 24,
          background: '#7F77DD',
          borderRadius: 6,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <i className="ti ti-sparkles" style={{ fontSize: 13, color: 'white' }} aria-hidden="true" />
        </div>
        <p style={{ fontSize: 12, fontWeight: 500, color: '#3C3489' }}>
          Ringkasan AI hari ini
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[100, 85, 70].map(w => (
            <div key={w} style={{
              height: 12,
              width: `${w}%`,
              background: '#AFA9EC',
              borderRadius: 6,
              opacity: 0.5
            }} />
          ))}
        </div>
      ) : (
        <p style={{ fontSize: 13, color: '#3C3489', lineHeight: 1.7 }}>
          {summary}
        </p>
      )}
    </div>
  )
}