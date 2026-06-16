"use client";

import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  onAddToCart?: (id: string, quantity: number) => void;
}

export default function ProductCard({ id, name, description, price, imageUrl, onAddToCart }: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    if (onAddToCart) onAddToCart(id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="card-3d-wrapper h-full">
      <div className="glass-ultra h-full flex flex-col relative overflow-hidden group card-3d">
        
        {/* Glow Effects */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500 rounded-full mix-blend-screen filter blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-pink-500 rounded-full mix-blend-screen filter blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>

        <div className="relative z-10 flex flex-col h-full card-content-3d">
          {/* Product Image */}
          <div className="h-48 bg-black/50 relative border-b border-white/5 overflow-hidden">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-600 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjMDUwNTA1Ij48L3JlY3Q+CjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiMxMTEiPjwvcmVjdD4KPC9zdmc+')]">
                <svg className="w-12 h-12 text-cyan-500/30 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_15px_rgba(0,240,255,0.8)] transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute top-4 left-4 bg-cyan-400 text-black font-black px-4 py-1 rounded shadow-[0_0_15px_rgba(0,240,255,0.6)] transform -skew-x-12">
              <span className="inline-block transform skew-x-12">₹{price}</span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 flex-1 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">{name}</h3>
            <p className="text-sm text-gray-400 flex-1 line-clamp-3 mb-6 leading-relaxed font-light">{description}</p>
            
            <button 
              onClick={handleAddToCart}
              className={`w-full py-3 rounded text-sm font-black tracking-widest uppercase transition-all flex items-center justify-center gap-3 ${
                added 
                ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(138,43,226,0.6)] border border-purple-400" 
                : "btn-cyber"
              }`}
            >
              {added ? (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  ACQUIRED
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  ADD TO CART
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
