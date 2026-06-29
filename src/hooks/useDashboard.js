import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useDashboard(userId) {
  const [data, setData] = useState({
    revenue: 0,
    txCount: 0,
    topProducts: [],
    lowStockCount: 0,
    hourlyRevenue: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return
    fetchAll()
  }, [userId])

  async function fetchAll() {
    setLoading(true)
    const todayStart = new Date()
    todayStart.setHours(0, 0, 0, 0)
    const todayISO = todayStart.toISOString()

    const [txRes, itemsRes, stockRes] = await Promise.all([

      supabase
        .from('transactions')
        .select('total, created_at')
        .eq('owner_id', userId)
        .gte('created_at', todayISO),

      supabase
        .from('transaction_items')
        .select('quantity, price_at_sale, product_id, products(name), transactions!inner(owner_id, created_at)')
        .eq('transactions.owner_id', userId)
        .gte('transactions.created_at', todayISO),

      supabase
        .from('products')
        .select('id', { count: 'exact' })
        .eq('owner_id', userId)
        .lte('stock', 5)
    ])

    const transactions = txRes.data || []
    const items = itemsRes.data || []

    const revenue = transactions.reduce((s, t) => s + t.total, 0)
    const txCount = transactions.length

    const productMap = {}
    items.forEach(item => {
      const name = item.products?.name || 'Unknown'
      if (!productMap[name]) productMap[name] = 0
      productMap[name] += item.quantity
    })
    const topProducts = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, qty]) => ({ name, qty }))

    const hourMap = {}
    transactions.forEach(tx => {
      const hour = new Date(tx.created_at).getHours()
      const label = `${hour}:00`
      hourMap[label] = (hourMap[label] || 0) + tx.total
    })
    const hourlyRevenue = Array.from({ length: 24 }, (_, h) => ({
      hour: `${h}:00`,
      total: hourMap[`${h}:00`] || 0
    })).filter((_, i) => i >= 6 && i <= 22)

    setData({
      revenue,
      txCount,
      topProducts,
      lowStockCount: stockRes.count || 0,
      hourlyRevenue
    })
    setLoading(false)
  }

  return { ...data, loading, refetch: fetchAll }
}