interface OrderCardProps {
  orderId: string;
  items: string[];
  status: string;
  price: number;
}

export default function OrderCard({
  orderId,
  items,
  status,
  price,
}: OrderCardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="font-semibold">
        Order #{orderId}
      </h3>

      <p className="mt-2 text-sm text-gray-600">
        {items.join(", ")}
      </p>

      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
          {status}
        </span>

        <span className="font-bold">
          ₹{price}
        </span>
      </div>
    </div>
  );
}