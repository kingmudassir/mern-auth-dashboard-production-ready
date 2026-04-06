import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Car,
  Search,
  X,
  Eye,
  Flag,
  Trash2,
  CheckCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  MapPin,
  TrendingUp,
  Fuel,
  Gauge,
  Calendar,
  SlidersHorizontal,
  XCircle,
} from 'lucide-react';
import Toast from '../../User-Profile/Components/Common/Toast.jsx';
import ConfirmModal from '../../User-Profile/Components/Common/ConfirmModal.jsx';
import { useAllListings } from '../../../../Hooks/Admin-Hook/All-Listings/useAllListings.js';
import { useDeleteListing } from '../../../../Hooks/Admin-Hook/All-Listings/useDeleteListing.js';
import { useFlagListing } from '../../../../Hooks/Admin-Hook/All-Listings/useFlagListing.js';
import { useApproveListing } from '../../../../Hooks/Admin-Hook/All-Listings/useApproveListing.js';
import StatCard from '../Components/StatCard.jsx';
import StatusBadge, { STATUS_CONFIG } from '../Components/StatusBadge.jsx';
import ConditionBadge from '../Components/ConditionBadge.jsx';
import RejectModal from '../Components/RejectModal.jsx';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────
const formatPrice = (price) => {
  if (price == null) return '—';
  if (price >= 10_000_000) return `PKR ${(price / 10_000_000).toFixed(1)}Cr`;
  if (price >= 100_000) return `PKR ${(price / 100_000).toFixed(1)}L`;
  return `PKR ${price.toLocaleString()}`;
};

const getImageUrl = (image) => {
  if (!image) return null;

  // If the image is an object, get the URL property. If it's a string, use it directly.
  const path = typeof image === 'string' ? image : image.url;

  if (!path) return null;

  return path.startsWith('http') ? path : `${API_BASE_URL}/${path.replace(/^\/+/, '')}`;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' });

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(diff / 3_600_000);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(diff / 86_400_000);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const listingTitle = (l) =>
  (l.title ?? [l.year, l.make, l.model].filter(Boolean).join(' ')) || 'Untitled';

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '??';

const ALL_STATUSES = ['all', 'active', 'pending', 'rejected', 'expired', 'sold'];

const AVATAR_COLORS = [
  { bg: 'rgba(108,60,225,0.1)', color: '#6C3CE1' },
  { bg: 'rgba(201,168,76,0.15)', color: '#92700a' },
  { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
  { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
  { bg: 'rgba(232,98,42,0.1)', color: '#C4531F' },
  { bg: 'rgba(8,145,178,0.1)', color: '#0891B2' },
];

// ── Main ──────────────────────────────────────────────────────────
export default function AllCarListings() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatus] = useState('all');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [modal, setModal] = useState(null);

  // 1. Fetch Data (Server-side filtering & pagination)
  const { data, isLoading } = useAllListings({
    page,
    limit: PAGE_SIZE,
    search: search.trim(),
    status: statusFilter === 'all' ? '' : statusFilter,
  });

  const listings = data?.listings ?? [];
  const paginated = data?.listings ?? [];
  const totalPages = data?.pages ?? 1;
  const totalResults = data?.total ?? 0;
  console.log('Component Rendering. Filters:', { page, search, statusFilter });

  const { mutate: deleteListing } = useDeleteListing();
  const { mutate: flagListing } = useFlagListing();
  const { mutate: approveListing } = useApproveListing();

  // data is now the server payload directly: { listings, total, pages, ... }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const stats = useMemo(
    () => ({
      // Use data from the server payload if available,
      // otherwise fallback to calculated values (which only cover the current page)
      total: data?.total ?? 0,
      active: data?.activeCount ?? 0,
      pending: data?.pendingCount ?? 0,
      today: data?.todayCount ?? 0,
    }),
    [data]
  );

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };
  const handleStatus = (s) => {
    setStatus(s);
    setPage(1);
  };

  // ── Action handlers ───────────────────────────────────────────
  const handleDelete = () => {
    const { listing } = modal;
    deleteListing(listing._id, {
      onSuccess: () => {
        showToast(`"${listingTitle(listing)}" removed`);
        setModal(null);
      },
      onError: (e) => {
        showToast(e?.message || 'Failed to delete.', 'error');
        setModal(null);
      },
    });
  };

  const handleReject = (reason) => {
    const { listing } = modal;
    flagListing(
      { listingId: listing._id, reason },
      {
        onSuccess: () => {
          showToast(`"${listingTitle(listing)}" rejected`);
          setModal(null);
        },
        onError: (e) => {
          showToast(e?.message || 'Failed to reject.', 'error');
          setModal(null);
        },
      }
    );
  };

  const handleApprove = () => {
    const { listing } = modal;
    approveListing(listing._id, {
      onSuccess: () => {
        showToast(`"${listingTitle(listing)}" is now live ✓`);
        setModal(null);
      },
      onError: (e) => {
        showToast(e?.message || 'Failed to approve.', 'error');
        setModal(null);
      },
    });
  };

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      {/* Approve confirm */}
      <ConfirmModal
        open={modal?.type === 'approve'}
        title={`Approve "${listingTitle(modal?.listing ?? {})}"`}
        message="This listing will immediately go live and be visible to all buyers on the marketplace."
        confirmLabel="Approve & Publish"
        onConfirm={handleApprove}
        onCancel={() => setModal(null)}
      />

      {/* Delete confirm */}
      <ConfirmModal
        open={modal?.type === 'delete'}
        title={`Delete "${listingTitle(modal?.listing ?? {})}"`}
        message="This will permanently remove the listing. The seller will lose all inquiries. This cannot be undone."
        confirmLabel="Delete Listing"
        onConfirm={handleDelete}
        onCancel={() => setModal(null)}
        danger
      />

      {/* Reject — custom modal with reason field */}
      {modal?.type === 'reject' && (
        <RejectModal
          listing={modal.listing} // Use modal.listing
          onConfirm={handleReject} // Use your existing handleReject function
          onCancel={() => setModal(null)} // Close by setting modal to null
          listingTitle={listingTitle}
        />
      )}

      <div className="cl-root">
        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
          <div>
            <p className="cl-page-eyebrow">Listings Management</p>
            <h1 className="cl-page-title">All Listings</h1>
            <p className="cl-page-sub">
              Approve pending ads, reject rule-breakers, or remove harmful content
            </p>
          </div>
          {toast.msg && (
            <Toast
              msg={toast.msg}
              type={toast.type}
              onDismiss={() => setToast({ msg: '', type: 'success' })}
            />
          )}
        </div>

        {/* ── Stat strip ── */}
        <div className="cl-stat-grid mb-5">
          <StatCard
            icon={Car}
            label="Total listings"
            value={stats.total}
            accent={{ bg: 'rgba(108,60,225,0.08)', color: '#6C3CE1' }}
          />
          <StatCard
            icon={CheckCircle}
            label="Live / Active"
            value={stats.active} // Now defined
            accent={{ bg: 'rgba(5,150,105,0.08)', color: '#059669' }}
          />
          <StatCard
            icon={Clock}
            label="Pending approval"
            value={stats.pending}
            accent={{ bg: 'rgba(217,119,6,0.08)', color: '#D97706' }}
            sub={stats.pending > 0 ? 'Needs review' : undefined}
          />
          <StatCard
            icon={TrendingUp}
            label="Added today"
            value={stats.today} // Now defined
            accent={{ bg: 'rgba(37,99,235,0.08)', color: '#2563EB' }}
          />
        </div>

        {/* ── Toolbar ── */}
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <div className="cl-search flex-1" style={{ minWidth: '220px' }}>
            <Search size={14} strokeWidth={2} style={{ color: '#C4BDD0', flexShrink: 0 }} />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by title, make, model, seller, city, or ID…"
              className="cl-search-input"
            />
            {search && (
              <button type="button" onClick={() => handleSearch('')} style={{ color: '#C4BDD0' }}>
                <X size={13} strokeWidth={2} />
              </button>
            )}
          </div>
          <button
            type="button"
            onClick={() => setFiltersOpen((p) => !p)}
            className="cl-filter-btn sm:hidden"
            aria-label="Toggle filters"
          >
            <SlidersHorizontal size={14} strokeWidth={2} />
            Filters
            {statusFilter !== 'all' && <span className="cl-filter-dot" />}
          </button>
        </div>

        {/* ── Status tabs ── */}
        <div className={`cl-tabs-wrap mb-4 ${filtersOpen ? 'cl-tabs-open' : ''}`}>
          <div className="cl-tabs">
            {ALL_STATUSES.map((s) => {
              const cfg = s === 'all' ? null : STATUS_CONFIG[s];
              const count =
                s === 'all'
                  ? stats.total
                  : s === 'active'
                    ? stats.active
                    : s === 'pending'
                      ? stats.pending
                      : 0;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleStatus(s)}
                  className={`cl-tab ${statusFilter === s ? 'cl-tab-active' : ''}`}
                >
                  {cfg && (
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: cfg.dot }}
                    />
                  )}
                  <span className="capitalize">{s === 'all' ? 'All' : cfg?.label}</span>
                  <span className="cl-tab-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Empty state ── */}
        {!isLoading && listings.length === 0 && (
          <div
            className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl"
            style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(108,60,225,0.08)' }}
            >
              <Car size={20} strokeWidth={1.8} style={{ color: '#6C3CE1' }} />
            </div>
            <p className="cl-empty-title">
              {search || statusFilter !== 'all'
                ? 'No listings match your filters'
                : 'No listings yet'}
            </p>
            <p className="cl-empty-sub">
              {search || statusFilter !== 'all'
                ? 'Try adjusting your search or filter'
                : 'Listings submitted by sellers will appear here'}
            </p>
            {(search || statusFilter !== 'all') && (
              <button
                type="button"
                className="cl-clear-btn"
                onClick={() => {
                  handleSearch('');
                  handleStatus('all');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* ── Desktop table ── */}
        {!isLoading && listings.length > 0 && (
          <>
            <div className="cl-table-wrap hidden md:block">
              <div className="cl-thead">
                {[
                  'Listing',
                  'Seller',
                  'Price',
                  'Details',
                  'City',
                  'Status',
                  'Posted',
                  'Actions',
                ].map((h) => (
                  <span key={h} className="cl-th">
                    {h}
                  </span>
                ))}
              </div>

              {paginated.map((listing, i) => {
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const seller = listing.seller ?? listing.createdBy ?? {};
                const isPending = listing.status === 'pending';
                const isActive = listing.status === 'active';
                const fuel = listing.fuel ?? listing.fuelType;

                return (
                  <div key={listing._id} className="cl-row">
                    {/* Listing Column */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center border border-gray-200">
                        {listing.images?.length > 0 ? (
                          <img
                            src={getImageUrl(listing.images[0])}
                            alt={listingTitle(listing)}
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              // Show fallback icon on error
                              if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                        ) : null}

                        <div
                          className="text-[#6C3CE1] opacity-40 flex items-center justify-center"
                          style={{ display: listing.images?.length > 0 ? 'none' : 'flex' }}
                        >
                          <Car size={18} strokeWidth={1.5} />
                        </div>

                        <div
                          className="text-[#6C3CE1] opacity-40 flex items-center justify-center"
                          style={{ display: listing.images?.length > 0 ? 'none' : 'flex' }}
                        >
                          <Car size={18} strokeWidth={1.5} />
                        </div>
                      </div>

                      <div className="min-w-0">
                        <p
                          className="cl-listing-name truncate font-medium text-sm"
                          title={listingTitle(listing)}
                        >
                          {listingTitle(listing)}
                        </p>
                        <p className="cl-listing-id text-[10px] opacity-60">
                          #{listing._id?.slice(-8)}
                        </p>
                      </div>
                    </div>

                    {/* Seller */}
                    <div className="flex items-center gap-2 min-w-0">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.6rem] font-extrabold shrink-0"
                        style={{
                          background: avatarColor.bg,
                          color: avatarColor.color,
                          fontFamily: "'Syne', sans-serif",
                        }}
                      >
                        {initials(seller.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="cl-seller-name truncate">{seller.name ?? '—'}</p>
                        <p className="cl-seller-email truncate">{seller.email ?? '—'}</p>
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <p className="cl-price">{formatPrice(listing.price)}</p>
                      {listing.condition && <ConditionBadge condition={listing.condition} />}
                    </div>

                    {/* Details */}
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                        <span className="cl-detail-text">{listing.year ?? '—'}</span>
                        {listing.mileage && (
                          <>
                            <span style={{ color: '#E8E3DC' }}>·</span>
                            <Gauge size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                            <span className="cl-detail-text">
                              {(listing.mileage / 1000).toFixed(0)}k km
                            </span>
                          </>
                        )}
                      </div>
                      {fuel && (
                        <div className="flex items-center gap-1.5">
                          <Fuel size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                          <span className="cl-detail-text capitalize">{fuel}</span>
                        </div>
                      )}
                    </div>

                    {/* City */}
                    <div className="flex items-center gap-1.5">
                      <MapPin
                        size={11}
                        strokeWidth={2}
                        style={{ color: '#C4BDD0', flexShrink: 0 }}
                      />
                      <span className="cl-city truncate">{listing.city ?? '—'}</span>
                    </div>

                    {/* Status */}
                    <StatusBadge status={listing.status} />

                    {/* Posted */}
                    <div>
                      <p className="cl-posted-ago">{timeAgo(listing.createdAt)}</p>
                      <p className="cl-posted-date">{formatDate(listing.createdAt)}</p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/listings/${listing._id}`)}
                        className="cl-action-btn"
                        title="View listing"
                      >
                        <Eye size={12} strokeWidth={2} />
                      </button>

                      {isPending && (
                        <button
                          type="button"
                          onClick={() => setModal({ type: 'approve', listing })}
                          className="cl-action-btn cl-approve"
                          title="Approve listing"
                        >
                          <CheckCircle size={12} strokeWidth={2} />
                        </button>
                      )}

                      {(isPending || isActive) && (
                        <button
                          type="button"
                          onClick={() => setModal({ type: 'reject', listing })}
                          className="cl-action-btn cl-flag"
                          title="Reject listing"
                        >
                          <XCircle size={12} strokeWidth={2} />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setModal({ type: 'delete', listing })}
                        className="cl-action-btn cl-delete"
                        title="Delete listing"
                      >
                        <Trash2 size={12} strokeWidth={2} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Mobile cards ── */}
            <div className="flex flex-col gap-3 md:hidden">
              {paginated.map((listing, i) => {
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const seller = listing.seller ?? listing.createdBy ?? {};
                const isPending = listing.status === 'pending';
                const isActive = listing.status === 'active';

                return (
                  <div key={listing._id} className="cl-mobile-card">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-12 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center border border-gray-200">
                          {listing.images?.length > 0 ? (
                            <img
                              src={getImageUrl(listing.images[0])}
                              alt={listingTitle(listing)}
                              className="w-full h-full object-cover"
                              loading="lazy"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                // Show fallback icon on error
                                if (e.target.nextSibling)
                                  e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}

                          {/* Fallback Icon (Visible if no image or if image fails to load) */}
                          <div
                            className="text-[#6C3CE1] opacity-40 flex items-center justify-center"
                            style={{ display: listing.images?.length > 0 ? 'none' : 'flex' }}
                          >
                            <Car size={16} strokeWidth={1.5} />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="cl-listing-name truncate">{listingTitle(listing)}</p>
                          <p className="cl-listing-id">#{listing._id?.slice(-8)}</p>
                        </div>
                      </div>
                      <StatusBadge status={listing.status} />
                    </div>

                    <div
                      className="grid grid-cols-2 gap-2 py-3 mb-3"
                      style={{ borderTop: '1px solid #F2EEE9', borderBottom: '1px solid #F2EEE9' }}
                    >
                      <div>
                        <p className="cl-meta-label">Price</p>
                        <p className="cl-price">{formatPrice(listing.price)}</p>
                      </div>
                      <div>
                        <p className="cl-meta-label">Year</p>
                        <p className="cl-meta-val">{listing.year ?? '—'}</p>
                      </div>
                      <div>
                        <p className="cl-meta-label">Seller</p>
                        <p className="cl-meta-val truncate">{seller.name ?? '—'}</p>
                      </div>
                      <div>
                        <p className="cl-meta-label">City</p>
                        <p className="cl-meta-val">{listing.city ?? '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5">
                        <Clock size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                        <span className="cl-posted-ago">{timeAgo(listing.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/listings/${listing._id}`)}
                        className="cl-mobile-btn"
                        style={{ color: '#8A8390', borderColor: '#E8E3DC', background: '#FAFAF9' }}
                      >
                        <Eye size={12} strokeWidth={2} /> View
                      </button>
                      {isPending && (
                        <button
                          type="button"
                          onClick={() => setModal({ type: 'approve', listing })}
                          className="cl-mobile-btn"
                          style={{
                            color: '#059669',
                            borderColor: 'rgba(5,150,105,0.3)',
                            background: 'rgba(5,150,105,0.06)',
                          }}
                        >
                          <CheckCircle size={12} strokeWidth={2} /> Approve
                        </button>
                      )}
                      {(isPending || isActive) && (
                        <button
                          type="button"
                          onClick={() => setModal({ type: 'reject', listing })}
                          className="cl-mobile-btn"
                          style={{
                            color: '#C4531F',
                            borderColor: 'rgba(232,98,42,0.3)',
                            background: 'rgba(232,98,42,0.06)',
                          }}
                        >
                          <XCircle size={12} strokeWidth={2} /> Reject
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setModal({ type: 'delete', listing })}
                        className="cl-mobile-btn"
                        style={{
                          color: '#DC2626',
                          borderColor: 'rgba(220,38,38,0.3)',
                          background: 'rgba(220,38,38,0.06)',
                        }}
                      >
                        <Trash2 size={12} strokeWidth={2} /> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Pagination ── */}
            <div className="cl-pagination mt-4">
              <p className="cl-pagination-info">
                Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, totalResults)} of{' '}
                {totalResults} listing{totalResults !== 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="cl-page-btn"
                >
                  <ChevronLeft size={14} strokeWidth={2} />
                </button>
                {(() => {
                  const pages = [];
                  for (let p = 1; p <= totalPages; p++) {
                    if (p === 1 || p === totalPages || (p >= page - 1 && p <= page + 1)) {
                      pages.push(p);
                    } else if (pages[pages.length - 1] !== '…') {
                      pages.push('…');
                    }
                  }
                  return pages.map((p, i) =>
                    p === '…' ? (
                      <span key={`e-${i}`} className="cl-page-ellipsis">
                        …
                      </span>
                    ) : (
                      <button
                        key={p}
                        type="button"
                        onClick={() => setPage(p)}
                        className="cl-page-btn"
                        style={{
                          borderColor: page === p ? '#6C3CE1' : '#E8E3DC',
                          background: page === p ? 'rgba(108,60,225,0.08)' : '#FFFFFF',
                          color: page === p ? '#6C3CE1' : '#8A8390',
                        }}
                      >
                        {p}
                      </button>
                    )
                  );
                })()}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="cl-page-btn"
                >
                  <ChevronRight size={14} strokeWidth={2} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── Loading ── */}
        {isLoading && (
          <div className="flex items-center justify-center h-52">
            <div className="flex flex-col items-center gap-3">
              <div className="cl-spinner" />
              <p className="cl-loading-text">Loading listings…</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
