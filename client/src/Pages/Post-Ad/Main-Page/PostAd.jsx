import React, { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Upload,
  X,
  Plus,
  AlertCircle,
  ArrowRight,
  Car,
  MapPin,
  Phone,
  FileText,
  Image,
  Star,
  Check,
  Info,
} from 'lucide-react';

import VehicleInfoSection from '../../Post-Ad/Functions/VehicleInfoSection';
import PhotosSection from '../../Post-Ad/Functions/PhotosSection';
import FeaturesSection from '../../Post-Ad/Functions/FeaturesSection';
import DescriptionSection from '../../Post-Ad/Functions/DescriptionSection';
import PriceSection from '../../Post-Ad/Functions/PriceSection';
import LocationContactSection from '../../Post-Ad/Functions/LocationContactSection';
import SubmitSection from '../../Post-Ad/Functions/SubmitSection';
import ProgressBar from '../../Post-Ad/Functions/ProgressBar';
import { usePostAd } from '../../../Hooks/Post-Ad/usePostAd';

const MAX_IMAGES = 10;

// ── Validation ────────────────────────────────────────────────────
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

// ── Image uploader ────────────────────────────────────────────────
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
                <img
                  src={img.preview}
                  alt={`Photo ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                {i === 0 && (
                  <span
                    className="absolute bottom-0 left-0 right-0 text-center text-[0.58rem] font-bold uppercase tracking-wider py-0.5 text-white"
                    style={{
                      background: 'rgba(232,98,42,0.85)',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    Cover
                  </span>
                )}
              </div>
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
            >
              <Plus size={16} strokeWidth={2} style={{ color: '#C4BDD0' }} />
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
        <Info size={11} strokeWidth={2} />
        First photo will be the cover. Hover a photo to set a different one as cover or remove it.
      </p>
    </div>
  );
}

// ── Feature toggle ────────────────────────────────────────────────
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

// ── Success screen ────────────────────────────────────────────────
function PendingSuccessScreen({ fields, onReset, onGoToAds }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#F7F4F0', paddingTop: '66px' }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-10 text-center"
        style={{
          background: '#FFFFFF',
          border: '1.5px solid #E8E3DC',
          boxShadow: '0 12px 40px rgba(26,21,35,0.08)',
        }}
      >
        {/* Icon */}
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(217,119,6,0.1)' }}
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#D97706"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        {/* Heading */}
        <h2
          className="text-[1.5rem] font-extrabold tracking-[-0.04em] mb-2"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          Ad Submitted for Review
        </h2>

        {/* Car name */}
        <p
          className="text-[0.88rem] font-semibold mb-3"
          style={{ color: '#6C3CE1', fontFamily: "'DM Sans', sans-serif" }}
        >
          {[fields.year, fields.make, fields.model].filter(Boolean).join(' ')}
        </p>

        {/* Explanation */}
        <p
          className="text-[0.82rem] leading-relaxed mb-6"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          Your listing is now <strong style={{ color: '#D97706' }}>under review</strong>. Our team
          will check it against our listing guidelines and approve it — usually within a few hours.
          You'll be able to track its status in <strong style={{ color: '#1A1523' }}>My Ads</strong>
          .
        </p>

        {/* Status indicator */}
        <div
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl mb-6"
          style={{ background: 'rgba(217,119,6,0.07)', border: '1px solid rgba(217,119,6,0.2)' }}
        >
          <span className="w-2 h-2 rounded-full" style={{ background: '#D97706' }} />
          <span
            className="text-[0.78rem] font-semibold"
            style={{ color: '#D97706', fontFamily: "'DM Sans', sans-serif" }}
          >
            Pending approval
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <button
            type="button"
            onClick={onGoToAds}
            className="w-full py-3 rounded-xl text-[0.88rem] font-bold text-white transition-opacity hover:opacity-90"
            style={{
              background: 'linear-gradient(135deg, #6C3CE1, #8B5CF6)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            View in My Ads
          </button>
          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 rounded-xl text-[0.88rem] font-medium border transition-colors"
            style={{
              color: '#8A8390',
              borderColor: '#E8E3DC',
              background: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Post Another Ad
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Progress steps ────────────────────────────────────────────────
const STEPS = [
  { label: 'Vehicle', icon: Car },
  { label: 'Photos', icon: Image },
  { label: 'Details', icon: FileText },
  { label: 'Contact', icon: Phone },
];

// ── Main component ────────────────────────────────────────────────
const EMPTY_FIELDS = {
  make: '',
  model: '',
  variant: '',
  customVariant: '',
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
};

export default function PostAd() {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [fields, setFields] = useState({ ...EMPTY_FIELDS });
  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState('');

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFields((p) => {
      const next = { ...p, [key]: val };
      if (key === 'make') {
        next.model = '';
        next.variant = '';
      }
      if (key === 'model' && val !== 'Other' && p.make !== 'Other') {
        next.variant = '';
      }
      return next;
    });
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  // Progress tracking
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

  const derivedActiveStep = submitted
    ? 4
    : contactDone
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
    setActiveStep(index);
  };

  const toggleFeature = (feat) => {
    setFeatures((p) => (p.includes(feat) ? p.filter((f) => f !== feat) : [...p, feat]));
  };

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

  const postAdMutation = usePostAd({
    onSuccess: () => setSubmitted(true),
    onError: (msg) => setGlobalErr(msg),
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAll(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      document
        .querySelector('[aria-invalid="true"]')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (images.length === 0) {
      setGlobalErr('Please upload at least one photo of your vehicle.');
      document
        .getElementById('step-photos')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setGlobalErr('');
    postAdMutation.mutate({ fields, images, features });
  };

  const handleReset = () => {
    setSubmitted(false);
    setFields({ ...EMPTY_FIELDS });
    setImages([]);
    setFeatures([]);
  };

  if (submitted) {
    return (
      <PendingSuccessScreen
        fields={fields}
        onReset={handleReset}
        onGoToAds={() => navigate('/profile/my-ads')}
      />
    );
  }

  return (
    <div className="pa-bg" style={{ paddingTop: '66px' }}>
      <div className="pa-inner">
        {/* Heading */}
        <div className="mb-8">
          <p
            className="text-[0.72rem] font-bold uppercase tracking-widest mb-1"
            style={{ color: '#6C3CE1', fontFamily: "'DM Sans', sans-serif" }}
          >
            Sell Your Car
          </p>
          <h1
            className="text-[2rem] font-extrabold tracking-[-0.04em] leading-tight"
            style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
          >
            Post Your Ad
          </h1>
          <p
            className="text-[0.875rem] mt-1"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            Fill in the details below. Your ad will go live after a quick review by our team.
          </p>
        </div>

        <ProgressBar
          activeStep={derivedActiveStep}
          steps={STEPS}
          onStepClick={scrollToSection}
          completedSteps={completedSteps}
        />

        {/* Global error */}
        {globalErr && (
          <div
            className="flex items-start gap-2.5 rounded-xl px-4 py-3 mb-5"
            style={{ background: 'rgba(232,98,42,0.07)', border: '1px solid rgba(232,98,42,0.25)' }}
            role="alert"
          >
            <AlertCircle size={15} strokeWidth={2} style={{ color: '#E8622A', flexShrink: 0 }} />
            <p
              className="text-[0.8rem] font-medium"
              style={{ color: '#C4531F', fontFamily: "'DM Sans', sans-serif" }}
            >
              {globalErr}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Post vehicle ad">
          <div className="flex flex-col gap-5">
            {/* STEP 1 — Vehicle Info */}
            <div id="step-vehicle">
              <VehicleInfoSection
                fields={fields}
                errors={errors}
                set={set}
                setFields={setFields}
                setFeatures={setFeatures}
              />
            </div>

            {/* STEP 2 — Photos */}
            <div id="step-photos">
              <PhotosSection
                images={images}
                onAdd={handleAddImages}
                onRemove={handleRemoveImage}
                onSetPrimary={handleSetPrimary}
                ImageUploader={ImageUploader}
              />
            </div>

            {/* STEP 3 — Details */}
            <div id="step-details" className="flex flex-col gap-5">
              <FeaturesSection
                features={features}
                toggleFeature={toggleFeature}
                FeatureToggle={FeatureToggle}
              />
              <DescriptionSection fields={fields} errors={errors} set={set} />
              <PriceSection fields={fields} errors={errors} set={set} />
            </div>

            {/* STEP 4 — Contact */}
            <div id="step-contact">
              <LocationContactSection fields={fields} errors={errors} set={set} />
            </div>

            <SubmitSection loading={postAdMutation.isPending} />
          </div>
        </form>
      </div>
    </div>
  );
}
