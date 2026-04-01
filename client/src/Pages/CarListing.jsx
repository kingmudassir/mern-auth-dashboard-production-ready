import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCarById, useGetSimilarCars } from '../Hooks/Car-Listing/useGetCarById'; // adjust path
import {
  ArrowLeft,
  Heart,
  Share2,
  Flag,
  MapPin,
  Calendar,
  Fuel,
  Gauge,
  Settings2,
  Palette,
  Car,
  Shield,
  CheckCircle2,
  Phone,
  MessageCircle,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
  Check,
  Copy,
  ExternalLink,
  Clock,
  Users,
  Star,
  BadgeCheck,
} from 'lucide-react';

const REPORT_REASONS = [
  'Misleading price or description',
  'Duplicate listing',
  'Fraudulent or scam activity',
  'Wrong category',
  'Offensive content',
  'Car already sold',
  'Fake photos or stolen images',
  'Other',
];

// ── Helpers ───────────────────────────────────────────────────────
const fmtPrice = (n) => {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Crore`;
  if (n >= 100000) return `${(n / 100000).toFixed(0)} Lac`;
  return `PKR ${n.toLocaleString()}`;
};
const fmtMileage = (n) => `${Number(n).toLocaleString()} km`;
const fmtDate = (d) => new Date(d).toLocaleDateString('en-PK', { year: 'numeric', month: 'long' });
const timeAgo = (d) => {
  const diff = Date.now() - new Date(d).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  const months = Math.floor(days / 30);
  return `${months} month${months > 1 ? 's' : ''} ago`;
};

// ── Image gallery ─────────────────────────────────────────────────
// Accepts real images array: [{ url, publicId }]
// Falls back to emoji placeholders if empty (dev convenience)
function Gallery({ images = [], make, model, year }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length || 1;
  const hasReal = images.length > 0;
  const currentUrl = hasReal ? images[active]?.url : null;

  // Fallback gradient pairs for placeholder mode
  const BG = [
    ['#1A1523', '#231930'],
    ['#F2EEE9', '#EAE5DD'],
    ['#1F1A2E', '#2D2440'],
    ['#F7F4F0', '#EDE8E2'],
    ['#1A1523', '#1F1A2E'],
    ['#EDE8E2', '#E8E3DC'],
    ['#231930', '#2D2440'],
  ];
  const bg = (i) => `linear-gradient(135deg, ${BG[i % BG.length][0]}, ${BG[i % BG.length][1]})`;

  const Placeholder = ({ size = '6rem' }) => (
    <div className="text-center select-none">
      <div style={{ fontSize: size }} aria-hidden="true">
        🚗
      </div>
      <p
        style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: '0.75rem',
          fontFamily: "'DM Sans', sans-serif",
          marginTop: '6px',
        }}
      >
        {year} {make} {model}
      </p>
    </div>
  );

  const NavBtn = ({ onClick, label, children, style = {} }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center"
      style={{
        background: 'rgba(255,255,255,0.15)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        ...style,
      }}
      aria-label={label}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: 'rgba(26,21,35,0.95)' }}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Close lightbox"
          >
            <X size={20} strokeWidth={2} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive((p) => (p - 1 + count) % count);
            }}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} strokeWidth={2} />
          </button>

          <div
            className="lightbox-img flex items-center justify-center rounded-2xl overflow-hidden"
            style={{ background: currentUrl ? '#000' : bg(active) }}
            onClick={(e) => e.stopPropagation()}
          >
            {currentUrl ? (
              <img
                src={currentUrl}
                alt={`${year} ${make} ${model} photo ${active + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            ) : (
              <Placeholder size="5rem" />
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setActive((p) => (p + 1) % count);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
            }}
            aria-label="Next image"
          >
            <ChevronRight size={20} strokeWidth={2} />
          </button>

          <p
            className="absolute bottom-5 text-[0.78rem]"
            style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif" }}
          >
            {active + 1} / {count}
          </p>
        </div>
      )}

      {/* Main image */}
      <div
        className="gallery-main rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden"
        style={{ background: currentUrl ? '#0D0B12' : bg(active) }}
        onClick={() => setLightbox(true)}
        role="button"
        tabIndex={0}
        aria-label="Open photo gallery"
        onKeyDown={(e) => e.key === 'Enter' && setLightbox(true)}
      >
        {currentUrl ? (
          <img
            src={currentUrl}
            alt={`${year} ${make} ${model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <Placeholder />
        )}

        {count > 1 && (
          <>
            <NavBtn
              onClick={(e) => {
                e.stopPropagation();
                setActive((p) => (p - 1 + count) % count);
              }}
              label="Previous photo"
              style={{ left: '12px' }}
            >
              <ChevronLeft size={17} strokeWidth={2} />
            </NavBtn>
            <NavBtn
              onClick={(e) => {
                e.stopPropagation();
                setActive((p) => (p + 1) % count);
              }}
              label="Next photo"
              style={{ right: '12px' }}
            >
              <ChevronRight size={17} strokeWidth={2} />
            </NavBtn>
          </>
        )}

        <span
          className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[0.72rem] font-semibold"
          style={{
            background: 'rgba(26,21,35,0.6)',
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {active + 1} / {count}
        </span>
        {!currentUrl && (
          <p
            className="absolute bottom-3 left-3 text-[0.72rem]"
            style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'DM Sans', sans-serif" }}
          >
            tap to expand
          </p>
        )}
      </div>

      {/* Thumbnails */}
      {count > 1 && (
        <div
          className="flex gap-2 mt-3 overflow-x-auto pb-1"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {images.map((img, i) => (
            <button
              key={img.publicId ?? i}
              type="button"
              onClick={() => setActive(i)}
              className="flex-shrink-0 rounded-xl overflow-hidden transition-all duration-150"
              style={{
                width: '68px',
                height: '52px',
                border: i === active ? '2px solid #E8622A' : '2px solid transparent',
                opacity: i === active ? 1 : 0.6,
                background: '#0D0B12',
                cursor: 'pointer',
              }}
              aria-label={`Photo ${i + 1}`}
              aria-pressed={i === active}
            >
              <img
                src={img.url}
                alt={`Thumbnail ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </button>
          ))}
        </div>
      )}
    </>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────
function PageSkeleton() {
  const Box = ({ w = '100%', h = '16px', r = '8px', mt = '0' }) => (
    <div
      className="animate-pulse"
      style={{ width: w, height: h, borderRadius: r, background: '#EDE8E2', marginTop: mt }}
    />
  );
  return (
    <div className="cl-page" style={{ paddingTop: '66px' }}>
      <div className="cl-inner">
        <div className="cl-grid">
          <div className="cl-left flex flex-col gap-4">
            <Box h="420px" r="20px" />
            <div className="cl-card flex flex-col gap-3">
              <Box w="55%" h="22px" />
              <Box w="35%" h="14px" />
              <Box w="40%" h="28px" mt="8px" />
            </div>
            <div className="cl-card flex flex-col gap-3">
              <Box w="40%" h="16px" />
              {[...Array(5)].map((_, i) => (
                <Box key={i} h="13px" w={`${70 + (i % 3) * 10}%`} />
              ))}
            </div>
          </div>
          <div className="cl-right">
            <div className="cl-card flex flex-col gap-3">
              <Box w="70%" h="22px" />
              <Box w="45%" h="14px" />
              <Box w="50%" h="32px" mt="8px" />
              <Box h="48px" r="12px" mt="8px" />
              <Box h="48px" r="12px" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Report modal ──────────────────────────────────────────────────
function ReportModal({ onClose, carId }) {
  const [step, setStep] = useState('select');
  const [selectedReason, setSelectedReason] = useState('');
  const [detail, setDetail] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleSubmit = async () => {
    if (!selectedReason) {
      setErr('Please select a reason');
      return;
    }
    setLoading(true);
    setErr('');
    // TODO: replace with reportMutation.mutate({ reason: selectedReason, detail })
    await new Promise((r) => setTimeout(r, 1100));
    setLoading(false);
    setStep('done');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="Report listing"
    >
      <div
        className="report-modal bg-white w-full sm:max-w-md p-6 sm:p-7"
        style={{
          border: '1.5px solid #E8E3DC',
          boxShadow: '0 20px 60px rgba(26,21,35,0.18)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '92vh',
          overflowY: 'auto',
        }}
      >
        <div
          className="sm:hidden mx-auto mb-4 rounded-full"
          style={{ width: '36px', height: '4px', background: '#E8E3DC' }}
        />

        {step === 'done' ? (
          <div className="text-center py-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(34,197,94,0.1)' }}
            >
              <CheckCircle2 size={28} strokeWidth={1.8} style={{ color: '#16a34a' }} />
            </div>
            <h3
              className="text-[1.1rem] font-extrabold mb-2"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Report submitted
            </h3>
            <p
              className="text-[0.82rem] leading-relaxed mb-6"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Thank you. Our team will review this listing within 24 hours.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="w-full py-3 rounded-xl text-white text-[0.875rem] font-semibold"
              style={{
                background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-start justify-between mb-5">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(232,98,42,0.1)' }}
                >
                  <Flag size={17} strokeWidth={2} style={{ color: '#E8622A' }} />
                </div>
                <div>
                  <h3
                    className="text-[1rem] font-extrabold"
                    style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                  >
                    Report this listing
                  </h3>
                  <p
                    className="text-[0.72rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Help us keep Paiyya safe
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{
                  background: '#F2EEE9',
                  color: '#8A8390',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label="Close"
              >
                <X size={14} strokeWidth={2} />
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-4">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setSelectedReason(r);
                    setErr('');
                  }}
                  className="flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all duration-150"
                  style={{
                    border: selectedReason === r ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
                    background: selectedReason === r ? 'rgba(108,60,225,0.05)' : '#FAFAF9',
                    cursor: 'pointer',
                    minHeight: '44px',
                  }}
                  aria-pressed={selectedReason === r}
                >
                  <span
                    className="text-[0.82rem] font-medium"
                    style={{
                      color: selectedReason === r ? '#6C3CE1' : '#1A1523',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {r}
                  </span>
                  {selectedReason === r && (
                    <Check
                      size={14}
                      strokeWidth={2.5}
                      style={{ color: '#6C3CE1', flexShrink: 0 }}
                    />
                  )}
                </button>
              ))}
            </div>

            <textarea
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="Additional details (optional)…"
              rows={3}
              className="w-full rounded-xl border text-[0.82rem] p-3 outline-none resize-none mb-4"
              style={{
                borderColor: '#E8E3DC',
                background: '#FAFAF9',
                color: '#1A1523',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px',
              }}
              aria-label="Additional details"
            />

            {err && (
              <p
                className="flex items-center gap-1.5 text-[0.75rem] mb-3"
                style={{ color: '#E8622A', fontFamily: "'DM Sans', sans-serif" }}
              >
                <AlertCircle size={12} strokeWidth={2} /> {err}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-[0.82rem] font-medium border"
                style={{
                  color: '#8A8390',
                  borderColor: '#E8E3DC',
                  background: 'transparent',
                  fontFamily: "'DM Sans', sans-serif",
                  minHeight: '48px',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 py-3 rounded-xl text-[0.82rem] font-semibold text-white disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #E8622A, #C4531F)',
                  fontFamily: "'DM Sans', sans-serif",
                  minHeight: '48px',
                }}
              >
                {loading ? 'Submitting…' : 'Submit Report'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ── Share modal ───────────────────────────────────────────────────
function ShareModal({ onClose, title }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;

  const copy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="share-modal bg-white w-full sm:max-w-sm p-6 sm:p-7"
        style={{
          border: '1.5px solid #E8E3DC',
          boxShadow: '0 20px 60px rgba(26,21,35,0.18)',
          borderRadius: '20px 20px 0 0',
        }}
      >
        <div
          className="sm:hidden mx-auto mb-4 rounded-full"
          style={{ width: '36px', height: '4px', background: '#E8E3DC' }}
        />
        <div className="flex items-center justify-between mb-5">
          <h3
            className="text-[1rem] font-extrabold"
            style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
          >
            Share listing
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center"
            style={{ background: '#F2EEE9', color: '#8A8390', border: 'none', cursor: 'pointer' }}
            aria-label="Close"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>
        <p
          className="text-[0.78rem] mb-4 truncate font-medium"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {title}
        </p>
        <div
          className="flex items-center gap-2 p-3 rounded-xl mb-4"
          style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DC' }}
        >
          <p
            className="flex-1 text-[0.75rem] truncate"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            {url}
          </p>
          <button
            type="button"
            onClick={copy}
            className="shrink-0 flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-lg"
            style={{
              background: copied ? 'rgba(34,197,94,0.1)' : 'rgba(108,60,225,0.1)',
              color: copied ? '#16a34a' : '#6C3CE1',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              minHeight: '36px',
            }}
          >
            {copied ? <Check size={12} strokeWidth={2.5} /> : <Copy size={12} strokeWidth={2} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            {
              label: 'WhatsApp',
              color: '#25D366',
              href: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
            },
            {
              label: 'Facebook',
              color: '#1877F2',
              href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            },
          ].map(({ label, color, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl text-[0.8rem] font-semibold text-white"
              style={{
                background: color,
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
                padding: '12px 8px',
                minHeight: '48px',
              }}
            >
              <ExternalLink size={13} strokeWidth={2} /> {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Spec row ──────────────────────────────────────────────────────
function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null;
  return (
    <div
      className="flex items-center justify-between py-3"
      style={{ borderBottom: '1px solid #F7F4F0' }}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: 'rgba(108,60,225,0.07)' }}
        >
          <Icon size={14} strokeWidth={1.9} style={{ color: '#6C3CE1' }} aria-hidden="true" />
        </div>
        <span
          className="text-[0.8rem]"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </span>
      </div>
      <span
        className="text-[0.85rem] font-semibold text-right ml-2"
        style={{
          color: '#1A1523',
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: '55%',
          wordBreak: 'break-word',
        }}
      >
        {value}
      </span>
    </div>
  );
}

// ── Similar car card ──────────────────────────────────────────────
function SimilarCard({ car }) {
  const thumb = car.images?.[0]?.url;
  return (
    <a
      href={`/cars/${car._id}`}
      className="similar-card rounded-2xl overflow-hidden flex flex-col"
      style={{ textDecoration: 'none' }}
      aria-label={`${car.year} ${car.make} ${car.model}`}
    >
      <div
        className="flex items-center justify-center overflow-hidden"
        style={{
          height: '110px',
          background: thumb ? '#0D0B12' : 'linear-gradient(135deg, #F2EEE9, #EAE5DD)',
        }}
      >
        {thumb ? (
          <img
            src={thumb}
            alt={`${car.year} ${car.make} ${car.model}`}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div className="text-center">
            <div style={{ fontSize: '2.2rem' }} aria-hidden="true">
              🚗
            </div>
            <p
              className="text-[0.62rem]"
              style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
            >
              {car.year} · {car.fuel}
            </p>
          </div>
        )}
      </div>
      <div className="p-3">
        <p
          className="text-[0.82rem] font-extrabold tracking-[-0.02em] leading-snug"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          {car.year} {car.make} {car.model}
          {car.variant ? ` ${car.variant}` : ''}
        </p>
        <p
          className="text-[0.7rem] mt-0.5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {car.city} · {car.mileage ? `${(car.mileage / 1000).toFixed(0)}k km` : 'N/A'}
        </p>
        <p
          className="text-[0.95rem] font-extrabold mt-1.5"
          style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
        >
          {fmtPrice(car.price)}
        </p>
      </div>
    </a>
  );
}

function SimilarSkeleton() {
  return (
    <div className="similar-card rounded-2xl overflow-hidden animate-pulse">
      <div style={{ height: '110px', background: '#F2EEE9' }} />
      <div className="p-3 flex flex-col gap-2">
        <div style={{ height: '14px', width: '80%', background: '#F2EEE9', borderRadius: '6px' }} />
        <div style={{ height: '11px', width: '55%', background: '#F2EEE9', borderRadius: '6px' }} />
        <div style={{ height: '16px', width: '45%', background: '#F2EEE9', borderRadius: '6px' }} />
      </div>
    </div>
  );
}

// ── Mobile sticky CTA ─────────────────────────────────────────────
function MobileCTABar({ phone, whatsapp, title, phoneVisible, setPhoneVisible }) {
  // whatsapp is a boolean on the schema — we use phone for both channels
  const waNumber = phone?.replace(/^0/, '92');

  return (
    <div className="mobile-cta-bar">
      <button
        type="button"
        onClick={() => setPhoneVisible((p) => !p)}
        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[0.82rem] font-semibold"
        style={{
          background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
          boxShadow: '0 2px 12px rgba(108,60,225,0.3)',
          fontFamily: "'DM Sans', sans-serif",
          border: 'none',
          cursor: 'pointer',
          minHeight: '48px',
        }}
      >
        <Phone size={15} strokeWidth={2} aria-hidden="true" />
        {phoneVisible ? phone : 'Call'}
      </button>
      {whatsapp && (
        <a
          href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I'm interested in your ${title} on Paiyya.`)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-[0.82rem] font-semibold"
          style={{
            background: '#25D366',
            boxShadow: '0 2px 10px rgba(37,211,102,0.3)',
            fontFamily: "'DM Sans', sans-serif",
            textDecoration: 'none',
            minHeight: '48px',
          }}
        >
          <MessageCircle size={15} strokeWidth={2} aria-hidden="true" />
          WhatsApp
        </a>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function CarListing() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const { data: carData, isLoading, isError } = useGetCarById(carId);
  const car = carData?.car;
  console.log('Full carData from Hook:', carData);
  const { data: similarData, isLoading: similarLoading } = useGetSimilarCars(car?.make, car?._id);
  const similarCars = similarData?.data?.cars?.slice(0, 4) ?? [];

  const [liked, setLiked] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);

  if (isLoading) return <PageSkeleton />;

  if (isError || !car) {
    return (
      <div className="cl-page" style={{ paddingTop: '66px' }}>
        <div className="cl-inner flex flex-col items-center justify-center py-24 text-center">
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
          <h2
            className="text-[1.2rem] font-extrabold mb-2"
            style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
          >
            Listing not found
          </h2>
          <p
            className="text-[0.85rem] mb-5"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            This listing may have been removed or doesn't exist.
          </p>
          <button
            type="button"
            onClick={() => navigate('/cars')}
            className="text-[0.82rem] font-semibold text-white px-5 py-2.5 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Browse all cars
          </button>
        </div>
      </div>
    );
  }

  const title = `${car.year} ${car.make} ${car.model}${car.variant ? ' ' + car.variant : ''}`;
  const priceFormatted = fmtPrice(car.price);
  const postedAgo = timeAgo(car.createdAt);
  const updatedAgo = timeAgo(car.updatedAt);
  const waNumber = car.phone?.replace(/^0/, '92');

  // Seller info — postedBy is populated with { name, createdAt }
  const seller = car.postedBy ?? {};
  const sellerInitials = seller.name
    ? seller.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <>
      <style>{STYLES}</style>

      {showReport && <ReportModal onClose={() => setShowReport(false)} carId={carId} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} title={title} />}

      <MobileCTABar
        phone={car.phone}
        whatsapp={car.whatsapp}
        title={title}
        phoneVisible={phoneVisible}
        setPhoneVisible={setPhoneVisible}
      />

      <div className="cl-page">
        <div className="cl-inner">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-4 flex-wrap" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-[0.78rem] font-medium"
              style={{
                color: '#8A8390',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                padding: '6px 0',
                minHeight: '36px',
              }}
            >
              <ArrowLeft size={13} strokeWidth={2} /> Back
            </button>
            <span className="hidden sm:inline" style={{ color: '#E8E3DC' }}>
              /
            </span>
            <a
              href="/cars"
              className="hidden sm:inline text-[0.78rem]"
              style={{
                color: '#8A8390',
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Cars
            </a>
            <span className="hidden sm:inline" style={{ color: '#E8E3DC' }}>
              /
            </span>
            <a
              href={`/cars?make=${car.make}`}
              className="hidden sm:inline text-[0.78rem]"
              style={{
                color: '#8A8390',
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {car.make}
            </a>
            <span className="hidden sm:inline" style={{ color: '#E8E3DC' }}>
              /
            </span>
            <span
              className="hidden sm:inline text-[0.78rem] font-medium"
              style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
            >
              {car.model}
            </span>
          </nav>

          {/* Main grid */}
          <div className="cl-grid">
            {/* Left column */}
            <div className="cl-left">
              <Gallery images={car.images} make={car.make} model={car.model} year={car.year} />

              {/* Mobile title block */}
              <div className="mobile-title-block cl-card mt-4">
                <h1
                  className="text-[1.2rem] font-extrabold tracking-[-0.03em] leading-tight mb-1"
                  style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                >
                  {title}
                </h1>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <MapPin
                    size={12}
                    strokeWidth={2}
                    style={{ color: '#C4BDD0' }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.75rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {car.area ? `${car.area}, ` : ''}
                    {car.city}
                  </span>
                  <span style={{ color: '#E8E3DC' }}>·</span>
                  <Clock
                    size={11}
                    strokeWidth={2}
                    style={{ color: '#C4BDD0' }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.75rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {postedAgo}
                  </span>
                </div>
                <p
                  className="text-[1.8rem] font-extrabold tracking-[-0.04em]"
                  style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
                >
                  {priceFormatted}{' '}
                  {car.negotiable && (
                    <span
                      className="text-[0.7rem] font-normal"
                      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      · Negotiable
                    </span>
                  )}
                </p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { icon: Calendar, val: car.year },
                    { icon: Gauge, val: car.mileage != null ? fmtMileage(car.mileage) : 'N/A' },
                    { icon: Fuel, val: car.fuel },
                    { icon: Settings2, val: car.transmission },
                  ].map(({ icon: Icon, val }) => (
                    <div
                      key={String(val)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl"
                      style={{ background: '#F7F4F0' }}
                    >
                      <Icon
                        size={12}
                        strokeWidth={1.9}
                        style={{ color: '#6C3CE1', flexShrink: 0 }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[0.75rem] font-medium"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center gap-2 mt-4 flex-wrap">
                <button
                  type="button"
                  onClick={() => setLiked((p) => !p)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[0.8rem] font-medium transition-all duration-150"
                  style={{
                    borderColor: liked ? 'rgba(232,98,42,0.3)' : '#E8E3DC',
                    background: liked ? 'rgba(232,98,42,0.06)' : '#FFFFFF',
                    color: liked ? '#E8622A' : '#8A8390',
                    fontFamily: "'DM Sans', sans-serif",
                    minHeight: '40px',
                  }}
                  aria-pressed={liked}
                  aria-label={liked ? 'Remove from saved' : 'Save listing'}
                >
                  <Heart
                    size={14}
                    strokeWidth={2}
                    style={{ fill: liked ? '#E8622A' : 'none' }}
                    aria-hidden="true"
                  />
                  {liked ? 'Saved' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowShare(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[0.8rem] font-medium transition-colors duration-150"
                  style={{
                    borderColor: '#E8E3DC',
                    background: '#FFFFFF',
                    color: '#8A8390',
                    fontFamily: "'DM Sans', sans-serif",
                    minHeight: '40px',
                  }}
                >
                  <Share2 size={14} strokeWidth={2} aria-hidden="true" /> Share
                </button>
                <button
                  type="button"
                  onClick={() => setShowReport(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[0.8rem] font-medium transition-colors duration-150 ml-auto"
                  style={{
                    borderColor: 'rgba(232,98,42,0.2)',
                    background: 'rgba(232,98,42,0.04)',
                    color: '#E8622A',
                    fontFamily: "'DM Sans', sans-serif",
                    minHeight: '40px',
                  }}
                >
                  <Flag size={13} strokeWidth={2} aria-hidden="true" /> Report
                </button>
              </div>

              {/* Description */}
              <div className="cl-card mt-4">
                <h2 className="cl-section-title">Description</h2>
                <p
                  className="text-[0.875rem] leading-relaxed whitespace-pre-line"
                  style={{ color: '#4A4558', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {car.description}
                </p>
              </div>

              {/* Features */}
              {car.features?.length > 0 && (
                <div className="cl-card mt-4">
                  <h2 className="cl-section-title">Features & Equipment</h2>
                  <div className="features-grid">
                    {car.features.map((f) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <CheckCircle2
                          size={14}
                          strokeWidth={2}
                          style={{ color: '#6C3CE1', flexShrink: 0 }}
                          aria-hidden="true"
                        />
                        <span
                          className="text-[0.82rem]"
                          style={{ color: '#4A4558', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {f}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Specs */}
              <div className="cl-card mt-4">
                <h2 className="cl-section-title">Full Specifications</h2>
                <SpecRow
                  icon={Car}
                  label="Make & Model"
                  value={`${car.make} ${car.model}${car.variant ? ' ' + car.variant : ''}`}
                />
                <SpecRow icon={Calendar} label="Year" value={car.year} />
                <SpecRow
                  icon={Gauge}
                  label="Mileage"
                  value={car.mileage != null ? fmtMileage(car.mileage) : undefined}
                />
                <SpecRow icon={Fuel} label="Fuel Type" value={car.fuel} />
                <SpecRow icon={Settings2} label="Transmission" value={car.transmission} />
                <SpecRow icon={Car} label="Body Type" value={car.bodyType} />
                <SpecRow icon={Palette} label="Color" value={car.color} />
                <SpecRow
                  icon={Settings2}
                  label="Engine"
                  value={car.engineCC ? `${car.engineCC}cc` : undefined}
                />
                <SpecRow icon={Shield} label="Assembly" value={car.assembly} />
                <SpecRow icon={MapPin} label="Registered In" value={car.registeredIn} />
                <SpecRow icon={Shield} label="Condition" value={car.condition} />
                <SpecRow icon={Clock} label="Last Updated" value={updatedAgo} />
              </div>

              {/* Mobile seller card */}
              <div className="mobile-seller cl-card mt-4">
                <h2 className="cl-section-title">Seller</h2>
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-[0.85rem] font-extrabold flex-shrink-0"
                    style={{
                      background: 'rgba(108,60,225,0.1)',
                      color: '#6C3CE1',
                      fontFamily: "'Syne', sans-serif",
                    }}
                    aria-hidden="true"
                  >
                    {sellerInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[0.9rem] font-bold"
                      style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                    >
                      {seller.name ?? 'Unknown'}
                    </p>
                    {seller.createdAt && (
                      <p
                        className="text-[0.75rem]"
                        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Member since {fmtDate(seller.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  <div className="flex items-center gap-2.5">
                    <MapPin
                      size={13}
                      strokeWidth={1.9}
                      style={{ color: '#C4BDD0', flexShrink: 0 }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[0.78rem]"
                      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {car.city}
                    </span>
                  </div>
                </div>
                {/* Contact buttons (mobile inline) */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setPhoneVisible((p) => !p)}
                    className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white text-[0.85rem] font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
                      fontFamily: "'DM Sans', sans-serif",
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Phone size={15} strokeWidth={2} aria-hidden="true" />
                    {phoneVisible ? car.phone : 'Show Phone Number'}
                  </button>
                  {car.whatsapp && (
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I'm interested in your ${title} on Paiyya.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-white text-[0.85rem] font-semibold"
                      style={{
                        background: '#25D366',
                        fontFamily: "'DM Sans', sans-serif",
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={15} strokeWidth={2} aria-hidden="true" />
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Safety tips */}
              <div
                className="mt-4 p-5 rounded-2xl"
                style={{
                  background: 'rgba(108,60,225,0.04)',
                  border: '1.5px solid rgba(108,60,225,0.12)',
                }}
              >
                <h3
                  className="text-[0.85rem] font-bold mb-3"
                  style={{ color: '#6C3CE1', fontFamily: "'Syne', sans-serif" }}
                >
                  🛡️ Buyer Safety Tips
                </h3>
                <ul className="flex flex-col gap-2">
                  {[
                    'Always inspect the car in person before paying',
                    'Verify ownership documents (registration book, CNIC)',
                    'Check for any outstanding loans or leases on the vehicle',
                    'Take a test drive and check all electricals',
                    'Use a trusted mechanic for inspection if unsure',
                    'Never transfer payment before physical handover',
                  ].map((tip) => (
                    <li key={tip} className="flex items-start gap-2">
                      <Check
                        size={13}
                        strokeWidth={2.5}
                        style={{ color: '#6C3CE1', flexShrink: 0, marginTop: '2px' }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[0.78rem]"
                        style={{ color: '#5A4E6E', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {tip}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right column (desktop) */}
            <div className="cl-right">
              <div className="cl-card">
                <h1
                  className="text-[1.4rem] font-extrabold tracking-[-0.035em] leading-tight mb-1"
                  style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                >
                  {title}
                </h1>
                <div className="flex items-center gap-2 mb-4 flex-wrap">
                  <MapPin
                    size={13}
                    strokeWidth={2}
                    style={{ color: '#C4BDD0' }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.78rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {car.area ? `${car.area}, ` : ''}
                    {car.city}
                  </span>
                  <span style={{ color: '#E8E3DC' }}>·</span>
                  <Clock
                    size={12}
                    strokeWidth={2}
                    style={{ color: '#C4BDD0' }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.78rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {postedAgo}
                  </span>
                </div>
                <div
                  className="flex items-baseline gap-2 mb-5 pb-5"
                  style={{ borderBottom: '1px solid #F2EEE9' }}
                >
                  <p
                    className="text-[2rem] font-extrabold tracking-[-0.04em]"
                    style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
                  >
                    {priceFormatted}
                  </p>
                  <span
                    className="text-[0.75rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    PKR
                  </span>
                  {car.negotiable && (
                    <span
                      className="text-[0.72rem] font-semibold px-2 py-0.5 rounded-full"
                      style={{
                        background: 'rgba(34,197,94,0.1)',
                        color: '#16a34a',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      Negotiable
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    { icon: Calendar, val: car.year },
                    { icon: Gauge, val: car.mileage != null ? fmtMileage(car.mileage) : 'N/A' },
                    { icon: Fuel, val: car.fuel },
                    { icon: Settings2, val: car.transmission },
                  ].map(({ icon: Icon, val }) => (
                    <div
                      key={String(val)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl"
                      style={{ background: '#F7F4F0' }}
                    >
                      <Icon
                        size={13}
                        strokeWidth={1.9}
                        style={{ color: '#6C3CE1', flexShrink: 0 }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[0.78rem] font-medium"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPhoneVisible((p) => !p)}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-[0.9rem] font-semibold"
                    style={{
                      background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
                      boxShadow: '0 2px 12px rgba(108,60,225,0.3)',
                      fontFamily: "'DM Sans', sans-serif",
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    <Phone size={16} strokeWidth={2} aria-hidden="true" />
                    {phoneVisible ? car.phone : 'Show Phone Number'}
                  </button>
                  {car.whatsapp && (
                    <a
                      href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Hi, I'm interested in your ${title} on Paiyya.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-[0.9rem] font-semibold"
                      style={{
                        background: '#25D366',
                        boxShadow: '0 2px 10px rgba(37,211,102,0.3)',
                        fontFamily: "'DM Sans', sans-serif",
                        textDecoration: 'none',
                      }}
                    >
                      <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                      Chat on WhatsApp
                    </a>
                  )}
                </div>
              </div>

              {/* Desktop seller card */}
              <div className="cl-card mt-4">
                <h2 className="cl-section-title">Seller</h2>
                <div className="flex items-start gap-3 mb-4">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-[0.85rem] font-extrabold flex-shrink-0"
                    style={{
                      background: 'rgba(108,60,225,0.1)',
                      color: '#6C3CE1',
                      fontFamily: "'Syne', sans-serif",
                    }}
                    aria-hidden="true"
                  >
                    {sellerInitials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[0.9rem] font-bold"
                      style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                    >
                      {seller.name ?? 'Unknown'}
                    </p>
                    {seller.createdAt && (
                      <p
                        className="text-[0.75rem]"
                        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Member since {fmtDate(seller.createdAt)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2.5 mb-4">
                  <MapPin
                    size={13}
                    strokeWidth={1.9}
                    style={{ color: '#C4BDD0', flexShrink: 0 }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.78rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {car.city}
                  </span>
                </div>
              </div>

              {/* Posted info */}
              <div
                className="mt-4 p-4 rounded-2xl flex items-center gap-3"
                style={{ background: '#F7F4F0', border: '1.5px solid #E8E3DC' }}
              >
                <Clock
                  size={14}
                  strokeWidth={1.9}
                  style={{ color: '#C4BDD0', flexShrink: 0 }}
                  aria-hidden="true"
                />
                <p
                  className="text-[0.75rem]"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Posted <strong style={{ color: '#1A1523' }}>{postedAgo}</strong> · Updated{' '}
                  <strong style={{ color: '#1A1523' }}>{updatedAgo}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Similar listings */}
          <div className="similar-section mt-10 mb-6">
            <h2
              className="text-[1.1rem] font-extrabold tracking-[-0.03em] mb-4"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Similar Listings
            </h2>
            <div className="similar-grid">
              {similarLoading ? (
                [...Array(4)].map((_, i) => <SimilarSkeleton key={i} />)
              ) : similarCars.length > 0 ? (
                similarCars.map((c) => <SimilarCard key={c._id} car={c} />)
              ) : (
                <p
                  className="text-[0.82rem]"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                >
                  No similar listings found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Styles (unchanged from original) ─────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
  .cl-page { background: #F7F4F0; display: flex; flex-direction: column; min-height: 100vh; width: 100%; overflow-x: hidden; padding-top: 66px; box-sizing: border-box; }
  .cl-inner { max-width: 1200px; width: 100%; margin: 0 auto; padding: 32px 24px 80px; box-sizing: border-box; }
  .cl-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; align-items: start; width: 100%; min-width: 0; }
  .cl-left, .cl-right { min-width: 0; width: 100%; }
  .cl-right { position: sticky; top: 82px; }
  .similar-section { width: 100%; box-sizing: border-box; }
  .cl-card { background: #FFFFFF; border: 1.5px solid #E8E3DC; border-radius: 20px; padding: 24px; box-shadow: 0 1px 4px rgba(26,21,35,0.04); }
  .cl-section-title { font-family: 'Syne', sans-serif; font-size: 0.95rem; font-weight: 800; color: #1A1523; letter-spacing: -0.02em; margin-bottom: 16px; }
  .gallery-main { height: 420px; transition: opacity 0.15s ease; }
  .gallery-main-emoji { font-size: 6rem; }
  .lightbox-img { width: 70vw; height: 60vh; }
  .lightbox-emoji { font-size: 5rem; }
  .features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px 16px; }
  .similar-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
  .similar-card { background: #FFFFFF; border: 1.5px solid #E8E3DC; box-shadow: 0 1px 4px rgba(26,21,35,0.04); transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease; }
  .similar-card:hover { box-shadow: 0 6px 24px rgba(26,21,35,0.1); transform: translateY(-2px); border-color: rgba(108,60,225,0.2); }
  .mobile-cta-bar { display: none; }
  .mobile-title-block, .mobile-seller { display: none; }
  .report-modal, .share-modal { border-radius: 20px !important; }
  @media (max-width: 1024px) {
    .cl-grid { grid-template-columns: 1fr; width: 100%; }
    .cl-left, .cl-right { width: 100%; max-width: 100%; }
    .cl-right { position: static; }
    .similar-grid { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 768px) {
    .cl-page { padding-top: 0; }
    .cl-inner { padding: 16px 14px 100px; width: 100%; max-width: 100%; }
    .cl-grid { display: block; width: 100%; }
    .cl-left { width: 100%; }
    .gallery-main { height: 260px; border-radius: 16px; }
    .gallery-main-emoji { font-size: 4rem; }
    .lightbox-img { width: 92vw; height: 50vw; min-height: 200px; }
    .lightbox-emoji { font-size: 3.5rem; }
    .cl-card { padding: 18px 16px; border-radius: 16px; }
    .mobile-title-block, .mobile-seller { display: block; }
    .cl-right { display: none; }
    .features-grid { grid-template-columns: 1fr; gap: 8px; }
    .similar-section { width: 100%; }
    .similar-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; width: 100%; }
    .mobile-cta-bar { display: flex; position: fixed; bottom: 0; left: 0; right: 0; z-index: 40; gap: 10px; padding: 12px 14px; padding-bottom: calc(12px + env(safe-area-inset-bottom)); background: rgba(247,244,240,0.95); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); border-top: 1px solid #E8E3DC; }
    .report-modal, .share-modal { border-radius: 20px 20px 0 0 !important; }
  }
  @media (max-width: 390px) {
    .cl-inner { padding: 12px 12px 100px; }
    .gallery-main { height: 220px; }
    .gallery-main-emoji { font-size: 3rem; }
    .similar-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
  }
`;
