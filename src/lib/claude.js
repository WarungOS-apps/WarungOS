const API_KEY = import.meta.env.VITE_GEMINI_API_KEY
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

// ==========================================
// 1. FUNGSI UTAMA GEMINI (DENGAN RETRY & DELAY)
// ==========================================
async function callGemini(prompt) {
  if (!API_KEY) {
    console.warn('⚠️ GEMINI API KEY TIDAK ADA')
    return null
  }

  let retries = 3
  let delay = 1000 // mulai delay 1 detik

  while (retries > 0) {
    try {
      console.log('🔄 Memanggil Gemini API...')
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { maxOutputTokens: 1024 }
        })
      })

      console.log('📨 Status response:', res.status)
      
      // Kalau 429 (Rate limited), tunggu & retry
      if (res.status === 429) {
        retries--
        if (retries > 0) {
          console.warn(`⏳ Rate limited! Retry dalam ${delay}ms... (${retries} retries left)`)
          await new Promise(r => setTimeout(r, delay))
          delay *= 2 // exponential backoff
          continue
        }
      }

      if (!res.ok) {
        const errData = await res.json()
        console.error('❌ Error dari Gemini:', errData)
        return null
      }

      const data = await res.json()
      console.log('✅ Response data:', data)
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text ?? null
      console.log('📝 Extracted text:', result)
      return result
    } catch (err) {
      console.error('❌ Fetch error:', err)
      retries--
      if (retries > 0) {
        await new Promise(r => setTimeout(r, delay))
        delay *= 2
        continue
      }
      return null
    }
  }

  console.error('❌ Semua retry gagal')
  return null
}

// ==========================================
// 2. FUNGSI EXPORT UNTUK WARUNG OS
// ==========================================
export async function getPembukuanSummary(transactions) {
  if (!transactions || transactions.length === 0) return null

  const prompt = `
Kamu adalah akuntan sederhana untuk UMKM Indonesia.
Data transaksi hari ini:
${JSON.stringify(transactions)}

Buat ringkasan keuangan sederhana dalam Bahasa Indonesia yang mudah dipahami pemilik warung.
Sertakan: total pemasukan, produk terlaris, dan saran singkat.
Format: teks singkat 3-4 kalimat, tidak perlu format JSON.
`
  return callGemini(prompt)
}

export async function getLowStockAlert(lowStockItems) {
  if (!lowStockItems || lowStockItems.length === 0) return null

  const prompt = `
Produk berikut stoknya rendah:
${JSON.stringify(lowStockItems)}

Berikan pesan peringatan singkat dalam Bahasa Indonesia dan saran kapan harus restock.
Maks 2 kalimat.
`
  return callGemini(prompt)
}

export async function getDemandForecast(salesData, dayName, date) {
  if (!salesData || salesData.length === 0) return null

  const prompt = `
Kamu adalah asisten bisnis warung makan Indonesia.
Berikut data penjualan 7 hari terakhir per menu:
${JSON.stringify(salesData)}

Hari ini adalah ${dayName}, ${date}.

Berikan prediksi:
1. Menu apa yang paling laris hari ini
2. Berapa porsi yang sebaiknya disiapkan per menu
3. Bahan baku apa yang perlu dibeli lebih banyak

Jawab dalam format JSON yang valid saja, tanpa teks lain:
{
  "top_items": [{ "name": "string", "predicted_qty": 0 }],
  "shopping_suggestions": [{ "ingredient": "string", "reason": "string" }],
  "summary": "1-2 kalimat dalam Bahasa Indonesia"
}
`
  return callGemini(prompt)
}