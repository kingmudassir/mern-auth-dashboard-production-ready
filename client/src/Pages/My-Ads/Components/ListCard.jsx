import { MapPin, Clock, Eye, Heart, Edit2, AlertCircle, XCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';
import ActionMenu from './ActionMenu';

const BG_PAIRS = [
  ['#E0C3FC', '#8EC5FC'],
  ['#F093FB', '#F5576C'],
  ['#43E97B', '#38F9D7'],
  ['#FA709A', '#FEE140'],
  ['#667EEA', '#764BA2'],
];

/**
 * Utility: Format price using Pakistani grouping (Lakh/Crore)
 * without the "Rs" prefix.
 */
const fmtPrice = (price) => {
  return new Intl.NumberFormat('en-PK', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(price);
};

const fmtKm = (km) => {
  if (!km) return '0 km';
  return `${new Intl.NumberFormat('en-PK').format(km)} km`;
};

const ListCard = ({ ad, onDelete, onPatch }) => {
  const bg = BG_PAIRS[ad.id % BG_PAIRS.length];
  const isDark = ad.id % 2 === 0;

  return (
    <article
      className="upa-list-card rounded-2xl overflow-hidden flex bg-white"
      style={{
        opacity: ad.status === 'rejected' ? 0.72 : 1,
        border: '1.5px solid #E8E3DC',
      }}
      aria-label={`${ad.year} ${ad.make} ${ad.model}`}
    >
      {/* Thumbnail */}
      <a
        href={`/cars/${ad.id}`}
        className="shrink-0 flex items-center justify-center no-underline"
        style={{ width: '172px', background: `linear-gradient(135deg,${bg[0]},${bg[1]})` }}
        aria-label={`View ${ad.make} ${ad.model}`}
      >
        <div className="text-center select-none">
          <div style={{ fontSize: '2.3rem' }} aria-hidden="true">
            🚗
          </div>
          <p
            className="text-[0.62rem] mt-0.5"
            style={{
              color: isDark ? 'rgba(255,255,255,0.6)' : '#666',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {ad.color}
          </p>
        </div>
      </a>

      {/* Body */}
      <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
        <div>
          {/* Top row */}
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div className="min-w-0">
              <a href={`/cars/${ad.id}`} className="no-underline">
                <h3
                  className="text-[0.92rem] font-extrabold tracking-[-0.025em] leading-tight hover:text-[#6C3CE1] transition-colors duration-150"
                  style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                >
                  {ad.year} {ad.make} {ad.model}
                  {ad.featured && (
                    <span
                      className="ml-2 align-middle text-[0.55rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                      style={{ background: '#C9A84C', color: '#1A1523' }}
                    >
                      Featured
                    </span>
                  )}
                </h3>
              </a>
              <p
                className="text-[0.7rem] mt-0.5 truncate"
                style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
              >
                {ad.variant}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <StatusBadge status={ad.status} />
              <ActionMenu ad={ad} onDelete={onDelete} onPatch={onPatch} />
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-2.5 flex-wrap">
            <span
              className="flex items-center gap-1 text-[0.7rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              <MapPin size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} />
              {ad.city}
            </span>
            <span
              className="flex items-center gap-1 text-[0.7rem]"
              style={{ color: '#B0AABA', fontFamily: "'DM Sans', sans-serif" }}
            >
              <Clock size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} />
              {ad.postedAt}
            </span>
          </div>

          {/* Spec pills */}
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {[ad.fuel, fmtKm(ad.mileage), ad.transmission].map((v) => (
              <span
                key={v}
                className="px-2.5 py-0.5 rounded-full text-[0.66rem] font-medium"
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

          {/* Notices */}
          {ad.status === 'pending' && (
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl mb-2"
              style={{
                background: 'rgba(234,179,8,0.07)',
                border: '1px solid rgba(234,179,8,0.2)',
              }}
            >
              <AlertCircle size={12} strokeWidth={2} style={{ color: '#a16207' }} />
              <p className="text-[0.7rem]" style={{ color: '#a16207' }}>
                Under review · usually 2–4 hours
              </p>
            </div>
          )}
          {ad.status === 'rejected' && (
            <div
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl mb-2"
              style={{
                background: 'rgba(239,68,68,0.07)',
                border: '1px solid rgba(239,68,68,0.2)',
              }}
            >
              <XCircle size={12} strokeWidth={2} style={{ color: '#dc2626' }} />
              <p className="text-[0.7rem]" style={{ color: '#dc2626' }}>
                Rejected — edit and repost to make it live
              </p>
            </div>
          )}
        </div>

        {/* Bottom row */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: '1px solid #F7F4F0' }}
        >
          <p
            className="text-[1.1rem] font-extrabold tracking-[-0.03em]"
            style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
          >
            {fmtPrice(ad.price)}
            <span className="text-[0.68rem] font-normal ml-1" style={{ color: '#8A8390' }}>
              PKR
            </span>
          </p>
          <div className="flex items-center gap-3">
            {(ad.status === 'active' || ad.status === 'expired') && (
              <>
                <span
                  className="flex items-center gap-1.5 text-[0.7rem]"
                  style={{ color: '#8A8390' }}
                >
                  <Eye size={12} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                  {ad.views?.toLocaleString() || 0} views
                </span>
                <span
                  className="flex items-center gap-1.5 text-[0.7rem]"
                  style={{ color: '#8A8390' }}
                >
                  <Heart size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                  {ad.saves || 0} saves
                </span>
              </>
            )}
            <a
              href={`/edit-ad/${ad.id}`}
              className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold px-3.5 py-1.5 rounded-xl no-underline transition-all duration-150 hover:-translate-y-px"
              style={{
                color: '#fff',
                background: 'linear-gradient(135deg,#6C3CE1,#5A2FCA)',
                boxShadow: '0 2px 8px rgba(108,60,225,0.25)',
                fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label={`Edit ${ad.make} ${ad.model}`}
            >
              <Edit2 size={12} strokeWidth={2} /> Edit Ad
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ListCard;
