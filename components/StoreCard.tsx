interface StoreCardProps {
  id: string;
  name: string;
  category: string;
  image?: string;
}

export default function StoreCard({
  name,
  category,
  image,
}: StoreCardProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      <div className="h-40 w-full bg-gray-200">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-500">{category}</p>
      </div>
    </div>
  );
}