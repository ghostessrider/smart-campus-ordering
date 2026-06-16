import StoreCard from "@/components/StoreCard";

// Dummy Data
const DUMMY_STORES = [
  { id: "1", name: "Cyber Canteen", category: "Food & Snacks", rating: 4.9, deliveryTime: "10-15 min" },
  { id: "2", name: "Neon Juice Bar", category: "Beverages", rating: 4.8, deliveryTime: "5-10 min" },
  { id: "3", name: "Hologram Grill", category: "Fast Food", rating: 4.5, deliveryTime: "20-25 min" },
  { id: "4", name: "Synaptic Salads", category: "Salads & Bowls", rating: 4.6, deliveryTime: "15-20 min" },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Decorative Orbs */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-purple-600 rounded-full mix-blend-screen filter blur-[50px] opacity-50 animate-pulse"></div>
      <div className="absolute bottom-40 right-20 w-48 h-48 bg-cyan-400 rounded-full mix-blend-screen filter blur-[80px] opacity-40 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500 rounded-full mix-blend-screen filter blur-[100px] opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Header section */}
      <header className="mb-16 relative z-10 text-center flex flex-col items-center justify-center">
        <h1 className="text-5xl md:text-7xl font-black mb-4 gradient-text-crazy text-glow tracking-tighter" style={{ animation: 'popIn 1s cubic-bezier(0.16, 1, 0.3, 1)' }}>
          INITIATE ORDER SEQUENCE
        </h1>
        <p className="text-gray-300 text-lg md:text-xl font-light max-w-2xl mx-auto" style={{ animation: 'popIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.2s backwards' }}>
          Welcome back to the neural link. Bypass the physical queue and download your nutrients instantly.
        </p>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="flex items-center justify-between mb-10 border-b border-gray-800 pb-4" style={{ animation: 'popIn 1s cubic-bezier(0.16, 1, 0.3, 1) 0.4s backwards' }}>
          <h2 className="text-3xl font-bold text-white tracking-wide">
            AVAILABLE <span className="text-cyan-400">NODES</span>
          </h2>
          <span className="btn-cyber px-4 py-1 rounded text-sm font-bold tracking-widest uppercase">
            {DUMMY_STORES.length} ONLINE
          </span>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-stagger">
          {DUMMY_STORES.map((store) => (
            <StoreCard 
              key={store.id}
              id={store.id}
              name={store.name}
              category={store.category}
              rating={store.rating}
              deliveryTime={store.deliveryTime}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
