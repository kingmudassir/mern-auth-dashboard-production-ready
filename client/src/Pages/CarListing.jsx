import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

// ─────────────────────────────────────────────────────────────────
// 💡 TANSTACK INTEGRATION
//
//  const { carId } = useParams();
//
//  const { data: car, isLoading } = useQuery({
//    queryKey: ['car', carId],
//    queryFn: () => axios.get(`/api/cars/${carId}`).then(r => r.data),
//  });
//
//  Report:
//  const reportMutation = useMutation({
//    mutationFn: (data) => axios.post(`/api/cars/${carId}/report`, data),
//    onSuccess: () => { setReportStep('done'); },
//    onError: () => setReportErr('Something went wrong. Please try again.'),
//  });
//  Replace simulate() in handleSubmitReport with:
//  reportMutation.mutate({ reason: selectedReason, detail })
// ─────────────────────────────────────────────────────────────────

// ── Mock car ──────────────────────────────────────────────────────
const MOCK_CAR = {
  id: 1,
  make: 'Toyota',
  model: 'Corolla',
  variant: 'Altis X 1.6',
  year: 2021,
  price: 2800000,
  city: 'Lahore',
  area: 'DHA Phase 5',
  condition: 'Used',
  mileage: 42000,
  fuel: 'Petrol',
  transmission: 'Automatic',
  bodyType: 'Sedan',
  color: 'Pearl White',
  engineCC: 1600,
  assembly: 'Local',
  registeredIn: 'Lahore',
  lastUpdated: '2 days ago',
  postedAt: '5 days ago',
  featured: true,
  description: `This well-maintained Toyota Corolla Altis X 1.6 is in excellent condition. Single owner, all original paintwork, fully documented. Regular servicing done from authorized Toyota service centre.

Key highlights:
• Original paint — never touched up
• All documents genuine and up to date
• New tyres installed 3 months ago
• Recently serviced (engine oil, air filter, spark plugs)
• Sound system upgraded — Pioneer head unit with subwoofer
• Push start and keyless entry
• Genuine leather seats

Minor scratch on rear bumper (visible in photos). Price is slightly negotiable for serious buyers only. No exchange.`,

  features: [
    'Push Start / Keyless Entry',
    'Cruise Control',
    'Rear Parking Camera',
    'Climate Control (Dual Zone)',
    'Alloy Wheels (16")',
    'Leather Seats',
    'Sunroof',
    'Fog Lights',
    'Traction Control',
    'ABS + EBD',
    'Airbags (Driver + Passenger)',
    'Power Windows (All 4)',
    'Power Mirrors',
    'USB + Aux Input',
    'Navigation System',
    'Auto Headlights',
  ],

  seller: {
    id: 'seller-001',
    name: 'Ali Hassan Motors',
    type: 'Dealer',
    city: 'Lahore',
    phone: '0300-1234567',
    whatsapp: '923001234567',
    verified: true,
    listings: 14,
    memberSince: 'March 2022',
    rating: 4.7,
    reviews: 38,
  },

  images: 7,
};

const SIMILAR_CARS = [
  {
    id: 2,
    make: 'Toyota',
    model: 'Corolla',
    year: 2020,
    price: 2500000,
    city: 'Lahore',
    mileage: 65000,
    fuel: 'Petrol',
  },
  {
    id: 5,
    make: 'Honda',
    model: 'Civic',
    year: 2021,
    price: 3200000,
    city: 'Karachi',
    mileage: 38000,
    fuel: 'Petrol',
  },
  {
    id: 9,
    make: 'Toyota',
    model: 'Corolla',
    year: 2022,
    price: 3100000,
    city: 'Islamabad',
    mileage: 22000,
    fuel: 'Hybrid',
  },
  {
    id: 14,
    make: 'Honda',
    model: 'City',
    year: 2021,
    price: 2200000,
    city: 'Lahore',
    mileage: 50000,
    fuel: 'CNG',
  },
];

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

const fmtMileage = (n) => `${n.toLocaleString()} km`;

// ── Image gallery ─────────────────────────────────────────────────
function Gallery({ count, make, model, year }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const BG_COLORS = [
    ['#1A1523', '#231930'],
    ['#F2EEE9', '#EAE5DD'],
    ['#1F1A2E', '#2D2440'],
    ['#F7F4F0', '#EDE8E2'],
    ['#1A1523', '#1F1A2E'],
    ['#EDE8E2', '#E8E3DC'],
    ['#231930', '#2D2440'],
  ];

  const EMOJIS = ['🚗', '🏎️', '🚙', '🚘', '🛞', '🚗', '🏎️'];

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
            className="lightbox-img flex items-center justify-center rounded-2xl"
            style={{
              background: `linear-gradient(135deg, ${BG_COLORS[active][0]}, ${BG_COLORS[active][1]})`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-center">
              <div className="lightbox-emoji" aria-hidden="true">
                {EMOJIS[active]}
              </div>
              <p
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: '0.85rem',
                  fontFamily: "'DM Sans', sans-serif",
                  marginTop: '8px',
                }}
              >
                {year} {make} {model} — Photo {active + 1} of {count}
              </p>
            </div>
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
          <div className="absolute bottom-5 flex gap-2">
            {Array.from({ length: count }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(i);
                }}
                className="rounded-full transition-all duration-150"
                style={{
                  width: i === active ? '20px' : '8px',
                  height: '8px',
                  background: i === active ? '#E8622A' : 'rgba(255,255,255,0.3)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                aria-label={`Go to photo ${i + 1}`}
              />
            ))}
          </div>
        </div>
      )}

      {/* Main image */}
      <div
        className="gallery-main rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${BG_COLORS[active][0]}, ${BG_COLORS[active][1]})`,
        }}
        onClick={() => setLightbox(true)}
        role="button"
        aria-label="Open photo gallery"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setLightbox(true)}
      >
        <div className="text-center select-none">
          <div className="gallery-main-emoji" aria-hidden="true">
            {EMOJIS[active]}
          </div>
          <p
            className="gallery-hint-text text-[0.75rem] mt-2"
            style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'DM Sans', sans-serif" }}
          >
            {year} {make} {model} — tap to expand
          </p>
        </div>

        {/* Nav arrows */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActive((p) => (p - 1 + count) % count);
          }}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Previous photo"
        >
          <ChevronLeft size={17} strokeWidth={2} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setActive((p) => (p + 1) % count);
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center"
          style={{
            background: 'rgba(255,255,255,0.12)',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
          aria-label="Next photo"
        >
          <ChevronRight size={17} strokeWidth={2} />
        </button>

        {/* Counter badge */}
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
      </div>

      {/* Thumbnails */}
      <div
        className="flex gap-2 mt-3 overflow-x-auto pb-1"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {Array.from({ length: count }).map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setActive(i)}
            className="flex-shrink-0 rounded-xl flex items-center justify-center overflow-hidden transition-all duration-150"
            style={{
              width: '68px',
              height: '52px',
              background: `linear-gradient(135deg, ${BG_COLORS[i][0]}, ${BG_COLORS[i][1]})`,
              border: i === active ? '2px solid #E8622A' : '2px solid transparent',
              cursor: 'pointer',
              opacity: i === active ? 1 : 0.6,
            }}
            aria-label={`Photo ${i + 1}`}
            aria-pressed={i === active}
          >
            <span style={{ fontSize: '1.4rem' }} aria-hidden="true">
              {EMOJIS[i]}
            </span>
          </button>
        ))}
      </div>
    </>
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
      {/* Bottom sheet on mobile, centered modal on larger screens */}
      <div
        className="report-modal bg-white w-full sm:max-w-md p-6 sm:p-7 sm:rounded-2xl"
        style={{
          border: '1.5px solid #E8E3DC',
          boxShadow: '0 20px 60px rgba(26,21,35,0.18)',
          borderRadius: '20px 20px 0 0',
          maxHeight: '92vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {/* Drag handle on mobile */}
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
              className="text-[1.1rem] font-extrabold mb-2 tracking-[-0.025em]"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Report submitted
            </h3>
            <p
              className="text-[0.82rem] leading-relaxed mb-6"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Thank you. Our team will review this listing and take appropriate action within 24
              hours.
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
                    className="text-[1rem] font-extrabold tracking-[-0.025em]"
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
                className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
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
                  className="flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-all duration-150"
                  style={{
                    border: selectedReason === r ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
                    background: selectedReason === r ? 'rgba(108,60,225,0.05)' : '#FAFAF9',
                    cursor: 'pointer',
                    minHeight: '44px', // touch target
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
              className="w-full rounded-xl border text-[0.82rem] p-3 outline-none resize-none mb-4 transition-[border-color,box-shadow] duration-200 focus:border-[rgba(108,60,225,0.4)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)]"
              style={{
                borderColor: '#E8E3DC',
                background: '#FAFAF9',
                color: '#1A1523',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '16px', // prevent iOS zoom
              }}
              aria-label="Additional details"
            />

            {err && (
              <p
                className="flex items-center gap-1.5 text-[0.75rem] mb-3"
                style={{ color: '#E8622A', fontFamily: "'DM Sans', sans-serif" }}
              >
                <AlertCircle size={12} strokeWidth={2} />
                {err}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl text-[0.82rem] font-medium border transition-colors duration-150"
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
                className="flex-1 py-3 rounded-xl text-[0.82rem] font-semibold text-white transition-opacity duration-150 disabled:opacity-60"
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
        className="share-modal bg-white w-full sm:max-w-sm p-6 sm:p-7 sm:rounded-2xl"
        style={{
          border: '1.5px solid #E8E3DC',
          boxShadow: '0 20px 60px rgba(26,21,35,0.18)',
          borderRadius: '20px 20px 0 0',
        }}
      >
        {/* Drag handle on mobile */}
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
            className="flex-shrink-0 flex items-center gap-1.5 text-[0.75rem] font-semibold px-3 py-1.5 rounded-lg transition-colors duration-150"
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
              className="flex items-center justify-center gap-2 rounded-xl text-[0.8rem] font-semibold text-white transition-opacity duration-150 hover:opacity-90"
              style={{
                background: color,
                textDecoration: 'none',
                fontFamily: "'DM Sans', sans-serif",
                padding: '12px 8px',
                minHeight: '48px',
              }}
            >
              <ExternalLink size={13} strokeWidth={2} />
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Spec row ──────────────────────────────────────────────────────
function SpecRow({ icon: Icon, label, value, accent }) {
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
          color: accent ? '#E8622A' : '#1A1523',
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
  return (
    <a
      href={`/cars/${car.id}`}
      className="similar-card rounded-2xl overflow-hidden flex flex-col no-underline"
      style={{ textDecoration: 'none' }}
      aria-label={`${car.year} ${car.make} ${car.model}`}
    >
      <div
        className="flex items-center justify-center"
        style={{ height: '110px', background: 'linear-gradient(135deg, #F2EEE9, #EAE5DD)' }}
      >
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
      </div>
      <div className="p-3">
        <p
          className="text-[0.82rem] font-extrabold tracking-[-0.02em] leading-snug"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          {car.year} {car.make} {car.model}
        </p>
        <p
          className="text-[0.7rem] mt-0.5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {car.city} · {(car.mileage / 1000).toFixed(0)}k km
        </p>
        <p
          className="text-[0.95rem] font-extrabold mt-1.5"
          style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
        >
          {car.price >= 100000
            ? `${(car.price / 100000).toFixed(0)} Lac`
            : `PKR ${car.price.toLocaleString()}`}
        </p>
      </div>
    </a>
  );
}

// ── Mobile sticky CTA bar ─────────────────────────────────────────
function MobileCTABar({ seller, title, phoneVisible, setPhoneVisible }) {
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
        aria-label={phoneVisible ? seller.phone : 'Show phone number'}
      >
        <Phone size={15} strokeWidth={2} aria-hidden="true" />
        {phoneVisible ? seller.phone : 'Call'}
      </button>
      <a
        href={`https://wa.me/${seller.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in your ${title} listed on Paiyya.`)}`}
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
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={15} strokeWidth={2} aria-hidden="true" />
        WhatsApp
      </a>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function CarListing() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const car = MOCK_CAR;

  const [liked, setLiked] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);

  const title = `${car.year} ${car.make} ${car.model} ${car.variant}`;
  const priceFormatted = fmtPrice(car.price);

  return (
    <>
      <style>{STYLES}</style>

      {showReport && <ReportModal onClose={() => setShowReport(false)} carId={carId} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} title={title} />}

      {/* Mobile sticky CTA */}
      <MobileCTABar
        seller={car.seller}
        title={title}
        phoneVisible={phoneVisible}
        setPhoneVisible={setPhoneVisible}
      />

      <div className="cl-page">
        <div className="cl-inner">
          {/* ── Breadcrumb ── */}
          <nav className="flex items-center gap-1.5 mb-4 flex-wrap" aria-label="Breadcrumb">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-[0.78rem] font-medium transition-colors duration-150"
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
              <ArrowLeft size={13} strokeWidth={2} />
              Back
            </button>
            {/* Only show full breadcrumb on larger screens */}
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

          {/* ── Main grid ── */}
          <div className="cl-grid">
            {/* ── Left column ── */}
            <div className="cl-left">
              {/* Gallery */}
              <Gallery count={car.images} make={car.make} model={car.model} year={car.year} />

              {/* Mobile: title + price shown here (before action row) */}
              <div className="mobile-title-block cl-card mt-4">
                {car.featured && (
                  <div className="flex items-center gap-1.5 mb-2">
                    <Star
                      size={12}
                      strokeWidth={2}
                      style={{ color: '#C9A84C', fill: '#C9A84C' }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[0.68rem] font-bold uppercase tracking-wider"
                      style={{ color: '#C9A84C', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Featured Listing
                    </span>
                  </div>
                )}
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
                    {car.area}, {car.city}
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
                    {car.postedAt}
                  </span>
                </div>
                <p
                  className="text-[1.8rem] font-extrabold tracking-[-0.04em]"
                  style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
                >
                  {priceFormatted}{' '}
                  <span className="text-[0.75rem] font-normal" style={{ color: '#8A8390' }}>
                    PKR
                  </span>
                </p>

                {/* Quick specs (mobile) */}
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {[
                    { icon: Calendar, val: car.year },
                    { icon: Gauge, val: fmtMileage(car.mileage) },
                    { icon: Fuel, val: car.fuel },
                    { icon: Settings2, val: car.transmission },
                  ].map(({ icon: Icon, val }) => (
                    <div
                      key={val}
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
                  aria-label="Share listing"
                >
                  <Share2 size={14} strokeWidth={2} aria-hidden="true" />
                  Share
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
                  aria-label="Report listing"
                >
                  <Flag size={13} strokeWidth={2} aria-hidden="true" />
                  Report
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

              {/* Specifications */}
              <div className="cl-card mt-4">
                <h2 className="cl-section-title">Full Specifications</h2>
                <SpecRow
                  icon={Car}
                  label="Make & Model"
                  value={`${car.make} ${car.model} ${car.variant}`}
                />
                <SpecRow icon={Calendar} label="Year" value={car.year} />
                <SpecRow icon={Gauge} label="Mileage" value={fmtMileage(car.mileage)} />
                <SpecRow icon={Fuel} label="Fuel Type" value={car.fuel} />
                <SpecRow icon={Settings2} label="Transmission" value={car.transmission} />
                <SpecRow icon={Car} label="Body Type" value={car.bodyType} />
                <SpecRow icon={Palette} label="Color" value={car.color} />
                <SpecRow icon={Settings2} label="Engine" value={`${car.engineCC}cc`} />
                <SpecRow icon={Shield} label="Assembly" value={car.assembly} />
                <SpecRow icon={MapPin} label="Registered In" value={car.registeredIn} />
                <SpecRow icon={Shield} label="Condition" value={car.condition} />
                <SpecRow icon={Clock} label="Last Updated" value={car.lastUpdated} />
              </div>

              {/* Seller card — mobile only, shown inline */}
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
                    {car.seller.name
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p
                        className="text-[0.9rem] font-bold"
                        style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                      >
                        {car.seller.name}
                      </p>
                      {car.seller.verified && (
                        <BadgeCheck
                          size={15}
                          strokeWidth={2}
                          style={{ color: '#6C3CE1', flexShrink: 0 }}
                          aria-label="Verified seller"
                        />
                      )}
                    </div>
                    <p
                      className="text-[0.75rem]"
                      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {car.seller.type} · {car.seller.city}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mb-4">
                  {[
                    {
                      icon: Star,
                      val: `${car.seller.rating} / 5  (${car.seller.reviews} reviews)`,
                      color: '#C9A84C',
                    },
                    { icon: Car, val: `${car.seller.listings} active listings` },
                    { icon: Calendar, val: `Member since ${car.seller.memberSince}` },
                    { icon: MapPin, val: car.seller.city },
                  ].map(({ icon: Icon, val, color }) => (
                    <div key={val} className="flex items-center gap-2.5">
                      <Icon
                        size={13}
                        strokeWidth={1.9}
                        style={{ color: color ?? '#C4BDD0', flexShrink: 0 }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[0.78rem]"
                        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
                <a
                  href={`/sellers/${car.seller.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-[0.8rem] font-medium"
                  style={{
                    borderColor: '#E8E3DC',
                    color: '#6C3CE1',
                    background: 'transparent',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                    minHeight: '44px',
                  }}
                >
                  <Users size={13} strokeWidth={2} aria-hidden="true" />
                  View all listings by seller
                </a>
              </div>

              {/* Safety & tips */}
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

            {/* ── Right column (desktop only) ── */}
            <div className="cl-right">
              {/* Price card */}
              <div className="cl-card">
                {car.featured && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <Star
                      size={12}
                      strokeWidth={2}
                      style={{ color: '#C9A84C', fill: '#C9A84C' }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[0.68rem] font-bold uppercase tracking-wider"
                      style={{ color: '#C9A84C', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Featured Listing
                    </span>
                  </div>
                )}

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
                    {car.area}, {car.city}
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
                    {car.postedAt}
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
                </div>

                {/* Quick specs */}
                <div className="grid grid-cols-2 gap-2 mb-5">
                  {[
                    { icon: Calendar, val: car.year },
                    { icon: Gauge, val: fmtMileage(car.mileage) },
                    { icon: Fuel, val: car.fuel },
                    { icon: Settings2, val: car.transmission },
                  ].map(({ icon: Icon, val }) => (
                    <div
                      key={val}
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

                {/* Contact buttons */}
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => setPhoneVisible((p) => !p)}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-[0.9rem] font-semibold transition-transform duration-150 hover:-translate-y-px"
                    style={{
                      background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
                      boxShadow: '0 2px 12px rgba(108,60,225,0.3)',
                      fontFamily: "'DM Sans', sans-serif",
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    aria-label={phoneVisible ? car.seller.phone : 'Show phone number'}
                  >
                    <Phone size={16} strokeWidth={2} aria-hidden="true" />
                    {phoneVisible ? car.seller.phone : 'Show Phone Number'}
                  </button>
                  <a
                    href={`https://wa.me/${car.seller.whatsapp}?text=${encodeURIComponent(`Hi, I'm interested in your ${title} listed on Paiyya.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-white text-[0.9rem] font-semibold transition-transform duration-150 hover:-translate-y-px"
                    style={{
                      background: '#25D366',
                      boxShadow: '0 2px 10px rgba(37,211,102,0.3)',
                      fontFamily: "'DM Sans', sans-serif",
                      textDecoration: 'none',
                    }}
                    aria-label="Chat on WhatsApp"
                  >
                    <MessageCircle size={16} strokeWidth={2} aria-hidden="true" />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Seller card */}
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
                    {car.seller.name
                      .split(' ')
                      .slice(0, 2)
                      .map((w) => w[0])
                      .join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p
                        className="text-[0.9rem] font-bold"
                        style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                      >
                        {car.seller.name}
                      </p>
                      {car.seller.verified && (
                        <BadgeCheck
                          size={15}
                          strokeWidth={2}
                          style={{ color: '#6C3CE1', flexShrink: 0 }}
                          aria-label="Verified seller"
                        />
                      )}
                    </div>
                    <p
                      className="text-[0.75rem]"
                      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {car.seller.type} · {car.seller.city}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mb-4">
                  {[
                    {
                      icon: Star,
                      val: `${car.seller.rating} / 5  (${car.seller.reviews} reviews)`,
                      color: '#C9A84C',
                    },
                    { icon: Car, val: `${car.seller.listings} active listings` },
                    { icon: Calendar, val: `Member since ${car.seller.memberSince}` },
                    { icon: MapPin, val: car.seller.city },
                  ].map(({ icon: Icon, val, color }) => (
                    <div key={val} className="flex items-center gap-2.5">
                      <Icon
                        size={13}
                        strokeWidth={1.9}
                        style={{ color: color ?? '#C4BDD0', flexShrink: 0 }}
                        aria-hidden="true"
                      />
                      <span
                        className="text-[0.78rem]"
                        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {val}
                      </span>
                    </div>
                  ))}
                </div>

                <a
                  href={`/sellers/${car.seller.id}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-[0.8rem] font-medium transition-colors duration-150"
                  style={{
                    borderColor: '#E8E3DC',
                    color: '#6C3CE1',
                    background: 'transparent',
                    textDecoration: 'none',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Users size={13} strokeWidth={2} aria-hidden="true" />
                  View all listings by seller
                </a>
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
                  Posted <strong style={{ color: '#1A1523' }}>{car.postedAt}</strong> · Last updated{' '}
                  <strong style={{ color: '#1A1523' }}>{car.lastUpdated}</strong>
                </p>
              </div>
            </div>
          </div>

          {/* ── Similar listings ── */}
          <div className="similar-section mt-10 mb-6">
            <h2
              className="text-[1.1rem] font-extrabold tracking-[-0.03em] mb-4"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Similar Listings
            </h2>
            <div className="similar-grid">
              {SIMILAR_CARS.map((c) => (
                <SimilarCard key={c.id} car={c} />
              ))}
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

  /* ── Base ── */
  .cl-page {
    background: #F7F4F0;
    /* flex column so the element stretches to fit ALL content, not just viewport */
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    width: 100%;
    overflow-x: hidden;
    padding-top: 66px;
    box-sizing: border-box;
  }

  .cl-inner {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 32px 24px 80px;
    box-sizing: border-box;
  }

  /* ── Main grid ── */
  .cl-grid {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 24px;
    align-items: start;
    width: 100%;
    min-width: 0;
  }

  /* Grid children must not overflow their column */
  .cl-left,
  .cl-right {
    min-width: 0;
    width: 100%;
  }

  .cl-right {
    position: sticky;
    top: 82px;
  }

  /* Similar section always full-width — lives outside cl-grid */
  .similar-section {
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Card ── */
  .cl-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
  }

  .cl-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.95rem;
    font-weight: 800;
    color: #1A1523;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }

  /* ── Gallery ── */
  .gallery-main {
    height: 420px;
    transition: opacity 0.15s ease;
  }

  .gallery-main-emoji {
    font-size: 6rem;
  }

  /* ── Lightbox ── */
  .lightbox-img {
    width: 70vw;
    height: 60vh;
  }

  .lightbox-emoji {
    font-size: 5rem;
  }

  /* ── Features grid ── */
  .features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 16px;
  }

  /* ── Similar cars ── */
  .similar-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }

  .similar-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  }

  .similar-card:hover {
    box-shadow: 0 6px 24px rgba(26,21,35,0.1);
    transform: translateY(-2px);
    border-color: rgba(108,60,225,0.2);
  }

  /* ── Mobile sticky CTA ── */
  .mobile-cta-bar {
    display: none;
  }

  /* ── Mobile-only blocks hidden by default ── */
  .mobile-title-block,
  .mobile-seller {
    display: none;
  }

  /* ── Report / Share modals: desktop = centered ── */
  .report-modal,
  .share-modal {
    border-radius: 20px !important;
  }

  /* ════════════════════════════════════
     TABLET  ≤ 1024px
  ════════════════════════════════════ */
  @media (max-width: 1024px) {
    .cl-grid {
      grid-template-columns: 1fr;
      width: 100%;
    }

    .cl-left,
    .cl-right {
      width: 100%;
      max-width: 100%;
    }

    .cl-right {
      position: static;
    }

    .similar-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  /* ════════════════════════════════════
     MOBILE  ≤ 768px
  ════════════════════════════════════ */
  @media (max-width: 768px) {
    /* Page spacing */
    .cl-page {
      padding-top: 0;
    }

    .cl-inner {
      padding: 16px 14px 100px;
      /* Guarantee full-width on mobile */
      width: 100%;
      max-width: 100%;
    }

    /* Switch grid off entirely — block stacking is simpler and bulletproof */
    .cl-grid {
      display: block;
      width: 100%;
    }

    .cl-left {
      width: 100%;
    }

    /* Gallery: shorter on mobile */
    .gallery-main {
      height: 260px;
      border-radius: 16px;
    }

    .gallery-main-emoji {
      font-size: 4rem;
    }

    /* Lightbox: full width on mobile */
    .lightbox-img {
      width: 92vw;
      height: 50vw;
      min-height: 200px;
    }

    .lightbox-emoji {
      font-size: 3.5rem;
    }

    /* Cards */
    .cl-card {
      padding: 18px 16px;
      border-radius: 16px;
    }

    /* Show mobile title + seller blocks */
    .mobile-title-block,
    .mobile-seller {
      display: block;
    }

    /* Hide desktop right column entirely */
    .cl-right {
      display: none;
    }

    /* Features: single column */
    .features-grid {
      grid-template-columns: 1fr;
      gap: 8px;
    }

    /* Similar section + grid: explicitly full width */
    .similar-section {
      width: 100%;
    }

    .similar-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      width: 100%;
    }

    /* Show sticky CTA bar */
    .mobile-cta-bar {
      display: flex;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 40;
      gap: 10px;
      padding: 12px 14px;
      padding-bottom: calc(12px + env(safe-area-inset-bottom));
      background: rgba(247, 244, 240, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-top: 1px solid #E8E3DC;
    }

    /* Modals: bottom sheet */
    .report-modal,
    .share-modal {
      border-radius: 20px 20px 0 0 !important;
    }
  }

  /* ════════════════════════════════════
     SMALL MOBILE  ≤ 390px
  ════════════════════════════════════ */
  @media (max-width: 390px) {
    .cl-inner {
      padding: 12px 12px 100px;
    }

    .gallery-main {
      height: 220px;
    }

    .gallery-main-emoji {
      font-size: 3rem;
    }

    .similar-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 8px;
    }
  }
`;
