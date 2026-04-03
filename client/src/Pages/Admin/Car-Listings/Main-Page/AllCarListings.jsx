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

const PAGE_SIZE = 10;

// ── Helpers ───────────────────────────────────────────────────────
const formatPrice = (price) => {
  if (price == null) return '—';
  if (price >= 10_000_000) return `PKR ${(price / 10_000_000).toFixed(1)}Cr`;
  if (price >= 100_000) return `PKR ${(price / 100_000).toFixed(1)}L`;
  return `PKR ${price.toLocaleString()}`;
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

// ── Config ────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active: { label: 'Active', dot: '#059669', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
  pending: { label: 'Pending', dot: '#D97706', bg: 'rgba(217,119,6,0.08)', text: '#D97706' },
  rejected: { label: 'Rejected', dot: '#DC2626', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  expired: { label: 'Expired', dot: '#8A8390', bg: 'rgba(138,131,144,0.1)', text: '#8A8390' },
  sold: { label: 'Sold', dot: '#6C3CE1', bg: 'rgba(108,60,225,0.08)', text: '#6C3CE1' },
};
const ALL_STATUSES = ['all', 'active', 'pending', 'rejected', 'expired', 'sold'];

const CONDITION_CONFIG = {
  new: { label: 'New', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
  used: { label: 'Used', bg: 'rgba(108,60,225,0.08)', text: '#6C3CE1' },
  certified: { label: 'Certified', bg: 'rgba(37,99,235,0.08)', text: '#2563EB' },
};

const AVATAR_COLORS = [
  { bg: 'rgba(108,60,225,0.1)', color: '#6C3CE1' },
  { bg: 'rgba(201,168,76,0.15)', color: '#92700a' },
  { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
  { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
  { bg: 'rgba(232,98,42,0.1)', color: '#C4531F' },
  { bg: 'rgba(8,145,178,0.1)', color: '#0891B2' },
];

// ── Sub-components ────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent, sub }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
      style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent.bg }}
      >
        <Icon size={15} strokeWidth={2} style={{ color: accent.color }} />
      </div>
      <div>
        <p
          className="text-[1.05rem] font-extrabold tracking-[-0.03em] leading-none"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          {value}
        </p>
        <p
          className="text-[0.72rem] mt-0.5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </p>
        {sub && (
          <p
            className="text-[0.65rem] mt-0.5 font-semibold"
            style={{ color: accent.color, fontFamily: "'DM Sans', sans-serif" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    dot: '#8A8390',
    bg: 'rgba(138,131,144,0.1)',
    text: '#8A8390',
  };
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[0.68rem] font-semibold whitespace-nowrap"
      style={{ background: cfg.bg, color: cfg.text, fontFamily: "'DM Sans', sans-serif" }}
    >
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function ConditionBadge({ condition }) {
  const cfg = CONDITION_CONFIG[condition?.toLowerCase()] ?? CONDITION_CONFIG.used;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-md text-[0.65rem] font-semibold"
      style={{ background: cfg.bg, color: cfg.text, fontFamily: "'DM Sans', sans-serif" }}
    >
      {cfg.label}
    </span>
  );
}

// Reject modal — needs a reason field unlike a plain ConfirmModal
function RejectModal({ listing, onConfirm, onCancel }) {
  const [reason, setReason] = useState('');
  if (!listing) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm"
        style={{ border: '1.5px solid #E8E3DC', boxShadow: '0 20px 60px rgba(26,21,35,0.18)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(232,98,42,0.1)' }}
        >
          <XCircle size={18} strokeWidth={2} style={{ color: '#C4531F' }} />
        </div>
        <h3
          className="text-[1rem] font-extrabold mb-1 tracking-[-0.025em]"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          Reject listing?
        </h3>
        <p
          className="text-[0.8rem] mb-4"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {listingTitle(listing)}
        </p>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Reason for rejection (required)…"
          rows={3}
          className="w-full rounded-xl p-3 text-[0.82rem] resize-none outline-none mb-4"
          style={{
            border: '1.5px solid #E8E3DC',
            fontFamily: "'DM Sans', sans-serif",
            color: '#1A1523',
            background: '#FAFAF9',
          }}
        />
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-[0.82rem] font-medium py-2.5 rounded-xl border"
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
            onClick={() => reason.trim() && onConfirm(reason.trim())}
            disabled={!reason.trim()}
            className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl transition-opacity"
            style={{
              background: 'linear-gradient(135deg,#C4531F,#E8622A)',
              opacity: reason.trim() ? 1 : 0.45,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
}

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

  // ── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(
    () => ({
      total: totalResults,
      // We show 'current view' info if we don't have global counts from API
      showing: listings.length,
      pending: listings.filter((l) => l.status === 'pending').length,
    }),
    [totalResults, listings]
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
      <style>{STYLES}</style>

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
          listing={modal.listing}
          onConfirm={handleReject}
          onCancel={() => setModal(null)}
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
            value={stats.active}
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
            value={stats.today}
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
                s === 'all' ? listings.length : listings.filter((l) => l.status === s).length;
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
                    {/* Listing */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="cl-car-thumb" aria-hidden="true">
                        <Car
                          size={16}
                          strokeWidth={1.7}
                          style={{ color: '#6C3CE1', opacity: 0.6 }}
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="cl-listing-name truncate" title={listingTitle(listing)}>
                          {listingTitle(listing)}
                        </p>
                        <p className="cl-listing-id">#{listing._id?.slice(-8)}</p>
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
                        <div className="cl-car-thumb shrink-0">
                          <Car
                            size={14}
                            strokeWidth={1.7}
                            style={{ color: '#6C3CE1', opacity: 0.6 }}
                          />
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

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  @keyframes spin   { to { transform: rotate(360deg); } }
  @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }

  .cl-root { font-family:'DM Sans',sans-serif; max-width:1280px; }

  .cl-page-eyebrow {
    font-size:0.68rem; font-weight:700; text-transform:uppercase;
    letter-spacing:0.1em; color:#6C3CE1; margin:0 0 3px;
    font-family:'DM Sans',sans-serif;
  }
  .cl-page-title {
    font-family:'Syne',sans-serif; font-size:1.35rem; font-weight:800;
    color:#1A1523; letter-spacing:-0.035em; margin:0 0 2px;
  }
  .cl-page-sub { font-size:0.8rem; color:#8A8390; margin:0; }

  .cl-stat-grid {
    display:grid; grid-template-columns:repeat(4,1fr); gap:12px;
  }
  @media (max-width:900px)  { .cl-stat-grid { grid-template-columns:repeat(2,1fr); } }
  @media (max-width:480px)  { .cl-stat-grid { grid-template-columns:repeat(2,1fr); } }

  .cl-search {
    display:flex; align-items:center; gap:10px;
    padding:0 14px; height:42px; border-radius:12px;
    border:1.5px solid #E8E3DC; background:#FFFFFF;
    transition:border-color 0.2s,box-shadow 0.2s;
  }
  .cl-search:focus-within {
    border-color:rgba(108,60,225,0.4);
    box-shadow:0 0 0 3px rgba(108,60,225,0.08);
  }
  .cl-search-input {
    flex:1; height:100%; background:transparent; outline:none; border:none;
    font-size:0.85rem; color:#1A1523; font-family:'DM Sans',sans-serif;
  }
  .cl-search-input::placeholder { color:#C4BDD0; }

  .cl-filter-btn {
    display:flex; align-items:center; gap:6px; position:relative;
    padding:0 14px; height:42px; border-radius:12px;
    border:1.5px solid #E8E3DC; background:#FFFFFF; color:#8A8390;
    font-size:0.8rem; font-weight:600; font-family:'DM Sans',sans-serif;
    cursor:pointer; transition:border-color 0.15s;
  }
  .cl-filter-btn:hover { border-color:#C4BDD0; }
  .cl-filter-dot {
    position:absolute; top:8px; right:8px;
    width:7px; height:7px; border-radius:50%; background:#6C3CE1;
  }

  .cl-tabs-wrap { overflow-x:auto; -webkit-overflow-scrolling:touch; scrollbar-width:none; }
  .cl-tabs-wrap::-webkit-scrollbar { display:none; }
  @media (max-width:640px) { .cl-tabs-wrap:not(.cl-tabs-open) { display:none; } }
  .cl-tabs {
    display:flex; gap:4px; padding:4px;
    background:#F7F4F0; border-radius:12px; width:fit-content;
  }
  .cl-tab {
    display:inline-flex; align-items:center; gap:5px;
    padding:6px 12px; border-radius:9px;
    font-size:0.75rem; font-weight:600; font-family:'DM Sans',sans-serif;
    color:#8A8390; background:transparent; border:none; cursor:pointer;
    white-space:nowrap; transition:background 0.15s,color 0.15s,box-shadow 0.15s;
  }
  .cl-tab:hover { color:#1A1523; background:rgba(255,255,255,0.6); }
  .cl-tab-active { background:#FFFFFF; color:#1A1523; box-shadow:0 1px 4px rgba(26,21,35,0.1); }
  .cl-tab-count {
    font-size:0.65rem; font-weight:700;
    background:rgba(26,21,35,0.06); color:#8A8390;
    padding:1px 5px; border-radius:20px;
  }
  .cl-tab-active .cl-tab-count { background:rgba(108,60,225,0.1); color:#6C3CE1; }

  .cl-table-wrap {
    border-radius:16px; overflow:hidden;
    border:1.5px solid #E8E3DC; background:#FFFFFF;
    animation:fadeUp 0.3s ease both;
  }
  .cl-thead {
    display:grid;
    grid-template-columns:2.2fr 1.6fr 1fr 1.1fr 0.9fr 1fr 0.9fr auto;
    align-items:center; padding:10px 20px;
    background:#FAFAF9; border-bottom:1px solid #F2EEE9; gap:8px;
  }
  .cl-th {
    font-size:0.68rem; font-weight:700; text-transform:uppercase;
    letter-spacing:0.1em; color:#C4BDD0; font-family:'DM Sans',sans-serif;
    white-space:nowrap;
  }
  .cl-row {
    display:grid;
    grid-template-columns:2.2fr 1.6fr 1fr 1.1fr 0.9fr 1fr 0.9fr auto;
    align-items:center; padding:14px 20px; gap:8px;
    border-bottom:1px solid #F2EEE9; transition:background 0.12s;
  }
  .cl-row:last-child { border-bottom:none; }
  .cl-row:hover { background:#FAFAF9; }

  .cl-car-thumb {
    width:36px; height:36px; border-radius:10px;
    background:rgba(108,60,225,0.06); border:1px solid rgba(108,60,225,0.12);
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
  }
  .cl-listing-name  { font-size:0.82rem; font-weight:600; color:#1A1523; font-family:'DM Sans',sans-serif; line-height:1.2; }
  .cl-listing-id    { font-size:0.65rem; color:#C4BDD0; font-family:'DM Sans',sans-serif; margin-top:1px; }
  .cl-seller-name   { font-size:0.78rem; font-weight:500; color:#1A1523; font-family:'DM Sans',sans-serif; line-height:1.2; }
  .cl-seller-email  { font-size:0.68rem; color:#8A8390; font-family:'DM Sans',sans-serif; }
  .cl-price         { font-size:0.85rem; font-weight:700; color:#1A1523; font-family:'Syne',sans-serif; letter-spacing:-0.02em; margin-bottom:2px; }
  .cl-detail-text   { font-size:0.7rem; color:#8A8390; font-family:'DM Sans',sans-serif; }
  .cl-city          { font-size:0.75rem; color:#8A8390; font-family:'DM Sans',sans-serif; }
  .cl-posted-ago    { font-size:0.75rem; font-weight:500; color:#1A1523; font-family:'DM Sans',sans-serif; }
  .cl-posted-date   { font-size:0.65rem; color:#C4BDD0; font-family:'DM Sans',sans-serif; }

  .cl-action-btn {
    width:29px; height:29px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    border:1.5px solid #E8E3DC; background:#FAFAF9; color:#8A8390;
    cursor:pointer; transition:border-color 0.15s,background 0.15s,color 0.15s;
  }
  .cl-action-btn:hover   { background:#F2EEE9; border-color:#C4BDD0; color:#1A1523; }
  .cl-action-btn:disabled { opacity:0.4; cursor:not-allowed; }
  .cl-approve { color:#059669; border-color:rgba(5,150,105,0.25); background:rgba(5,150,105,0.04); }
  .cl-approve:hover { background:rgba(5,150,105,0.1); border-color:rgba(5,150,105,0.4); }
  .cl-flag    { color:#C4531F; border-color:rgba(232,98,42,0.25); background:rgba(232,98,42,0.04); }
  .cl-flag:hover { background:rgba(232,98,42,0.1); border-color:rgba(232,98,42,0.4); }
  .cl-delete  { color:#DC2626; border-color:rgba(220,38,38,0.25); background:rgba(220,38,38,0.04); }
  .cl-delete:hover { background:rgba(220,38,38,0.1); border-color:rgba(220,38,38,0.4); }

  .cl-mobile-card {
    background:#FFFFFF; border:1.5px solid #E8E3DC;
    border-radius:16px; padding:16px; animation:fadeUp 0.3s ease both;
  }
  .cl-mobile-btn {
    flex:1; display:flex; align-items:center; justify-content:center; gap:5px;
    padding:8px 0; border-radius:10px; font-size:0.73rem; font-weight:600;
    font-family:'DM Sans',sans-serif; border:1.5px solid; cursor:pointer;
    transition:opacity 0.15s;
  }
  .cl-mobile-btn:hover { opacity:0.8; }
  .cl-meta-label {
    font-size:0.62rem; font-weight:600; text-transform:uppercase;
    letter-spacing:0.06em; color:#C4BDD0; font-family:'DM Sans',sans-serif; margin-bottom:1px;
  }
  .cl-meta-val { font-size:0.78rem; font-weight:500; color:#1A1523; font-family:'DM Sans',sans-serif; }

  .cl-pagination { display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:8px; }
  .cl-pagination-info { font-size:0.75rem; color:#8A8390; font-family:'DM Sans',sans-serif; }
  .cl-page-btn {
    width:32px; height:32px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    border:1.5px solid #E8E3DC; background:#FFFFFF; color:#8A8390;
    cursor:pointer; font-size:0.78rem; font-weight:600; font-family:'DM Sans',sans-serif;
    transition:border-color 0.15s,background 0.15s,color 0.15s;
  }
  .cl-page-btn:disabled { opacity:0.4; cursor:not-allowed; }
  .cl-page-btn:not(:disabled):hover { border-color:#C4BDD0; color:#1A1523; }
  .cl-page-ellipsis {
    width:32px; height:32px; display:flex; align-items:center; justify-content:center;
    font-size:0.78rem; color:#C4BDD0; font-family:'DM Sans',sans-serif;
  }

  .cl-empty-title { font-family:'Syne',sans-serif; font-size:0.88rem; font-weight:700; color:#1A1523; margin:0; }
  .cl-empty-sub   { font-size:0.75rem; color:#8A8390; margin:0; font-family:'DM Sans',sans-serif; }
  .cl-clear-btn {
    font-size:0.78rem; font-weight:600; color:#6C3CE1;
    background:rgba(108,60,225,0.08); border:none;
    padding:7px 16px; border-radius:8px; cursor:pointer;
    font-family:'DM Sans',sans-serif; transition:background 0.15s;
  }
  .cl-clear-btn:hover { background:rgba(108,60,225,0.15); }
  .cl-spinner {
    width:28px; height:28px; border:2.5px solid rgba(108,60,225,0.15);
    border-top-color:#6C3CE1; border-radius:50%; animation:spin 0.7s linear infinite;
  }
  .cl-loading-text { font-size:0.8rem; color:#8A8390; font-family:'DM Sans',sans-serif; }
`;
