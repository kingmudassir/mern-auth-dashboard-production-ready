import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGetCarById, useGetSimilarCars } from '../Hooks/Car-Listing/useGetCarById';
import { useGetSavedAds } from '../Hooks/Saved-Ads/useGetSavedAds';
import { useToggleSave } from '../Hooks/Saved-Ads/useToggleSave';
import FEATURE_GROUPS_DATA from '../JSON-DATA/feature_groups.json';
import {
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
  Phone,
  MessageCircle,
  Check,
  Clock,
  ChevronDown,
} from 'lucide-react';
import Gallery from './Car-Listing/Components/Gallery';
import ReportModal from './Car-Listing/Components/ReportModal';
import ShareModal from './Car-Listing/Components/ShareModal';
import PageSkeleton from './Car-Listing/Components/PageSkeleton';
import SpecRow from './Car-Listing/Components/SpecRow';
import { SimilarCard, SimilarSkeleton } from './Car-Listing/Components/SimilarCard';
import MobileCTABar from './Car-Listing/Components/MobileCTABar';
import Breadcrumbs from './Car-Listing/Functions/Breadcrumbs';
import FeatureAccordion from './Car-Listing/Components/FeatureAccordion';

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

// ── Main component ────────────────────────────────────────────────
export default function CarListing() {
  const { carId } = useParams();
  const navigate = useNavigate();

  const { data: carData, isLoading, isError } = useGetCarById(carId);
  const car = carData?.car;
  const { data: similarData, isLoading: similarLoading } = useGetSimilarCars(car?.make, car?._id);
  const similarCars = similarData?.data?.cars?.slice(0, 4) ?? [];

  const { data: savedAds = [] } = useGetSavedAds();
  const { mutate: toggleSave, isPending: savePending } = useToggleSave();
  // const liked = savedAds.some((s) => (s._id ?? s.id) === carId);
  const liked = car?.isSaved || savedAds.some((s) => (s._id ?? s.id) === carId);

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

  const seller = car.postedBy ?? {};
  const sellerInitials = seller.name
    ? seller.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase()
    : '?';

  const groupedFeatures = FEATURE_GROUPS_DATA.FEATURE_GROUPS.map((group) => {
    // Filter items in this group that exist in the car's feature list
    const activeItems = group.items.filter((item) =>
      car.features.some((f) => {
        const normalizedF = f.replace(/_/g, ' ').toLowerCase();
        const normalizedItem = item.toLowerCase();
        return normalizedItem === normalizedF || normalizedItem.includes(normalizedF);
      })
    );

    return {
      title: group.group,
      items: activeItems,
    };
  }).filter((group) => group.items.length > 0);

  return (
    <>
      {showReport && <ReportModal onClose={() => setShowReport(false)} carId={carId} />}
      {showShare && <ShareModal onClose={() => setShowShare(false)} title={title} />}

      <MobileCTABar
        phone={car.phone}
        whatsapp={car.whatsapp}
        title={title}
        phoneVisible={phoneVisible}
        setPhoneVisible={setPhoneVisible}
        liked={liked}
        savePending={savePending}
        onToggleSave={() => toggleSave(carId)}
      />

      <div className="cl-page">
        <div className="cl-inner">
          <Breadcrumbs car={car} />

          <div className="cl-grid">
            {/* ── Left column ── */}
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
                  onClick={() => toggleSave(carId)}
                  disabled={savePending}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[0.8rem] font-medium transition-all duration-150"
                  style={{
                    borderColor: liked ? 'rgba(232,98,42,0.3)' : '#E8E3DC',
                    background: liked ? 'rgba(232,98,42,0.06)' : '#FFFFFF',
                    color: liked ? '#E8622A' : '#8A8390',
                    fontFamily: "'DM Sans', sans-serif",
                    minHeight: '40px',
                    cursor: savePending ? 'not-allowed' : 'pointer',
                    opacity: savePending ? 0.7 : 1,
                  }}
                  aria-pressed={liked}
                  aria-label={liked ? 'Remove from saved' : 'Save listing'}
                >
                  <Heart
                    size={14}
                    strokeWidth={2}
                    style={{
                      fill: liked ? '#E8622A' : 'none',
                      color: liked ? '#E8622A' : 'currentColor',
                    }}
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
              {groupedFeatures.length > 0 && (
                <div className="cl-card mt-4">
                  <h2 className="cl-section-title">Features & Equipment</h2>

                  <div className="space-y-1">
                    {groupedFeatures.map((group, index) => (
                      <FeatureAccordion
                        key={group.title}
                        group={group}
                        isLast={index === groupedFeatures.length - 1}
                      />
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
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-[0.85rem] font-extrabold shrink-0"
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

            {/* ── Right column (desktop) ── */}
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
                  {/* ── Save button ── */}
                  <button
                    type="button"
                    onClick={() => toggleSave(carId)}
                    disabled={savePending}
                    className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl text-[0.9rem] font-semibold transition-all duration-150"
                    style={{
                      border: liked ? '1.5px solid rgba(232,98,42,0.35)' : '1.5px solid #E8E3DC',
                      background: liked ? 'rgba(232,98,42,0.06)' : '#FAFAF9',
                      color: liked ? '#E8622A' : '#8A8390',
                      fontFamily: "'DM Sans', sans-serif",
                      cursor: savePending ? 'not-allowed' : 'pointer',
                      opacity: savePending ? 0.7 : 1,
                    }}
                    aria-pressed={liked}
                    aria-label={liked ? 'Remove from saved' : 'Save listing'}
                  >
                    <Heart
                      size={16}
                      strokeWidth={2}
                      style={{
                        fill: liked ? '#E8622A' : 'none',
                        color: liked ? '#E8622A' : '#8A8390',
                      }}
                      aria-hidden="true"
                    />
                    {liked ? 'Saved' : 'Save Listing'}
                  </button>
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
