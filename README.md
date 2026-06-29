# WarungOS — Project Brief
> Grand theme: Digital solution for UMKM (Usaha Mikro, Kecil, dan Menengah) in Indonesia
> Build target: 2 weeks | Format: Progressive Web App (PWA) | Stack: React + Supabase + Gemini AI

---

## 1. Product Overview

**WarungOS** is an all-in-one business operations app for Indonesian small business owners (UMKM). It targets four UMKM segments — warung/retail, e-commerce sellers, service businesses, and food/culinary businesses — and solves their most painful daily operational problems through a simple, mobile-first PWA with AI assistance.

**Core philosophy:** Simple UI, great UX. Designed for warung owners with low digital literacy. Everything in Bahasa Indonesia. Works on low-spec Android phones. No app store installation required (PWA).

---

## 2. Problems We Solve

### 2.1 Warung & Retail — Stock & Pembukuan

**Problem 1: No stock tracking**
- Owners use paper notebooks or memory for inventory
- Results: expired goods, surprise stockouts, no restocking insight
- Business impact: direct revenue loss and wasted purchasing budget

**Problem 2: No financial bookkeeping (pembukuan)**
- Personal and business money mixed together
- Cannot measure daily/monthly profit
- Cannot apply for government financing (KUR) without financial records

### 2.2 E-Commerce — Order Management

**Problem 3: Order chaos across multiple platforms**
- Sellers manage Shopee, Tokopedia, WhatsApp, Instagram simultaneously
- Orders get missed, response times are slow, fulfilment is inconsistent
- No single view of what needs to be processed today

### 2.3 Service Business — Scheduling & Retention

**Problem 4: No booking system → high cancellation rate**
- Salons, tutors, laundry services, and repair shops rely on WhatsApp for bookings
- No automated reminders = high no-show and last-minute cancellation rate
- Lost revenue from empty time slots

**Problem 5: No customer retention system**
- Loyalty is built only through personal memory of the owner
- No way to track which customers return, or to send promotions
- Cannot measure customer satisfaction or return rate

### 2.4 Food & Culinary — Waste & Operations

**Problem 6: Food waste and raw material over-purchasing**
- Ingredients bought without forecasting actual demand
- Unsold food and expired raw materials directly reduce profit margins
- No data-driven guidance on what and how much to prepare

---

## 3. Our Solution — Feature List

| Feature | Segment | Description |
|---|---|---|
| Smart Kasir (POS) | Retail | Sell products, auto-deduct stock on each sale |
| Stock Dashboard | Retail | View current stock levels; AI flags low-stock and near-expiry items |
| AI Pembukuan | Retail | Every sale auto-logged as income; daily profit/loss report in simple language |
| Order Inbox | E-Commerce | Unified manual order entry + WhatsApp order logging with status tracking |
| Booking Scheduler | Service | Appointment calendar + auto WhatsApp reminder 1 day and 1 hour before |
| Customer Loyalty | Service & Food | Punch-card loyalty tracker; customer visit history and profile |
| AI Demand Forecast | Food | Gemini API predicts what menu items to prepare based on past sales + day of week |
| Business Dashboard | All | Daily revenue, top products, customer stats at a glance |

---

## 4. Success Metrics

| Metric | Target |
|---|---|
| Stock/food waste reduction | Visible in demo: AI forecast vs actual purchase comparison |
| Order handling speed | Demo shows all orders in one inbox vs scattered WhatsApp |
| Cancellation rate reduction | Demo shows booking + reminder flow live |
| Customer return rate | Loyalty card punch count visible per customer |
| Time efficiency | Kasir checkout flow under 10 seconds per transaction |
| Profit visibility | Owner can see today's profit without doing manual math |

---

## 5. Tech Stack

### Frontend
- **React 18** with **Vite** — fast setup, hot reload, huge ecosystem
- **Tailwind CSS** — mobile-first utility classes, no custom CSS needed
- **React Router v6** — page navigation
- **Recharts** — profit charts, stock graphs, sales trends

### PWA
- **vite-plugin-pwa** — one plugin to make the app installable and offline-capable
- Service worker with Workbox for offline caching of key pages

### Backend & Database
- **Supabase** — managed PostgreSQL + Auth + Realtime subscriptions
  - No backend server to set up
  - Free tier is sufficient for hackathon
  - Built-in row-level security for multi-tenant owner data

### AI Layer
- **Google Gemini API** (gemini-1.5-flash)
  - Demand forecasting: send past 7-day sales data, get prediction for next day
  - Pembukuan summary: send raw transaction log, get plain Bahasa Indonesia summary
  - Low-stock alert reasoning: explain why a product needs restocking

### WhatsApp Notifications
- **Fonnte** or **WAMe** — Indonesian WhatsApp API gateway
  - Send booking reminders automatically 24h and 1h before appointment
  - Free tier available for hackathon volume

### Deployment
- **Vercel** — free tier, instant deploy from GitHub, automatic HTTPS, global CDN

---

## 6. Database Schema (Supabase / PostgreSQL)

```sql
-- Business owner account
CREATE TABLE owners (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  business_name TEXT,
  business_type TEXT CHECK (business_type IN ('retail', 'ecommerce', 'service', 'food')),
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Products / menu items
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES owners(id),
  name TEXT NOT NULL,
  price INTEGER NOT NULL, -- in IDR
  stock INTEGER DEFAULT 0,
  unit TEXT DEFAULT 'pcs',
  category TEXT,
  expiry_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sales transactions (kasir)
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES owners(id),
  total INTEGER NOT NULL, -- in IDR
  payment_method TEXT DEFAULT 'cash',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Line items per transaction
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price_at_sale INTEGER NOT NULL
);

-- Orders (unified inbox)
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES owners(id),
  customer_name TEXT,
  customer_phone TEXT,
  source TEXT DEFAULT 'manual', -- manual, whatsapp, shopee, tokopedia
  status TEXT DEFAULT 'pending', -- pending, processing, done, cancelled
  total INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES owners(id),
  name TEXT NOT NULL,
  phone TEXT,
  visit_count INTEGER DEFAULT 0,
  last_visit TIMESTAMPTZ,
  loyalty_punches INTEGER DEFAULT 0
);

-- Bookings (service businesses)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES owners(id),
  customer_id UUID REFERENCES customers(id),
  service_name TEXT,
  scheduled_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'confirmed', -- confirmed, reminded, done, cancelled
  reminder_sent BOOLEAN DEFAULT FALSE,
  notes TEXT
);
```

---

## 7. App Pages / Routes

```
/                   → Landing / Login
/register           → Owner registration + business type selection
/dashboard          → Home: today's revenue, quick actions, alerts
/kasir              → POS: select product, quantity, checkout
/stock              → Stock list, add product, edit, low-stock view
/pembukuan          → Financial summary: daily/weekly/monthly profit
/orders             → Order inbox: all orders, update status
/bookings           → Booking calendar + add new booking
/customers          → Customer list, loyalty punches, visit history
/ai-forecast        → AI demand forecast for today/tomorrow
/settings           → Business profile, WhatsApp setup
```

---

## 8. AI Integration — Gemini API

### Setup

```javascript
// lib/gemini.js
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
```

### 8.1 Demand Forecast

```javascript
async function getDemandForecast(salesData, dayName, date) {
  const prompt = `
Kamu adalah asisten bisnis warung makan Indonesia.
Berikut data penjualan 7 hari terakhir per menu:
${JSON.stringify(salesData)}

Hari ini adalah ${dayName}, ${date}.

Berikan prediksi:
1. Menu apa yang paling laris hari ini
2. Berapa porsi yang sebaiknya disiapkan per menu
3. Bahan baku apa yang perlu dibeli lebih banyak

Jawab dalam format JSON:
{
  "top_items": [{ "name": string, "predicted_qty": number }],
  "shopping_suggestions": [{ "ingredient": string, "reason": string }],
  "summary": string (1-2 kalimat dalam Bahasa Indonesia)
}
`;

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}
```

### 8.2 Pembukuan Summary

```javascript
async function getPembukuanSummary(transactions) {
  const prompt = `
Kamu adalah akuntan sederhana untuk UMKM Indonesia.
Data transaksi hari ini:
${JSON.stringify(transactions)}

Buat ringkasan keuangan sederhana dalam Bahasa Indonesia yang mudah dipahami pemilik warung.
Sertakan: total pemasukan, produk terlaris, dan saran singkat.
Format: teks singkat 3-4 kalimat, tidak perlu format JSON.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

### 8.3 Low Stock Alert

```javascript
async function getLowStockAlert(lowStockItems) {
  const prompt = `
Produk berikut stoknya rendah:
${JSON.stringify(lowStockItems)}

Berikan pesan peringatan singkat dalam Bahasa Indonesia dan saran kapan harus restock.
Maks 2 kalimat.
`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}
```

---

## 9. WhatsApp Reminder Flow (Fonnte)

```javascript
// Triggered by cron / Supabase edge function
async function sendBookingReminder(booking) {
  const message = `Halo ${booking.customer_name}! 
Reminder dari ${booking.owner.business_name}:
Jadwal Anda: ${booking.service_name}
Waktu: ${formatDate(booking.scheduled_at)}

Jika ada pertanyaan, hubungi kami. Terima kasih!`;

  await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { 'Authorization': process.env.FONNTE_TOKEN },
    body: JSON.stringify({
      target: booking.customer.phone,
      message: message
    })
  });
}
```

---

## 10. Project Structure

```
warunos/
├── public/
│   └── icons/          # PWA icons (192px, 512px)
├── src/
│   ├── components/
│   │   ├── ui/         # Button, Card, Input, Badge, Modal
│   │   ├── kasir/      # ProductGrid, CartItem, CheckoutModal
│   │   ├── stock/      # StockList, StockAlert, AddProductForm
│   │   ├── orders/     # OrderCard, OrderStatusBadge, OrderInbox
│   │   ├── bookings/   # BookingCalendar, BookingForm
│   │   ├── customers/  # CustomerCard, LoyaltyPuncher
│   │   └── ai/         # ForecastCard, PembukuanSummary
│   ├── pages/          # One file per route (matches Section 7)
│   ├── lib/
│   │   ├── supabase.js # Supabase client init
│   │   ├── gemini.js   # Gemini API wrapper functions
│   │   └── fonnte.js   # WhatsApp API wrapper
│   ├── hooks/          # useAuth, useStock, useTransactions, useBookings
│   ├── store/          # Zustand global state (cart, user)
│   └── main.jsx
├── vite.config.js      # includes vite-plugin-pwa config
├── tailwind.config.js
└── .env                # SUPABASE_URL, SUPABASE_ANON_KEY, GEMINI_API_KEY, FONNTE_TOKEN
```

---

## 11. Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GEMINI_API_KEY=your_google_gemini_api_key
VITE_FONNTE_TOKEN=your_fonnte_api_token
```

---

## 12. Key NPM Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "@supabase/supabase-js": "^2.45.0",
    "@google/generative-ai": "^0.15.0",
    "recharts": "^2.12.0",
    "zustand": "^4.5.0",
    "date-fns": "^3.6.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "vite": "^5.3.0",
    "vite-plugin-pwa": "^0.20.0",
    "@vitejs/plugin-react": "^4.3.0",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "workbox-window": "^7.1.0"
  }
}
```

---

## 13. PWA Config (vite.config.js)

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'WarungOS',
        short_name: 'WarungOS',
        description: 'Aplikasi operasional UMKM Indonesia',
        theme_color: '#1D9E75',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/.*\.supabase\.co\/.*/i,
            handler: 'NetworkFirst',
            options: { cacheName: 'supabase-cache' }
          }
        ]
      }
    })
  ]
})
```

