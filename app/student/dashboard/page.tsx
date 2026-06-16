import StoreCard from "@/components/StoreCard";

// Dummy Data
const DUMMY_STORES = [
  { id: "1", name: "Canteen 1", category: "Food & Snacks", rating: 4.2, deliveryTime: "10-15 min" },
  { id: "2", name: "Juice Bar", category: "Beverages", rating: 4.8, deliveryTime: "5-10 min" },
  { id: "3", name: "Campus Grill", category: "Fast Food", rating: 4.5, deliveryTime: "20-25 min" },
  { id: "4", name: "Healthy Bites", category: "Salads & Bowls", rating: 4.6, deliveryTime: "15-20 min" },
];

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 md:p-12">
      {/* Header section */}
      <header className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome back, Student! 👋
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          What are you craving today? Order ahead and skip the line.
        </p>
      </header>

      {/* Main Content */}
      <main>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Available Stores
          </h2>
          <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            {DUMMY_STORES.length} Open Now
          </span>
        </div>

        {/* Store Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {DUMMY_STORES.map((store) => (
            <StoreCard 
              key={store.id}
              id={store.id}
              name={store.name}
              category={store.category}
              rating={store.rating}
              deliveryTime={store.deliveryTime}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
