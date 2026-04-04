import { useState, useMemo } from 'react';
import {
  Car,
  Eye,
  Heart,
  Plus,
  Search,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  CheckCircle2,
  TrendingUp,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';
import StatPill from '../Components/StatPill';
import GridCard from '../Components/GridCard';
import ListCard from '../Components/ListCard';
import DeleteModal from '../Components/DeleteModal';
import EmptyState from '../Components/EmptyState';
import useMyAds from '../../../Hooks/My-Ads/useMyAds';
import useDeleteAd from '../../../Hooks/My-Ads/useDeleteAd';
import usePatchAd from '../../../Hooks/My-Ads/usePatchAd';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'views-desc', label: 'Most Viewed' },
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
];

const STATUS_TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'pending', label: 'Pending' },
  { value: 'expired', label: 'Expired' },
  { value: 'rejected', label: 'Rejected' },
];

export default function MyAds() {
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('grid');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { ads, isLoading, isError, error } = useMyAds();

  // ADD THIS DEBUG LINE right before your 'return' statement:
  console.log('Component Ads State:', ads);
  const { mutate: removeAd, isPending: isDeleting } = useDeleteAd();
  const { mutate: patchAd } = usePatchAd();

  const totalViews = ads.reduce((s, a) => s + a.views, 0);
  const totalSaves = ads.reduce((s, a) => s + a.saves, 0);
  const activeCount = ads.filter((a) => a.status === 'active').length;

  const handleDeleteRequest = (id) => setDeleteTarget(ads.find((a) => a._id === id));
  const handleDeleteConfirm = () => {
    removeAd(deleteTarget._id);
    setDeleteTarget(null);
  };
  const handlePatch = (id, status) => patchAd({ adId: id, status });

  const filtered = useMemo(() => {
    let r = [...ads];
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((a) =>
        `${a.make} ${a.model} ${a.variant} ${a.year} ${a.city}`.toLowerCase().includes(q)
      );
    }
    if (statusTab !== 'all') r = r.filter((a) => a.status === statusTab);
    switch (sortBy) {
      case 'views-desc':
        r.sort((a, b) => b.views - a.views);
        break;
      case 'price-asc':
        r.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        r.sort((a, b) => b.price - a.price);
        break;
      default:
        break; // server already returns newest first
    }
    return r;
  }, [ads, search, statusTab, sortBy]);

  const isFiltered = !!search.trim() || statusTab !== 'all';

  // ── Loading ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="upa-page">
        <div className="upa-inner">
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (isError) {
    return (
      <div className="upa-page">
        <div className="upa-inner">
          <div className="flex flex-col items-center justify-center py-24 text-center px-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(239,68,68,0.08)' }}
            >
              <AlertTriangle size={22} strokeWidth={1.8} style={{ color: '#dc2626' }} />
            </div>
            <h2
              className="text-[1.05rem] font-extrabold tracking-[-0.03em] mb-2"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Failed to load ads
            </h2>
            <p
              className="text-[0.82rem] mb-6 max-w-xs"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {error?.message || 'Something went wrong. Please try again.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-[0.82rem] font-semibold px-5 py-2.5 rounded-xl text-white"
              style={{
                background: 'linear-gradient(135deg,#6C3CE1,#5A2FCA)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {deleteTarget && (
        <DeleteModal
          ad={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          isLoading={isDeleting}
        />
      )}

      <div className="upa-page">
        <div className="upa-inner">
          {/* ── Heading ─────────────────────────────────────── */}
          <div className="flex items-start justify-between gap-4 mb-7 flex-wrap">
            <div>
              <p
                className="text-[0.7rem] font-bold uppercase tracking-[0.1em] mb-1"
                style={{ color: '#6C3CE1', fontFamily: "'DM Sans',sans-serif" }}
              >
                Your Listings
              </p>
              <h1
                className="text-[1.85rem] font-extrabold tracking-[-0.04em] leading-tight"
                style={{ color: '#1A1523', fontFamily: "'Syne',sans-serif" }}
              >
                My Ads
              </h1>
              <p
                className="text-[0.82rem] mt-1"
                style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
              >
                {ads.length === 0
                  ? 'No ads posted'
                  : `${ads.length} listing${ads.length !== 1 ? 's' : ''} · ${activeCount} active`}
              </p>
            </div>
            <a
              href="/post-ad"
              className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-white px-5 py-2.5 rounded-xl no-underline transition-transform duration-150 hover:-translate-y-px self-start"
              style={{
                background: 'linear-gradient(135deg,#6C3CE1,#5A2FCA)',
                boxShadow: '0 2px 12px rgba(108,60,225,0.25)',
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              <Plus size={15} strokeWidth={2.5} aria-hidden="true" />
              Post New Ad
            </a>
          </div>

          {/* ── Stats ───────────────────────────────────────── */}
          {ads.length > 0 && (
            <div className="upa-stats mb-7">
              <StatPill icon={Car} value={ads.length} label="Total listings" />
              <StatPill icon={CheckCircle2} value={activeCount} label="Active" />
              <StatPill icon={Eye} value={totalViews.toLocaleString()} label="Total views" />
              <StatPill icon={Heart} value={totalSaves} label="Total saves" />
            </div>
          )}

          {/* ── Status tabs ─────────────────────────────────── */}
          {ads.length > 0 && (
            <div
              className="flex items-center gap-2 mb-5 overflow-x-auto pb-1"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              {STATUS_TABS.map((t) => {
                const count =
                  t.value === 'all' ? ads.length : ads.filter((a) => a.status === t.value).length;
                const active = statusTab === t.value;
                return (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setStatusTab(t.value)}
                    className="flex-shrink-0 inline-flex items-center gap-1.5 px-3.5 py-[0.45rem] rounded-xl text-[0.78rem] font-medium transition-all duration-150"
                    style={{
                      background: active ? '#6C3CE1' : '#FFFFFF',
                      color: active ? '#FFFFFF' : '#8A8390',
                      border: active ? 'none' : '1.5px solid #E8E3DC',
                      boxShadow: active ? '0 2px 8px rgba(108,60,225,0.22)' : 'none',
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                    aria-pressed={active}
                  >
                    {t.label}
                    {count > 0 && (
                      <span
                        className="px-1.5 py-0.5 rounded-full text-[0.6rem] font-bold"
                        style={{
                          background: active ? 'rgba(255,255,255,0.22)' : '#F2EEE9',
                          color: active ? '#fff' : '#8A8390',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* ── Controls ────────────────────────────────────── */}
          {ads.length > 0 && (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="upa-search-wrap">
                <Search size={14} strokeWidth={2} className="upa-search-icon" aria-hidden="true" />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search your ads…"
                  className="upa-search-input"
                  aria-label="Search your ads"
                />
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="upa-search-clear"
                    aria-label="Clear search"
                  >
                    <X size={13} strokeWidth={2.5} />
                  </button>
                )}
              </div>

              <div className="relative upa-sort-wrap">
                <ArrowUpDown
                  size={13}
                  strokeWidth={2}
                  className="upa-sort-icon"
                  aria-hidden="true"
                />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="upa-sort-select"
                  aria-label="Sort by"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              <span
                className="text-[0.75rem] ml-auto"
                style={{ color: '#B0AABA', fontFamily: "'DM Sans',sans-serif" }}
                aria-live="polite"
              >
                {filtered.length !== ads.length
                  ? `${filtered.length} of ${ads.length}`
                  : `${ads.length} listing${ads.length !== 1 ? 's' : ''}`}
              </span>

              <div
                className="flex items-center border rounded-xl overflow-hidden"
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
          )}

          {/* ── Listings ────────────────────────────────────── */}
          {filtered.length === 0 ? (
            <EmptyState
              isFiltered={isFiltered}
              onClear={() => {
                setSearch('');
                setStatusTab('all');
              }}
            />
          ) : view === 'grid' ? (
            <div className="upa-grid">
              {filtered.map((ad) => (
                <GridCard
                  key={ad._id}
                  ad={ad}
                  onDelete={handleDeleteRequest}
                  onPatch={handlePatch}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((ad) => (
                <ListCard
                  key={ad._id}
                  ad={ad}
                  onDelete={handleDeleteRequest}
                  onPatch={handlePatch}
                />
              ))}
            </div>
          )}

          {/* ── Feature CTA ─────────────────────────────────── */}
          {ads.length > 0 && filtered.length > 0 && (
            <div
              className="mt-10 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{
                background: 'linear-gradient(135deg,#1A1523 0%,#231930 100%)',
                border: '1.5px solid rgba(255,255,255,0.06)',
              }}
            >
              <div>
                <p
                  className="text-[0.95rem] font-extrabold text-white tracking-[-0.02em]"
                  style={{ fontFamily: "'Syne',sans-serif" }}
                >
                  Want more visibility?
                </p>
                <p
                  className="text-[0.75rem] mt-0.5"
                  style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans',sans-serif" }}
                >
                  Feature a listing to reach 5× more buyers across Pakistan.
                </p>
              </div>
              <a
                href="/boost-ad"
                className="inline-flex items-center gap-2 text-[0.85rem] font-semibold text-white px-5 py-2.5 rounded-xl no-underline transition-transform duration-150 hover:-translate-y-px flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg,#C9A84C,#A8852C)',
                  boxShadow: '0 2px 10px rgba(201,168,76,0.3)',
                  fontFamily: "'DM Sans',sans-serif",
                }}
              >
                <TrendingUp size={14} strokeWidth={2.2} aria-hidden="true" />
                Feature an Ad
                <ChevronRight size={13} strokeWidth={2.5} aria-hidden="true" />
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// ── Skeleton ─────────────────────────────────────────────────────

const SkeletonBox = ({ style = {} }) => (
  <div className="rounded-xl animate-pulse" style={{ background: '#F2EEE9', ...style }} />
);

const LoadingSkeleton = () => (
  <div>
    <div className="flex items-start justify-between gap-4 mb-7">
      <div>
        <SkeletonBox style={{ width: '80px', height: '10px', marginBottom: '8px' }} />
        <SkeletonBox style={{ width: '140px', height: '28px', marginBottom: '6px' }} />
        <SkeletonBox style={{ width: '110px', height: '10px' }} />
      </div>
      <SkeletonBox style={{ width: '120px', height: '40px', borderRadius: '12px' }} />
    </div>
    <div className="upa-stats mb-7">
      {[...Array(4)].map((_, i) => (
        <SkeletonBox key={i} style={{ width: '140px', height: '72px', borderRadius: '16px' }} />
      ))}
    </div>
    <div className="flex gap-2 mb-5">
      {[...Array(5)].map((_, i) => (
        <SkeletonBox key={i} style={{ width: '70px', height: '34px', borderRadius: '12px' }} />
      ))}
    </div>
    <div className="upa-grid">
      {[...Array(6)].map((_, i) => (
        <SkeletonBox key={i} style={{ height: '280px', borderRadius: '16px' }} />
      ))}
    </div>
  </div>
);
