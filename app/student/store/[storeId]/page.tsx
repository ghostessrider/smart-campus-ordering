import ProductCard from "@/components/ProductCard";
import Link from "next/link";

// Dummy Data
const DUMMY_PRODUCTS = [
  { id: "p1", name: "Synaptic Dosa", description: "Crispy rice crepe filled with spiced potato curry. Served with sambar and chutney.", price: 60 },
  { id: "p2", name: "Neon Fried Rice", description: "Wok-tossed rice with fresh vegetables and soy sauce.", price: 80 },
  { id: "p3", name: "Cyber Paneer Roll", description: "Grilled paneer chunks wrapped in a flatbread with mint sauce.", price: 70 },
  { id: "p4", name: "Quantum Coffee", description: "Refreshing cold coffee blended with ice cream.", price: 50 },
  { id: "p5", name: "Aloo Paratha v2.0", description: "Whole wheat flatbread stuffed with spiced mashed potatoes.", price: 40 },
  { id: "p6", name: "Glitch Samosa (2 pcs)", description: "Crispy pastry filled with spiced potatoes and peas.", price: 30 },
];

export default function StorePage({ params }: { params: { storeId: string } }) {
  const storeName = params.storeId === "1" ? "Cyber Canteen" : `Node #${params.storeId}`;

  return (
    <div className="min-h-screen relative overflow-hidden pb-20">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[150px] opacity-20 pointer-events-none"></div>

      {/* Store Cover Header */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 mix-blend-overlay"></div>
        
        <div className="absolute bottom-8 left-6 md:left-12 z-10" style={{ animation: 'popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          <Link href="/student/dashboard" className="text-cyan-400 hover:text-cyan-300 font-bold tracking-widest uppercase text-sm flex items-center gap-2 mb-6 transition-all hover:-translate-x-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            RETURN TO DASHBOARD
          </Link>
          <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-100 to-white text-glow tracking-tighter drop-shadow-[0_0_20px_rgba(0,240,255,0.3)]">{storeName}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm font-black tracking-widest">
            <span className="flex items-center text-pink-400 bg-pink-500/10 px-3 py-1 rounded border border-pink-500/20">
              <span className="w-2 h-2 rounded-full bg-pink-400 mr-2 animate-pulse"></span>
              RATING 4.9
            </span>
            <span className="text-white/50">|</span>
            <span className="text-cyan-400">FOOD & SNACKS</span>
          </div>
        </div>
      </div>

      <main className="p-6 md:p-12 max-w-7xl mx-auto relative z-10">
        <h2 className="text-3xl font-black text-white tracking-widest mb-10 border-l-4 border-cyan-400 pl-4 py-1" style={{ animation: 'popIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards' }}>
          AVAILABLE <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">CONSUMABLES</span>
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-stagger">
          {DUMMY_PRODUCTS.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              price={product.price}
              onAddToCart={(id, qty) => console.log(`Added ${qty} of ${id} to cart`)}
            />
          ))}
        </div>
      </main>
      
      {/* Floating Cart Button */}
      <Link href="/student/cart" className="fixed bottom-8 right-8 btn-cyber rounded-full p-4 flex items-center justify-center transition-transform hover:scale-110 z-50 group border-cyan-400">
        <svg className="w-7 h-7 text-cyan-400 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs font-black w-7 h-7 flex items-center justify-center rounded-full border border-pink-400 shadow-[0_0_15px_rgba(255,0,85,0.8)] group-hover:scale-110 transition-transform">
          3
        </span>
      </Link>
    </div>
  );
}
