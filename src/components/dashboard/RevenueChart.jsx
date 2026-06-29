import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid
} from 'recharts'

function formatRupiah(value) {
  if (value >= 1000000) return `${(value/1000000).toFixed(1)}jt`
  if (value >= 1000) return `${Math.round(value/1000)}rb`
  return `${value}`
}

export default function RevenueChart({ data }) {
  if (!data || data.length === 0) return (
    <div style={{
      height: 160,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-text-tertiary)',
      fontSize: 13
    }}>
      Belum ada transaksi hari ini
    </div>
  )

  return (
    <ResponsiveContainer width="100%" height={160}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border-tertiary)" vertical={false} />
        <XAxis
          dataKey="hour"
          tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
          tickLine={false}
          axisLine={false}
          interval={2}
        />
        <YAxis
          tick={{ fontSize: 11, fill: 'var(--color-text-tertiary)' }}
          tickLine={false}
          axisLine={false}
          tickFormatter={formatRupiah}
        />
        <Tooltip
          formatter={(v) => [`Rp ${v.toLocaleString('id-ID')}`, 'Pendapatan']}
          labelStyle={{ fontSize: 12 }}
          contentStyle={{
            fontSize: 12,
            border: '0.5px solid var(--color-border-tertiary)',
            borderRadius: 8
          }}
        />
        <Bar dataKey="total" fill="#1D9E75" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}