import { useEffect, useState } from 'react';
import { Mail, Phone, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForgetPassword } from '../Hooks/useForgetPassword';
import { validateEmail } from '../utilities/EmailValidator';
import { useNavigate } from 'react-router-dom';
import authService from '../Services/authService';

// ── Validators ───────────────────────────────────────────────────
const isPhone = (v) => /^(\+92|0)[0-9]{10}$/.test(v);

function ForgotPasswordSkeleton() {
  return (
    <div className="fp-bg relative min-h-screen flex items-center justify-center px-4 py-20">
      <div className="fp-card relative z-10 w-full max-w-105 rounded-3xl p-8 md:p-10">
        {/* Header */}
        <div className="text-center mb-7 flex flex-col items-center gap-3">
          {/* Logo */}
          <div className="w-28 h-5 rounded-md bg-gray-200 animate-pulse mb-2" />
          {/* Icon badge */}
          <div className="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse mb-2" />
          {/* Title */}
          <div className="w-44 h-7 rounded-md bg-gray-200 animate-pulse" />
          {/* Subtitle */}
          <div className="w-64 h-4 rounded bg-gray-200 animate-pulse" />
          <div className="w-52 h-4 rounded bg-gray-200 animate-pulse" />
        </div>

        {/* Mode toggle */}
        <div className="flex gap-1 bg-[#F2EEE9] p-1 rounded-xl mb-5">
          <div className="flex-1 h-9 rounded-lg bg-gray-200 animate-pulse" />
          <div className="flex-1 h-9 rounded-lg bg-gray-200 animate-pulse" />
        </div>

        <div className="flex flex-col gap-4">
          {/* Input field */}
          <div className="flex flex-col gap-1.5">
            <div className="w-24 h-3 rounded bg-gray-200 animate-pulse" />
            <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* Submit button */}
          <div className="w-full h-12 rounded-xl bg-gray-200 animate-pulse" />
        </div>

        {/* Back to login */}
        <div className="flex justify-center mt-6">
          <div className="w-24 h-4 rounded bg-gray-200 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function ForgotPassword() {
  const {
    mutateAsync: requestPasswordReset,
    isPending: isRequestingPasswordReset,
    isError: isPasswordResetRequestError,
    error: passwordResetRequestError,
    isSuccess: isPasswordResetRequestSuccessful,
    reset: resetPasswordResetState,
  } = useForgetPassword();

  const [passwordMessage, setPasswordMessage] = useState('');

  const [mode, setMode] = useState('email');
  const [contact, setContact] = useState('');
  const [contactErr, setContactErr] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setContactErr('');

    if (!contact.trim()) {
      setContactErr(mode === 'email' ? 'Email address is required' : 'Phone number is required');
      return;
    }
    if (mode === 'email') {
      const error = validateEmail(contact);
      if (error) {
        setContactErr(error);
        return;
      }
    }
    if (mode === 'phone' && !isPhone(contact)) {
      setContactErr('Enter a valid Pakistani number (e.g. 03001234567)');
      return;
    }

    try {
      const data = await requestPasswordReset({ email: contact });
      setPasswordMessage(data.message);
    } catch {
      // error already handled via isPasswordResetRequestError
    }
  };

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      try {
        const data = await authService.checkAuth();
        console.log('checkAuth response:', data); // <-- add this
        if (data.alreadyLoggedIn) {
          navigate('/');
        }
      } catch (err) {
        console.log('checkAuth failed:', err); // <-- and this
      } finally {
        setChecking(false);
      }
    };

    checkIfAlreadyLoggedIn();
  }, [navigate]);

  if (checking) return <ForgotPasswordSkeleton />; // Prevent rendering login form while checking

  return (
    <>
      <div className="fp-bg relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="fp-card fp-fade relative z-10 w-full max-w-105 rounded-3xl p-8 md:p-10">
          {/* ── Header ── */}
          <div className="text-center mb-7">
            <a
              href="/"
              className="inline-flex items-center gap-2 mb-5"
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

            {/* Lock icon badge */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background:
                  'linear-gradient(135deg, rgba(108,60,225,0.1) 0%, rgba(108,60,225,0.05) 100%)',
              }}
              aria-hidden="true"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6C3CE1"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>

            <h1
              className="text-[1.65rem] font-extrabold text-[#1A1523] leading-tight tracking-[-0.035em] mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Forgot password?
            </h1>
            <p
              className="text-[0.875rem] text-[#8A8390] leading-relaxed max-w-72.5 mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Enter your email or phone number and we'll send you a verification code.
            </p>
          </div>

          {/* ── Success banner ── */}
          {isPasswordResetRequestSuccessful && (
            <div
              className="flex items-start gap-2.5 bg-[rgba(34,197,94,0.07)] border border-[rgba(34,197,94,0.25)] rounded-xl px-4 py-3 mb-5"
              role="alert"
              aria-live="assertive"
            >
              <CheckCircle2
                size={15}
                strokeWidth={2}
                className="text-[#16a34a] shrink-0 mt-px"
                aria-hidden="true"
              />
              <p
                className="text-[0.8rem] text-[#16a34a] font-medium leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {passwordMessage || 'A new code has been sent!'}
              </p>
            </div>
          )}

          {/* ── Error banner ── */}
          {isPasswordResetRequestError && (
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
                {passwordResetRequestError?.message}
              </p>
            </div>
          )}

          {/* ── Mode toggle ── */}
          <div
            className="flex gap-1 bg-[#F2EEE9] p-1 rounded-xl mb-5"
            role="tablist"
            aria-label="Choose contact method"
          >
            {[
              { id: 'email', label: 'Email', Icon: Mail },
              { id: 'phone', label: 'Phone', Icon: Phone },
            ].map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={mode === id}
                onClick={() => {
                  setMode(id);
                  setContact('');
                  setContactErr('');
                }}
                className={`mode-pill ${mode === id ? 'active' : 'inactive'}`}
              >
                <Icon size={13} strokeWidth={2} aria-hidden="true" />
                {label}
              </button>
            ))}
          </div>

          {/* ── Form ── */}
          <form onSubmit={handleSubmit} noValidate aria-label="Forgot password form">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label
                  htmlFor="fp-contact"
                  className="text-[0.72rem] font-semibold text-[#8A8390] uppercase tracking-wider"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {mode === 'email' ? 'Email Address' : 'Phone Number'}
                </label>

                <div className={`fp-input-wrap ${contactErr ? 'has-error' : ''}`}>
                  {mode === 'email' ? (
                    <Mail
                      size={15}
                      strokeWidth={1.9}
                      className="absolute left-3.5 text-[#B0AABA] pointer-events-none"
                      aria-hidden="true"
                    />
                  ) : (
                    <Phone
                      size={15}
                      strokeWidth={1.9}
                      className="absolute left-3.5 text-[#B0AABA] pointer-events-none"
                      aria-hidden="true"
                    />
                  )}
                  <input
                    id="fp-contact"
                    type={mode === 'email' ? 'email' : 'tel'}
                    value={contact}
                    onChange={(e) => {
                      setContact(e.target.value);
                      if (isPasswordResetRequestError || isPasswordResetRequestSuccessful) {
                        resetPasswordResetState();
                      }
                      setContactErr('');
                    }}
                    placeholder={mode === 'email' ? 'you@example.com' : '03001234567'}
                    className="fp-input"
                    autoComplete={mode === 'email' ? 'email' : 'tel'}
                    aria-label={mode === 'email' ? 'Email address' : 'Phone number'}
                    aria-invalid={!!contactErr}
                    aria-describedby={contactErr ? 'fp-contact-err' : undefined}
                  />
                </div>

                {contactErr && (
                  <span
                    id="fp-contact-err"
                    className="flex items-center gap-1 text-[0.75rem] text-[#E8622A]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                    role="alert"
                  >
                    <AlertCircle size={11} strokeWidth={2} aria-hidden="true" />
                    {contactErr}
                  </span>
                )}
              </div>

              <button
                type="submit"
                disabled={isRequestingPasswordReset}
                className="btn-primary w-full flex items-center justify-center gap-2 text-white text-[0.9rem] font-semibold py-3.5 rounded-xl"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                aria-label="Send verification code"
              >
                {isRequestingPasswordReset ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span className="relative z-10">Sending code…</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Send Verification Link</span>
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

          {/* ── Back to login ── */}
          <div className="flex justify-center mt-6">
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-[#8A8390] hover:text-[#1A1523] transition-colors duration-150 no-underline"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" />
              Back to login
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
