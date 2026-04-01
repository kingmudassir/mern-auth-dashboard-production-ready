import { useState, useMemo } from 'react';
import {
  Car,
  MapPin,
  Fuel,
  Gauge,
  Clock,
  Eye,
  Heart,
  Edit2,
  Trash2,
  Plus,
  Search,
  X,
  ArrowUpDown,
  LayoutGrid,
  List,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  TrendingUp,
  ChevronRight,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// 💡 TANSTACK INTEGRATION
//
//  const { data: ads = [], isLoading } = useQuery({
//    queryKey: ['my-ads'],
//    queryFn: () => axios.get('/api/user/ads').then(r => r.data),
//  });
//
//  const deleteMutation = useMutation({
//    mutationFn: (id) => axios.delete(`/api/ads/${id}`),
//    onSuccess: (_, id) =>
//      queryClient.setQueryData(['my-ads'], old => old.filter(a => a.id !== id)),
//  });
//
//  const patchMutation = useMutation({
//    mutationFn: ({ id, status }) => axios.patch(`/api/ads/${id}`, { status }),
//    onSuccess: () => queryClient.invalidateQueries(['my-ads']),
//  });
//
//  Replace the local `ads` useState and handlers with the above.
// ─────────────────────────────────────────────────────────────────

// ── Mock data ─────────────────────────────────────────────────────
const MOCK_ADS = [
  {
    id: 101,
    make: 'Toyota',
    model: 'Corolla',
    variant: 'Altis X 1.6',
    year: 2021,
    price: 2800000,
    city: 'Lahore',
    fuel: 'Petrol',
    transmission: 'Automatic',
    mileage: 42000,
    condition: 'Used',
    color: 'Pearl White',
    status: 'active',
    views: 318,
    saves: 24,
    postedAt: '5 days ago',
    expiresIn: '25 days',
    featured: true,
  },
  {
    id: 102,
    make: 'Honda',
    model: 'Civic',
    variant: 'Oriel 1.8',
    year: 2019,
    price: 2950000,
    city: 'Lahore',
    fuel: 'Petrol',
    transmission: 'Automatic',
    mileage: 68000,
    condition: 'Used',
    color: 'Lunar Silver',
    status: 'active',
    views: 142,
    saves: 11,
    postedAt: '2 weeks ago',
    expiresIn: '14 days',
    featured: false,
  },
  {
    id: 103,
    make: 'Suzuki',
    model: 'Alto',
    variant: 'VXR',
    year: 2022,
    price: 1600000,
    city: 'Rawalpindi',
    fuel: 'Petrol',
    transmission: 'Manual',
    mileage: 14000,
    condition: 'Used',
    color: 'Silky Silver',
    status: 'pending',
    views: 0,
    saves: 0,
    postedAt: '1 hour ago',
    expiresIn: '30 days',
    featured: false,
  },
  {
    id: 104,
    make: 'Kia',
    model: 'Sportage',
    variant: 'Alpha 2.0',
    year: 2020,
    price: 5700000,
    city: 'Islamabad',
    fuel: 'Petrol',
    transmission: 'Automatic',
    mileage: 38000,
    condition: 'Used',
    color: 'Snow White Pearl',
    status: 'expired',
    views: 520,
    saves: 39,
    postedAt: '35 days ago',
    expiresIn: null,
    featured: false,
  },
  {
    id: 105,
    make: 'Toyota',
    model: 'Fortuner',
    variant: 'Sigma 4 2.7',
    year: 2018,
    price: 7900000,
    city: 'Lahore',
    fuel: 'Petrol',
    transmission: 'Automatic',
    mileage: 82000,
    condition: 'Used',
    color: 'Super White',
    status: 'active',
    views: 87,
    saves: 7,
    postedAt: '3 days ago',
    expiresIn: '27 days',
    featured: false,
  },
  {
    id: 106,
    make: 'Honda',
    model: 'City',
    variant: 'Aspire 1.5',
    year: 2017,
    price: 2100000,
    city: 'Faisalabad',
    fuel: 'CNG',
    transmission: 'Automatic',
    mileage: 92000,
    condition: 'Used',
    color: 'Taffeta White',
    status: 'rejected',
    views: 0,
    saves: 0,
    postedAt: '2 days ago',
    expiresIn: null,
    featured: false,
  },
];

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

// ── Helpers ───────────────────────────────────────────────────────
const fmtPrice = (n) => {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(0)} Lac`;
  return `PKR ${n.toLocaleString()}`;
};

const fmtKm = (n) => (n >= 1000 ? `${(n / 1000).toFixed(0)}k km` : `${n} km`);

const STATUS_META = {
  active: {
    label: 'Active',
    Icon: CheckCircle2,
    color: '#16a34a',
    bg: 'rgba(34,197,94,0.09)',
    border: 'rgba(34,197,94,0.22)',
  },
  pending: {
    label: 'Under Review',
    Icon: AlertCircle,
    color: '#a16207',
    bg: 'rgba(234,179,8,0.09)',
    border: 'rgba(234,179,8,0.25)',
  },
  expired: {
    label: 'Expired',
    Icon: Clock,
    color: '#8A8390',
    bg: 'rgba(138,131,144,0.09)',
    border: 'rgba(138,131,144,0.22)',
  },
  rejected: {
    label: 'Rejected',
    Icon: XCircle,
    color: '#dc2626',
    bg: 'rgba(239,68,68,0.09)',
    border: 'rgba(239,68,68,0.22)',
  },
};

const BG_PAIRS = [
  ['#1A1523', '#231930'],
  ['#F2EEE9', '#EAE5DD'],
  ['#1F1A2E', '#2D2440'],
  ['#F7F4F0', '#EDE8E2'],
  ['#231930', '#1A1523'],
  ['#EDE8E2', '#E8E3DC'],
];

// ── Status badge ──────────────────────────────────────────────────
function StatusBadge({ status }) {
  const m = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-[0.3rem] rounded-full text-[0.67rem] font-bold whitespace-nowrap"
      style={{
        background: m.bg,
        color: m.color,
        border: `1px solid ${m.border}`,
        fontFamily: "'DM Sans',sans-serif",
      }}
    >
      <m.Icon size={10} strokeWidth={2.5} aria-hidden="true" />
      {m.label}
    </span>
  );
}

// ── Three-dot action dropdown ─────────────────────────────────────
function ActionMenu({ ad, onDelete, onPatch }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative" style={{ zIndex: open ? 30 : 1 }}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150"
        style={{
          background: open ? '#F2EEE9' : 'transparent',
          border: '1.5px solid #E8E3DC',
          cursor: 'pointer',
          color: '#8A8390',
        }}
        aria-label="Ad options"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <MoreHorizontal size={15} strokeWidth={2} aria-hidden="true" />
      </button>

      {open && (
        <>
          {/* backdrop */}
          <div
            className="fixed inset-0"
            style={{ zIndex: 20 }}
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="absolute right-0 top-full mt-1.5 w-44 rounded-2xl overflow-hidden"
            style={{
              background: '#FFFFFF',
              border: '1.5px solid #E8E3DC',
              boxShadow: '0 8px 32px rgba(26,21,35,0.13)',
              zIndex: 30,
            }}
            role="menu"
          >
            {/* View */}
            <a
              href={`/cars/${ad.id}`}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium no-underline transition-colors duration-150"
              style={{ color: '#1A1523', fontFamily: "'DM Sans',sans-serif" }}
              onClick={() => setOpen(false)}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(108,60,225,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Eye size={13} strokeWidth={1.8} style={{ color: '#8A8390' }} aria-hidden="true" />
              View listing
            </a>

            {/* Edit */}
            <a
              href={`/edit-ad/${ad.id}`}
              role="menuitem"
              className="flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium no-underline transition-colors duration-150"
              style={{ color: '#1A1523', fontFamily: "'DM Sans',sans-serif" }}
              onClick={() => setOpen(false)}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(108,60,225,0.05)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              <Edit2 size={13} strokeWidth={1.8} style={{ color: '#8A8390' }} aria-hidden="true" />
              Edit ad
            </a>

            {/* Contextual status action */}
            {ad.status === 'active' && (
              <button
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium text-left transition-colors duration-150"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#a16207',
                  fontFamily: "'DM Sans',sans-serif",
                }}
                onClick={() => {
                  onPatch(ad.id, 'expired');
                  setOpen(false);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(234,179,8,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <CheckCircle2 size={13} strokeWidth={1.8} aria-hidden="true" />
                Mark as sold
              </button>
            )}
            {(ad.status === 'expired' || ad.status === 'rejected') && (
              <button
                type="button"
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium text-left transition-colors duration-150"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#16a34a',
                  fontFamily: "'DM Sans',sans-serif",
                }}
                onClick={() => {
                  onPatch(ad.id, 'pending');
                  setOpen(false);
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34,197,94,0.06)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
              >
                <TrendingUp size={13} strokeWidth={1.8} aria-hidden="true" />
                Repost ad
              </button>
            )}

            {/* Divider + Delete */}
            <div
              style={{ height: '1px', background: '#F2EEE9', margin: '2px 0' }}
              aria-hidden="true"
            />
            <button
              type="button"
              role="menuitem"
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[0.8rem] font-medium text-left transition-colors duration-150"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#dc2626',
                fontFamily: "'DM Sans',sans-serif",
              }}
              onClick={() => {
                onDelete(ad.id);
                setOpen(false);
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.06)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
            >
              <Trash2 size={13} strokeWidth={1.8} aria-hidden="true" />
              Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ── Stat summary pill ─────────────────────────────────────────────
function StatPill({ icon: Icon, value, label }) {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-5 py-4"
      style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(108,60,225,0.07)' }}
      >
        <Icon size={16} strokeWidth={1.8} style={{ color: '#6C3CE1' }} aria-hidden="true" />
      </div>
      <div>
        <p
          className="text-[1.15rem] font-extrabold tracking-[-0.03em] leading-none"
          style={{ color: '#1A1523', fontFamily: "'Syne',sans-serif" }}
        >
          {value}
        </p>
        <p
          className="text-[0.68rem] mt-0.5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

// ── Ad card — grid ────────────────────────────────────────────────
function GridCard({ ad, onDelete, onPatch }) {
  const bg = BG_PAIRS[ad.id % BG_PAIRS.length];
  const isDark = ad.id % 2 === 0;

  return (
    <article
      className="upa-grid-card rounded-2xl overflow-hidden flex flex-col"
      style={{ opacity: ad.status === 'rejected' ? 0.72 : 1 }}
      aria-label={`${ad.year} ${ad.make} ${ad.model}`}
    >
      {/* Image */}
      <div
        className="relative flex items-center justify-center"
        style={{ height: '152px', background: `linear-gradient(135deg,${bg[0]},${bg[1]})` }}
      >
        {ad.featured && (
          <span
            className="absolute top-2.5 left-2.5 text-[0.58rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: '#C9A84C', color: '#1A1523', fontFamily: "'DM Sans',sans-serif" }}
          >
            Featured
          </span>
        )}
        <div className="absolute top-2.5 right-2.5">
          <ActionMenu ad={ad} onDelete={onDelete} onPatch={onPatch} />
        </div>
        <a
          href={`/cars/${ad.id}`}
          className="absolute inset-0 flex items-center justify-center"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="text-center select-none pointer-events-none">
            <div style={{ fontSize: '2.8rem' }} aria-hidden="true">
              🚗
            </div>
            <p
              className="text-[0.63rem] mt-0.5"
              style={{
                color: isDark ? 'rgba(255,255,255,0.28)' : '#C4BDD0',
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {ad.year} · {ad.color}
            </p>
          </div>
        </a>
      </div>

      {/* Body */}
      <div className="flex-1 p-4 flex flex-col gap-2.5">
        {/* Title + badge */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <a href={`/cars/${ad.id}`} className="no-underline">
              <h3
                className="text-[0.88rem] font-extrabold tracking-[-0.025em] leading-tight hover:text-[#6C3CE1] transition-colors duration-150"
                style={{ color: '#1A1523', fontFamily: "'Syne',sans-serif" }}
              >
                {ad.year} {ad.make} {ad.model}
              </h3>
            </a>
            <p
              className="text-[0.68rem] mt-0.5 truncate"
              style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
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
            style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
          >
            {ad.city}
          </span>
        </div>

        {/* Spec pills */}
        <div className="flex flex-wrap gap-1">
          {[ad.fuel, fmtKm(ad.mileage)].map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 rounded-full text-[0.64rem] font-medium"
              style={{
                background: '#F2EEE9',
                color: '#8A8390',
                fontFamily: "'DM Sans',sans-serif",
              }}
            >
              {v}
            </span>
          ))}
        </div>

        {/* Stats / notices */}
        {(ad.status === 'active' || ad.status === 'expired') && (
          <div
            className="flex items-center gap-3 px-3 py-2 rounded-xl"
            style={{ background: '#F7F4F0' }}
          >
            <span
              className="flex items-center gap-1 text-[0.66rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
            >
              <Eye size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />{' '}
              {ad.views.toLocaleString()}
            </span>
            <span
              className="flex items-center gap-1 text-[0.66rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
            >
              <Heart size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />{' '}
              {ad.saves}
            </span>
            {ad.expiresIn && (
              <span
                className="flex items-center gap-1 text-[0.66rem] ml-auto"
                style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
              >
                <Clock size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />{' '}
                {ad.expiresIn}
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
              style={{ color: '#a16207', flexShrink: 0, marginTop: '1px' }}
              aria-hidden="true"
            />
            <p
              className="text-[0.64rem]"
              style={{ color: '#a16207', fontFamily: "'DM Sans',sans-serif" }}
            >
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
              style={{ color: '#dc2626', flexShrink: 0, marginTop: '1px' }}
              aria-hidden="true"
            />
            <p
              className="text-[0.64rem]"
              style={{ color: '#dc2626', fontFamily: "'DM Sans',sans-serif" }}
            >
              Rejected — edit and repost
            </p>
          </div>
        )}

        {/* Price + edit */}
        <div
          className="flex items-center justify-between mt-auto pt-2.5"
          style={{ borderTop: '1px solid #F2EEE9' }}
        >
          <p
            className="text-[1rem] font-extrabold tracking-[-0.03em]"
            style={{ color: '#E8622A', fontFamily: "'Syne',sans-serif" }}
          >
            {fmtPrice(ad.price)}
          </p>
          <a
            href={`/edit-ad/${ad.id}`}
            className="inline-flex items-center gap-1 text-[0.7rem] font-semibold px-2.5 py-1.5 rounded-lg no-underline transition-colors duration-150"
            style={{
              color: '#6C3CE1',
              background: 'rgba(108,60,225,0.08)',
              fontFamily: "'DM Sans',sans-serif",
            }}
            aria-label={`Edit ${ad.make} ${ad.model}`}
          >
            <Edit2 size={11} strokeWidth={2} aria-hidden="true" /> Edit
          </a>
        </div>
      </div>
    </article>
  );
}

// ── Ad card — list ────────────────────────────────────────────────
function ListCard({ ad, onDelete, onPatch }) {
  const bg = BG_PAIRS[ad.id % BG_PAIRS.length];
  const isDark = ad.id % 2 === 0;

  return (
    <article
      className="upa-list-card rounded-2xl overflow-hidden flex"
      style={{ opacity: ad.status === 'rejected' ? 0.72 : 1 }}
      aria-label={`${ad.year} ${ad.make} ${ad.model}`}
    >
      {/* Thumbnail */}
      <a
        href={`/cars/${ad.id}`}
        className="flex-shrink-0 flex items-center justify-center"
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
              color: isDark ? 'rgba(255,255,255,0.28)' : '#C4BDD0',
              fontFamily: "'DM Sans',sans-serif",
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
                  style={{ color: '#1A1523', fontFamily: "'Syne',sans-serif" }}
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
                className="text-[0.7rem] mt-0.5"
                style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
              >
                {ad.variant}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <StatusBadge status={ad.status} />
              <ActionMenu ad={ad} onDelete={onDelete} onPatch={onPatch} />
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-2.5 flex-wrap">
            <span
              className="flex items-center gap-1 text-[0.7rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
            >
              <MapPin size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
              {ad.city}
            </span>
            <span
              className="flex items-center gap-1 text-[0.7rem]"
              style={{ color: '#B0AABA', fontFamily: "'DM Sans',sans-serif" }}
            >
              <Clock size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
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
                  fontFamily: "'DM Sans',sans-serif",
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
              <AlertCircle
                size={12}
                strokeWidth={2}
                style={{ color: '#a16207' }}
                aria-hidden="true"
              />
              <p
                className="text-[0.7rem]"
                style={{ color: '#a16207', fontFamily: "'DM Sans',sans-serif" }}
              >
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
              <XCircle size={12} strokeWidth={2} style={{ color: '#dc2626' }} aria-hidden="true" />
              <p
                className="text-[0.7rem]"
                style={{ color: '#dc2626', fontFamily: "'DM Sans',sans-serif" }}
              >
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
            style={{ color: '#E8622A', fontFamily: "'Syne',sans-serif" }}
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
                  style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
                >
                  <Eye size={12} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
                  {ad.views.toLocaleString()} views
                </span>
                <span
                  className="flex items-center gap-1.5 text-[0.7rem]"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
                >
                  <Heart
                    size={11}
                    strokeWidth={2}
                    style={{ color: '#C4BDD0' }}
                    aria-hidden="true"
                  />
                  {ad.saves} saves
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
                fontFamily: "'DM Sans',sans-serif",
              }}
              aria-label={`Edit ${ad.make} ${ad.model}`}
            >
              <Edit2 size={12} strokeWidth={2} aria-hidden="true" /> Edit Ad
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

// ── Delete confirm modal ──────────────────────────────────────────
function DeleteModal({ ad, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Confirm delete listing"
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm"
        style={{ border: '1.5px solid #E8E3DC', boxShadow: '0 20px 60px rgba(26,21,35,0.18)' }}
      >
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
          style={{ background: 'rgba(239,68,68,0.1)' }}
          aria-hidden="true"
        >
          <Trash2 size={18} strokeWidth={2} style={{ color: '#dc2626' }} />
        </div>
        <h3
          className="text-[1rem] font-extrabold mb-1 tracking-[-0.025em]"
          style={{ color: '#1A1523', fontFamily: "'Syne',sans-serif" }}
        >
          Delete this listing?
        </h3>
        <p
          className="text-[0.82rem] font-semibold mb-1"
          style={{ color: '#1A1523', fontFamily: "'DM Sans',sans-serif" }}
        >
          {ad.year} {ad.make} {ad.model}
        </p>
        <p
          className="text-[0.78rem] leading-relaxed mb-5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
        >
          This will permanently remove the listing. Buyers won't be able to find it. This cannot be
          undone.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-[0.82rem] font-medium py-2.5 rounded-xl border"
            style={{
              color: '#8A8390',
              borderColor: '#E8E3DC',
              background: 'transparent',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg,#dc2626,#b91c1c)',
              fontFamily: "'DM Sans',sans-serif",
            }}
          >
            Delete
          </button>
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
        style={{ background: 'rgba(108,60,225,0.07)' }}
        aria-hidden="true"
      >
        <Car size={30} strokeWidth={1.5} style={{ color: '#6C3CE1', opacity: 0.45 }} />
      </div>
      <h2
        className="text-[1.15rem] font-extrabold tracking-[-0.03em] mb-2"
        style={{ color: '#1A1523', fontFamily: "'Syne',sans-serif" }}
      >
        {isFiltered ? 'No ads match' : 'No ads posted yet'}
      </h2>
      <p
        className="text-[0.85rem] max-w-xs leading-relaxed mb-7"
        style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
      >
        {isFiltered
          ? 'Try a different filter or search term.'
          : 'Post your first car listing and start reaching buyers across Pakistan.'}
      </p>
      {isFiltered ? (
        <button
          type="button"
          onClick={onClear}
          className="text-[0.82rem] font-semibold px-5 py-2.5 rounded-xl border"
          style={{
            color: '#6C3CE1',
            borderColor: 'rgba(108,60,225,0.28)',
            background: 'rgba(108,60,225,0.05)',
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          Clear filters
        </button>
      ) : (
        <a
          href="/post-ad"
          className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-white px-6 py-3 rounded-xl no-underline transition-transform duration-150 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg,#6C3CE1,#5A2FCA)',
            boxShadow: '0 2px 12px rgba(108,60,225,0.28)',
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          <Plus size={15} strokeWidth={2.5} aria-hidden="true" /> Post Your First Ad
        </a>
      )}
    </div>
  );
}

// ── Main page component ───────────────────────────────────────────
export default function MyAds() {
  const [ads, setAds] = useState(MOCK_ADS);
  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [view, setView] = useState('grid');
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Derived stats
  const totalViews = ads.reduce((s, a) => s + a.views, 0);
  const totalSaves = ads.reduce((s, a) => s + a.saves, 0);
  const activeCount = ads.filter((a) => a.status === 'active').length;

  // Handlers
  const handleDeleteRequest = (id) => setDeleteTarget(ads.find((a) => a.id === id));
  const handleDeleteConfirm = () => {
    setAds((p) => p.filter((a) => a.id !== deleteTarget.id));
    setDeleteTarget(null);
  };
  const handlePatch = (id, status) =>
    setAds((p) => p.map((a) => (a.id === id ? { ...a, status } : a)));

  // Filter + sort
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
        r.sort((a, b) => b.id - a.id);
    }
    return r;
  }, [ads, search, statusTab, sortBy]);

  const isFiltered = !!search.trim() || statusTab !== 'all';

  return (
    <>
      <style>{STYLES}</style>

      {deleteTarget && (
        <DeleteModal
          ad={deleteTarget}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}

      <div className="upa-page">
        <div className="upa-inner">
          {/* ── Page heading ───────────────────────────────── */}
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

          {/* ── Stats row ──────────────────────────────────── */}
          {ads.length > 0 && (
            <div className="upa-stats mb-7">
              <StatPill icon={Car} value={ads.length} label="Total listings" />
              <StatPill icon={CheckCircle2} value={activeCount} label="Active" />
              <StatPill icon={Eye} value={totalViews.toLocaleString()} label="Total views" />
              <StatPill icon={Heart} value={totalSaves} label="Total saves" />
            </div>
          )}

          {/* ── Status tabs ────────────────────────────────── */}
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

          {/* ── Controls bar ───────────────────────────────── */}
          {ads.length > 0 && (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              {/* Search */}
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

              {/* Sort */}
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

              {/* Result count */}
              <span
                className="text-[0.75rem] ml-auto"
                style={{ color: '#B0AABA', fontFamily: "'DM Sans',sans-serif" }}
                aria-live="polite"
              >
                {filtered.length !== ads.length
                  ? `${filtered.length} of ${ads.length}`
                  : `${ads.length} listing${ads.length !== 1 ? 's' : ''}`}
              </span>

              {/* View toggle */}
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
                  key={ad.id}
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
                  key={ad.id}
                  ad={ad}
                  onDelete={handleDeleteRequest}
                  onPatch={handlePatch}
                />
              ))}
            </div>
          )}

          {/* ── Feature CTA banner ──────────────────────────── */}
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

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  /* ── Page shell — sits inside dl-content from DashboardLayout ── */
  .upa-page {
    background: #F7F4F0;
    min-height: 100vh;
  }

  .upa-inner {
    max-width: 1080px;
    margin: 0 auto;
    padding: 40px 32px 72px;
  }

  /* ── Stats ── */
  .upa-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
  }

  /* ── Card grid ── */
  .upa-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(238px, 1fr));
    gap: 16px;
  }

  /* ── Cards ── */
  .upa-grid-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  }
  .upa-grid-card:hover {
    box-shadow: 0 6px 24px rgba(26,21,35,0.09);
    transform: translateY(-2px);
    border-color: rgba(108,60,225,0.18);
  }

  .upa-list-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }
  .upa-list-card:hover {
    box-shadow: 0 4px 20px rgba(26,21,35,0.08);
    border-color: rgba(108,60,225,0.18);
  }

  /* ── Search ── */
  .upa-search-wrap {
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
  .upa-search-wrap:focus-within {
    border-color: rgba(108,60,225,0.4);
    box-shadow: 0 0 0 3px rgba(108,60,225,0.07);
  }
  .upa-search-icon {
    position: absolute;
    left: 12px;
    color: #C4BDD0;
    pointer-events: none;
  }
  .upa-search-input {
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
  .upa-search-input::placeholder { color: #C4BDD0; }
  .upa-search-clear {
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
  .upa-search-clear:hover { color: #8A8390; }

  /* ── Sort ── */
  .upa-sort-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 12px;
    min-width: 158px;
    transition: border-color 0.2s ease;
  }
  .upa-sort-wrap:focus-within { border-color: rgba(108,60,225,0.4); }
  .upa-sort-icon {
    position: absolute;
    left: 11px;
    color: #C4BDD0;
    pointer-events: none;
  }
  .upa-sort-select {
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

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .upa-stats { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 768px) {
    .upa-inner { padding: 28px 20px 60px; }
    .upa-grid  { grid-template-columns: repeat(2, 1fr); gap: 12px; }
    .upa-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; }
  }

  @media (max-width: 480px) {
    .upa-inner { padding: 24px 16px 56px; }
    .upa-grid  { grid-template-columns: 1fr; }
    .upa-stats { grid-template-columns: repeat(2, 1fr); }
  }
`;
