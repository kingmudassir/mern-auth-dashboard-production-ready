// src/components/Marketplace/Components/CarCard.jsx
import { MapPin, Fuel, Gauge, Calendar, Heart, ArrowUpDown } from 'lucide-react';
import { useToggleSave } from '../../../Hooks/Saved-Ads/useToggleSave';
import { useGetSavedAds } from '../../../Hooks/Saved-Ads/useGetSavedAds';
import { useUser } from '../../../Hooks/useUser';

// ── Format helpers ─────────────────────────────────────────────────────────
const fmtPrice = (n) => {
  if (!n) return 'PKR 0';
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(0)} Lac`;
  return `PKR ${n.toLocaleString()}`;
};

const fmtMileage = (n) => (!n || n === 0 ? '0 km' : `${Number(n).toLocaleString()} km`);

// ── CarCard Component ──────────────────────────────────────────────────────
export default function CarCard({ car, view = 'grid' }) {
  const { data: user } = useUser();
  const { data: savedAds = [] } = useGetSavedAds();
  const { mutate: toggleSave, isPending } = useToggleSave();

  // Source of truth for saved state:
  // 1. Check the live saved-ads cache first (post-toggle, this is always fresh).
  // 2. Fall back to car.isSaved from the server (populated by optionalAuth on GET /cars).
  // This dual-check ensures the heart is correct both on first load AND after toggling.
  const isSaved = user
    ? savedAds.some((s) => (s._id ?? s.id) === car._id) || car.isSaved === true
    : false;

  const handleToggle = (e) => {
    e.preventDefault(); // prevent navigating if card is wrapped in <a>
    e.stopPropagation();
    if (!user) {
      window.location.href = '/login';
      return;
    }
    if (isPending) return;
    toggleSave(car._id);
  };

  const heartStyle = {
    color: isSaved ? '#E8622A' : '#C4BDD0',
    fill: isSaved ? '#E8622A' : 'none',
    transition: 'color 0.15s, fill 0.15s',
  };

  const thumbUrl = car.images?.[0]?.url;

  // ── LIST VIEW ───────────────────────────────────────────────────────────
  if (view === 'list') {
    return (
      <div className="car-card-list rounded-2xl overflow-hidden flex border border-[#F2EEE9] hover:border-[#E8622A]/10 transition-colors">
        {/* Image / Thumbnail */}
        <div
          className="shrink-0 flex items-center justify-center relative"
          style={{
            width: '220px',
            background: thumbUrl ? 'none' : 'linear-gradient(135deg, #F2EEE9 0%, #EAE5DD 100%)',
            overflow: 'hidden',
          }}
        >
          {thumbUrl ? (
            <img
              src={thumbUrl}
              alt={`${car.year} ${car.make} ${car.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem' }} aria-hidden="true">
                🚗
              </div>
              <p
                className="text-[0.7rem] font-semibold mt-1"
                style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
              >
                {car.year} · {car.color}
              </p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            {/* Title + Location + Heart */}
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3
                  className="text-[1rem] font-extrabold tracking-[-0.025em] leading-tight"
                  style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                >
                  {car.make} {car.model}
                  {car.variant ? ` ${car.variant}` : ''}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin
                    size={11}
                    strokeWidth={2}
                    style={{ color: '#C4BDD0' }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.75rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {car.city}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggle}
                disabled={isPending}
                className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ background: isSaved ? 'rgba(232,98,42,0.1)' : '#F7F4F0' }}
                aria-label={isSaved ? 'Remove from saved' : 'Save this ad'}
              >
                <Heart size={14} strokeWidth={2} style={heartStyle} />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { icon: Calendar, val: car.year },
                { icon: Fuel, val: car.fuel },
                { icon: Gauge, val: fmtMileage(car.mileage) },
                { icon: ArrowUpDown, val: car.transmission },
              ].map(({ icon: Icon, val }) => (
                <span
                  key={val}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-medium"
                  style={{
                    background: '#F2EEE9',
                    color: '#8A8390',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Icon size={11} strokeWidth={2} aria-hidden="true" />
                  {val}
                </span>
              ))}

              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-medium"
                style={{
                  background:
                    car.condition === 'New' ? 'rgba(34,197,94,0.1)' : 'rgba(108,60,225,0.08)',
                  color: car.condition === 'New' ? '#16a34a' : '#6C3CE1',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {car.condition}
              </span>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between">
            <p
              className="text-[1.35rem] font-extrabold tracking-[-0.03em]"
              style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
            >
              {fmtPrice(car.price)}
              {car.negotiable && (
                <span
                  className="text-[0.65rem] font-semibold ml-2"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Negotiable
                </span>
              )}
            </p>

            <a
              href={`/cars/${car._id}`}
              className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white px-4 py-2 rounded-xl transition-transform duration-150 hover:-translate-y-px active:scale-95"
              style={{
                background: 'linear-gradient(135deg, #6C3CE1 0%, #5A2FCA 100%)',
                boxShadow: '0 2px 8px rgba(108,60,225,0.25)',
                textDecoration: 'none',
              }}
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    );
  }

  // ── GRID VIEW (default) ─────────────────────────────────────────────────
  return (
    <div className="car-card-grid rounded-2xl overflow-hidden flex flex-col border border-[#F2EEE9] hover:border-[#E8622A]/10 transition-colors h-full">
      {/* Image / Thumbnail */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: '160px',
          background: thumbUrl ? 'none' : 'linear-gradient(135deg, #F2EEE9 0%, #EAE5DD 100%)',
          overflow: 'hidden',
        }}
      >
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt={`${car.year} ${car.make} ${car.model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.8rem' }} aria-hidden="true">
              🚗
            </div>
            <p
              className="text-[0.68rem]"
              style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
            >
              {car.year} · {car.color}
            </p>
          </div>
        )}

        {/* Heart button (floating) */}
        <button
          type="button"
          onClick={handleToggle}
          disabled={isPending}
          className="absolute top-3 right-3 w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-150 hover:scale-110 disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: 'rgba(255,255,255,0.9)', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
          aria-label={isSaved ? 'Remove from saved' : 'Save this ad'}
        >
          <Heart size={13} strokeWidth={2} style={heartStyle} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        {/* Title + City */}
        <div>
          <h3
            className="text-[0.92rem] font-extrabold tracking-[-0.025em] leading-tight mb-0.5"
            style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
          >
            {car.make} {car.model}
            {car.variant ? ` ${car.variant}` : ''}
          </h3>
          <div className="flex items-center gap-1">
            <MapPin size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
            <span
              className="text-[0.72rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {car.city}
            </span>
          </div>
        </div>

        {/* Feature tags */}
        <div className="flex flex-wrap gap-1.5">
          {[car.year, car.fuel, fmtMileage(car.mileage), car.transmission].map((v, i) => (
            <span
              key={`${v}-${i}`}
              className="px-2 py-0.5 rounded-full text-[0.68rem] font-medium"
              style={{
                background: '#F2EEE9',
                color: '#8A8390',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {v}
            </span>
          ))}
        </div>

        {/* Price + View link */}
        <div
          className="flex items-center justify-between mt-auto pt-2"
          style={{ borderTop: '1px solid #F2EEE9' }}
        >
          <div>
            <p
              className="text-[1.05rem] font-extrabold tracking-[-0.03em]"
              style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
            >
              {fmtPrice(car.price)}
            </p>
            {car.negotiable && (
              <p
                className="text-[0.62rem] mt-px"
                style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
              >
                Negotiable
              </p>
            )}
          </div>

          <a
            href={`/cars/${car._id}`}
            className="text-[0.72rem] font-semibold px-3 py-1.5 rounded-lg transition-[background-color,color] duration-150 hover:bg-[rgba(108,60,225,0.1)] active:scale-95"
            style={{
              color: '#6C3CE1',
              textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            View →
          </a>
        </div>
      </div>
    </div>
  );
}
