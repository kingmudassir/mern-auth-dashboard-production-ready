import React from 'react';
import { MapPin, Eye, Heart, Clock, AlertCircle, XCircle, Edit2 } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ActionMenu from './ActionMenu';

// Configuration for card header gradients
const BG_PAIRS = [
  ['#E0C3FC', '#8EC5FC'],
  ['#F093FB', '#F5576C'],
  ['#43E97B', '#38F9D7'],
  ['#FA709A', '#FEE140'],
  ['#667EEA', '#764BA2'],
];

/**
 * Utility: Format price to currency string
 */
const fmtPrice = (price) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Utility: Format mileage
 */
const fmtKm = (km) => {
  if (!km) return '0 km';
  return `${(km / 1000).toFixed(0)}k km`;
};

const GridCard = ({ ad, onDelete, onPatch }) => {
  const idNumeric = parseInt(ad.id.slice(-6), 16) || 0;
  const bg = BG_PAIRS[idNumeric % BG_PAIRS.length];
  const isDark = idNumeric % 2 === 0;

  return (
    <article
      className="upa-grid-card rounded-2xl overflow-hidden flex flex-col bg-white"
      style={{
        opacity: ad.status === 'rejected' ? 0.72 : 1,
        border: '1.5px solid #E8E3DC',
      }}
      aria-label={`${ad.year} ${ad.make} ${ad.model}`}
    >
      {/* Header / Image Area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          height: '152px',
          background:
            ad.images?.length > 0 ? '#F2EEE9' : `linear-gradient(135deg, ${bg[0]}, ${bg[1]})`,
        }}
      >
        {/* Actual Car Image */}
        {ad.images?.length > 0 ? (
          <img
            src={ad.images[0].url}
            alt={`${ad.year} ${ad.make}`}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
        ) : (
          /* Fallback Emoji Placeholder */
          <div className="text-center select-none pointer-events-none">
            <div style={{ fontSize: '2.8rem' }} aria-hidden="true">
              🚗
            </div>
            <p
              className="text-[0.63rem] mt-0.5"
              style={{
                color: isDark ? 'rgba(255,255,255,0.6)' : '#666',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {ad.year} · {ad.color}
            </p>
          </div>
        )}

        {/* Badges and Menus remain on top */}
        {ad.featured && (
          <span
            className="absolute top-2.5 left-2.5 text-[0.58rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full z-10"
            style={{ background: '#C9A84C', color: '#1A1523' }}
          >
            Featured
          </span>
        )}

        <div className="absolute top-2.5 right-2.5 z-20">
          <ActionMenu ad={ad} onDelete={onDelete} onPatch={onPatch} />
        </div>
      </div>

      {/* Body Content */}
      <div className="flex-1 p-4 flex flex-col gap-2.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <a href={`/cars/${ad.id}`} className="no-underline">
              <h3
                className="text-[0.88rem] font-extrabold tracking-[-0.025em] leading-tight hover:text-[#6C3CE1] transition-colors duration-150 truncate"
                style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
              >
                {ad.year} {ad.make} {ad.model}
              </h3>
            </a>
            <p
              className="text-[0.68rem] mt-0.5 truncate"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {ad.variant}
            </p>
          </div>
          <StatusBadge status={ad.status} />
        </div>

        {/* Location */}
        <div className="flex items-center gap-1">
          <MapPin size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
          <span
            className="text-[0.7rem]"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            {ad.city}
          </span>
        </div>

        {/* Specs */}
        <div className="flex flex-wrap gap-1">
          {[ad.fuel, fmtKm(ad.mileage)].map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 rounded-full text-[0.64rem] font-medium"
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

        {/* Conditional Status Footers */}
        {(ad.status === 'active' || ad.status === 'expired') && (
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: '#F7F4F0' }}
          >
            <span className="flex items-center gap-1 text-[0.66rem]" style={{ color: '#8A8390' }}>
              <Eye size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} />{' '}
              {ad.views?.toLocaleString() || 0}
            </span>
            <span className="flex items-center gap-1 text-[0.66rem]" style={{ color: '#8A8390' }}>
              <Heart size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} /> {ad.saves || 0}
            </span>
            {ad.expiresIn && (
              <span
                className="flex items-center gap-1 text-[0.66rem] ml-auto"
                style={{ color: '#8A8390' }}
              >
                <Clock size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} /> {ad.expiresIn}
              </span>
            )}
          </div>
        )}

        {ad.status === 'pending' && (
          <div
            className="flex items-start gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.2)' }}
          >
            <AlertCircle
              size={11}
              strokeWidth={2}
              style={{ color: '#a16207', flexShrink: 0, marginTop: '2px' }}
            />
            <p className="text-[0.64rem]" style={{ color: '#a16207' }}>
              Under review · usually 2–4 hours
            </p>
          </div>
        )}

        {ad.status === 'rejected' && (
          <div
            className="flex items-start gap-1.5 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}
          >
            <XCircle
              size={11}
              strokeWidth={2}
              style={{ color: '#dc2626', flexShrink: 0, marginTop: '2px' }}
            />
            <p className="text-[0.64rem]" style={{ color: '#dc2626' }}>
              Rejected — edit and repost
            </p>
          </div>
        )}

        {/* Footer: Price & Edit Button */}
        <div
          className="flex items-center justify-between mt-auto pt-2.5"
          style={{ borderTop: '1px solid #F2EEE9' }}
        >
          <p
            className="text-[1rem] font-extrabold tracking-[-0.03em]"
            style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
          >
            {fmtPrice(ad.price)}
          </p>
          <a
            href={`/edit-ad/${ad.id}`}
            className="inline-flex items-center gap-1 text-[0.7rem] font-semibold px-2.5 py-1.5 rounded-lg no-underline hover:bg-[#6C3CE1] hover:text-white transition-all duration-150"
            style={{
              color: '#6C3CE1',
              background: 'rgba(108,60,225,0.08)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Edit2 size={11} strokeWidth={2} /> Edit
          </a>
        </div>
      </div>
    </article>
  );
};

export default GridCard;
