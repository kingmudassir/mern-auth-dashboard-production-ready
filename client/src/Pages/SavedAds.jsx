import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  MapPin,
  Fuel,
  Gauge,
  ArrowUpDown,
  Trash2,
  Search,
  X,
  SlidersHorizontal,
  ArrowRight,
  CheckSquare,
  LayoutGrid,
  List,
  Clock,
} from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { useGetSavedAds } from '../Hooks/Saved-Ads/useGetSavedAds';
import { useToggleSave } from '../Hooks/Saved-Ads/useToggleSave';

const SORT_OPTIONS = [
  { value: 'newest-saved', label: 'Recently Saved' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'year-desc', label: 'Newest Year' },
  { value: 'mileage-asc', label: 'Lowest Mileage' },
];

// ── Helpers ───────────────────────────────────────────────────────
const fmtPrice = (n) => {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  return `${(n / 100000).toFixed(0)} Lac`;
};

const fmtMileage = (n) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k km` : `${n} km`);

// ── Car card ──────────────────────────────────────────────────────
const BG_PAIRS = [
  ['#1A1523', '#231930'],
  ['#F2EEE9', '#EAE5DD'],
  ['#1F1A2E', '#2D2440'],
  ['#F7F4F0', '#EDE8E2'],
  ['#231930', '#1A1523'],
  ['#EDE8E2', '#E8E3DC'],
];

function SavedCard({ ad, view, selected, onSelect, onUnsave }) {
  // ad.id is the normalized mongo _id string (set in useGetSavedAds select transform)
  const bgIdx = ad._id ? ad._id.charCodeAt(ad._id.length - 1) % BG_PAIRS.length : 0;
  const bg = BG_PAIRS[bgIdx];
  const isDark = bgIdx % 2 === 0;
  const thumb = ad.images?.[0]?.url;

  if (view === 'list') {
    return (
      <div
        className={`sa-card-list rounded-2xl overflow-hidden flex transition-all duration-150 ${selected ? 'sa-card-selected' : ''}`}
      >
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onSelect(ad._id)}
          className="flex items-center justify-center shrink-0 px-4 transition-colors duration-150"
          style={{
            background: selected ? 'rgba(108,60,225,0.05)' : 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label={selected ? 'Deselect' : 'Select'}
          aria-pressed={selected}
        >
          <div
            className="w-4.5 h-4.5 rounded-md flex items-center justify-center transition-[background,border] duration-150"
            style={{
              width: '18px',
              height: '18px',
              borderRadius: '5px',
              border: selected ? 'none' : '1.5px solid #C4BDD0',
              background: selected ? '#6C3CE1' : 'transparent',
            }}
            aria-hidden="true"
          >
            {selected && (
              <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                <path
                  d="M1 4l2.5 2.5L9 1"
                  stroke="white"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>
        </button>

        {/* Image */}
        <Link
          to={`/cars/${ad?._id}`}
          className="shrink-0 flex items-center justify-center relative overflow-hidden"
          style={{
            width: '180px',

            background: thumb ? '#0D0B12' : `linear-gradient(135deg, ${bg[0]}, ${bg[1]})`,
          }}
          aria-label={`View ${ad.year} ${ad.make} ${ad.model}`}
        >
          {thumb ? (
            <img
              src={thumb}
              alt={`${ad.year} ${ad.make} ${ad.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="text-center select-none">
              <div style={{ fontSize: '2.2rem' }} aria-hidden="true">
                🚗
              </div>
              <p
                className="text-[0.65rem] mt-0.5"
                style={{
                  color: isDark ? 'rgba(255,255,255,0.3)' : '#C4BDD0',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {ad.color}
              </p>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex-1 flex flex-col justify-between p-4 min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <a
                href={`/cars/${ad._id}`}
                className="no-underline"
                aria-label={`${ad.year} ${ad.make} ${ad.model}`}
              >
                <h3
                  className="text-[0.92rem] font-extrabold tracking-[-0.025em] leading-tight hover:text-[#6C3CE1] transition-colors duration-150"
                  style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                >
                  {ad.year} {ad.make} {ad.model}
                </h3>
              </a>
              <button
                type="button"
                onClick={() => onUnsave(ad._id)}
                className="shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
                style={{ background: 'rgba(232,98,42,0.08)' }}
                aria-label="Remove from saved"
              >
                <Heart
                  size={13}
                  strokeWidth={2}
                  style={{ color: '#E8622A', fill: '#E8622A' }}
                  aria-hidden="true"
                />
              </button>
            </div>

            <div className="flex items-center gap-1.5 mb-3">
              <MapPin size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
              <span
                className="text-[0.72rem]"
                style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
              >
                {ad.city}
              </span>
              <span style={{ color: '#E8E3DC' }}>·</span>
              <Clock size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
              <span
                className="text-[0.72rem]"
                style={{ color: '#B0AABA', fontFamily: "'DM Sans', sans-serif" }}
              >
                Saved {ad.savedAt}
              </span>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[ad.fuel, fmtMileage(ad.mileage), ad.transmission].filter(Boolean).map((v) => (
                <span
                  key={v}
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
          </div>

          <div
            className="flex items-center justify-between mt-3 pt-3"
            style={{ borderTop: '1px solid #F7F4F0' }}
          >
            <p
              className="text-[1.1rem] font-extrabold tracking-[-0.03em]"
              style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
            >
              {fmtPrice(ad.price)}
              <span className="text-[0.7rem] font-medium ml-1" style={{ color: '#8A8390' }}>
                PKR
              </span>
            </p>
            <a
              href={`/cars/${ad._id}`}
              className="flex items-center gap-1.5 text-[0.75rem] font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-150 hover:-translate-y-px no-underline"
              style={{
                color: '#fff',
                background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
                boxShadow: '0 2px 8px rgba(108,60,225,0.25)',
                fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label={`View details for ${ad.year} ${ad.make} ${ad.model}`}
            >
              View
              <ArrowRight size={12} strokeWidth={2.5} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div
      className={`sa-card-grid rounded-2xl overflow-hidden flex flex-col ${selected ? 'sa-card-selected' : ''}`}
    >
      <div
        className="relative"
        style={{
          height: '150px',
          background: thumb ? '#0D0B12' : `linear-gradient(135deg, ${bg[0]}, ${bg[1]})`,
        }}
      >
        <button
          type="button"
          onClick={() => onSelect(ad._id)}
          className="absolute top-2.5 left-2.5 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-150 z-10"
          style={{
            background: selected ? '#6C3CE1' : 'rgba(255,255,255,0.85)',
            border: selected ? 'none' : '1.5px solid rgba(255,255,255,0.5)',
          }}
          aria-label={selected ? 'Deselect' : 'Select'}
          aria-pressed={selected}
        >
          {selected && (
            <svg width="9" height="7" viewBox="0 0 10 8" fill="none" aria-hidden="true">
              <path
                d="M1 4l2.5 2.5L9 1"
                stroke="white"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => onUnsave(ad._id)}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-xl flex items-center justify-center transition-colors duration-150 z-10"
          style={{ background: 'rgba(255,255,255,0.9)' }}
          aria-label="Remove from saved"
        >
          <Heart
            size={13}
            strokeWidth={2}
            style={{ color: '#E8622A', fill: '#E8622A' }}
            aria-hidden="true"
          />
        </button>

        <a
          href={`/cars/${ad._id}`}
          className="absolute inset-0 flex items-center justify-center"
          aria-label={`View ${ad.year} ${ad.make} ${ad.model}`}
        >
          {thumb ? (
            <img
              src={thumb}
              alt={`${ad.year} ${ad.make} ${ad.model}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <div className="text-center select-none pointer-events-none">
              <div style={{ fontSize: '2.8rem' }} aria-hidden="true">
                🚗
              </div>
              <p
                className="text-[0.65rem]"
                style={{
                  color: isDark ? 'rgba(255,255,255,0.3)' : '#C4BDD0',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {ad.year} · {ad.color}
              </p>
            </div>
          )}
        </a>
      </div>

      <div className="flex-1 p-4 flex flex-col gap-2.5">
        <div>
          <a href={`/cars/${ad._id}`} className="no-underline">
            <h3
              className="text-[0.88rem] font-extrabold tracking-[-0.025em] leading-tight hover:text-[#6C3CE1] transition-colors duration-150"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              {ad.year} {ad.make} {ad.model}
            </h3>
          </a>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
            <span
              className="text-[0.7rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {ad.city}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {[ad.fuel, fmtMileage(ad.mileage)].filter(Boolean).map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 rounded-full text-[0.65rem] font-medium"
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

        <div
          className="flex items-center justify-between mt-auto pt-2.5"
          style={{ borderTop: '1px solid #F7F4F0' }}
        >
          <p
            className="text-[1rem] font-extrabold tracking-[-0.03em]"
            style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
          >
            {fmtPrice(ad.price)}
          </p>
          <span
            className="text-[0.65rem]"
            style={{ color: '#B0AABA', fontFamily: "'DM Sans', sans-serif" }}
          >
            {ad.savedAt}
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────
function EmptyState({ isFiltered, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-5"
        style={{ background: 'rgba(232,98,42,0.07)' }}
        aria-hidden="true"
      >
        <Heart size={32} strokeWidth={1.5} style={{ color: '#E8622A', opacity: 0.5 }} />
      </div>
      <h2
        className="text-[1.2rem] font-extrabold tracking-[-0.03em] mb-2"
        style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
      >
        {isFiltered ? 'No matches found' : 'No saved ads yet'}
      </h2>
      <p
        className="text-[0.875rem] max-w-xs leading-relaxed mb-7"
        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
      >
        {isFiltered
          ? 'Try adjusting your search or sort options.'
          : 'Tap the heart on any listing to save it here for easy access later.'}
      </p>
      {isFiltered ? (
        <button
          type="button"
          onClick={onClear}
          className="text-[0.82rem] font-semibold px-5 py-2.5 rounded-xl border transition-colors duration-150"
          style={{
            color: '#6C3CE1',
            borderColor: 'rgba(108,60,225,0.28)',
            background: 'rgba(108,60,225,0.05)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Clear search
        </button>
      ) : (
        <a
          href="/cars"
          className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-white px-6 py-3 rounded-xl transition-transform duration-150 hover:-translate-y-px no-underline"
          style={{
            background: 'linear-gradient(135deg, #E8622A, #C4531F)',
            boxShadow: '0 2px 12px rgba(232,98,42,0.3)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Browse Cars
          <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function SavedAds() {
  const { data: ads = [], isLoading } = useGetSavedAds();
  const { mutate: toggleSave } = useToggleSave();

  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest-saved');
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState(new Set());
  const [confirmClear, setConfirmClear] = useState(false);

  // Unsave single — optimistic via useToggleSave's onSuccess
  const handleUnsave = (id) => {
    toggleSave(id);
    setSelected((p) => {
      const n = new Set(p);
      n.delete(id);
      return n;
    });
  };

  // Unsave selected — fire one mutation per id
  const handleUnsaveSelected = () => {
    selected.forEach((id) => toggleSave(id));
    setSelected(new Set());
  };

  // Clear all
  const handleClearAll = () => {
    ads.forEach((ad) => toggleSave(ad._id));
    setSelected(new Set());
    setConfirmClear(false);
  };

  const handleSelect = (id) => {
    setSelected((p) => {
      const n = new Set(p);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const handleSelectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((a) => a._id)));
    }
  };

  const filtered = useMemo(() => {
    let result = [...ads];
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        `${a.make} ${a.model} ${a.year} ${a.city} ${a.fuel}`.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'year-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'mileage-asc':
        result.sort((a, b) => a.mileage - b.mileage);
        break;
      default:
        break;
    }
    return result;
  }, [ads, search, sortBy]);

  const allSelected = filtered.length > 0 && selected.size === filtered.length;
  const someSelected = selected.size > 0;
  const isFiltered = !!search.trim();

  if (isLoading) {
    return (
      <div className="sa-page">
        <div className="sa-inner">
          <div className="sa-grid">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="sa-card-grid rounded-2xl overflow-hidden animate-pulse">
                <div style={{ height: '150px', background: '#F2EEE9' }} />
                <div className="p-4 flex flex-col gap-2">
                  <div
                    style={{
                      height: '14px',
                      width: '80%',
                      background: '#F2EEE9',
                      borderRadius: '6px',
                    }}
                  />
                  <div
                    style={{
                      height: '11px',
                      width: '55%',
                      background: '#F2EEE9',
                      borderRadius: '6px',
                    }}
                  />
                  <div
                    style={{
                      height: '16px',
                      width: '45%',
                      background: '#F2EEE9',
                      borderRadius: '6px',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      {/* Clear all confirm modal */}
      {confirmClear && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm clear all saved ads"
        >
          <div
            className="bg-white rounded-2xl p-7 w-full max-w-sm"
            style={{ border: '1.5px solid #E8E3DC', boxShadow: '0 20px 60px rgba(26,21,35,0.18)' }}
          >
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(232,98,42,0.1)' }}
              aria-hidden="true"
            >
              <Trash2 size={18} strokeWidth={2} style={{ color: '#E8622A' }} />
            </div>
            <h3
              className="text-[1rem] font-extrabold mb-1.5 tracking-[-0.025em]"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Clear all saved ads?
            </h3>
            <p
              className="text-[0.8rem] leading-relaxed mb-5"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              This will remove all {ads.length} saved ads. You can always save them again from the
              listings.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setConfirmClear(false)}
                className="flex-1 text-[0.82rem] font-medium py-2.5 rounded-xl border transition-colors duration-150"
                style={{
                  color: '#8A8390',
                  borderColor: '#E8E3DC',
                  background: 'transparent',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl"
                style={{
                  background: 'linear-gradient(135deg, #E8622A, #C4531F)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="sa-page">
        <div className="sa-inner">
          {/* ── Page header ── */}
          <div className="flex items-start justify-between gap-4 mb-7 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Heart
                  size={18}
                  strokeWidth={2}
                  style={{ color: '#E8622A', fill: '#E8622A' }}
                  aria-hidden="true"
                />
                <p
                  className="text-[0.72rem] font-bold uppercase tracking-[0.1em]"
                  style={{ color: '#E8622A', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Your Wishlist
                </p>
              </div>
              <h1
                className="text-[1.9rem] font-extrabold tracking-[-0.04em] leading-tight"
                style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
              >
                Saved Ads
              </h1>
              <p
                className="text-[0.82rem] mt-1"
                style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
              >
                {ads.length === 0
                  ? 'No saved ads'
                  : `${ads.length} saved listing${ads.length !== 1 ? 's' : ''}`}
              </p>
            </div>

            {ads.length > 0 && (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="flex items-center gap-2 text-[0.78rem] font-medium px-4 py-2 rounded-xl border transition-colors duration-150 self-start"
                style={{
                  color: '#8A8390',
                  borderColor: '#E8E3DC',
                  background: '#FFFFFF',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                aria-label="Clear all saved ads"
              >
                <Trash2 size={13} strokeWidth={2} aria-hidden="true" />
                Clear All
              </button>
            )}
          </div>

          {ads.length > 0 && (
            <>
              {/* ── Controls bar ── */}
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <div className="sa-search-wrap">
                  <Search size={14} strokeWidth={2} className="sa-search-icon" aria-hidden="true" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search saved ads…"
                    className="sa-search-input"
                    aria-label="Search saved ads"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch('')}
                      className="sa-search-clear"
                      aria-label="Clear search"
                    >
                      <X size={13} strokeWidth={2.5} />
                    </button>
                  )}
                </div>

                <div className="relative sa-sort-wrap">
                  <ArrowUpDown
                    size={13}
                    strokeWidth={2}
                    className="sa-sort-icon"
                    aria-hidden="true"
                  />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sa-sort-select"
                    aria-label="Sort by"
                  >
                    {SORT_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div
                  className="flex items-center border rounded-xl overflow-hidden ml-auto"
                  style={{ borderColor: '#E8E3DC' }}
                >
                  {[
                    { id: 'grid', Icon: LayoutGrid },
                    { id: 'list', Icon: List },
                  ].map(({ id, Icon }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setView(id)}
                      className="w-9 h-9 flex items-center justify-center transition-colors duration-150"
                      style={{
                        background: view === id ? '#6C3CE1' : '#FFFFFF',
                        color: view === id ? '#FFFFFF' : '#8A8390',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      aria-label={`${id} view`}
                      aria-pressed={view === id}
                    >
                      <Icon size={14} strokeWidth={2} aria-hidden="true" />
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Bulk select bar ── */}
              <div className="flex items-center gap-3 mb-5">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-[0.78rem] font-medium transition-colors duration-150"
                  style={{
                    color: '#8A8390',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                  aria-label={allSelected ? 'Deselect all' : 'Select all'}
                >
                  <div
                    className="w-4 h-4 rounded-[4px] flex items-center justify-center transition-[background,border] duration-150"
                    style={{
                      border: allSelected ? 'none' : '1.5px solid #C4BDD0',
                      background: allSelected ? '#6C3CE1' : 'transparent',
                    }}
                    aria-hidden="true"
                  >
                    {allSelected && (
                      <svg width="8" height="7" viewBox="0 0 10 8" fill="none">
                        <path
                          d="M1 4l2.5 2.5L9 1"
                          stroke="white"
                          strokeWidth="1.7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  {allSelected ? 'Deselect all' : 'Select all'}
                </button>

                {someSelected && (
                  <>
                    <span style={{ color: '#E8E3DC', fontSize: '12px' }}>|</span>
                    <span
                      className="text-[0.75rem] font-medium"
                      style={{ color: '#6C3CE1', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {selected.size} selected
                    </span>
                    <button
                      type="button"
                      onClick={handleUnsaveSelected}
                      className="flex items-center gap-1.5 text-[0.75rem] font-medium px-3 py-1.5 rounded-xl border transition-colors duration-150"
                      style={{
                        color: '#E8622A',
                        borderColor: 'rgba(232,98,42,0.25)',
                        background: 'rgba(232,98,42,0.05)',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                      aria-label={`Remove ${selected.size} selected ads from saved`}
                    >
                      <Trash2 size={12} strokeWidth={2} aria-hidden="true" />
                      Remove selected
                    </button>
                  </>
                )}

                <span
                  className="ml-auto text-[0.75rem]"
                  style={{ color: '#B0AABA', fontFamily: "'DM Sans', sans-serif" }}
                  aria-live="polite"
                >
                  {filtered.length !== ads.length
                    ? `${filtered.length} of ${ads.length}`
                    : `${ads.length} listing${ads.length !== 1 ? 's' : ''}`}
                </span>
              </div>
            </>
          )}

          {/* ── Grid / List ── */}
          {filtered.length === 0 ? (
            <EmptyState isFiltered={isFiltered} onClear={() => setSearch('')} />
          ) : view === 'grid' ? (
            <div className="sa-grid">
              {filtered.map((ad) => (
                <SavedCard
                  key={ad._id}
                  ad={ad}
                  view="grid"
                  selected={selected.has(ad._id)}
                  onSelect={handleSelect}
                  onUnsave={handleUnsave}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((ad) => (
                <SavedCard
                  key={ad._id}
                  ad={ad}
                  view="list"
                  selected={selected.has(ad._id)}
                  onSelect={handleSelect}
                  onUnsave={handleUnsave}
                />
              ))}
            </div>
          )}

          {/* ── Browse more CTA ── */}
          {ads.length > 0 && filtered.length > 0 && (
            <div
              className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: 'linear-gradient(135deg, #1A1523 0%, #231930 100%)',
                border: '1.5px solid rgba(255,255,255,0.06)',
              }}
            >
              <div>
                <p
                  className="text-[0.95rem] font-extrabold text-white tracking-[-0.02em]"
                  style={{ fontFamily: "'Syne', sans-serif" }}
                >
                  Looking for more options?
                </p>
                <p
                  className="text-[0.75rem] mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Browse thousands of verified listings across Pakistan.
                </p>
              </div>
              <a
                href="/cars"
                className="inline-flex items-center gap-2 text-white text-[0.85rem] font-semibold px-5 py-2.5 rounded-xl transition-transform duration-150 hover:-translate-y-px no-underline flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #E8622A, #C4531F)',
                  boxShadow: '0 2px 10px rgba(232,98,42,0.3)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Browse Marketplace
                <ArrowRight size={14} strokeWidth={2.2} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .sa-page {
    background: #F7F4F0;
    min-height: 100vh;
    padding-top: 66px;
  }

  .sa-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: 36px 24px 72px;
  }

  /* Grid */
  .sa-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    gap: 16px;
  }

  /* Cards */
  .sa-card-grid {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  }

  .sa-card-grid:hover {
    box-shadow: 0 6px 24px rgba(26,21,35,0.09);
    transform: translateY(-2px);
    border-color: rgba(108,60,225,0.18);
  }

  .sa-card-list {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .sa-card-list:hover {
    box-shadow: 0 4px 20px rgba(26,21,35,0.08);
    border-color: rgba(108,60,225,0.18);
  }

  .sa-card-selected {
    border-color: #6C3CE1 !important;
    box-shadow: 0 0 0 3px rgba(108,60,225,0.1) !important;
  }

  /* Search */
  .sa-search-wrap {
    position: relative;
    flex: 1;
    min-width: 180px;
    display: flex;
    align-items: center;
    height: 40px;
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 12px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .sa-search-wrap:focus-within {
    border-color: rgba(108,60,225,0.4);
    box-shadow: 0 0 0 3px rgba(108,60,225,0.07);
  }

  .sa-search-icon {
    position: absolute;
    left: 12px;
    color: #C4BDD0;
    pointer-events: none;
  }

  .sa-search-input {
    flex: 1;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.82rem;
    color: #1A1523;
    padding-left: 36px;
    padding-right: 32px;
    font-family: 'DM Sans', sans-serif;
  }

  .sa-search-input::placeholder { color: #C4BDD0; }

  .sa-search-clear {
    position: absolute;
    right: 10px;
    color: #C4BDD0;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    padding: 0;
    transition: color 0.15s ease;
  }
  .sa-search-clear:hover { color: #8A8390; }

  /* Sort */
  .sa-sort-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 12px;
    min-width: 160px;
    transition: border-color 0.2s ease;
  }

  .sa-sort-wrap:focus-within { border-color: rgba(108,60,225,0.4); }

  .sa-sort-icon {
    position: absolute;
    left: 11px;
    color: #C4BDD0;
    pointer-events: none;
  }

  .sa-sort-select {
    flex: 1;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.8rem;
    font-family: 'DM Sans', sans-serif;
    color: #1A1523;
    padding-left: 32px;
    padding-right: 10px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
  }

  @media (max-width: 640px) {
    .sa-inner { padding: 24px 16px 56px; }
    .sa-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  }

  @media (max-width: 380px) {
    .sa-grid { grid-template-columns: 1fr; }
  }
`;
