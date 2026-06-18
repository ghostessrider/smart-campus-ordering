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
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 flex flex-col items-center hover:shadow-md transition-shadow m-2 mb-4 text-center">
      
      {/* Product Image */}
      <div className="w-32 h-32 flex-shrink-0 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden relative mb-4">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 flex flex-col items-center w-full">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1">{name}</h3>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">₹{price}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4">{description}</p>
        
        <button 
          onClick={handleAddToCart}
          disabled={added}
          className={`mt-auto px-6 py-2 rounded-full text-sm font-medium transition-colors flex items-center justify-center gap-1.5 w-full max-w-[200px] ${
            added 
            ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800" 
            : "bg-gray-50 text-gray-900 dark:bg-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600"
          }`}
        >
          {added ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              Added
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              Add
            </>
          )}
        </button>
      </div>
      
    </div>
  );
}
