import { useEffect, useState, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

// ---------------------------------------------------------------------------
// Supabase client — reads from Vite env vars (or falls back to demo mode)
// ---------------------------------------------------------------------------
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const LOW_STOCK_THRESHOLD = 5;

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

/** Skeleton card shown while loading */
function SkeletonCard() {
  return (
    <div className="rounded-2xl bg-white border border-gray-100 overflow-hidden animate-pulse">
      <div className="h-28 bg-gray-100" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-8 bg-gray-100 rounded-xl mt-3" />
      </div>
    </div>
  );
}

/** Stock badge — shows urgency via colour */
function StockBadge({ stock }) {
  if (stock === 0)
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
        Habis
      </span>
    );
  if (stock <= LOW_STOCK_THRESHOLD)
    return (
      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-600">
        Sisa {stock}
      </span>
    );
  return (
    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">
      Stok {stock}
    </span>
  );
}

/** Single tappable product card */
function ProductCard({ product, onAddToCart }) {
  const [pressed, setPressed] = useState(false);
  const outOfStock = product.stock === 0;

  const handleTap = useCallback(() => {
    if (outOfStock) return;
    setPressed(true);
    onAddToCart(product);
    setTimeout(() => setPressed(false), 200);
  }, [outOfStock, onAddToCart, product]);

  return (
    <button
      type="button"
      onClick={handleTap}
      disabled={outOfStock}
      aria-label={`Tambah ${product.name} ke keranjang`}
      className={[
        "group relative w-full text-left rounded-2xl bg-white border overflow-hidden",
        "transition-all duration-150 select-none",
        outOfStock
          ? "opacity-50 cursor-not-allowed border-gray-100"
          : "border-gray-100 active:scale-95 hover:border-emerald-300 hover:shadow-md cursor-pointer",
        pressed ? "scale-95 border-emerald-400 shadow-md" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Category chip — top-left overlay */}
      {product.category && (
        <span className="absolute top-2 left-2 z-10 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/80 backdrop-blur-sm text-gray-500 border border-gray-200">
          {product.category}
        </span>
      )}

      {/* Product visual area */}
      <div className="h-28 bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center relative overflow-hidden">
        {/* Decorative circle */}
        <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/30" />
        <span className="text-4xl" role="img" aria-hidden>
          {categoryEmoji(product.category)}
        </span>
      </div>

      {/* Info section */}
      <div className="p-3 space-y-1">
        <div className="flex items-start justify-between gap-1">
          <p className="text-sm font-semibold text-gray-800 leading-tight line-clamp-2 flex-1">
            {product.name}
          </p>
          <StockBadge stock={product.stock} />
        </div>

        <p className="text-xs text-gray-400">
          {product.unit ?? "pcs"}
        </p>

        {/* Price + add button row */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-bold text-emerald-700">
            {formatRupiah(product.price)}
          </span>

          {!outOfStock && (
            <span
              className={[
                "w-8 h-8 rounded-xl flex items-center justify-center text-white text-lg font-light transition-all duration-150",
                "bg-emerald-500 group-hover:bg-emerald-600",
                pressed ? "bg-emerald-700 scale-90" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden
            >
              +
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Category → emoji map (expand as needed)
// ---------------------------------------------------------------------------
function categoryEmoji(category) {
  const map = {
    makanan: "🍱",
    minuman: "🥤",
    snack: "🍪",
    rokok: "🚬",
    sembako: "🛒",
    sabun: "🧴",
    bumbu: "🌶️",
    buah: "🍎",
    sayur: "🥦",
    frozen: "🧊",
    roti: "🍞",
    obat: "💊",
  };
  if (!category) return "📦";
  const key = category.toLowerCase();
  return map[key] ?? "📦";
}

// ---------------------------------------------------------------------------
// Main ProductGrid component
// ---------------------------------------------------------------------------

/**
 * ProductGrid
 *
 * Props:
 *   ownerId      {string}    UUID of the business owner — required
 *   onAddToCart  {Function}  Called with the full product object on tap
 *   searchQuery  {string}    Optional — filters by product name client-side
 *   className    {string}    Extra class names for the wrapper
 */
export default function ProductGrid({
  ownerId,
  onAddToCart,
  searchQuery = "",
  className = "",
}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // -------------------------------------------------------------------------
  // Fetch products from Supabase
  // -------------------------------------------------------------------------
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      if (!supabase) {
        // Demo mode — no real Supabase configured
        await new Promise((r) => setTimeout(r, 800));
        setProducts(DEMO_PRODUCTS);
        return;
      }

      const { data, error: sbError } = await supabase
        .from("products")
        .select("id, name, price, stock, unit, category, expiry_date")
        .eq("owner_id", ownerId)
        .order("name", { ascending: true });

      if (sbError) throw sbError;
      setProducts(data ?? []);
    } catch (err) {
      console.error("[ProductGrid] fetch error:", err);
      setError(err.message ?? "Gagal memuat produk.");
    } finally {
      setLoading(false);
    }
  }, [ownerId]);

  useEffect(() => {
    if (!ownerId) {
      setError("owner_id tidak ditemukan.");
      setLoading(false);
      return;
    }
    fetchProducts();
  }, [fetchProducts, ownerId]);

  // -------------------------------------------------------------------------
  // Client-side search filter
  // -------------------------------------------------------------------------
  const visible = searchQuery.trim()
    ? products.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  // -------------------------------------------------------------------------
  // Render states
  // -------------------------------------------------------------------------
  if (loading) {
    return (
      <div className={`grid grid-cols-2 gap-3 px-4 pb-4 ${className}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center py-12 px-6 text-center ${className}`}>
        <span className="text-4xl mb-3">⚠️</span>
        <p className="text-sm font-semibold text-gray-700 mb-1">Gagal memuat produk</p>
        <p className="text-xs text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchProducts}
          className="text-sm font-semibold text-white bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 px-5 py-2 rounded-xl transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  if (visible.length === 0) {
    return (
      <div className={`flex flex-col items-center py-12 px-6 text-center ${className}`}>
        <span className="text-4xl mb-3">📭</span>
        <p className="text-sm font-semibold text-gray-700">
          {searchQuery ? "Produk tidak ditemukan" : "Belum ada produk"}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          {searchQuery
            ? `Tidak ada hasil untuk "${searchQuery}"`
            : "Tambahkan produk di halaman Stok"}
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-2 gap-3 px-4 pb-6 ${className}`}
      role="list"
      aria-label="Daftar produk"
    >
      {visible.map((product) => (
        <div key={product.id} role="listitem">
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Demo data — used when VITE_SUPABASE_URL is not set
// ---------------------------------------------------------------------------
const DEMO_PRODUCTS = [
  {
    id: "1",
    name: "Indomie Goreng",
    price: 3500,
    stock: 48,
    unit: "bungkus",
    category: "makanan",
  },
  {
    id: "2",
    name: "Aqua 600ml",
    price: 4000,
    stock: 3,
    unit: "botol",
    category: "minuman",
  },
  {
    id: "3",
    name: "Teh Botol Sosro",
    price: 5000,
    stock: 12,
    unit: "botol",
    category: "minuman",
  },
  {
    id: "4",
    name: "Chitato Original",
    price: 8000,
    stock: 0,
    unit: "bungkus",
    category: "snack",
  },
  {
    id: "5",
    name: "Sabun Lifebuoy",
    price: 4500,
    stock: 20,
    unit: "pcs",
    category: "sabun",
  },
  {
    id: "6",
    name: "Beras 1kg",
    price: 14000,
    stock: 5,
    unit: "kg",
    category: "sembako",
  },
  {
    id: "7",
    name: "Kopi Kapal Api",
    price: 2000,
    stock: 30,
    unit: "sachet",
    category: "minuman",
  },
  {
    id: "8",
    name: "Roti Tawar Sari Roti",
    price: 18000,
    stock: 8,
    unit: "bungkus",
    category: "roti",
  },
];
