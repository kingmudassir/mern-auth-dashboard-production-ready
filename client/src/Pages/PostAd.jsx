import { useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  X,
  Plus,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
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

// ─────────────────────────────────────────────────────────────────
// 💡 TANSTACK MUTATION INTEGRATION
//
//  const postAdMutation = useMutation({
//    mutationFn: (formData) => axios.post('/api/listings', formData, {
//      headers: { 'Content-Type': 'multipart/form-data' },
//    }),
//    onSuccess: (data) => navigate(`/cars/${data.listing._id}`),
//    onError: (err) => setGlobalErr(err.response?.data?.message || 'Failed to post ad.'),
//  });
//
//  Replace simulate() in handleSubmit with:
//  const fd = new FormData();
//  Object.entries(fields).forEach(([k, v]) => fd.append(k, v));
//  features.forEach(f => fd.append('features[]', f));
//  images.forEach(img => fd.append('images', img.file));
//  postAdMutation.mutate(fd);
//
//  Replace `loading` useState with: const loading = postAdMutation.isPending;
// ─────────────────────────────────────────────────────────────────

// ── Static data ───────────────────────────────────────────────────
const MAKES = [
  'Toyota',
  'Honda',
  'Suzuki',
  'Hyundai',
  'Kia',
  'Nissan',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Daihatsu',
  'Mitsubishi',
  'Changan',
  'Proton',
  'MG',
  'Other',
];
const MODELS = {
  Toyota: [
    'Corolla',
    'Yaris',
    'Fortuner',
    'Hilux',
    'Prado',
    'Vitz',
    'Aqua',
    'Premio',
    'Altis',
    'Other',
  ],
  Honda: ['Civic', 'City', 'HR-V', 'BR-V', 'Accord', 'Jazz', 'Fit', 'Other'],
  Suzuki: ['Alto', 'Swift', 'Cultus', 'Wagon R', 'Vitara', 'Jimny', 'Every', 'Other'],
  Hyundai: ['Tucson', 'Elantra', 'Sonata', 'Santa Fe', 'Creta', 'i10', 'Other'],
  Kia: ['Sportage', 'Picanto', 'Stonic', 'Sorento', 'Carnival', 'Other'],
  Nissan: ['Sunny', 'Dayz', 'Juke', 'X-Trail', 'Patrol', 'Other'],
  BMW: ['3 Series', '5 Series', '7 Series', 'X1', 'X3', 'X5', 'Other'],
  'Mercedes-Benz': ['C-Class', 'E-Class', 'S-Class', 'GLC', 'GLE', 'Other'],
  Audi: ['A3', 'A4', 'A6', 'Q3', 'Q5', 'Q7', 'Other'],
  Daihatsu: ['Mira', 'Move', 'Cast', 'Rocky', 'Other'],
  Mitsubishi: ['Outlander', 'Pajero', 'Eclipse Cross', 'Other'],
  Changan: ['Alsvin', 'CS35 Plus', 'CS55', 'Oshan X7', 'Other'],
  Proton: ['Saga', 'X70', 'X50', 'Other'],
  MG: ['HS', 'ZS', 'ZS EV', 'Other'],
  Other: ['Other'],
};
const YEARS = Array.from({ length: 26 }, (_, i) => 2025 - i);
const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Quetta',
  'Multan',
  'Hyderabad',
  'Sialkot',
  'Gujranwala',
  'Bahawalpur',
  'Abbottabad',
  'Other',
];
const FUEL_TYPES = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG', 'LPG'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const BODY_TYPES = [
  'Sedan',
  'SUV',
  'Hatchback',
  'Pickup / Truck',
  'Van / Minivan',
  'Coupe',
  'Crossover',
  'Wagon',
  'Convertible',
];
const COLORS = [
  'White',
  'Black',
  'Silver',
  'Grey',
  'Red',
  'Blue',
  'Brown',
  'Green',
  'Gold',
  'Beige',
  'Orange',
  'Yellow',
  'Maroon',
  'Other',
];
const ASSEMBLIES = ['Local', 'Imported'];
const CONDITIONS = ['Used', 'New'];
const REGISTERED_IN = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Quetta',
  'Multan',
  'Un-registered',
  'Other',
];

const FEATURE_GROUPS = [
  {
    group: 'Safety',
    items: [
      'ABS (Anti-lock Brakes)',
      'Airbags',
      'Traction Control',
      'Stability Control',
      'Reverse Camera',
      'Reverse Sensors',
      'Front Sensors',
      'Lane Departure Warning',
      'Blind Spot Monitor',
    ],
  },
  {
    group: 'Comfort',
    items: [
      'Air Conditioning',
      'Climate Control (Dual Zone)',
      'Heated Seats',
      'Ventilated Seats',
      'Leather Seats',
      'Sunroof / Moonroof',
      'Cruise Control',
      'Keyless Entry',
      'Push Start',
    ],
  },
  {
    group: 'Technology',
    items: [
      'Navigation System',
      'Rear Entertainment',
      'USB Input',
      'Aux Input',
      'Bluetooth',
      'Apple CarPlay',
      'Android Auto',
      'Wireless Charging',
    ],
  },
  {
    group: 'Exterior',
    items: [
      'Alloy Wheels',
      'Fog Lights',
      'LED Headlights',
      'Daytime Running Lights',
      'Roof Rails',
      'Power Mirrors',
      'Tinted Windows',
    ],
  },
  {
    group: 'Power & Convenience',
    items: [
      'Power Windows',
      'Power Steering',
      'Power Seats',
      'Power Tailgate',
      'Auto Headlights',
      'Auto Wipers',
      'Auto Dimming Mirror',
    ],
  },
];

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

// ── Shared primitives ─────────────────────────────────────────────
function SectionCard({ children, id }) {
  return (
    <div id={id} className="pa-card rounded-2xl p-6 md:p-8">
      {children}
    </div>
  );
}

function SectionTitle({ step, children, sub }) {
  return (
    <div className="flex items-start gap-3 mb-6">
      <span
        className="w-7 h-7 rounded-xl flex items-center justify-center text-[0.7rem] font-bold text-white flex-shrink-0 mt-0.5"
        style={{
          background: 'linear-gradient(135deg, #6C3CE1, #5A2FCA)',
          fontFamily: "'DM Sans', sans-serif",
        }}
        aria-hidden="true"
      >
        {step}
      </span>
      <div>
        <h2
          className="text-[1rem] font-extrabold tracking-[-0.025em] text-[#1A1523]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {children}
        </h2>
        {sub && (
          <p
            className="text-[0.75rem] text-[#8A8390] mt-0.5"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function FieldLabel({ children, required }) {
  return (
    <label
      className="block text-[0.7rem] font-semibold uppercase tracking-wider mb-1.5"
      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
      {required && <span style={{ color: '#E8622A' }}> *</span>}
    </label>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <span
      className="flex items-center gap-1 text-[0.72rem] mt-1"
      style={{ color: '#E8622A', fontFamily: "'DM Sans', sans-serif" }}
    >
      <AlertCircle size={10} strokeWidth={2} aria-hidden="true" />
      {msg}
    </span>
  );
}

function TextInput({ error, ...props }) {
  return (
    <input
      className="pa-input"
      style={{ borderColor: error ? 'rgba(232,98,42,0.5)' : undefined }}
      aria-invalid={!!error}
      {...props}
    />
  );
}

function SelectInput({ error, children, ...props }) {
  return (
    <div className="relative">
      <select
        className="pa-select"
        style={{ borderColor: error ? 'rgba(232,98,42,0.5)' : undefined }}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        strokeWidth={2.2}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: '#C4BDD0' }}
        aria-hidden="true"
      />
    </div>
  );
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
      {/* Upload zone */}
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

      {/* Preview grid */}
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
                    aria-label="Primary photo"
                  >
                    Cover
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

          {/* Add more tile */}
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
        className="w-4 h-4 rounded-[5px] flex items-center justify-center flex-shrink-0 transition-[background,border] duration-150"
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

// ── Progress steps ────────────────────────────────────────────────
const STEPS = [
  { label: 'Vehicle', icon: Car },
  { label: 'Photos', icon: Image },
  { label: 'Details', icon: FileText },
  { label: 'Contact', icon: Phone },
];

function ProgressBar({ activeStep }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map(({ label, icon: Icon }, i) => {
        const done = i < activeStep;
        const active = i === activeStep;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-300"
                style={{
                  background: done ? '#6C3CE1' : active ? 'rgba(108,60,225,0.12)' : '#F2EEE9',
                }}
              >
                {done ? (
                  <Check size={15} strokeWidth={2.5} style={{ color: '#fff' }} aria-hidden="true" />
                ) : (
                  <Icon
                    size={15}
                    strokeWidth={1.9}
                    style={{ color: active ? '#6C3CE1' : '#C4BDD0' }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span
                className="text-[0.65rem] font-semibold uppercase tracking-wide hidden sm:block"
                style={{
                  color: active ? '#6C3CE1' : done ? '#1A1523' : '#C4BDD0',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-0.5 mx-2 rounded-full transition-colors duration-300"
                style={{ background: i < activeStep ? '#6C3CE1' : '#E8E3DC' }}
                aria-hidden="true"
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function PostAd() {
  const navigate = useNavigate();

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

  const [images, setImages] = useState([]);
  const [features, setFeatures] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [globalErr, setGlobalErr] = useState('');

  // Derived
  const availableModels = MODELS[fields.make] ?? [];
  const charCount = fields.description.length;
  const activeStep = submitted
    ? 4
    : images.length > 0
      ? fields.phone
        ? 3
        : 2
      : fields.make
        ? 1
        : 0;

  const set = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFields((p) => ({
      ...p,
      [key]: val,
      ...(key === 'make' ? { model: '' } : {}),
    }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
    if (globalErr) setGlobalErr('');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateAll(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      // scroll to first error
      const firstErr = document.querySelector('[aria-invalid="true"]');
      firstErr?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    if (images.length === 0) {
      setGlobalErr('Please upload at least one photo of your vehicle.');
      document
        .getElementById('step-photos')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setLoading(true);
    setGlobalErr('');

    // ← REPLACE with: postAdMutation.mutate(formData)
    await new Promise((r) => setTimeout(r, 1600));
    setLoading(false);
    setSubmitted(true);
  };

  // ── Success ───────────────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="pa-bg min-h-screen flex items-center justify-center px-4 py-20">
          <div className="pa-card success-pop w-full max-w-md rounded-3xl p-10 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(108,60,225,0.1)' }}
            >
              <CheckCircle2 size={30} strokeWidth={1.8} style={{ color: '#6C3CE1' }} />
            </div>
            <h2
              className="text-[1.6rem] font-extrabold tracking-[-0.035em] mb-2"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Ad posted!
            </h2>
            <p
              className="text-[0.875rem] leading-relaxed mb-7"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Your {fields.year} {fields.make} {fields.model} is now live. Buyers can find and
              contact you directly.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => navigate('/cars')}
                className="inline-flex items-center justify-center gap-2 w-full text-white text-[0.875rem] font-semibold py-3.5 rounded-xl transition-transform duration-150 hover:-translate-y-px"
                style={{
                  background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
                  boxShadow: '0 2px 12px rgba(232,98,42,0.3)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Browse Marketplace
                <ArrowRight size={15} strokeWidth={2.2} />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setFields({
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
                  setImages([]);
                  setFeatures([]);
                }}
                className="w-full py-3 rounded-xl text-[0.875rem] font-medium border transition-colors duration-150"
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
      </>
    );
  }

  return (
    <>
      <style>{STYLES}</style>

      <div className="pa-bg" style={{ paddingTop: '66px' }}>
        <div className="pa-inner">
          {/* Page heading */}
          <div className="mb-8">
            <p
              className="text-[0.72rem] font-bold uppercase tracking-[0.1em] mb-1"
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
              Fill in the details below and your listing will be live in minutes.
            </p>
          </div>

          <ProgressBar activeStep={activeStep} />

          {/* Global error */}
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

          <form onSubmit={handleSubmit} noValidate aria-label="Post vehicle ad">
            <div className="flex flex-col gap-5">
              {/* ══ STEP 1 — Vehicle Info ══════════════════════ */}
              <SectionCard id="step-vehicle">
                <SectionTitle step="1" sub="Tell buyers what you're selling">
                  Vehicle Information
                </SectionTitle>

                {/* Make / Model / Variant */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <FieldLabel required>Make</FieldLabel>
                    <SelectInput
                      value={fields.make}
                      onChange={set('make')}
                      error={errors.make}
                      aria-label="Make"
                    >
                      <option value="">Select Make</option>
                      {MAKES.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </SelectInput>
                    <FieldError msg={errors.make} />
                  </div>
                  <div>
                    <FieldLabel required>Model</FieldLabel>
                    <SelectInput
                      value={fields.model}
                      onChange={set('model')}
                      error={errors.model}
                      disabled={!fields.make}
                      aria-label="Model"
                    >
                      <option value="">Select Model</option>
                      {availableModels.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </SelectInput>
                    <FieldError msg={errors.model} />
                  </div>
                  <div>
                    <FieldLabel>Variant</FieldLabel>
                    <TextInput
                      type="text"
                      placeholder="e.g. Altis X 1.6"
                      value={fields.variant}
                      onChange={set('variant')}
                      aria-label="Variant"
                    />
                  </div>
                </div>

                {/* Year / Condition / Body type */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div>
                    <FieldLabel required>Year</FieldLabel>
                    <SelectInput
                      value={fields.year}
                      onChange={set('year')}
                      error={errors.year}
                      aria-label="Year"
                    >
                      <option value="">Select Year</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </SelectInput>
                    <FieldError msg={errors.year} />
                  </div>
                  <div>
                    <FieldLabel required>Condition</FieldLabel>
                    <div className="flex gap-2 h-11">
                      {CONDITIONS.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => {
                            setFields((p) => ({ ...p, condition: c }));
                          }}
                          className="flex-1 rounded-xl border text-[0.82rem] font-semibold transition-all duration-150"
                          style={{
                            border:
                              fields.condition === c
                                ? '1.5px solid #6C3CE1'
                                : '1.5px solid #E8E3DC',
                            background:
                              fields.condition === c ? 'rgba(108,60,225,0.07)' : '#FAFAF9',
                            color: fields.condition === c ? '#6C3CE1' : '#8A8390',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                          aria-pressed={fields.condition === c}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>Body Type</FieldLabel>
                    <SelectInput
                      value={fields.bodyType}
                      onChange={set('bodyType')}
                      error={errors.bodyType}
                      aria-label="Body type"
                    >
                      <option value="">Select Body Type</option>
                      {BODY_TYPES.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </SelectInput>
                    <FieldError msg={errors.bodyType} />
                  </div>
                </div>

                {/* Fuel / Transmission / Engine / Assembly */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <FieldLabel required>Fuel</FieldLabel>
                    <SelectInput
                      value={fields.fuel}
                      onChange={set('fuel')}
                      error={errors.fuel}
                      aria-label="Fuel type"
                    >
                      <option value="">Select</option>
                      {FUEL_TYPES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </SelectInput>
                    <FieldError msg={errors.fuel} />
                  </div>
                  <div>
                    <FieldLabel required>Transmission</FieldLabel>
                    <SelectInput
                      value={fields.transmission}
                      onChange={set('transmission')}
                      error={errors.transmission}
                      aria-label="Transmission"
                    >
                      <option value="">Select</option>
                      {TRANSMISSIONS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </SelectInput>
                    <FieldError msg={errors.transmission} />
                  </div>
                  <div>
                    <FieldLabel>Engine (CC)</FieldLabel>
                    <TextInput
                      type="number"
                      placeholder="e.g. 1600"
                      value={fields.engineCC}
                      onChange={set('engineCC')}
                      min={100}
                      max={9000}
                      aria-label="Engine displacement"
                    />
                  </div>
                  <div>
                    <FieldLabel>Assembly</FieldLabel>
                    <div className="flex gap-2 h-11">
                      {ASSEMBLIES.map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => setFields((p) => ({ ...p, assembly: a }))}
                          className="flex-1 rounded-xl border text-[0.78rem] font-semibold transition-all duration-150"
                          style={{
                            border:
                              fields.assembly === a ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
                            background: fields.assembly === a ? 'rgba(108,60,225,0.07)' : '#FAFAF9',
                            color: fields.assembly === a ? '#6C3CE1' : '#8A8390',
                            fontFamily: "'DM Sans', sans-serif",
                          }}
                          aria-pressed={fields.assembly === a}
                        >
                          {a}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mileage / Color / Registered in */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <FieldLabel required={fields.condition !== 'New'}>
                      Mileage (km){fields.condition === 'New' && ' (optional)'}
                    </FieldLabel>
                    <TextInput
                      type="number"
                      placeholder="e.g. 45000"
                      value={fields.mileage}
                      onChange={set('mileage')}
                      error={errors.mileage}
                      min={0}
                      aria-label="Mileage in kilometers"
                    />
                    <FieldError msg={errors.mileage} />
                  </div>
                  <div>
                    <FieldLabel required>Color</FieldLabel>
                    <SelectInput
                      value={fields.color}
                      onChange={set('color')}
                      error={errors.color}
                      aria-label="Color"
                    >
                      <option value="">Select Color</option>
                      {COLORS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </SelectInput>
                    <FieldError msg={errors.color} />
                  </div>
                  <div>
                    <FieldLabel>Registered In</FieldLabel>
                    <SelectInput
                      value={fields.registeredIn}
                      onChange={set('registeredIn')}
                      aria-label="Registered in"
                    >
                      <option value="">Select City</option>
                      {REGISTERED_IN.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </SelectInput>
                  </div>
                </div>
              </SectionCard>

              {/* ══ STEP 2 — Photos ═══════════════════════════ */}
              <SectionCard id="step-photos">
                <SectionTitle
                  step="2"
                  sub="Good photos get significantly more inquiries — add up to 10"
                >
                  Photos
                </SectionTitle>
                <ImageUploader
                  images={images}
                  onAdd={handleAddImages}
                  onRemove={handleRemoveImage}
                  onSetPrimary={handleSetPrimary}
                />
              </SectionCard>

              {/* ══ STEP 3 — Features ══════════════════════════ */}
              <SectionCard>
                <SectionTitle step="3" sub="Select all that apply — this helps buyers filter">
                  Features & Equipment
                </SectionTitle>
                <div className="flex flex-col gap-5">
                  {FEATURE_GROUPS.map(({ group, items }) => (
                    <div key={group}>
                      <p
                        className="text-[0.7rem] font-bold uppercase tracking-[0.08em] mb-2.5"
                        style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {group}
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                        {items.map((feat) => (
                          <FeatureToggle
                            key={feat}
                            label={feat}
                            checked={features.includes(feat)}
                            onChange={() => toggleFeature(feat)}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                {features.length > 0 && (
                  <p
                    className="text-[0.72rem] mt-4 font-medium"
                    style={{ color: '#6C3CE1', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {features.length} feature{features.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </SectionCard>

              {/* ══ STEP 4 — Description ══════════════════════ */}
              <SectionCard id="step-details">
                <SectionTitle step="4" sub="Describe your car honestly — mention any issues too">
                  Description
                </SectionTitle>
                <div>
                  <FieldLabel required>Ad Description</FieldLabel>
                  <textarea
                    value={fields.description}
                    onChange={set('description')}
                    placeholder={`Describe your ${fields.make || 'vehicle'} in detail. Include condition, any recent repairs, accessories, reason for selling, etc.\n\nMinimum 30 characters.`}
                    rows={7}
                    className="w-full rounded-xl border bg-[#FAFAF9] text-[0.875rem] p-4 outline-none resize-none transition-[border-color,box-shadow] duration-200 focus:border-[rgba(108,60,225,0.4)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus:bg-white"
                    style={{
                      borderColor: errors.description ? 'rgba(232,98,42,0.5)' : '#E8E3DC',
                      color: '#1A1523',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    aria-label="Ad description"
                    aria-invalid={!!errors.description}
                    aria-describedby="desc-count"
                  />
                  <div className="flex items-center justify-between mt-1">
                    <FieldError msg={errors.description} />
                    <span
                      id="desc-count"
                      className="text-[0.68rem] ml-auto"
                      style={{
                        color: charCount < 30 ? '#E8622A' : '#8A8390',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {charCount} characters
                      {charCount < 30 ? ` (${30 - charCount} more needed)` : ''}
                    </span>
                  </div>
                </div>
              </SectionCard>

              {/* ══ STEP 5 — Price ════════════════════════════ */}
              <SectionCard>
                <SectionTitle step="5" sub="Set your asking price in PKR">
                  Price
                </SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Asking Price (PKR)</FieldLabel>
                    <div className="relative">
                      <span
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8rem] font-semibold pointer-events-none"
                        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        aria-hidden="true"
                      >
                        PKR
                      </span>
                      <TextInput
                        type="number"
                        placeholder="e.g. 2500000"
                        value={fields.price}
                        onChange={set('price')}
                        error={errors.price}
                        min={0}
                        style={{ paddingLeft: '52px' }}
                        aria-label="Asking price in PKR"
                      />
                    </div>
                    <FieldError msg={errors.price} />
                    {fields.price && !isNaN(Number(fields.price)) && Number(fields.price) > 0 && (
                      <p
                        className="text-[0.72rem] mt-1 font-medium"
                        style={{ color: '#6C3CE1', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        ≈{' '}
                        {Number(fields.price) >= 10000000
                          ? `${(Number(fields.price) / 10000000).toFixed(2)} Crore`
                          : `${(Number(fields.price) / 100000).toFixed(1)} Lac`}
                      </p>
                    )}
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex-shrink-0">
                        <input
                          type="checkbox"
                          className="peer sr-only"
                          checked={fields.negotiable}
                          onChange={set('negotiable')}
                          aria-label="Price is negotiable"
                        />
                        <div
                          className="w-5 h-5 rounded-md border transition-[background,border] duration-150 flex items-center justify-center"
                          style={{
                            border: fields.negotiable ? 'none' : '1.5px solid #C4BDD0',
                            background: fields.negotiable ? '#6C3CE1' : 'transparent',
                          }}
                        >
                          {fields.negotiable && (
                            <Check size={11} strokeWidth={3} style={{ color: '#fff' }} />
                          )}
                        </div>
                      </div>
                      <div>
                        <p
                          className="text-[0.82rem] font-semibold"
                          style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Price is negotiable
                        </p>
                        <p
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Buyers will know they can make an offer
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </SectionCard>

              {/* ══ STEP 6 — Location & Contact ═══════════════ */}
              <SectionCard id="step-contact">
                <SectionTitle step="6" sub="Where is the car located and how can buyers reach you">
                  Location & Contact
                </SectionTitle>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div>
                    <FieldLabel required>City</FieldLabel>
                    <SelectInput
                      value={fields.city}
                      onChange={set('city')}
                      error={errors.city}
                      aria-label="City"
                    >
                      <option value="">Select City</option>
                      {CITIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </SelectInput>
                    <FieldError msg={errors.city} />
                  </div>
                  <div>
                    <FieldLabel>Area / Neighbourhood</FieldLabel>
                    <div className="relative">
                      <MapPin
                        size={14}
                        strokeWidth={1.9}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: '#C4BDD0' }}
                        aria-hidden="true"
                      />
                      <TextInput
                        type="text"
                        placeholder="e.g. DHA Phase 5"
                        value={fields.area}
                        onChange={set('area')}
                        style={{ paddingLeft: '38px' }}
                        aria-label="Area or neighbourhood"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <FieldLabel required>Contact Number</FieldLabel>
                    <div className="relative">
                      <Phone
                        size={14}
                        strokeWidth={1.9}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                        style={{ color: '#C4BDD0' }}
                        aria-hidden="true"
                      />
                      <TextInput
                        type="tel"
                        placeholder="03001234567"
                        value={fields.phone}
                        onChange={set('phone')}
                        error={errors.phone}
                        style={{ paddingLeft: '38px' }}
                        autoComplete="tel"
                        aria-label="Contact phone number"
                      />
                    </div>
                    <FieldError msg={errors.phone} />
                  </div>
                  <div className="flex items-end pb-0.5">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div
                        className="w-5 h-5 rounded-md border flex items-center justify-center transition-[background,border] duration-150"
                        style={{
                          border: fields.whatsapp ? 'none' : '1.5px solid #C4BDD0',
                          background: fields.whatsapp ? '#25D366' : 'transparent',
                        }}
                        aria-hidden="true"
                      >
                        {fields.whatsapp && (
                          <Check size={11} strokeWidth={3} style={{ color: '#fff' }} />
                        )}
                      </div>
                      <input
                        type="checkbox"
                        className="sr-only"
                        checked={fields.whatsapp}
                        onChange={set('whatsapp')}
                        aria-label="WhatsApp available on this number"
                      />
                      <div>
                        <p
                          className="text-[0.82rem] font-semibold"
                          style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          WhatsApp available
                        </p>
                        <p
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Show WhatsApp button on your listing
                        </p>
                      </div>
                    </label>
                  </div>
                </div>
              </SectionCard>

              {/* ══ Submit ════════════════════════════════════ */}
              <div
                className="rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                style={{
                  background: 'linear-gradient(135deg, #1A1523 0%, #231930 100%)',
                  border: '1.5px solid rgba(255,255,255,0.06)',
                }}
              >
                <div>
                  <p
                    className="text-[0.95rem] font-extrabold text-white tracking-[-0.02em]"
                    style={{ fontFamily: "'Syne', sans-serif" }}
                  >
                    Ready to post your ad?
                  </p>
                  <p
                    className="text-[0.75rem] mt-0.5"
                    style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Your listing will be reviewed and go live shortly.
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="pa-submit-btn flex items-center gap-2.5 text-white text-[0.9rem] font-semibold px-7 py-3.5 rounded-xl flex-shrink-0 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  aria-label="Post your ad"
                >
                  {loading ? (
                    <>
                      <span className="pa-spinner" aria-hidden="true" />
                      Posting…
                    </>
                  ) : (
                    <>
                      Post Ad
                      <ArrowRight size={15} strokeWidth={2.2} aria-hidden="true" />
                    </>
                  )}
                </button>
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

  .pa-bg {
    background-color: #F7F4F0;
    background-image:
      radial-gradient(ellipse 50% 40% at 5% 20%, rgba(108,60,225,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 40% 30% at 95% 80%, rgba(232,98,42,0.04) 0%, transparent 65%);
    min-height: 100vh;
  }

  .pa-inner {
    max-width: 860px;
    margin: 0 auto;
    padding: 36px 24px 72px;
  }

  .pa-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 2px 12px rgba(26,21,35,0.04), 0 1px 3px rgba(26,21,35,0.03);
  }

  .pa-input, .pa-select {
    width: 100%;
    height: 44px;
    background: #FAFAF9;
    border: 1.5px solid #E8E3DC;
    border-radius: 12px;
    font-size: 0.875rem;
    color: #1A1523;
    padding: 0 14px;
    outline: none;
    font-family: 'DM Sans', sans-serif;
    transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
    appearance: none;
    -webkit-appearance: none;
    display: block;
  }

  .pa-input:focus, .pa-select:focus {
    border-color: rgba(108,60,225,0.4);
    box-shadow: 0 0 0 3px rgba(108,60,225,0.08);
    background-color: #FFFFFF;
  }

  .pa-input::placeholder { color: #C4BDD0; }
  .pa-input:disabled, .pa-select:disabled { opacity: 0.5; cursor: not-allowed; }

  /* Dropzone */
  .pa-dropzone {
    border: 2px dashed #E8E3DC;
    background: #FAFAF9;
    transition: border-color 0.2s ease, background-color 0.2s ease;
    padding: 32px 24px;
  }

  .pa-dropzone:hover, .pa-dropzone:focus-within {
    border-color: rgba(108,60,225,0.38);
    background-color: rgba(108,60,225,0.02);
    outline: none;
  }

  /* Submit button */
  .pa-submit-btn {
    background: linear-gradient(135deg, #E8622A 0%, #C4531F 100%);
    box-shadow: 0 2px 12px rgba(232,98,42,0.32);
    position: relative; overflow: hidden;
    border: none; cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .pa-submit-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #D4521C 0%, #AA3E12 100%);
    opacity: 0;
    transition: opacity 0.18s ease;
    border-radius: inherit;
  }

  .pa-submit-btn:not(:disabled):hover::before { opacity: 1; }
  .pa-submit-btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(232,98,42,0.4);
  }
  .pa-submit-btn:not(:disabled):active { transform: translateY(0); }

  /* Spinner */
  @keyframes spin { to { transform: rotate(360deg); } }
  .pa-spinner {
    width: 17px; height: 17px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* Success pop */
  @keyframes successPop {
    0%   { opacity: 0; transform: scale(0.88) translateY(16px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .success-pop { animation: successPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  @media (max-width: 640px) {
    .pa-inner { padding: 24px 16px 56px; }
  }
`;
