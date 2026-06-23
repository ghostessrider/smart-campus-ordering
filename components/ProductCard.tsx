interface ProductCardProps {
  name: string;
  price: number;
  available: boolean;
}

export default function ProductCard({
  name,
  price,
  available,
}: ProductCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="text-lg font-semibold">{name}</h3>

      <p className="mt-2 text-xl font-bold">
        ₹{price}
      </p>

      <span
        className={`mt-2 inline-block rounded-full px-3 py-1 text-sm ${
          available
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {available ? "Available" : "Unavailable"}
      </span>
    </div>
  );
}