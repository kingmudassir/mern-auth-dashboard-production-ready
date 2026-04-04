import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CAR_DATA from '../../../JSON-DATA/make_model.json';

import {
  Upload,
  X,
  Plus,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Car,
  MapPin,
  Phone,
  FileText,
  Image,
  Star,
  Check,
  Info,
  Save,
  Loader2,
} from 'lucide-react';

import VehicleInfoSection from '../../Post-Ad/Functions/VehicleInfoSection';
import PhotosSection from '../../Post-Ad/Functions/PhotosSection';
import FeaturesSection from '../../Post-Ad/Functions/FeaturesSection';
import DescriptionSection from '../../Post-Ad/Functions/DescriptionSection';
import PriceSection from '../../Post-Ad/Functions/PriceSection';
import LocationContactSection from '../../Post-Ad/Functions/LocationContactSection';
import ProgressBar from '../../Post-Ad/Functions/ProgressBar';
import { useAdDetail } from '../../../Hooks/Edit-Ad/useAdDetail';
import { useUpdateAd } from '../../../Hooks/Edit-Ad/useUpdateAd';

// ── Mock existing ad (replace with real fetch) ────────────────────
const MOCK_AD = {
  id: 101,
  make: 'Toyota',
  model: 'Corolla',
  variant: 'Altis X 1.6',
  year: '2021',
  condition: 'Used',
  bodyType: 'Sedan',
  color: 'Pearl White',
  engineCC: '1600',
  assembly: 'Local',
  transmission: 'Automatic',
  fuel: 'Petrol',
  mileage: '42000',
  registeredIn: 'Lahore',
  price: '2800000',
  negotiable: true,
  city: 'Lahore',
  area: 'DHA Phase 5',
  phone: '03001234567',
  whatsapp: true,
  description:
    'This well-maintained Toyota Corolla Altis X 1.6 is in excellent condition. Single owner, all original paintwork, fully documented. Regular servicing done from authorized Toyota service centre.\n\nNew tyres installed 3 months ago. Recently serviced — engine oil, air filter, spark plugs. Sound system upgraded. Push start and keyless entry. Genuine leather seats.',
  features: [
    'Push Start / Keyless Entry',
    'Cruise Control',
    'Rear Parking Camera',
    'Climate Control (Dual Zone)',
    'Alloy Wheels',
    'Leather Seats',
    'Sunroof',
    'Fog Lights',
    'ABS + EBD',
    'Airbags (Driver + Passenger)',
    'Power Windows (All 4)',
    'Navigation System',
  ],
  // existing images — in real usage these would be URLs from your backend.
  // We represent them here as preview-ready objects so the ImageUploader
  // can render them just like newly-uploaded files.
  existingImages: [
    { id: 'existing-1', preview: null, isExisting: true, label: 'Photo 1' },
    { id: 'existing-2', preview: null, isExisting: true, label: 'Photo 2' },
    { id: 'existing-3', preview: null, isExisting: true, label: 'Photo 3' },
  ],
};

const MAX_IMAGES = 10;

// ── Validation (same rules as PostAd) ────────────────────────────
const isPhone = (v) => /^(\+92|0)[0-9]{10}$/.test(v);

function validateAll(fields) {
  const e = {};
  if (!fields.make) e.make = 'Required';
  if (!fields.model) e.model = 'Required';
  if (!fields.year) e.year = 'Required';
  if (!fields.price || isNaN(Number(fields.price)) || Number(fields.price) <= 0)
    e.price = 'Enter a valid price';
  if (!fields.mileage && fields.condition !== 'New') e.mileage = 'Required for used vehicles';
  if (!fields.fuel) e.fuel = 'Required';
  if (!fields.transmission) e.transmission = 'Required';
  if (!fields.bodyType) e.bodyType = 'Required';
  if (!fields.color) e.color = 'Required';
  if (!fields.city) e.city = 'Required';
  if (!fields.phone || !isPhone(fields.phone)) e.phone = 'Enter a valid Pakistani number';
  if (!fields.description || fields.description.trim().length < 30)
    e.description = 'Description must be at least 30 characters';
  return e;
}

// ── Progress steps ────────────────────────────────────────────────
const STEPS = [
  { label: 'Vehicle', icon: Car },
  { label: 'Photos', icon: Image },
  { label: 'Details', icon: FileText },
  { label: 'Contact', icon: Phone },
];

// ── Image uploader (identical to PostAd) ─────────────────────────
function ImageUploader({ images, onAdd, onRemove, onSetPrimary }) {
  const fileRef = useRef(null);

  const handleFiles = (files) => {
    const valid = Array.from(files)
      .filter((f) => f.type.startsWith('image/'))
      .slice(0, MAX_IMAGES - images.length);
    const newImages = valid.map((file) => ({
      id: Math.random().toString(36).slice(2),
      file,
      preview: URL.createObjectURL(file),
    }));
    onAdd(newImages);
  };

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      handleFiles(e.dataTransfer.files);
    },
    [images.length]
  );

  return (
    <div>
      {images.length < MAX_IMAGES && (
        <div
          className="pa-dropzone rounded-2xl flex flex-col items-center justify-center gap-3 cursor-pointer"
          onClick={() => fileRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
          aria-label="Upload photos"
          style={{ minHeight: images.length > 0 ? '120px' : '180px' }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(108,60,225,0.08)' }}
            aria-hidden="true"
          >
            <Upload size={20} strokeWidth={1.8} style={{ color: '#6C3CE1' }} />
          </div>
          <div className="text-center">
            <p
              className="text-[0.875rem] font-semibold"
              style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
            >
              Drop photos here or <span style={{ color: '#6C3CE1' }}>browse</span>
            </p>
            <p
              className="text-[0.72rem] mt-0.5"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              JPG, PNG, WEBP · Max 5MB each · {images.length}/{MAX_IMAGES} uploaded
            </p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
            aria-label="File input"
          />
        </div>
      )}

      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mt-4">
          {images.map((img, i) => (
            <div key={img.id} className="relative group">
              <div
                className="aspect-square rounded-xl overflow-hidden"
                style={{
                  border: i === 0 ? '2px solid #E8622A' : '2px solid #E8E3DC',
                  position: 'relative',
                }}
              >
                {img.preview ? (
                  <img
                    src={img.preview}
                    alt={`Photo ${i + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Placeholder for existing server-side images */
                  <div
                    className="w-full h-full flex flex-col items-center justify-center gap-1"
                    style={{ background: 'linear-gradient(135deg,#F2EEE9,#EAE5DD)' }}
                  >
                    <span style={{ fontSize: '1.6rem' }} aria-hidden="true">
                      🚗
                    </span>
                    <span
                      className="text-[0.58rem] font-medium text-center px-1"
                      style={{ color: '#C4BDD0', fontFamily: "'DM Sans',sans-serif" }}
                    >
                      {img.label || `Photo ${i + 1}`}
                    </span>
                  </div>
                )}
                {i === 0 && (
                  <span
                    className="absolute bottom-0 left-0 right-0 text-center text-[0.58rem] font-bold uppercase tracking-wider py-0.5 text-white"
                    style={{
                      background: 'rgba(232,98,42,0.85)',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    aria-label="Primary photo"
                  >
                    Cover
                  </span>
                )}
                {img.isExisting && (
                  <span
                    className="absolute top-1 left-1 text-[0.5rem] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(108,60,225,0.85)',
                      color: '#fff',
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Saved
                  </span>
                )}
              </div>

              {/* Hover controls */}
              <div
                className="absolute inset-0 rounded-xl flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                style={{ background: 'rgba(26,21,35,0.45)' }}
              >
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => onSetPrimary(img.id)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{
                      background: 'rgba(255,255,255,0.9)',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    aria-label="Set as cover photo"
                    title="Set as cover"
                  >
                    <Star size={12} strokeWidth={2} style={{ color: '#E8622A' }} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onRemove(img.id)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(255,255,255,0.9)', border: 'none', cursor: 'pointer' }}
                  aria-label="Remove photo"
                  title="Remove"
                >
                  <X size={12} strokeWidth={2.5} style={{ color: '#E8622A' }} />
                </button>
              </div>
            </div>
          ))}

          {images.length < MAX_IMAGES && (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="aspect-square rounded-xl flex flex-col items-center justify-center gap-1 border-2 border-dashed transition-colors duration-150"
              style={{ borderColor: '#E8E3DC', background: '#FAFAF9', cursor: 'pointer' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(108,60,225,0.35)';
                e.currentTarget.style.background = 'rgba(108,60,225,0.03)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E8E3DC';
                e.currentTarget.style.background = '#FAFAF9';
              }}
              aria-label="Add more photos"
            >
              <Plus size={16} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
              <span
                className="text-[0.65rem]"
                style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
              >
                Add
              </span>
            </button>
          )}
        </div>
      )}

      <p
        className="text-[0.72rem] mt-3 flex items-center gap-1.5"
        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
      >
        <Info size={11} strokeWidth={2} aria-hidden="true" />
        First photo will be the cover. Hover a photo to reorder or remove it.
      </p>
    </div>
  );
}

// ── Feature toggle (identical to PostAd) ─────────────────────────
function FeatureToggle({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-left transition-all duration-150"
      style={{
        border: checked ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
        background: checked ? 'rgba(108,60,225,0.06)' : '#FAFAF9',
        cursor: 'pointer',
      }}
      aria-pressed={checked}
    >
      <span
        className="w-4 h-4 rounded-[5px] flex items-center justify-center shrink-0 transition-[background,border] duration-150"
        style={{
          border: checked ? 'none' : '1.5px solid #C4BDD0',
          background: checked ? '#6C3CE1' : 'transparent',
        }}
        aria-hidden="true"
      >
        {checked && <Check size={10} strokeWidth={3} style={{ color: '#fff' }} />}
      </span>
      <span
        className="text-[0.78rem] leading-tight"
        style={{
          color: checked ? '#6C3CE1' : '#4A4558',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: checked ? 600 : 400,
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Saved success banner ──────────────────────────────────────────
function SavedBanner({ adId, onDismiss }) {
  return (
    <div
      className="rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5"
      style={{ background: 'rgba(34,197,94,0.06)', border: '1.5px solid rgba(34,197,94,0.25)' }}
      role="alert"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(34,197,94,0.12)' }}
        aria-hidden="true"
      >
        <CheckCircle2 size={24} strokeWidth={1.8} style={{ color: '#16a34a' }} />
      </div>
      <div className="flex-1 text-center sm:text-left">
        <p
          className="text-[0.95rem] font-extrabold tracking-[-0.02em]"
          style={{ color: '#15803d', fontFamily: "'Syne',sans-serif" }}
        >
          Ad updated successfully!
        </p>
        <p
          className="text-[0.78rem] mt-0.5"
          style={{ color: '#16a34a', fontFamily: "'DM Sans',sans-serif" }}
        >
          Your changes are live. Buyers can see the updated listing now.
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <a
          href={`/cars/${adId}`}
          className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white px-4 py-2 rounded-xl no-underline transition-transform duration-150 hover:-translate-y-px"
          style={{
            background: 'linear-gradient(135deg,#16a34a,#15803d)',
            boxShadow: '0 2px 8px rgba(22,163,74,0.28)',
            fontFamily: "'DM Sans',sans-serif",
          }}
        >
          View listing
        </a>
        <button
          type="button"
          onClick={onDismiss}
          className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150"
          style={{
            background: 'rgba(22,163,74,0.1)',
            border: 'none',
            cursor: 'pointer',
            color: '#16a34a',
          }}
          aria-label="Dismiss"
        >
          <X size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function EditAd() {
  const { adId } = useParams();
  const navigate = useNavigate();

  // In production, replace MOCK_AD with the useQuery result for this adId.
  const { data: existingAd, isLoading, isError } = useAdDetail(adId);
  const updateMutation = useUpdateAd(adId);

  // ── Form state — pre-populated from existingAd ────────────────
  const [fields, setFields] = useState({
    make: '',
    model: '',
    variant: '',
    year: '',
    condition: 'Used',
    bodyType: '',
    color: '',
    engineCC: '',
    assembly: 'Local',
    transmission: '',
    fuel: '',
    mileage: '',
    registeredIn: '',
    price: '',
    negotiable: false,
    city: '',
    area: '',
    phone: '',
    whatsapp: false,
    description: '',
  });

  // Pre-populate existing images so the user sees what's already uploaded.
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState([]);

  useEffect(() => {
    // Use 'car' if it exists, otherwise fallback to 'ad'
    const source = existingAd?.car || existingAd?.ad;

    if (source) {
      console.log('Mapping from source:', source); // Debugging line

      setFields({
        make: source.make || '',
        model: source.model || '',
        variant: source.variant || '',
        year: source.year?.toString() || '',
        condition: source.condition || 'Used',
        bodyType: source.bodyType || '',
        color: source.color || '',
        engineCC: source.engineCC || '',
        assembly: source.assembly || 'Local',
        transmission: source.transmission || '',
        fuel: source.fuel || '',
        mileage: source.mileage?.toString() || '',
        registeredIn: source.registeredIn || '',
        price: source.price?.toString() || '',
        negotiable: source.negotiable || false,
        city: source.city || '',
        area: source.area || '',
        phone: source.phone || '',
        whatsapp: source.whatsapp || false,
        description: source.description || '',
      });

      // Images Mapping
      if (source.images && Array.isArray(source.images)) {
        const formattedImages = source.images.map((img, index) => ({
          // Use publicId from your payload, or fallback to index
          id: img.publicId || img._id || `existing-${index}`,
          preview: img.url,
          isExisting: true,
          file: null,
        }));

        setImages(formattedImages);
      }

      setFeatures(source.features || []);
    }
  }, [existingAd]);

  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // ── Field setter (same pattern as PostAd) ─────────────────────
  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFields((p) => {
      const next = { ...p, [key]: val };
      if (key === 'make') {
        next.model = '';
        next.variant = '';
      }
      if (key === 'model' && val !== 'Other' && p.make !== 'Other') next.variant = '';
      return next;
    });
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
    setSaved(false); // reset saved banner on any change
  };

  // ── Derived progress (mirrors PostAd logic) ───────────────────
  const vehicleDone = !!(
    fields.make &&
    fields.model &&
    fields.year &&
    fields.fuel &&
    fields.transmission &&
    fields.bodyType &&
    fields.color &&
    fields.condition
  );
  const photosDone = images.length > 0;
  const detailsDone = !!(
    fields.description.trim().length >= 30 &&
    fields.price &&
    Number(fields.price) > 0
  );
  const contactDone = !!(fields.city && fields.phone && isPhone(fields.phone));
  const completedSteps = [vehicleDone, photosDone, detailsDone, contactDone];
  const derivedActiveStep = contactDone
    ? 3
    : detailsDone
      ? 3
      : photosDone
        ? 2
        : vehicleDone
          ? 1
          : 0;

  const scrollToSection = (index) => {
    const ids = ['step-vehicle', 'step-photos', 'step-details', 'step-contact'];
    document.getElementById(ids[index])?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // ── Image handlers ────────────────────────────────────────────
  const handleAddImages = (newImgs) => setImages((p) => [...p, ...newImgs].slice(0, MAX_IMAGES));
  const handleRemoveImage = (id) => setImages((p) => p.filter((img) => img.id !== id));
  const handleSetPrimary = (id) =>
    setImages((p) => {
      const idx = p.findIndex((img) => img.id === id);
      if (idx < 1) return p;
      const next = [...p];
      [next[0], next[idx]] = [next[idx], next[0]];
      return next;
    });

  const toggleFeature = (feat) =>
    setFeatures((p) => (p.includes(feat) ? p.filter((f) => f !== feat) : [...p, feat]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAll(fields);

    // 1. Validation: Check both current state and image length
    if (Object.keys(errs).length > 0 || images.length === 0) {
      setErrors(errs);
      if (images.length === 0) {
        setGlobalErr('At least one photo is required.');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setGlobalErr('');

    // 2. Prepare the payload in the format the backend expects
    // We filter based on the 'isExisting' flag you set in useEffect
    const payload = {
      ...fields,
      features,
      // Map existing images back to their original URLs/Identifiers
      existingImages: images.filter((img) => img.isExisting).map((img) => img.preview),

      // Map new files to their actual File objects
      images: images.filter((img) => !img.isExisting).map((img) => img.file),
    };

    // 3. Execute Mutation
    updateMutation.mutate(payload, {
      onSuccess: () => {
        setSaved(true);
        setSaving(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (err) => {
        setSaving(false);
        // Catch the "At least one photo is required" from backend here
        setGlobalErr(err.response?.data?.message || 'Update failed. Please try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  };
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="ea-spin text-purple-600" size={40} />
      </div>
    );
  }

  if (isError) {
    return <div className="p-20 text-center">Failed to load ad. It may have been deleted.</div>;
  }

  return (
    <>
      <style>{STYLES}</style>
      <div className="ea-page">
        <div className="ea-inner">
          {/* ── Back + heading ──────────────────────────────── */}
          <div className="mb-7">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium mb-4 transition-colors duration-150"
              style={{
                color: '#8A8390',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans',sans-serif",
                padding: 0,
              }}
            >
              <ArrowLeft size={14} strokeWidth={2} aria-hidden="true" />
              Back to My Ads
            </button>

            <p
              className="text-[0.72rem] font-bold uppercase tracking-widest mb-1"
              style={{ color: '#6C3CE1', fontFamily: "'DM Sans', sans-serif" }}
            >
              Edit Listing
            </p>
            <h1
              className="text-[2rem] font-extrabold tracking-[-0.04em] leading-tight"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              {existingAd?.car?.year} {existingAd?.car?.make} {existingAd?.car?.model}{' '}
            </h1>
            <p
              className="text-[0.875rem] mt-1"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Update the details below — changes go live immediately after saving.
            </p>
          </div>

          {/* ── Saved success banner ─────────────────────────── */}
          {saved && (
            <div className="mb-6">
              <SavedBanner adId={existingAd.id} onDismiss={() => setSaved(false)} />
            </div>
          )}

          {/* ── Progress bar ─────────────────────────────────── */}
          <ProgressBar
            activeStep={derivedActiveStep}
            steps={STEPS}
            onStepClick={scrollToSection}
            completedSteps={completedSteps}
          />

          {/* ── Global error ─────────────────────────────────── */}
          {globalErr && (
            <div
              className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5"
              style={{
                background: 'rgba(232,98,42,0.07)',
                border: '1px solid rgba(232,98,42,0.25)',
              }}
              role="alert"
            >
              <AlertCircle
                size={15}
                strokeWidth={2}
                style={{ color: '#E8622A', flexShrink: 0 }}
                aria-hidden="true"
              />
              <p
                className="text-[0.8rem] font-medium"
                style={{ color: '#C4531F', fontFamily: "'DM Sans', sans-serif" }}
              >
                {globalErr}
              </p>
            </div>
          )}

          {/* ── Form ─────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} noValidate aria-label="Edit vehicle listing">
            <div className="flex flex-col gap-5">
              {/* Step 1 — Vehicle info */}
              <div id="step-vehicle">
                <VehicleInfoSection
                  fields={fields}
                  errors={errors}
                  set={set}
                  setFields={setFields}
                />
              </div>

              {/* Step 2 — Photos */}
              <div id="step-photos">
                <PhotosSection
                  images={images}
                  onAdd={handleAddImages}
                  onRemove={handleRemoveImage}
                  onSetPrimary={handleSetPrimary}
                  ImageUploader={ImageUploader}
                />
              </div>

              {/* Step 3 — Features + description + price */}
              <div id="step-details" className="flex flex-col gap-5">
                <FeaturesSection
                  features={features}
                  toggleFeature={toggleFeature}
                  FeatureToggle={FeatureToggle}
                />
                <DescriptionSection fields={fields} errors={errors} set={set} />
                <PriceSection fields={fields} errors={errors} set={set} />
              </div>

              {/* Step 4 — Location & contact */}
              <div id="step-contact">
                <LocationContactSection fields={fields} errors={errors} set={set} />
              </div>

              {/* ── Save button ──────────────────────────────── */}
              <div
                className="rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4"
                style={{
                  background: '#FFFFFF',
                  border: '1.5px solid #E8E3DC',
                  boxShadow: '0 1px 4px rgba(26,21,35,0.04)',
                }}
              >
                <div>
                  <p
                    className="text-[0.85rem] font-semibold"
                    style={{ color: '#1A1523', fontFamily: "'DM Sans',sans-serif" }}
                  >
                    Ready to save your changes?
                  </p>
                  <p
                    className="text-[0.75rem] mt-0.5"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans',sans-serif" }}
                  >
                    Your listing will be updated immediately and visible to buyers.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="text-[0.85rem] font-medium px-5 py-2.5 rounded-xl border transition-colors duration-150"
                    style={{
                      color: '#8A8390',
                      borderColor: '#E8E3DC',
                      background: 'transparent',
                      fontFamily: "'DM Sans',sans-serif",
                    }}
                  >
                    Discard
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-white px-6 py-2.5 rounded-xl transition-all duration-200 disabled:opacity-70"
                    style={{
                      background: saving
                        ? 'rgba(108,60,225,0.7)'
                        : 'linear-gradient(135deg,#6C3CE1,#5A2FCA)',
                      boxShadow: saving ? 'none' : '0 2px 14px rgba(108,60,225,0.32)',
                      fontFamily: "'DM Sans',sans-serif",
                      transform: saving ? 'none' : undefined,
                    }}
                    aria-busy={saving}
                  >
                    {saving ? (
                      <>
                        <Loader2 size={15} strokeWidth={2} className="ea-spin" aria-hidden="true" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={15} strokeWidth={2} aria-hidden="true" />
                        Save Changes
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  /* ── Page shell ───────────────────────────────────────────────── */
  .ea-page {
    background: #F7F4F0;
    min-height: 100vh;
  }

  .ea-inner {
    max-width: 1070px;
    margin: 0 auto;
    padding: 90px 32px 80px;
  }

  /* ── Spinner ──────────────────────────────────────────────────── */
  @keyframes ea-spin {
    from { transform: rotate(0deg);   }
    to   { transform: rotate(360deg); }
  }
  .ea-spin { animation: ea-spin 0.75s linear infinite; }

  /* ── Photo dropzone (pa-dropzone reused from PostAd) ──────────── */
  .pa-dropzone {
    border: 2px dashed #E8E3DC;
    background: #FAFAF9;
    transition: border-color 0.2s ease, background 0.2s ease;
    padding: 24px;
  }
  .pa-dropzone:hover,
  .pa-dropzone:focus {
    border-color: rgba(108,60,225,0.4);
    background: rgba(108,60,225,0.03);
    outline: none;
  }

  /* ── Section card wrapper ─────────────────────────────────────── */
  /* PostAd sub-components typically wrap themselves in a white card.
     These rules back-stop any card that relies on pa-card or pa-section. */
  .pa-card,
  .pa-section {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 20px;
    padding: 28px;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
  }

  /* ── Form inputs shared baseline ─────────────────────────────── */
  .pa-input,
  .pa-select,
  .pa-textarea {
    width: 100%;
    background: #FAFAF9;
    border: 1.5px solid #E8E3DC;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.875rem;
    color: #1A1523;
    outline: none;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .pa-input,
  .pa-select {
    height: 44px;
    padding: 0 14px;
  }

  .pa-textarea {
    padding: 12px 14px;
    resize: vertical;
    min-height: 120px;
    line-height: 1.6;
  }

  .pa-input:focus,
  .pa-select:focus,
  .pa-textarea:focus {
    border-color: rgba(108,60,225,0.45);
    box-shadow: 0 0 0 3px rgba(108,60,225,0.09);
    background: #FFFFFF;
  }

  .pa-input[aria-invalid='true'],
  .pa-select[aria-invalid='true'],
  .pa-textarea[aria-invalid='true'] {
    border-color: rgba(232,98,42,0.5);
    box-shadow: 0 0 0 3px rgba(232,98,42,0.08);
  }

  .pa-input::placeholder,
  .pa-textarea::placeholder { color: #C4BDD0; }

  .pa-select {
    appearance: none;
    -webkit-appearance: none;
    cursor: pointer;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23C4BDD0' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
    padding-right: 38px;
  }

  /* ── Label ────────────────────────────────────────────────────── */
  .pa-label {
    display: block;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    font-weight: 600;
    color: #4A4558;
    margin-bottom: 6px;
  }

  /* ── Error text ───────────────────────────────────────────────── */
  .pa-error {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.72rem;
    color: #E8622A;
    margin-top: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* ── Section heading inside sub-components ────────────────────── */
  .pa-section-title {
    font-family: 'Syne', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    color: #1A1523;
    letter-spacing: -0.025em;
    margin-bottom: 20px;
  }

  .pa-section-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-size: 0.78rem;
    color: #8A8390;
    margin-top: -14px;
    margin-bottom: 20px;
  }

  /* ── Grid helpers used by sub-components ──────────────────────── */
  .pa-grid-2 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
  }

  .pa-grid-3 {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px;
  }

  /* ── Responsive ───────────────────────────────────────────────── */
  @media (max-width: 768px) {
    .ea-inner {
      padding: 28px 20px 64px;
    }
    .pa-grid-3 {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 480px) {
    .ea-inner {
      padding: 90px 16px 56px;
    }
    .pa-grid-2,
    .pa-grid-3 {
      grid-template-columns: 1fr;
    }
  }
`;
