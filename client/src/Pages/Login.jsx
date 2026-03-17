import { useEffect, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';
import { useLogin } from '../Hooks/useLogin';
import { Field } from '../Components/Login-Register/Field';
import { Input } from '../Components/Login-Register/Input';
import { useNavigate } from 'react-router-dom';
import authService from '../Services/authService';
import { validateLoginFields } from '../utilities/LoginValidator';

// ── Helpers ─────────────────────────────────────────────────────
const disposableDomains = [
  'tempmail.com',
  '10minutemail.com',
  'mailinator.com',
  'guerrillamail.com',
  'yopmail.com',
];

function LoginSkeleton() {
  return (
    <div className="login-bg relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="login-card relative z-10 w-full max-w-110 rounded-3xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-8 flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="w-28 h-5 rounded-md bg-gray-200 animate-pulse mb-3" />
          {/* Title */}
          <div className="w-44 h-7 rounded-md bg-gray-200 animate-pulse" />
          {/* Subtitle */}
          <div className="w-56 h-4 rounded-md bg-gray-200 animate-pulse" />
        </div>

        <div className="flex flex-col gap-5">
          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
            <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <div className="w-16 h-3 rounded bg-gray-200 animate-pulse" />
              <div className="w-24 h-3 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* Remember me */}
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 rounded-sm bg-gray-200 animate-pulse" />
            <div className="w-28 h-3 rounded bg-gray-200 animate-pulse" />
          </div>

          {/* Submit button */}
          <div className="w-full h-12 rounded-xl bg-gray-200 animate-pulse mt-1" />

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200 animate-pulse" />
            <div className="w-24 h-3 rounded bg-gray-200 animate-pulse" />
            <div className="flex-1 h-px bg-gray-200 animate-pulse" />
          </div>

          {/* Social buttons */}
          <div className="grid grid-cols-2 gap-3">
            <div className="h-11 rounded-xl bg-gray-200 animate-pulse" />
            <div className="h-11 rounded-xl bg-gray-200 animate-pulse" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-1.5 mt-7">
          <div className="w-48 h-3 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
function Login() {
  const [fields, setFields] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState('');
  const navigate = useNavigate();

  //Tanstack
  const { mutateAsync: loginUser, isPending, isError, error, isSuccess } = useLogin();

  const set = (key) => (e) => {
    setFields((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
    if (globalErr) setGlobalErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // const errs = validate(fields);
    const errs = validateLoginFields(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      setGlobalErr('');
      await loginUser(fields);
    } catch (error) {
      setGlobalErr(error?.message || 'Incorrect email or password.');
    }
  };

  // ── Success screen ─────────────────────────────────────────────
  useEffect(() => {
    if (isSuccess) {
      navigate('/userprofile');
    }
  }, [isSuccess, navigate]);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      try {
        const data = await authService.checkAuth();
        console.log('checkAuth response:', data); // <-- add this
        if (data.alreadyLoggedIn) {
          navigate('/userprofile');
        }
      } catch (err) {
        console.log('checkAuth failed:', err); // <-- and this
      } finally {
        setChecking(false);
      }
    };

    checkIfAlreadyLoggedIn();
  }, [navigate]);

  if (checking) return <LoginSkeleton />; // Prevent rendering login form while checking

  // ── Login form ─────────────────────────────────────────────────
  return (
    <>
      <div className="login-bg relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="login-card login-fade relative z-10 w-full max-w-110 rounded-3xl p-8 md:p-10">
          {/* ── Header ── */}
          <div className="text-center mb-8">
            <a
              href="/login"
              className="inline-flex items-center gap-2 mb-6"
              aria-label="Paiyya homepage"
            >
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
              Welcome back
            </h1>
            <p
              className="text-[0.875rem] text-[#8A8390]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Don't have an account?{' '}
              <a href="/register" className="text-[#6C3CE1] font-medium hover:underline">
                Sign up free
              </a>
            </p>
          </div>

          {/* ── Global error banner ── */}
          {globalErr && (
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
                {globalErr}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate aria-label="Login form">
            <div className="flex flex-col gap-5">
              {/* ── Email ── */}
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

              {/* ── Password ── */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label
                    className="text-[0.72rem] font-semibold text-[#8A8390] uppercase tracking-wider"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Password
                  </label>
                  <a
                    href="/forgotpassword"
                    className="forgot-link"
                    aria-label="Forgot your password?"
                  >
                    Forgot password?
                  </a>
                </div>
                <Input
                  icon={Lock}
                  type={showPw ? 'text' : 'password'}
                  placeholder="Your password"
                  value={fields.password}
                  onChange={set('password')}
                  error={errors.password}
                  autoComplete="current-password"
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
                {errors.password && (
                  <span
                    className="flex items-center gap-1 text-[0.75rem] text-[#E8622A]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    role="alert"
                  >
                    <AlertCircle size={11} strokeWidth={2} aria-hidden="true" />
                    {errors.password}
                  </span>
                )}
              </div>

              {/* ── Remember me ── */}
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative shrink-0">
                  <input type="checkbox" className="peer sr-only" aria-label="Keep me logged in" />
                  <div
                    className="
                      w-4 h-4 rounded-sm border border-[#E8E3DC] bg-[#FAFAF9]
                      peer-checked:bg-[#6C3CE1] peer-checked:border-[#6C3CE1]
                      peer-focus-visible:shadow-[0_0_0_3px_rgba(108,60,225,0.18)]
                      transition-[background-color,border-color] duration-150
                      flex items-center justify-center
                    "
                  >
                    <svg
                      className="hidden peer-checked:block w-2.5 h-2.5 text-white"
                      viewBox="0 0 10 8"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M1 4l2.5 2.5L9 1"
                        stroke="white"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <span
                  className="text-[0.82rem] text-[#8A8390] group-hover:text-[#1A1523] transition-colors duration-150 select-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Keep me logged in
                </span>
              </label>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={isPending}
                className="btn-submit w-full flex items-center justify-center gap-2 text-white text-[0.9rem] font-semibold py-3.5 rounded-xl mt-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                aria-label="Log in"
              >
                {isPending ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span className="relative z-10">Logging in…</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Log In</span>
                    <ArrowRight
                      size={15}
                      strokeWidth={2.2}
                      className="relative z-10"
                      aria-hidden="true"
                    />
                  </>
                )}
              </button>

              {/* ── Divider ── */}
              <div className="flex items-center gap-3" aria-hidden="true">
                <div className="divider-line" />
                <span
                  className="text-[0.72rem] text-[#B0AABA] font-medium whitespace-nowrap"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  or continue with
                </span>
                <div className="divider-line" />
              </div>

              {/* ── Social buttons ── */}
              <div className="grid grid-cols-2 gap-3">
                {/* Google */}
                <button
                  type="button"
                  className="social-btn flex items-center justify-center gap-2 h-11 rounded-xl"
                  aria-label="Continue with Google"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span
                    className="text-[0.82rem] font-medium text-[#1A1523]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Google
                  </span>
                </button>

                {/* Phone / OTP */}
                <button
                  type="button"
                  className="social-btn flex items-center justify-center gap-2 h-11 rounded-xl"
                  aria-label="Continue with phone number"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#1A1523"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  <span
                    className="text-[0.82rem] font-medium text-[#1A1523]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    Phone / OTP
                  </span>
                </button>
              </div>
            </div>
          </form>

          {/* ── Footer note ── */}
          <p
            className="text-center text-[0.72rem] text-[#B0AABA] mt-7 leading-relaxed"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            By logging in you agree to our{' '}
            <a
              href="/terms"
              className="text-[#8A8390] hover:text-[#6C3CE1] hover:underline transition-colors duration-150"
            >
              Terms
            </a>{' '}
            and{' '}
            <a
              href="/privacy"
              className="text-[#8A8390] hover:text-[#6C3CE1] hover:underline transition-colors duration-150"
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </>
  );
}
export default Login;
