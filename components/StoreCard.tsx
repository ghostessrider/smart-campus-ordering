import Link from "next/link";

interface StoreCardProps {
  id: string;
  name: string;
  category: string;
  imageUrl?: string;
  rating?: number;
  deliveryTime?: string;
}

export default function StoreCard({ id, name, category, imageUrl, rating = 4.5, deliveryTime = "15-20 min" }: StoreCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow m-2">
      <Link href={`/student/store/${id}`} className="block h-full outline-none focus:ring-2 focus:ring-blue-500">
        <div className="flex flex-col h-full">
          
          {/* Image Section */}
          <div className="h-40 bg-gray-200 dark:bg-gray-700 relative">
            {imageUrl ? (
              <img src={imageUrl} alt={name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
          
          {/* Content */}
          <div className="p-6 flex flex-col items-center justify-between flex-1 text-center">
            <div className="flex flex-col items-center mb-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-1 mb-2">{name}</h3>
              <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded text-xs font-medium w-fit">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                {rating}
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{category}</p>
            
            <div className="flex items-center justify-center text-sm text-gray-500 dark:text-gray-400 font-medium">
              <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {deliveryTime}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
