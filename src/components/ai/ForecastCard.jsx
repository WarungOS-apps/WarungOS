export default function ForecastCard({ forecast, loading }) {
  if (!loading && !forecast) return null

  if (loading) return (
    <div style={{
      background: '#EEEDFE',
      border: '0.5px solid #AFA9EC',
      borderRadius: 'var(--border-radius-lg)',
      padding: '16px'
    }}>
      <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
        <div style={{ width:24,height:24,background:'#7F77DD',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center' }}>
          <span style={{ color:'white', fontSize:13 }}>✦</span>
        </div>
        <p style={{ fontSize:12, fontWeight:500, color:'#3C3489' }}>AI sedang menganalisis data penjualan...</p>
      </div>
      {[80,65,50].map(w => (
        <div key={w} style={{ height:12, width:`${w}%`, background:'#AFA9EC', borderRadius:6, opacity:0.5, marginBottom:8 }} />
      ))}
    </div>
  )

  const maxQty = Math.max(...(forecast.top_items?.map(i => i.predicted_qty) || [1]))

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:12 }}>

      <div style={{ background:'#EEEDFE', border:'0.5px solid #AFA9EC', borderRadius:'var(--border-radius-lg)', padding:16 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
          <div style={{ width:24,height:24,background:'#7F77DD',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center' }}>
            <span style={{ color:'white', fontSize:13 }}>✦</span>
          </div>
          <p style={{ fontSize:12, fontWeight:500, color:'#3C3489' }}>Ringkasan prediksi hari ini</p>
        </div>
        <p style={{ fontSize:13, color:'#3C3489', lineHeight:1.7 }}>{forecast.summary}</p>
      </div>

      <div style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)', borderRadius:'var(--border-radius-lg)', padding:16 }}>
        <p style={{ fontSize:13, fontWeight:500, marginBottom:14 }}>Menu yang diprediksi laris hari ini</p>
        {forecast.top_items?.map((item, i) => (
          <div key={i} style={{ marginBottom:12 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <p style={{ fontSize:13 }}>{i+1}. {item.name}</p>
              <p style={{ fontSize:13, fontWeight:500, color:'#0F6E56' }}>
                ~{item.predicted_qty} porsi
              </p>
            </div>
            <div style={{ background:'var(--color-background-secondary)', borderRadius:4, height:8, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:4,
                background:'#1D9E75',
                width:`${Math.round((item.predicted_qty / maxQty) * 100)}%`,
                transition:'width 0.6s ease'
              }} />
            </div>
          </div>
        ))}
      </div>

      {forecast.shopping_suggestions?.length > 0 && (
        <div style={{ background:'var(--color-background-primary)', border:'0.5px solid var(--color-border-tertiary)', borderRadius:'var(--border-radius-lg)', padding:16 }}>
          <p style={{ fontSize:13, fontWeight:500, marginBottom:12 }}>Saran belanja bahan baku</p>
          {forecast.shopping_suggestions.map((s, i) => (
            <div key={i} style={{ display:'flex', gap:10, marginBottom:10, paddingBottom:10, borderBottom: i < forecast.shopping_suggestions.length-1 ? '0.5px solid var(--color-border-tertiary)' : 'none' }}>
              <div style={{ width:28,height:28,background:'#FAEEDA',borderRadius:6,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:14 }}>
                🛒
              </div>
              <div>
                <p style={{ fontSize:13, fontWeight:500 }}>{s.ingredient}</p>
                <p style={{ fontSize:12, color:'var(--color-text-secondary)', marginTop:2 }}>{s.reason}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}