"use client";

import StudentNavbar from "@/components/StudentNavbar";
import OrderCard from "@/components/OrderCard";

// Dummy Order History Data
const DUMMY_ORDERS: React.ComponentProps<typeof OrderCard>[] = [
  {
    id: "1045",
    storeName: "Nescafe",
    date: "Oct 24, 2026, 02:30 PM",
    status: "Completed",
    total: 80,
    items: [
      { name: "Cold Coffee", quantity: 1 },
      { name: "Masala Maggi", quantity: 1 }
    ]
  },
  {
    id: "1042",
    storeName: "Canteen 1",
    date: "Oct 23, 2026, 11:15 AM",
    status: "Completed",
    total: 140,
    items: [
      { name: "Masala Dosa", quantity: 1 },
      { name: "Veg Fried Rice", quantity: 1 }
    ]
  },
  {
    id: "1047",
    storeName: "Amul Parlour",
    date: "Oct 24, 2026, 04:00 PM",
    status: "Pending",
    total: 40,
    items: [
      { name: "Chocolate Cone", quantity: 1 }
    ]
  }
];

export default function OrdersPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans w-full flex flex-col items-center">
      
      {/* Navbar */}
      <StudentNavbar />

      <main className="max-w-7xl w-full px-8 md:px-16 py-12 flex flex-col items-center">
        <div className="w-full max-w-3xl">
          
          <div className="mb-8 border-b border-gray-200 pb-4 text-center">
            <h1 className="text-3xl font-bold">Your Orders</h1>
            <p className="text-gray-600 mt-2">View your current and past food orders.</p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {DUMMY_ORDERS.map((order) => (
              <OrderCard key={order.id} {...order} />
            ))}
          </div>

        </div>
      </main>
    </div>
  );
}