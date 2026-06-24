interface ProductCardProps {
  name: string;
  price: number;
  available: boolean;
  description?: string;
  onAdd?: () => void;
}

export default function ProductCard({
  name,
  price,
  available,
  description,
  onAdd,
}: ProductCardProps) {
  return (
    <div className="flex h-full flex-col justify-between rounded-xl border bg-white p-4 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold">{name}</h3>
        {description ? <p className="mt-2 text-sm text-gray-500">{description}</p> : null}
        <p className="mt-4 text-xl font-bold">₹{price}</p>
        <span
          className={`mt-3 inline-flex items-center rounded-full px-3 py-1 text-sm ${
            available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {available ? "Available" : "Unavailable"}
        </span>
      </div>

      {onAdd ? (
        <button
          onClick={onAdd}
          disabled={!available}
          className="mt-6 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
        >
          Add to cart
        </button>
      ) : null}
    </div>
  );
}
