import { supabase } from './supabase'

export async function processCheckout(ownerId, cartItems) {
  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  )

  // Langkah 1: buat record transaksi
  const { data: tx, error: txError } = await supabase
    .from('transactions')
    .insert({ owner_id: ownerId, total, payment_method: 'cash' })
    .select()
    .single()

  if (txError) throw txError

  // Langkah 2: simpan setiap item transaksi
  const lineItems = cartItems.map(item => ({
    transaction_id: tx.id,
    product_id: item.id,
    quantity: item.quantity,
    price_at_sale: item.price
  }))

  const { error: itemsError } = await supabase
    .from('transaction_items')
    .insert(lineItems)

  if (itemsError) throw itemsError

  // Langkah 3: kurangi stok setiap produk
  for (const item of cartItems) {
    await supabase.rpc('decrement_stock', {
      product_id: item.id,
      amount: item.quantity
    })
  }

  return tx
}