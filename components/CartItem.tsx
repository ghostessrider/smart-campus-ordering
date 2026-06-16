"use client";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function CartItem({ id, name, price, quantity, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 mb-4">
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 dark:text-white text-lg">{name}</h4>
        <div className="text-blue-600 dark:text-blue-400 font-semibold mt-1">₹{price} x {quantity}</div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          <button 
            onClick={() => onDecrease?.(id)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 transition-colors"
          >
            -
          </button>
          <span className="w-8 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
          <button 
            onClick={() => onIncrease?.(id)}
            className="w-8 h-8 flex items-center justify-center rounded-md text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-600 transition-colors"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={() => onRemove?.(id)}
          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
          title="Remove item"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
