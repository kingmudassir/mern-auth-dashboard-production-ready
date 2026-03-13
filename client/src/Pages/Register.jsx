import { useState, useRef } from 'react';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  ChevronDown,
  Camera,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
  Building2,
  UserCheck,
  ShoppingBag,
} from 'lucide-react';

// ── Data ────────────────────────────────────────────────────────
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
];

const ACCOUNT_TYPES = [
  {
    id: 'buyer',
    icon: ShoppingBag,
    label: 'Buyer',
    desc: 'I want to browse and buy cars',
  },
  {
    id: 'seller',
    icon: UserCheck,
    label: 'Seller',
    desc: 'I want to list my personal car',
  },
  {
    id: 'dealer',
    icon: Building2,
    label: 'Dealer',
    desc: 'I run a showroom or dealership',
  },
];

// ── Helpers ─────────────────────────────────────────────────────
const validate = (fields) => {
  const errs = {};
  if (!fields.fullName.trim()) errs.fullName = 'Full name is required';
  if (!fields.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Enter a valid email address';
  if (!fields.phone.match(/^(\+92|0)[0-9]{10}$/))
    errs.phone = 'Enter a valid Pakistani number (e.g. 03001234567)';
  if (!fields.city) errs.city = 'Please select your city';
  if (fields.password.length < 8) errs.password = 'Password must be at least 8 characters';
  if (fields.password !== fields.confirm) errs.confirm = 'Passwords do not match';
  if (!fields.accountType) errs.accountType = 'Please select an account type';
  return errs;
};

const pwStrength = (pw) => {
  if (!pw) return 0;
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

const STRENGTH_LABEL = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const STRENGTH_COLOR = ['', '#E8622A', '#C9A84C', '#6C3CE1', '#22c55e'];

// ── Field wrapper ────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[0.72rem] font-semibold text-[#8A8390] uppercase tracking-wider"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          className="flex items-center gap-1 text-[0.75rem] text-[#E8622A]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          role="alert"
        >
          <AlertCircle size={11} strokeWidth={2} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
}

// ── Input ────────────────────────────────────────────────────────
function Input({ icon: Icon, error, suffix, ...props }) {
  return (
    <div
      className={`
        relative flex items-center
        border rounded-xl h-11 bg-[#FAFAF9]
        transition-[border-color,box-shadow] duration-200
        ${
          error
            ? 'border-[rgba(232,98,42,0.5)] focus-within:border-[#E8622A] focus-within:shadow-[0_0_0_3px_rgba(232,98,42,0.1)]'
            : 'border-[#E8E3DC] focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus-within:bg-white'
        }
      `}
    >
      {Icon && (
        <Icon
          size={15}
          strokeWidth={1.9}
          className="absolute left-3.5 text-[#B0AABA] pointer-events-none"
          aria-hidden="true"
        />
      )}
      <input
        className="
          flex-1 h-full bg-transparent outline-none border-none
          text-[0.875rem] text-[#1A1523] placeholder-[#C4BDD0]
          pl-10 pr-4
        "
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        {...props}
      />
      {suffix}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
function Register() {
  const fileRef = useRef(null);

  const [fields, setFields] = useState({
    fullName: '',
    email: '',
    phone: '',
    city: '',
    password: '',
    confirm: '',
    accountType: '',
  });
  const [avatar, setAvatar] = useState(null);
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setFields((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
  };

  const handleAvatar = (e) => {
    const file = e.target.files?.[0];
    if (file) setAvatar(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSubmitted(true);
  };

  const strength = pwStrength(fields.password);

  // ── Success screen ───────────────────────────────────────────
  if (submitted) {
    return (
      <>
        <div className="reg-bg min-h-screen flex items-center justify-center px-4 py-16">
          <div className="success-pop bg-white border border-[#E8E3DC] rounded-3xl p-10 max-w-sm w-full text-center shadow-[0_8px_40px_rgba(26,21,35,0.08)]">
            <div className="w-16 h-16 rounded-full bg-[rgba(108,60,225,0.1)] flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 size={30} strokeWidth={1.8} className="text-[#6C3CE1]" />
            </div>
            <h2
              className="text-[1.6rem] font-extrabold text-[#1A1523] mb-2 leading-tight tracking-[-0.03em]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              You're in!
            </h2>
            <p
              className="text-[#8A8390] text-[0.9rem] leading-relaxed mb-7"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Your account has been created. Welcome to Paiyya — let's find your perfect drive.
            </p>
            <a
              href="/"
              className="
                inline-flex items-center justify-center gap-2 w-full
                text-white text-[0.875rem] font-semibold
                py-3 rounded-xl
                transition-transform duration-200 hover:-translate-y-px
              "
              style={{
                background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
                boxShadow: '0 2px 12px rgba(232,98,42,0.3)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Go to Homepage
              <ArrowRight size={15} strokeWidth={2.2} />
            </a>
          </div>
        </div>
      </>
    );
  }

  // ── Form ─────────────────────────────────────────────────────
  return (
    <div className="reg-bg relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="reg-card reg-fade relative z-10 w-full max-w-130 rounded-3xl p-8 md:p-10">
        {/* ── Header ── */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-6" aria-label="Paiyya homepage">
            <img src="/wheel.svg" alt="" className="w-7 h-7 object-contain" aria-hidden="true" />
            <span
              className="font-extrabold text-[1.25rem] tracking-[-0.045em] text-[#1A1523] leading-none"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Pai<em className="not-italic text-[#6C3CE1]">yya</em>
            </span>
          </a>
          <h1
            className="text-[1.75rem] font-extrabold text-[#1A1523] leading-tight tracking-[-0.035em] mb-1.5"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Create your account
          </h1>
          <p
            className="text-[0.875rem] text-[#8A8390]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Already have one?{' '}
            <a href="/login" className="text-[#6C3CE1] font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
          <div className="flex flex-col gap-5">
            {/* ── Full name ── */}
            <Field label="Full Name" error={errors.fullName}>
              <Input
                icon={User}
                type="text"
                placeholder="Muhammad Ali Khan"
                value={fields.fullName}
                onChange={set('fullName')}
                error={errors.fullName}
                autoComplete="name"
                aria-label="Full name"
                aria-invalid={!!errors.fullName}
              />
            </Field>

            {/* ── Email + Phone side by side ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Email" error={errors.email}>
                <Input
                  icon={Mail}
                  type="email"
                  placeholder="you@example.com"
                  value={fields.email}
                  onChange={set('email')}
                  error={errors.email}
                  autoComplete="email"
                  aria-label="Email address"
                  aria-invalid={!!errors.email}
                />
              </Field>

              <Field label="Phone" error={errors.phone}>
                <Input
                  icon={Phone}
                  type="tel"
                  placeholder="03001234567"
                  value={fields.phone}
                  onChange={set('phone')}
                  error={errors.phone}
                  autoComplete="tel"
                  aria-label="Phone number"
                  aria-invalid={!!errors.phone}
                />
              </Field>
            </div>

            {/* ── Password ── */}
            <Field label="Password" error={errors.password}>
              <Input
                icon={Lock}
                type={showPw ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                value={fields.password}
                onChange={set('password')}
                error={errors.password}
                autoComplete="new-password"
                aria-label="Password"
                aria-invalid={!!errors.password}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPw((p) => !p)}
                    className="absolute right-3.5 text-[#B0AABA] hover:text-[#8A8390] transition-colors duration-150"
                    aria-label={showPw ? 'Hide password' : 'Show password'}
                  >
                    {showPw ? (
                      <EyeOff size={15} strokeWidth={1.9} aria-hidden="true" />
                    ) : (
                      <Eye size={15} strokeWidth={1.9} aria-hidden="true" />
                    )}
                  </button>
                }
              />
              {/* Strength meter */}
              {fields.password && (
                <div className="mt-1.5">
                  <div className="flex gap-1 mb-1" aria-hidden="true">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="str-seg"
                        style={{
                          background: i <= strength ? STRENGTH_COLOR[strength] : '#E8E3DC',
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[0.7rem] font-medium"
                    style={{
                      color: STRENGTH_COLOR[strength],
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                    aria-live="polite"
                  >
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              )}
            </Field>

            {/* ── Confirm password ── */}
            <Field label="Confirm Password" error={errors.confirm}>
              <Input
                icon={Lock}
                type={showCf ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={fields.confirm}
                onChange={set('confirm')}
                error={errors.confirm}
                autoComplete="new-password"
                aria-label="Confirm password"
                aria-invalid={!!errors.confirm}
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowCf((p) => !p)}
                    className="absolute right-3.5 text-[#B0AABA] hover:text-[#8A8390] transition-colors duration-150"
                    aria-label={showCf ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showCf ? (
                      <EyeOff size={15} strokeWidth={1.9} aria-hidden="true" />
                    ) : (
                      <Eye size={15} strokeWidth={1.9} aria-hidden="true" />
                    )}
                  </button>
                }
              />
              {/* Match indicator */}
              {fields.confirm && fields.password && (
                <span
                  className={`flex items-center gap-1 text-[0.72rem] font-medium ${fields.confirm === fields.password ? 'text-green-500' : 'text-[#E8622A]'}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  aria-live="polite"
                >
                  <CheckCircle2 size={11} strokeWidth={2} aria-hidden="true" />
                  {fields.confirm === fields.password
                    ? 'Passwords match'
                    : 'Passwords do not match'}
                </span>
              )}
            </Field>

            {/* ── Terms ── */}
            <p
              className="text-[0.75rem] text-[#8A8390] text-center leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              By creating an account you agree to our{' '}
              <a href="/terms" className="text-[#6C3CE1] hover:underline font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-[#6C3CE1] hover:underline font-medium">
                Privacy Policy
              </a>
              .
            </p>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={loading}
              className="btn-submit w-full flex items-center justify-center gap-2 text-white text-[0.9rem] font-semibold py-3.5 rounded-xl mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              aria-label="Create account"
            >
              {loading ? (
                <>
                  <span className="spinner" aria-hidden="true" />
                  <span className="relative z-10">Creating account…</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Create Account</span>
                  <ArrowRight
                    size={15}
                    strokeWidth={2.2}
                    className="relative z-10"
                    aria-hidden="true"
                  />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default Register;
