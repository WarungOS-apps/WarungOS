import { differenceInDays, parseISO } from 'date-fns'

function StockBadge({ stock, expiryDate }) {
  const isLowStock = stock <= 5
  const daysUntilExpiry = expiryDate
    ? differenceInDays(parseISO(expiryDate), new Date())
    : null
  const isNearExpiry = daysUntilExpiry !== null && daysUntilExpiry <= 7

  if (isLowStock && isNearExpiry) return (
    <span style={{background:'#FCEBEB',color:'#A32D2D',fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:500}}>
      Stok rendah + hampir exp
    </span>
  )
  if (isLowStock) return (
    <span style={{background:'#FCEBEB',color:'#A32D2D',fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:500}}>
      Stok rendah
    </span>
  )
  if (isNearExpiry) return (
    <span style={{background:'#FAEEDA',color:'#633806',fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:500}}>
      Exp {daysUntilExpiry} hari lagi
    </span>
  )
  return (
    <span style={{background:'#E1F5EE',color:'#0F6E56',fontSize:11,padding:'2px 8px',borderRadius:20,fontWeight:500}}>
      Aman
    </span>
  )
}

export default function StockList({ products, onEdit, onDelete }) {
  if (products.length === 0) return (
    <div className="text-center py-12 text-gray-400 text-sm">
      Belum ada produk. Tambah produk pertamamu!
    </div>
  )

  return (
    <div className="divide-y divide-gray-100">
      {products.map(p => (
        <div key={p.id} className="flex items-center gap-3 px-4 py-3 bg-white">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{p.name}</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Rp {p.price.toLocaleString('id-ID')} · {p.stock} {p.unit}
            </p>
          </div>
          <StockBadge stock={p.stock} expiryDate={p.expiry_date} />
          <div className="flex gap-1 flex-shrink-0">
            <button
              onClick={() => onEdit(p)}
              className="text-xs text-gray-500 border border-gray-200 rounded-lg px-2 py-1"
            >Edit</button>
            <button
              onClick={() => onDelete(p.id)}
              className="text-xs text-red-500 border border-red-100 rounded-lg px-2 py-1"
            >Hapus</button>
          </div>
        </div>
      ))}
    </div>
  )
}