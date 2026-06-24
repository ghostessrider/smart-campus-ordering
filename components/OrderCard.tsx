interface OrderCardProps {
  orderId: string;
  orderNumber?: string;
  items: Array<{ name: string; quantity: number }>;
  status: string;
  price: number;
}

export default function OrderCard({
  orderId,
  orderNumber,
  items,
  status,
  price,
}: OrderCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold">Order #{orderNumber ?? orderId}</h3>
          <p className="text-sm text-gray-500">Reference: {orderId}</p>
        </div>
        <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          {status}
        </span>
      </div>

      <div className="mt-5 space-y-2 text-sm text-slate-700">
        {items.map((item, index) => (
          <p key={index}>
            {item.name} × {item.quantity}
          </p>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-lg font-semibold">
        <span>Total</span>
        <span>₹{price}</span>
      </div>
    </div>
  );
}
