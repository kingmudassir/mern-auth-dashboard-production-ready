import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import { Field } from '../Components/Login-Register/Field';
import { Input } from '../Components/Login-Register/Input';
import authService from '../Services/authService';
import { validateRegisterFields } from '../utilities/RegisterValidator';
import { useRegister } from '../Hooks/useRegister';

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

function RegisterSkeleton() {
  return (
    <div className="reg-bg relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="reg-card relative z-10 w-full max-w-130 rounded-3xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="w-28 h-5 rounded-md bg-gray-200 animate-pulse mb-3" />
          {/* Title */}
          <div className="w-52 h-7 rounded-md bg-gray-200 animate-pulse" />
          {/* Subtitle */}
          <div className="w-44 h-4 rounded-md bg-gray-200 animate-pulse" />
        </div>

        <div className="flex flex-col gap-5">
          {/* Full name */}
          <div className="flex flex-col gap-1.5">
            <div className="w-16 h-3 rounded bg-gray-200 animate-pulse" />
            <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* Email + Phone side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
              <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
              <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
            </div>
          </div>

          {/* Password + strength meter */}
          <div className="flex flex-col gap-1.5">
            <div className="w-16 h-3 rounded bg-gray-200 animate-pulse" />
            <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
            {/* Strength bars */}
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-1 flex-1 rounded-full bg-gray-200 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Confirm password */}
          <div className="flex flex-col gap-1.5">
            <div className="w-28 h-3 rounded bg-gray-200 animate-pulse" />
            <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* Terms text */}
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-72 h-3 rounded bg-gray-200 animate-pulse" />
            <div className="w-48 h-3 rounded bg-gray-200 animate-pulse" />
          </div>

          {/* Submit button */}
          <div className="w-full h-12 rounded-xl bg-gray-200 animate-pulse mt-1" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
function Register() {
  const { mutateAsync: registerUser, isPending, isError, error, isSuccess, reset } = useRegister();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (key) => (e) => {
    setFields((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));

    if (isError) {
      reset();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRegisterFields(fields, confirmPassword);

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      await registerUser(fields);
    } catch (err) {
      // React Query already sets isError + error
      // but catching prevents "Uncaught (in promise)"
    }
  };

  const strength = pwStrength(fields.password);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      try {
        const data = await authService.checkAuth();
        console.log('checkAuth response:', data);
        if (data.alreadyLoggedIn) {
          navigate('/');
        }
      } catch (err) {
        console.log('checkAuth failed:', err);
      } finally {
        setChecking(false);
      }
    };

    checkIfAlreadyLoggedIn();
  }, [navigate]);

  if (checking) return <RegisterSkeleton />; // Prevent rendering login form while checking

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
        {/* ── Global error banner ── */}

        {isError && (
          <div
            className="shake flex items-start gap-2.5 bg-[rgba(232,98,42,0.07)] border border-[rgba(232,98,42,0.25)] rounded-xl px-4 py-3 mb-5"
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle
              size={15}
              strokeWidth={2}
              className="text-[#E8622A] shrink-0 mt-px"
              aria-hidden="true"
            />
            <p
              className="text-[0.8rem] text-[#C4531F] font-medium leading-snug"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {error?.message || 'Something went wrong. Please try again.'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
          <div className="flex flex-col gap-5">
            {/* ── Full name ── */}
            <Field label="Full Name" error={errors.name}>
              <Input
                icon={User}
                type="text"
                placeholder="Muhammad Ali Khan"
                value={fields.name}
                onChange={set('name')}
                error={errors.name}
                autoComplete="name"
                aria-label="Full name"
                aria-invalid={!!errors.name}
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
            <Field label="Confirm Password">
              <Input
                icon={Lock}
                type={showCf ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                // error={errors.confirm}
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
              {confirmPassword && fields.password && (
                <span
                  className={`flex items-center gap-1 text-[0.72rem] font-medium ${confirmPassword === fields.password ? 'text-green-500' : 'text-[#E8622A]'}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  aria-live="polite"
                >
                  <CheckCircle2 size={11} strokeWidth={2} aria-hidden="true" />
                  {confirmPassword === fields.password
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
              disabled={isPending}
              className="btn-submit w-full flex items-center justify-center gap-2 text-white text-[0.9rem] font-semibold py-3.5 rounded-xl mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
              aria-label="Create account"
            >
              {isPending ? (
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
