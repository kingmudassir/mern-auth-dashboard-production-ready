import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { InputOTP } from '../Components/OTP/InputOTP';
import { useResendOTP } from '../Hooks/useResendOTP';
import { useVerifyOTP } from '../Hooks/useVerifyOTP';
import authService from '../Services/authService';

// ── Mask contact for display ─────────────────────────────────────
const maskContact = (value = '', type = 'email') => {
  if (type === 'email') {
    const [user, domain] = value.split('@');
    if (!domain) return value;
    return user.slice(0, 2) + '***@' + domain;
  }
  return value.slice(0, 4) + '***' + value.slice(-3);
};

// ResendButton.jsx
function ResendButton({ onResend, seconds = 60, resendPending, resetVerify }) {
  const [secs, setSecs] = useState(seconds);

  useEffect(() => {
    if (resendPending) return;
    if (!secs) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs, resendPending]);

  const handleResend = () => {
    setSecs(seconds);
    resetVerify?.();
    onResend?.();
  };

  const isDisabled = secs > 0 || resendPending;

  return (
    <button
      type="button"
      disabled={isDisabled}
      onClick={handleResend}
      className="flex items-center gap-1.5 text-[0.8rem] font-medium transition-colors duration-150 disabled:cursor-not-allowed"
      style={{
        fontFamily: "'DM Sans', sans-serif",
        background: 'none',
        border: 'none',
        padding: 0,
        color: isDisabled ? '#B0AABA' : '#6C3CE1',
        cursor: isDisabled ? '' : 'pointer',
      }}
    >
      {resendPending ? 'Sending…' : secs > 0 ? `Resend in ${secs}s` : 'Resend code'}
    </button>
  );
}

// ── Main component ───────────────────────────────────────────────
function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = useState('');
  const {
    mutateAsync: resendOTPMutate,
    isPending: resendPending,
    isError: isErrorResend,
    error: errorResend,
    isSuccess: isSuccessResend,
    reset: resetResend,
  } = useResendOTP(setSuccessMsg);

  const {
    mutateAsync: verifyOTPMutate,
    isPending: verifyPending,
    isError: isErrorVerify,
    error: errorVerify,
    isSuccess: isSuccessVerify,
    reset: resetVerify,
  } = useVerifyOTP();

  const contact = location.state?.contact;
  const type = location.state?.type ?? 'email';

  console.log('Contact:', contact);
  console.log('Type:', type);

  const [otp, setOtp] = useState('');
  const [otpErr, setOtpErr] = useState('');

  // ── Skeleton API call — replace with your mutation ──────────────
  const verifyOTP = async () => {
    setOtpErr('');

    try {
      await verifyOTPMutate({ email: contact, verificationCode: otp });

      // ✅ Navigate after success
      navigate('/userprofile', { replace: true });
    } catch (error) {
      setOtpErr(error.message || 'Failed to verify OTP');
    }
  };

  const resend = async () => {
    resendOTPMutate({ email: contact });
  };

  // ── Auto-submit when 6th digit is entered ───────────────────────
  useEffect(() => {
    if (otp.length === 6) verifyOTP({ email: contact, verificationCode: otp });
  }, [otp]);

  // ── If navigated here without state, bounce back ────────────────
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      try {
        const data = await authService.checkAuth();
        console.log('checkAuth response:', data); // <-- add this
        if (data.alreadyLoggedIn) {
          navigate('/');
        } else if (!contact) {
          navigate('/register', { replace: true });
          return null;
        }
      } catch (err) {
        console.log('checkAuth failed:', err); // <-- and this
      } finally {
        setChecking(false);
      }
    };

    checkIfAlreadyLoggedIn();
  }, [navigate]);

  if (checking) return null;
  // ── OTP entry screen ─────────────────────────────────────────────
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

            {/* Icon badge */}
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{
                background:
                  'linear-gradient(135deg, rgba(201,168,76,0.12) 0%, rgba(201,168,76,0.06) 100%)',
              }}
              aria-hidden="true"
            >
              {type === 'email' ? (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              ) : (
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#C9A84C"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
              )}
            </div>

            <h1
              className="text-[1.65rem] font-extrabold text-[#1A1523] leading-tight tracking-[-0.035em] mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Check your {type === 'email' ? 'inbox' : 'messages'}
            </h1>
            <p
              className="text-[0.875rem] text-[#8A8390] leading-relaxed max-w-72.5 mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-[#1A1523]">{maskContact(contact, type)}</span>. It
              expires in 10 minutes.
            </p>
          </div>

          {/* ── Success banner ── */}
          {isSuccessResend && (
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
                {successMsg || 'A new code has been sent!'}
              </p>
            </div>
          )}

          {/* ── Error banner ── */}
          {(isErrorResend || isErrorVerify) && (
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
                {errorResend?.message && <span>{errorResend.message}</span>}
                {errorVerify?.message && <span>{errorVerify.message}</span>}
              </p>
            </div>
          )}

          {/* ── OTP input ── */}
          <div className="mb-5">
            <InputOTP
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (otpErr) setOtpErr('');
                if (isSuccessResend || isErrorResend) resetResend();
                if (isErrorVerify) resetVerify();
              }}
              hasError={!!otpErr}
              disabled={resendPending || verifyPending}
            />
          </div>

          {/* ── Loading indicator under boxes ── */}
          {verifyPending && (
            <div className="flex items-center justify-center gap-2 mb-4" aria-live="polite">
              <span className="spinner-violet" aria-hidden="true" />
              <span
                className="text-[0.8rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Verifying…
              </span>
            </div>
          )}

          {/* ── Resend + back ── */}
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-[#8A8390] hover:text-[#1A1523] transition-colors duration-150"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
              }}
              onClick={() => navigate(-1)}
              aria-label="Go back and change contact"
            >
              <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" />
              Change {type === 'email' ? 'email' : 'number'}
            </button>{' '}
            <ResendButton
              onResend={resend}
              seconds={5}
              resendPending={resendPending}
              isErrorVerify={isErrorVerify}
              resetVerify={resetVerify}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default VerifyOTP;
