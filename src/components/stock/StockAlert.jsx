// src/components/stock/StockAlert.jsx
export default function StockAlert({ alerts }) {
  if (!alerts?.length) return null;

  return (
    <div className="flex flex-col gap-2 mb-4">
      {alerts.map((alert, i) => (
        <div
          key={i}
          className={`rounded-lg border px-4 py-3 text-sm ${
            alert.level === 'critical'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-yellow-50 border-yellow-200 text-yellow-800'
          }`}
        >
          <div className="flex items-center gap-2 font-medium mb-1">
            <span>{alert.level === 'critical' ? '🚨' : '⚠️'}</span>
            <span>{alert.product_name}</span>
          </div>
          <p className="mb-1">{alert.message}</p>
          <p className="opacity-75 text-xs">👉 {alert.action}</p>
        </div>
      ))}
    </div>
  );
}

// Usage in Stock.jsx and Dashboard.jsx:
// <StockAlert alerts={alertData} />