import ProductCard from "@/components/ProductCard";
import Link from "next/link";

// Dummy Data
const DUMMY_PRODUCTS = [
  { id: "p1", name: "Masala Dosa", description: "Crispy rice crepe filled with spiced potato curry. Served with sambar and chutney.", price: 60 },
  { id: "p2", name: "Veg Fried Rice", description: "Wok-tossed rice with fresh vegetables and soy sauce.", price: 80 },
  { id: "p3", name: "Paneer Tikka Roll", description: "Grilled paneer chunks wrapped in a flatbread with mint sauce.", price: 70 },
  { id: "p4", name: "Cold Coffee", description: "Refreshing cold coffee blended with ice cream.", price: 50 },
  { id: "p5", name: "Aloo Paratha", description: "Whole wheat flatbread stuffed with spiced mashed potatoes.", price: 40 },
  { id: "p6", name: "Samosa (2 pcs)", description: "Crispy pastry filled with spiced potatoes and peas.", price: 30 },
];

export default function StorePage({ params }: { params: { storeId: string } }) {
  // Mock store name based on ID
  const storeName = params.storeId === "1" ? "Canteen 1" : `Store #${params.storeId}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
      {/* Store Cover Header */}
      <div className="h-48 md:h-64 bg-blue-600 w-full relative">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-6 left-6 md:left-12">
          <Link href="/student/dashboard" className="text-white/80 hover:text-white flex items-center gap-2 mb-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-white">{storeName}</h1>
          <p className="text-gray-200 mt-2 flex items-center gap-2">
            <span className="flex items-center"><svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> 4.5</span>
            <span>•</span>
            <span>Food & Snacks</span>
          </p>
        </div>
      </div>

      <main className="p-6 md:p-12 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">
          Menu Menu
        </h2>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
      
      {/* Floating Cart Button (Mock) */}
      <Link href="/student/cart" className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg flex items-center justify-center transition-transform hover:scale-105 group z-50">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white dark:border-gray-900 group-hover:scale-110 transition-transform">
          3
        </span>
      </Link>
    </div>
  );
}
