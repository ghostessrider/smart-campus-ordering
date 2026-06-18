"use client";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  storeName?: string;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
  onRemove?: (id: string) => void;
}

export default function CartItem({ id, name, price, quantity, storeName, onIncrease, onDecrease, onRemove }: CartItemProps) {
  return (
    <div className="flex flex-col items-center justify-between p-4 bg-white rounded border border-gray-200 mb-4 sm:flex-row text-center sm:text-left gap-4">
      <div className="flex-1">
        <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
        {storeName && <div className="text-xs text-gray-500 font-medium mb-1">{storeName}</div>}
        <div className="text-gray-600 mt-1">₹{price} x {quantity}</div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center bg-gray-50 border border-gray-200 rounded">
          <button 
            onClick={() => onDecrease?.(id)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200"
          >
            -
          </button>
          <span className="w-8 text-center font-medium text-gray-900">{quantity}</span>
          <button 
            onClick={() => onIncrease?.(id)}
            className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-200"
          >
            +
          </button>
        </div>
        
        <button 
          onClick={() => onRemove?.(id)}
          className="text-red-500 hover:underline text-sm font-medium"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
