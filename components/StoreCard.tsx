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
    <div className="card-3d-wrapper">
      <Link href={`/student/store/${id}`} className="block h-full outline-none focus:ring-2 focus:ring-cyan-400 rounded-3xl">
        <div className="glass-ultra h-full flex flex-col relative overflow-hidden group card-3d">
          
          {/* Cyberpunk Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 rounded-3xl blur opacity-0 group-hover:opacity-20 transition duration-1000 group-hover:duration-200 z-0"></div>
          
          <div className="relative z-10 flex-1 flex flex-col h-full card-content-3d">
            {/* Image Section */}
            <div className="h-48 bg-gray-900 relative overflow-hidden border-b border-gray-800">
              {imageUrl ? (
                <img src={imageUrl} alt={name} className="w-full h-full object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 opacity-80 group-hover:opacity-100" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-900 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDkwOTA5Ij48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMOCA4Wk04IDBMMCA4WiIgc3Ryb2tlPSIjMTUxNTE1IiBzdHJva2Utd2lkdGg9IjEiPjwvcGF0aD4KPC9zdmc+')] opacity-50"></div>
                  <svg className="w-16 h-16 text-cyan-500/50 group-hover:text-cyan-400 transition-colors drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
              
              {/* Rating Badge */}
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-black text-white flex items-center gap-1.5 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_10px_rgba(0,240,255,0.5)] transition-all">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
                {rating}
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1 opacity-80">{category}</p>
                <h3 className="text-2xl font-black text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-purple-500 transition-all">{name}</h3>
              </div>
              
              <div className="flex items-center text-sm font-bold text-gray-400 bg-white/5 w-fit px-4 py-2 rounded-xl border border-white/5">
                <svg className="w-4 h-4 mr-2 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                ETA: {deliveryTime}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
