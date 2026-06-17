"use client";

import { useState } from "react";
import StoreCard from "@/components/StoreCard";
import StudentNavbar from "@/components/StudentNavbar";
import { DUMMY_STORES } from "@/data/dummyData";

export default function StudentDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(DUMMY_STORES.map(store => store.category)))];

  const filteredStores = DUMMY_STORES.filter(store => {
    const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || store.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans w-full flex flex-col items-center">
      
      {/* Navbar */}
      <StudentNavbar />

      <main className="max-w-7xl mx-auto px-8 md:px-16 py-12 flex flex-col items-center w-full">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold mb-2">Campus Stores</h2>
          <p className="text-gray-600">Browse available food vendors on campus.</p>
        </div>

        {/* Search and Filters */}
        <div className="w-full max-w-4xl mb-10 flex flex-col gap-4 items-center">
          <input 
            type="text" 
            placeholder="Search stores..." 
            className="w-full md:w-1/2 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                  selectedCategory === category 
                    ? "bg-blue-600 text-white border-blue-600" 
                    : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 place-items-center w-full">
            {filteredStores.map((store) => (
              <StoreCard 
                key={store.id}
                id={store.id}
                name={store.name}
                category={store.category}
                rating={store.rating}
                deliveryTime={store.deliveryTime}
                imageUrl={store.imageUrl}
              />
            ))}
          </div>
        ) : (
          <div className="text-gray-500 mt-10">No stores found matching your criteria.</div>
        )}
      </main>
      
    </div>
  );
}
