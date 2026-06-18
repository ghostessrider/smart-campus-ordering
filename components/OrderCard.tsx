interface OrderItem {
  name: string;
  quantity: number;
}

interface OrderCardProps {
  id: string;
  storeName: string;
  date: string;
  status: "Pending" | "Preparing" | "Completed";
  total: number;
  items: OrderItem[];
}

export default function OrderCard({ id, storeName, date, status, total, items }: OrderCardProps) {
  const getStatusColor = () => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Preparing":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Completed":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-4 w-full">
      <div className="flex justify-between items-start border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-900">{storeName}</h3>
          <p className="text-sm text-gray-500">Order #{id} • {date}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor()}`}>
          {status}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm text-gray-700">
            <span>{item.quantity}x {item.name}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
        <span className="font-medium text-gray-600">Total</span>
        <span className="font-bold text-lg text-gray-900">₹{total}</span>
      </div>
    </div>
  );
}
