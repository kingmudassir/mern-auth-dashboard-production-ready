import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Trash2,
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  Settings,
  Palette,
  Package,
  Phone,
  MessageSquare,
  Eye,
  Clock,
  User,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Tag,
  Zap,
  AlertTriangle,
  Hash,
} from 'lucide-react';
import { useAdminListing } from '../../../Hooks/Admin-Hook/All-Listings/useAdminListing';
import { useApproveListing } from '../../../Hooks/Admin-Hook/All-Listings/useApproveListing';
import { useFlagListing } from '../../../Hooks/Admin-Hook/All-Listings/useFlagListing';
import { useDeleteListing } from '../../../Hooks/Admin-Hook/All-Listings/useDeleteListing';
import Toast from '../../Admin/User-Profile/Components/Common/Toast';
import ConfirmModal from '../../Admin/User-Profile/Components/Common/ConfirmModal';

// ── Helpers ───────────────────────────────────────────────────────

const formatPrice = (price) => {
  if (price == null) return '—';
  if (price >= 10_000_000) return `PKR ${(price / 10_000_000).toFixed(2)} Cr`;
  if (price >= 100_000) return `PKR ${(price / 100_000).toFixed(1)} L`;
  return `PKR ${price.toLocaleString()}`;
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '?';

// ── Status config ─────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: 'Pending Review',
    dot: '#D97706',
    bg: 'rgba(217,119,6,0.1)',
    text: '#D97706',
    border: 'rgba(217,119,6,0.25)',
  },
  active: {
    label: 'Live',
    dot: '#059669',
    bg: 'rgba(5,150,105,0.08)',
    text: '#059669',
    border: 'rgba(5,150,105,0.25)',
  },
  rejected: {
    label: 'Rejected',
    dot: '#DC2626',
    bg: 'rgba(220,38,38,0.08)',
    text: '#DC2626',
    border: 'rgba(220,38,38,0.25)',
  },
  sold: {
    label: 'Sold',
    dot: '#6C3CE1',
    bg: 'rgba(108,60,225,0.08)',
    text: '#6C3CE1',
    border: 'rgba(108,60,225,0.25)',
  },
};

// ── Sub-components ────────────────────────────────────────────────

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.pending;
  return (
    <span
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[0.78rem] font-bold"
      style={{
        background: cfg.bg,
        color: cfg.text,
        border: `1.5px solid ${cfg.border}`,
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function SpecPill({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
      style={{ background: '#FAFAF9', border: '1.5px solid #E8E3DC' }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(108,60,225,0.07)' }}
      >
        <Icon size={13} strokeWidth={2} style={{ color: '#6C3CE1' }} />
      </div>
      <div>
        <p
          className="text-[0.62rem] uppercase tracking-wider font-bold"
          style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </p>
        <p
          className="text-[0.82rem] font-semibold leading-tight"
          style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div
      className="flex items-start justify-between gap-4 py-2.5"
      style={{ borderBottom: '1px solid #F2EEE9' }}
    >
      <span
        className="text-[0.75rem] font-medium flex-shrink-0"
        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </span>
      <span
        className="text-[0.8rem] font-semibold text-right"
        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Image Gallery ─────────────────────────────────────────────────
function ImageGallery({ images = [] }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div
        className="w-full flex items-center justify-center rounded-2xl"
        style={{
          height: '380px',
          background: 'linear-gradient(135deg, #F2EEE9, #EAE5DD)',
          border: '1.5px solid #E8E3DC',
        }}
      >
        <div className="text-center">
          <div style={{ fontSize: '3.5rem' }}>🚗</div>
          <p
            className="text-[0.75rem] font-medium mt-2"
            style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
          >
            No photos uploaded
          </p>
        </div>
      </div>
    );
  }

  const prev = () => setActive((a) => (a - 1 + images.length) % images.length);
  const next = () => setActive((a) => (a + 1) % images.length);

  return (
    <div>
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden mb-3"
        style={{ height: '380px', background: '#0F0C17', border: '1.5px solid #E8E3DC' }}
      >
        <img
          src={images[active]?.url}
          alt={`Photo ${active + 1}`}
          className="w-full h-full object-cover"
          style={{ transition: 'opacity 0.2s ease' }}
        />
        {/* Counter */}
        <div
          className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[0.7rem] font-bold text-white"
          style={{
            background: 'rgba(26,21,35,0.65)',
            backdropFilter: 'blur(6px)',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {active + 1} / {images.length}
        </div>
        {/* Cover badge */}
        {active === 0 && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[0.65rem] font-bold uppercase tracking-wider"
            style={{
              background: 'rgba(232,98,42,0.85)',
              color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cover Photo
          </div>
        )}
        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-opacity"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <ChevronLeft size={16} strokeWidth={2.5} style={{ color: '#1A1523' }} />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1px solid rgba(255,255,255,0.3)',
              }}
            >
              <ChevronRight size={16} strokeWidth={2.5} style={{ color: '#1A1523' }} />
            </button>
          </>
        )}
      </div>
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className="flex-shrink-0 rounded-xl overflow-hidden transition-all"
              style={{
                width: '68px',
                height: '52px',
                border: i === active ? '2.5px solid #6C3CE1' : '2px solid #E8E3DC',
                opacity: i === active ? 1 : 0.65,
              }}
            >
              <img src={img.url} alt={`Thumb ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Reject modal ──────────────────────────────────────────────────
function RejectModal({ onConfirm, onCancel, loading }) {
  const [reason, setReason] = useState('');
  const presets = [
    'Inaccurate vehicle details',
    'Misleading price or description',
    'Duplicate listing',
    'Inappropriate content or photos',
    'Unverifiable vehicle information',
    'Policy violation',
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(26,21,35,0.6)', backdropFilter: 'blur(5px)' }}
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-md"
        style={{ border: '1.5px solid #E8E3DC', boxShadow: '0 24px 60px rgba(26,21,35,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-5">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(220,38,38,0.1)' }}
          >
            <XCircle size={18} strokeWidth={2} style={{ color: '#DC2626' }} />
          </div>
          <div>
            <h3
              className="text-[1rem] font-extrabold tracking-[-0.025em]"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Reject Listing
            </h3>
            <p
              className="text-[0.72rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              The seller will see this reason in their dashboard
            </p>
          </div>
        </div>

        {/* Preset reason chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setReason(p)}
              className="px-3 py-1.5 rounded-lg text-[0.72rem] font-medium border transition-all"
              style={{
                border: reason === p ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
                background: reason === p ? 'rgba(108,60,225,0.07)' : '#FAFAF9',
                color: reason === p ? '#6C3CE1' : '#8A8390',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Or write a custom reason (optional)…"
          rows={3}
          className="w-full rounded-xl p-3 text-[0.82rem] resize-none outline-none mb-5"
          style={{
            border: '1.5px solid #E8E3DC',
            background: '#FAFAF9',
            fontFamily: "'DM Sans', sans-serif",
            color: '#1A1523',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'rgba(108,60,225,0.4)')}
          onBlur={(e) => (e.target.style.borderColor = '#E8E3DC')}
        />

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-[0.82rem] font-medium border"
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
            onClick={() => onConfirm(reason.trim() || undefined)}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl text-[0.82rem] font-semibold text-white transition-opacity"
            style={{
              background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
              opacity: loading ? 0.6 : 1,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {loading ? 'Rejecting…' : 'Reject Listing'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────
function ReviewSkeleton() {
  return (
    <div className="lrp-root animate-pulse">
      <div className="lrp-inner">
        <div
          style={{
            height: '20px',
            width: '120px',
            background: '#F2EEE9',
            borderRadius: '8px',
            marginBottom: '24px',
          }}
        />
        <div className="lrp-grid">
          <div>
            <div
              style={{
                height: '380px',
                background: '#F2EEE9',
                borderRadius: '16px',
                marginBottom: '12px',
              }}
            />
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: '68px',
                    height: '52px',
                    background: '#F2EEE9',
                    borderRadius: '12px',
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {[200, 100, 300, 150].map((w, i) => (
              <div
                key={i}
                style={{
                  height: '20px',
                  width: `${w}px`,
                  background: '#F2EEE9',
                  borderRadius: '8px',
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────
export default function ListingReviewPage() {
  const { listingId } = useParams();
  const navigate = useNavigate();

  const { data: listing, isLoading, isError } = useAdminListing(listingId);

  const { mutate: approveListing, isPending: approving } = useApproveListing();
  const { mutate: rejectListing, isPending: rejecting } = useFlagListing();
  const { mutate: deleteListing, isPending: deleting } = useDeleteListing();

  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [modal, setModal] = useState(null); // 'approve' | 'delete' | null
  const [showReject, setShowReject] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const handleApprove = () => {
    approveListing(listingId, {
      onSuccess: () => {
        showToast('Listing approved and is now live ✓');
        setModal(null);
        // Navigate back after a short delay so the toast is visible
        setTimeout(() => navigate('/admin/listings'), 1200);
      },
      onError: (e) => {
        showToast(e?.message || 'Failed to approve listing.', 'error');
        setModal(null);
      },
    });
  };

  const handleReject = (reason) => {
    rejectListing(
      { listingId, reason },
      {
        onSuccess: () => {
          showToast('Listing rejected');
          setShowReject(false);
          setTimeout(() => navigate('/admin/listings'), 1200);
        },
        onError: (e) => {
          showToast(e?.message || 'Failed to reject listing.', 'error');
          setShowReject(false);
        },
      }
    );
  };

  const handleDelete = () => {
    deleteListing(listingId, {
      onSuccess: () => {
        showToast('Listing permanently removed');
        setModal(null);
        setTimeout(() => navigate('/admin/listings'), 1200);
      },
      onError: (e) => {
        showToast(e?.message || 'Failed to delete listing.', 'error');
        setModal(null);
      },
    });
  };

  // ── Loading ────────────────────────────────────────────────────
  if (isLoading) return <ReviewSkeleton />;

  // ── Error ──────────────────────────────────────────────────────
  if (isError || !listing) {
    return (
      <div className="lrp-root">
        <div className="lrp-inner flex flex-col items-center justify-center py-24 text-center gap-4">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center"
            style={{ background: 'rgba(220,38,38,0.08)' }}
          >
            <AlertTriangle size={24} strokeWidth={1.8} style={{ color: '#DC2626' }} />
          </div>
          <h2
            className="text-[1.1rem] font-extrabold"
            style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
          >
            Listing Not Found
          </h2>
          <p
            className="text-[0.82rem]"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            This listing may have been deleted or the ID is invalid.
          </p>
          <button
            type="button"
            onClick={() => navigate('/admin/listings')}
            className="px-5 py-2.5 rounded-xl text-[0.82rem] font-semibold text-white"
            style={{
              background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Back to Listings
          </button>
        </div>
      </div>
    );
  }

  const seller = listing.postedBy || {};
  const status = listing.status ?? 'pending';
  const isPending = status === 'pending';
  const isActive = status === 'active';
  const isRejected = status === 'rejected';
  const title = [listing.year, listing.make, listing.model, listing.variant]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <style>{STYLES}</style>

      {/* Modals */}
      <ConfirmModal
        open={modal === 'approve'}
        title="Approve this listing?"
        message="This listing will immediately go live and be visible to all buyers on the marketplace."
        confirmLabel="Approve & Publish"
        onConfirm={handleApprove}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        open={modal === 'delete'}
        title="Permanently delete this listing?"
        message="This cannot be undone. All photos and data will be lost."
        confirmLabel="Delete Forever"
        onConfirm={handleDelete}
        onCancel={() => setModal(null)}
        danger
      />
      {showReject && (
        <RejectModal
          onConfirm={handleReject}
          onCancel={() => setShowReject(false)}
          loading={rejecting}
        />
      )}

      {/* Toast */}
      {toast.msg && (
        <div style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          <Toast
            msg={toast.msg}
            type={toast.type}
            onDismiss={() => setToast({ msg: '', type: 'success' })}
          />
        </div>
      )}

      <div className="lrp-root">
        <div className="lrp-inner">
          {/* ── Back + breadcrumb ── */}
          <div className="flex items-center gap-3 mb-6">
            <button
              type="button"
              onClick={() => navigate('/admin/listings')}
              className="flex items-center gap-1.5 text-[0.78rem] font-medium transition-colors"
              style={{
                color: '#8A8390',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <ArrowLeft size={14} strokeWidth={2} />
              All Listings
            </button>
            <span style={{ color: '#E8E3DC' }}>/</span>
            <span
              className="text-[0.78rem] font-medium truncate max-w-[200px]"
              style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
            >
              {title}
            </span>
          </div>

          {/* ── Page header ── */}
          <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
            <div>
              <p className="lrp-eyebrow">Listing Review</p>
              <h1 className="lrp-title">{title || 'Untitled Listing'}</h1>
              <div className="flex items-center gap-3 mt-2 flex-wrap">
                <StatusBadge status={status} />
                <span
                  className="flex items-center gap-1.5 text-[0.72rem]"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Hash size={11} strokeWidth={2} />
                  {listing._id?.slice(-10).toUpperCase()}
                </span>
                <span
                  className="flex items-center gap-1.5 text-[0.72rem]"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                >
                  <Clock size={11} strokeWidth={2} />
                  Submitted {timeAgo(listing.createdAt)}
                </span>
                {listing.views > 0 && (
                  <span
                    className="flex items-center gap-1.5 text-[0.72rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <Eye size={11} strokeWidth={2} />
                    {listing.views} views
                  </span>
                )}
              </div>
            </div>

            {/* ── Action buttons ── */}
            <div className="flex items-center gap-2 flex-wrap">
              {(isPending || isActive) && (
                <button
                  type="button"
                  onClick={() => setShowReject(true)}
                  disabled={rejecting}
                  className="lrp-btn-reject"
                >
                  <XCircle size={14} strokeWidth={2} />
                  {rejecting ? 'Rejecting…' : 'Reject'}
                </button>
              )}
              {isPending && (
                <button
                  type="button"
                  onClick={() => setModal('approve')}
                  disabled={approving}
                  className="lrp-btn-approve"
                >
                  <CheckCircle size={14} strokeWidth={2} />
                  {approving ? 'Approving…' : 'Approve & Publish'}
                </button>
              )}
              {isActive && (
                <button
                  type="button"
                  onClick={() => setModal('approve')}
                  disabled={approving}
                  className="lrp-btn-approve"
                  style={{ opacity: 0.55, cursor: 'not-allowed' }}
                  title="Already live"
                >
                  <CheckCircle size={14} strokeWidth={2} />
                  Already Live
                </button>
              )}
              <button
                type="button"
                onClick={() => setModal('delete')}
                disabled={deleting}
                className="lrp-btn-delete"
              >
                <Trash2 size={13} strokeWidth={2} />
              </button>
            </div>
          </div>

          {/* ── Rejection notice (if rejected) ── */}
          {isRejected && (
            <div
              className="flex items-start gap-3 p-4 rounded-2xl mb-6"
              style={{
                background: 'rgba(220,38,38,0.05)',
                border: '1.5px solid rgba(220,38,38,0.2)',
              }}
            >
              <XCircle
                size={16}
                strokeWidth={2}
                style={{ color: '#DC2626', flexShrink: 0, marginTop: '1px' }}
              />
              <div>
                <p
                  className="text-[0.8rem] font-bold mb-0.5"
                  style={{ color: '#DC2626', fontFamily: "'DM Sans', sans-serif" }}
                >
                  This listing was rejected
                </p>
                {listing.rejectionReason ? (
                  <p
                    className="text-[0.78rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Reason: <em>{listing.rejectionReason}</em>
                  </p>
                ) : (
                  <p
                    className="text-[0.78rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    No reason was provided.
                  </p>
                )}
                {listing.rejectedBy && (
                  <p
                    className="text-[0.72rem] mt-1"
                    style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    By {listing.rejectedBy.name} · {formatDate(listing.rejectedAt)}
                  </p>
                )}
                {/* Allow re-approval of rejected listings */}
                <button
                  type="button"
                  onClick={() => setModal('approve')}
                  className="mt-3 text-[0.75rem] font-semibold px-3 py-1.5 rounded-lg"
                  style={{
                    background: 'rgba(5,150,105,0.1)',
                    color: '#059669',
                    border: '1.5px solid rgba(5,150,105,0.25)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Approve Anyway
                </button>
              </div>
            </div>
          )}

          {/* ── Approval notice (if active) ── */}
          {isActive && listing.approvedBy && (
            <div
              className="flex items-center gap-3 p-3.5 rounded-2xl mb-6"
              style={{
                background: 'rgba(5,150,105,0.06)',
                border: '1.5px solid rgba(5,150,105,0.2)',
              }}
            >
              <ShieldCheck size={15} strokeWidth={2} style={{ color: '#059669', flexShrink: 0 }} />
              <p
                className="text-[0.78rem]"
                style={{ color: '#059669', fontFamily: "'DM Sans', sans-serif" }}
              >
                Approved by <strong>{listing.approvedBy.name}</strong> on{' '}
                {formatDate(listing.approvedAt)}
              </p>
            </div>
          )}

          {/* ── Main grid ── */}
          <div className="lrp-grid">
            {/* LEFT: Images + Description + Features */}
            <div className="flex flex-col gap-5">
              {/* Gallery */}
              <div className="lrp-card">
                <ImageGallery images={listing.images || []} />
              </div>

              {/* Description */}
              {listing.description && (
                <div className="lrp-card">
                  <p className="lrp-card-label mb-3">Description</p>
                  <p
                    className="text-[0.85rem] leading-relaxed whitespace-pre-wrap"
                    style={{ color: '#4A4558', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {listing.description}
                  </p>
                </div>
              )}

              {/* Features */}
              {listing.features?.length > 0 && (
                <div className="lrp-card">
                  <p className="lrp-card-label mb-3">Features & Equipment</p>
                  <div className="flex flex-wrap gap-2">
                    {listing.features.map((f) => (
                      <span
                        key={f}
                        className="px-3 py-1.5 rounded-lg text-[0.75rem] font-medium"
                        style={{
                          background: 'rgba(108,60,225,0.07)',
                          color: '#6C3CE1',
                          border: '1px solid rgba(108,60,225,0.15)',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT: Pricing + Specs + Seller + Meta */}
            <div className="flex flex-col gap-4">
              {/* Price card */}
              <div
                className="lrp-card"
                style={{
                  background: 'linear-gradient(135deg, #1A1523 0%, #2D1F45 100%)',
                  border: 'none',
                }}
              >
                <p
                  className="text-[0.65rem] uppercase tracking-widest font-bold mb-1"
                  style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Asking Price
                </p>
                <p
                  className="text-[2rem] font-extrabold tracking-[-0.04em] leading-none mb-1"
                  style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
                >
                  {formatPrice(listing.price)}
                </p>
                {listing.negotiable && (
                  <span
                    className="inline-block text-[0.68rem] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(232,98,42,0.15)',
                      color: '#E8622A',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Negotiable
                  </span>
                )}
              </div>

              {/* Specs grid */}
              <div className="lrp-card">
                <p className="lrp-card-label mb-3">Vehicle Specs</p>
                <div className="grid grid-cols-2 gap-2">
                  <SpecPill icon={Calendar} label="Year" value={listing.year} />
                  <SpecPill
                    icon={Gauge}
                    label="Mileage"
                    value={
                      listing.mileage
                        ? `${Number(listing.mileage).toLocaleString()} km`
                        : listing.condition === 'New'
                          ? '0 km'
                          : null
                    }
                  />
                  <SpecPill icon={Fuel} label="Fuel" value={listing.fuel} />
                  <SpecPill icon={Settings} label="Transmission" value={listing.transmission} />
                  <SpecPill
                    icon={Zap}
                    label="Engine"
                    value={listing.engineCC ? `${listing.engineCC} cc` : null}
                  />
                  <SpecPill icon={Package} label="Assembly" value={listing.assembly} />
                  <SpecPill icon={Palette} label="Color" value={listing.color} />
                  <SpecPill icon={Tag} label="Body Type" value={listing.bodyType} />
                </div>
              </div>

              {/* Additional info */}
              <div className="lrp-card">
                <p className="lrp-card-label mb-2">Additional Details</p>
                <InfoRow label="Condition" value={listing.condition} />
                <InfoRow label="Registered In" value={listing.registeredIn} />
                <InfoRow label="Variant" value={listing.variant} />
                <InfoRow label="City" value={listing.city} />
                <InfoRow label="Area" value={listing.area} />
                <InfoRow label="WhatsApp" value={listing.whatsapp ? 'Available' : null} />
              </div>

              {/* Seller info */}
              <div className="lrp-card">
                <p className="lrp-card-label mb-3">Seller Information</p>
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-[0.88rem] font-extrabold flex-shrink-0"
                    style={{
                      background: 'rgba(108,60,225,0.1)',
                      color: '#6C3CE1',
                      fontFamily: "'Syne', sans-serif",
                    }}
                  >
                    {initials(seller.name)}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="text-[0.88rem] font-bold leading-tight truncate"
                      style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {seller.name || '—'}
                    </p>
                    <p
                      className="text-[0.72rem] truncate"
                      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {seller.email || '—'}
                    </p>
                  </div>
                  {seller.isAccountVerified && (
                    <ShieldCheck
                      size={14}
                      strokeWidth={2}
                      style={{ color: '#059669', flexShrink: 0, marginLeft: 'auto' }}
                      title="Verified account"
                    />
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <div
                    className="flex items-center gap-2.5 p-2.5 rounded-xl"
                    style={{ background: '#FAFAF9', border: '1px solid #F2EEE9' }}
                  >
                    <Phone size={12} strokeWidth={2} style={{ color: '#8A8390', flexShrink: 0 }} />
                    <span
                      className="text-[0.8rem] font-medium"
                      style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {listing.phone || seller.phone || '—'}
                    </span>
                  </div>
                  {seller.city && (
                    <div
                      className="flex items-center gap-2.5 p-2.5 rounded-xl"
                      style={{ background: '#FAFAF9', border: '1px solid #F2EEE9' }}
                    >
                      <MapPin
                        size={12}
                        strokeWidth={2}
                        style={{ color: '#8A8390', flexShrink: 0 }}
                      />
                      <span
                        className="text-[0.8rem] font-medium"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {seller.city}
                      </span>
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate(`/admin/users/${seller._id}`)}
                    className="w-full py-2 rounded-xl text-[0.78rem] font-semibold border mt-1 transition-colors"
                    style={{
                      color: '#6C3CE1',
                      borderColor: 'rgba(108,60,225,0.25)',
                      background: 'rgba(108,60,225,0.04)',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    View Seller Profile →
                  </button>
                </div>
              </div>

              {/* Submission meta */}
              <div className="lrp-card">
                <p className="lrp-card-label mb-2">Submission Details</p>
                <InfoRow label="Submitted" value={formatDate(listing.createdAt)} />
                <InfoRow
                  label="Last Updated"
                  value={listing.updatedAt ? formatDate(listing.updatedAt) : null}
                />
                <InfoRow
                  label="Total Views"
                  value={listing.views > 0 ? `${listing.views} views` : '0 views'}
                />
                <InfoRow
                  label="Images"
                  value={`${listing.images?.length || 0} photo${listing.images?.length !== 1 ? 's' : ''}`}
                />
              </div>

              {/* Bottom action strip — repeated for convenience when scrolled down */}
              <div
                className="flex gap-2.5 p-4 rounded-2xl sticky bottom-4"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #E8E3DC',
                  boxShadow: '0 8px 24px rgba(26,21,35,0.1)',
                  zIndex: 10,
                }}
              >
                {(isPending || isActive || isRejected) && (
                  <button
                    type="button"
                    onClick={() => setShowReject(true)}
                    disabled={rejecting || isRejected}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.82rem] font-semibold border transition-colors"
                    style={{
                      color: isRejected ? '#C4BDD0' : '#DC2626',
                      borderColor: isRejected ? '#E8E3DC' : 'rgba(220,38,38,0.3)',
                      background: isRejected ? '#FAFAF9' : 'rgba(220,38,38,0.05)',
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: isRejected ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <XCircle size={13} strokeWidth={2} />
                    {isRejected ? 'Already Rejected' : 'Reject'}
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => (isActive ? null : setModal('approve'))}
                  disabled={approving || isActive}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[0.82rem] font-semibold text-white transition-opacity"
                  style={{
                    background: isActive
                      ? 'rgba(5,150,105,0.15)'
                      : 'linear-gradient(135deg, #059669, #047857)',
                    color: isActive ? '#059669' : '#fff',
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: isActive ? 'not-allowed' : 'pointer',
                    opacity: approving ? 0.7 : 1,
                  }}
                >
                  <CheckCircle size={13} strokeWidth={2} />
                  {isActive ? 'Already Live' : approving ? 'Approving…' : 'Approve & Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .lrp-root {
    font-family: 'DM Sans', sans-serif;
    background: #F7F4F0;
    min-height: 100vh;
  }

  .lrp-inner {
    max-width: 1280px;
    margin: 0 auto;
    padding: 32px 24px 80px;
  }

  .lrp-eyebrow {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    color: #6C3CE1;
    font-family: 'DM Sans', sans-serif;
    margin: 0 0 4px;
  }

  .lrp-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.5rem;
    font-weight: 800;
    color: #1A1523;
    letter-spacing: -0.04em;
    margin: 0;
    line-height: 1.1;
  }

  .lrp-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 20px;
    align-items: start;
  }

  @media (max-width: 900px) {
    .lrp-grid {
      grid-template-columns: 1fr;
    }
    .lrp-inner {
      padding: 20px 16px 80px;
    }
    .lrp-title {
      font-size: 1.2rem;
    }
  }

  .lrp-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 20px;
    padding: 20px;
  }

  .lrp-card-label {
    font-size: 0.65rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #C4BDD0;
    font-family: 'DM Sans', sans-serif;
    margin: 0;
  }

  .lrp-btn-approve {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0 18px;
    height: 40px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #059669, #047857);
    color: #fff;
    font-size: 0.82rem;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: opacity 0.15s, transform 0.15s;
    box-shadow: 0 3px 12px rgba(5,150,105,0.25);
  }
  .lrp-btn-approve:hover:not(:disabled) {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  .lrp-btn-approve:disabled {
    opacity: 0.55;
    cursor: not-allowed;
    transform: none;
  }

  .lrp-btn-reject {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 0 18px;
    height: 40px;
    border-radius: 12px;
    border: 1.5px solid rgba(220,38,38,0.35);
    background: rgba(220,38,38,0.06);
    color: #DC2626;
    font-size: 0.82rem;
    font-weight: 700;
    font-family: 'DM Sans', sans-serif;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .lrp-btn-reject:hover:not(:disabled) {
    background: rgba(220,38,38,0.1);
    border-color: rgba(220,38,38,0.5);
  }
  .lrp-btn-reject:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .lrp-btn-delete {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 12px;
    border: 1.5px solid rgba(220,38,38,0.25);
    background: rgba(220,38,38,0.04);
    color: #DC2626;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .lrp-btn-delete:hover:not(:disabled) {
    background: rgba(220,38,38,0.1);
    border-color: rgba(220,38,38,0.4);
  }
  .lrp-btn-delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
