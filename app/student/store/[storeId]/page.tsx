"use client";

import { use } from "react";
import ProductCard from "@/components/ProductCard";
import StudentNavbar from "@/components/StudentNavbar";
import { useCart } from "@/context/CartContext";
import { DUMMY_STORES, DUMMY_PRODUCTS } from "@/data/dummyData";

export default function StorePage({ params }: { params: Promise<{ storeId: string }> | { storeId: string } }) {
  // Unwrap params for Next.js 15+ compatibility
  const resolvedParams = params instanceof Promise ? use(params) : params;
  const storeId = resolvedParams.storeId;

  const store = DUMMY_STORES.find(s => s.id === storeId);
  const storeName = store ? store.name : `Store #${storeId}`;
  const products = DUMMY_PRODUCTS[storeId] || [];
  
  const { addToCart } = useCart();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 w-full flex flex-col items-center">
      
      {/* Navbar */}
      <StudentNavbar showBack={true} />

      <main className="max-w-7xl w-full px-8 md:px-16 py-12 flex flex-col items-center">
        <div className="bg-white p-8 rounded border border-gray-200 mb-10 text-center w-full max-w-2xl">
          <h1 className="text-3xl font-bold mb-2">{storeName}</h1>
          <p className="text-gray-600">Rating: {store?.rating || 4.0} | {store?.deliveryTime || "15 mins"}</p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center w-full">Menu</h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full place-items-center">
            {products.map((product) => (
              <ProductCard 
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                onAddToCart={(id, qty) => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: qty,
                    storeName: storeName
                  });
                }}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center">No products found for this store.</p>
        )}
      </main>
      
    </div>
  );
}
