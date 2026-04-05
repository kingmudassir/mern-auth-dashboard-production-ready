export function SimilarCard({ car }) {
  const thumb = car.images?.[0]?.url;

  // Local Helper: Formats price into Crore, Lac, or PKR
  const formatPrice = (n) => {
    if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Crore`;
    if (n >= 100000) return `${(n / 100000).toFixed(0)} Lac`;
    return `PKR ${n.toLocaleString()}`;
  };

  return (
    <a
      href={`/cars/${car._id}`}
      className="group flex flex-col rounded-2xl overflow-hidden bg-white border border-[#E8E3DC] transition-all hover:shadow-lg hover:border-[#DED9D1]"
      style={{ textDecoration: 'none' }}
      aria-label={`${car.year} ${car.make} ${car.model}`}
    >
      {/* Thumbnail Section */}
      <div
        className="relative flex items-center justify-center overflow-hidden bg-[#0D0B12]"
        style={{ height: '110px' }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={`${car.year} ${car.make} ${car.model}`}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="text-center w-full h-full flex flex-col items-center justify-center bg-linear-to-br from-[#F2EEE9] to-[#EAE5DD]">
            <span className="text-2xl mb-1" aria-hidden="true">
              🚗
            </span>
            <p className="text-[0.62rem] font-bold text-[#8A8390] font-dm-sans uppercase">
              {car.year} · {car.fuel}
            </p>
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="p-3">
        <h4 className="text-[0.82rem] font-extrabold tracking-tight text-[#1A1523] font-syne truncate leading-snug">
          {car.year} {car.make} {car.model}
          {car.variant && <span className="font-medium opacity-60"> {car.variant}</span>}
        </h4>
        <p className="text-[0.7rem] text-[#8A8390] font-dm-sans mt-0.5">
          {car.city} · {car.mileage ? `${(car.mileage / 1000).toFixed(0)}k km` : 'N/A'}
        </p>
        <p className="text-[0.95rem] font-black text-[#E8622A] font-syne mt-1.5">
          {formatPrice(car.price)}
        </p>
      </div>
    </a>
  );
}

/**
 * SimilarSkeleton Component
 */
export function SimilarSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden border border-[#E8E3DC] animate-pulse bg-white">
      <div className="h-27.5 bg-[#F2EEE9]" />
      <div className="p-3 space-y-2">
        <div className="h-3.5 w-4/5 bg-[#F2EEE9] rounded-md" />
        <div className="h-2.5 w-3/5 bg-[#F2EEE9] rounded-md" />
        <div className="h-4 w-1/2 bg-[#F2EEE9] rounded-md mt-1" />
      </div>
    </div>
  );
}
