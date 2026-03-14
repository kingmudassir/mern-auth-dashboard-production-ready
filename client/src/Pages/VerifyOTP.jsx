import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, CheckCircle2, RotateCcw, ArrowRight } from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// 💡 TANSTACK MUTATION INTEGRATION POINTS
//
//  1. Verify OTP:
//     const verifyOtpMutation = useMutation({
//       mutationFn: ({ contact, otp }) =>
//         axios.post('/api/auth/verify-otp', { contact, otp }),
//       onSuccess: () => navigate('/reset-password'),
//       onError: (err) => {
//         setOtpErr(err.response?.data?.message || 'Incorrect code. Please try again.');
//         setOtp('');
//       },
//     });
//     Then replace the simulate() call in handleAutoSubmit with:
//     verifyOtpMutation.mutate({ contact, otp })
//
//  2. Resend OTP:
//     const resendOtpMutation = useMutation({
//       mutationFn: ({ contact, type }) =>
//         axios.post('/api/auth/forgot-password', { contact, type }),
//       onSuccess: () => countdown.start(),
//       onError: (err) => setGlobalErr(err.response?.data?.message || 'Failed to resend.'),
//     });
//     Then replace the simulate() call in handleResend with:
//     resendOtpMutation.mutate({ contact, type })
//
//  3. Loading state:
//     Replace `loading` state with:
//     const loading = verifyOtpMutation.isPending || resendOtpMutation.isPending;
// ─────────────────────────────────────────────────────────────────

// ── Mask contact for display ─────────────────────────────────────
const maskContact = (value = '', type = 'email') => {
  if (type === 'email') {
    const [user, domain] = value.split('@');
    if (!domain) return value;
    return user.slice(0, 2) + '***@' + domain;
  }
  return value.slice(0, 4) + '***' + value.slice(-3);
};

// ── Countdown hook ───────────────────────────────────────────────
function useCountdown(seconds) {
  const [secs, setSecs] = useState(seconds);

  useEffect(() => {
    if (!secs) return;
    const t = setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secs]);

  return { secs, start: () => setSecs(seconds) };
}

// ── OTP box input ────────────────────────────────────────────────
function OtpInput({ value, onChange, hasError, disabled }) {
  const refs = useRef([]);
  const digits = value.split('');

  const handleKey = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const next = [...digits];
      if (next[i]) {
        next[i] = '';
        onChange(next.join(''));
      } else if (i > 0) {
        next[i - 1] = '';
        onChange(next.join(''));
        refs.current[i - 1]?.focus();
      }
      return;
    }
    if (e.key === 'ArrowLeft' && i > 0) {
      refs.current[i - 1]?.focus();
      return;
    }
    if (e.key === 'ArrowRight' && i < 5) {
      refs.current[i + 1]?.focus();
      return;
    }
    if (!/^[0-9]$/.test(e.key)) return;
    e.preventDefault();
    const next = [...digits];
    next[i] = e.key;
    onChange(next.join(''));
    if (i < 5) refs.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    onChange(pasted.padEnd(6, '').slice(0, 6));
    refs.current[Math.min(pasted.length, 5)]?.focus();
  };

  // Auto-focus first box on mount
  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  return (
    <div
      className="flex gap-2.5 justify-center"
      role="group"
      aria-label="6-digit verification code"
    >
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (refs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i] || ''}
          onKeyDown={(e) => handleKey(i, e)}
          onPaste={handlePaste}
          onChange={() => {}}
          disabled={disabled}
          className={`
            w-11 text-center text-[1.15rem] font-bold
            border rounded-xl outline-none
            transition-[border-color,box-shadow,background-color,opacity] duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${
              hasError
                ? 'border-[rgba(232,98,42,0.5)] bg-[rgba(232,98,42,0.04)] text-[#E8622A] focus:border-[#E8622A] focus:shadow-[0_0_0_3px_rgba(232,98,42,0.1)]'
                : digits[i]
                  ? 'border-[#6C3CE1] bg-[rgba(108,60,225,0.05)] text-[#1A1523] shadow-[0_0_0_2px_rgba(108,60,225,0.1)]'
                  : 'border-[#E8E3DC] bg-[#FAFAF9] text-[#1A1523] focus:border-[rgba(108,60,225,0.45)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus:bg-white'
            }
          `}
          style={{
            fontFamily: "'Syne', sans-serif",
            height: '52px',
            caretColor: 'transparent',
          }}
          aria-label={`Digit ${i + 1}`}
          aria-invalid={hasError}
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
        />
      ))}
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
function VerifyOTP() {
  const location = useLocation();
  const navigate = useNavigate();

  // Passed from ForgotPassword via navigate('/verify-otp', { state: { contact, type } })
  const contact = location.state?.contact ?? '';
  const type = location.state?.type ?? 'email';

  const [otp, setOtp] = useState('');
  const [otpErr, setOtpErr] = useState('');
  const [globalErr, setGlobalErr] = useState('');
  const [loading, setLoading] = useState(false); // replace with mutation.isPending
  const [success, setSuccess] = useState(false);

  const countdown = useCountdown(60);

  // ── Skeleton API call — replace with your mutation ──────────────
  const simulateVerify = async (code) => {
    setLoading(true);
    setOtpErr('');
    setGlobalErr('');

    // ← REPLACE THIS BLOCK with: verifyOtpMutation.mutate({ contact, otp: code })
    await new Promise((r) => setTimeout(r, 1300));
    const isWrong = Math.random() < 0.25; // simulate wrong OTP 25% of the time
    setLoading(false);

    if (isWrong) {
      setOtpErr('Incorrect code. Please try again.');
      setOtp('');
      return;
    }
    setSuccess(true);
    // ← on real success your mutation's onSuccess should navigate('/reset-password')
    // ─────────────────────────────────────────────────────────────
  };

  const simulateResend = async () => {
    setLoading(true);
    setOtpErr('');
    setGlobalErr('');

    // ← REPLACE THIS BLOCK with: resendOtpMutation.mutate({ contact, type })
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    countdown.start();
    // ─────────────────────────────────────────────────────────────
  };

  // ── Auto-submit when 6th digit is entered ───────────────────────
  useEffect(() => {
    if (otp.length === 6) simulateVerify(otp);
  }, [otp]);

  // ── If navigated here without state, bounce back ────────────────
  useEffect(() => {
    if (!contact) navigate('/forgotpassword', { replace: true });
  }, []);

  // ── Success screen ───────────────────────────────────────────────
  if (success) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="fp-bg relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="fp-card success-pop relative z-10 w-full max-w-[420px] rounded-3xl p-10 text-center">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(108,60,225,0.1)' }}
            >
              <CheckCircle2 size={30} strokeWidth={1.8} className="text-[#6C3CE1]" />
            </div>
            <h2
              className="text-[1.6rem] font-extrabold text-[#1A1523] mb-2 leading-tight tracking-[-0.03em]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Identity verified!
            </h2>
            <p
              className="text-[#8A8390] text-[0.9rem] leading-relaxed mb-7 max-w-[270px] mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Your code was accepted. You can now set a new password.
            </p>
            <a
              href="/reset-password"
              className="inline-flex items-center justify-center gap-2 w-full text-white text-[0.875rem] font-semibold py-3.5 rounded-xl transition-transform duration-200 hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
                boxShadow: '0 2px 12px rgba(232,98,42,0.3)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span>Set New Password</span>
              <ArrowRight size={15} strokeWidth={2.2} />
            </a>
            <a
              href="/login"
              className="block text-center text-[0.8rem] text-[#8A8390] hover:text-[#1A1523] mt-4 transition-colors duration-150"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Back to login
            </a>
          </div>
        </div>
      </>
    );
  }

  // ── OTP entry screen ─────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      <div className="fp-bg relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="fp-card fp-fade relative z-10 w-full max-w-[420px] rounded-3xl p-8 md:p-10">
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
              className="text-[0.875rem] text-[#8A8390] leading-relaxed max-w-[290px] mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              We sent a 6-digit code to{' '}
              <span className="font-semibold text-[#1A1523]">{maskContact(contact, type)}</span>. It
              expires in 10 minutes.
            </p>
          </div>

          {/* ── Error banner ── */}
          {(otpErr || globalErr) && (
            <div
              className="shake flex items-start gap-2.5 bg-[rgba(232,98,42,0.07)] border border-[rgba(232,98,42,0.25)] rounded-xl px-4 py-3 mb-5"
              role="alert"
              aria-live="assertive"
            >
              <AlertCircle
                size={15}
                strokeWidth={2}
                className="text-[#E8622A] flex-shrink-0 mt-[1px]"
                aria-hidden="true"
              />
              <p
                className="text-[0.8rem] text-[#C4531F] font-medium leading-snug"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {otpErr || globalErr}
              </p>
            </div>
          )}

          {/* ── OTP input ── */}
          <div className="mb-5">
            <OtpInput
              value={otp}
              onChange={(val) => {
                setOtp(val);
                if (otpErr) setOtpErr('');
              }}
              hasError={!!otpErr}
              disabled={loading}
            />
          </div>

          {/* ── Loading indicator under boxes ── */}
          {loading && (
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
              onClick={() => navigate('/forgotpassword')}
              aria-label="Go back and change contact"
            >
              <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" />
              Change {type === 'email' ? 'email' : 'number'}
            </button>

            <button
              type="button"
              disabled={countdown.secs > 0 || loading}
              onClick={simulateResend}
              className="flex items-center gap-1.5 text-[0.8rem] font-medium transition-colors duration-150 disabled:cursor-not-allowed"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                background: 'none',
                border: 'none',
                padding: 0,
                cursor: countdown.secs > 0 || loading ? 'not-allowed' : 'pointer',
                color: countdown.secs > 0 ? '#B0AABA' : '#6C3CE1',
              }}
              aria-label={countdown.secs > 0 ? `Resend in ${countdown.secs}s` : 'Resend code'}
              aria-live="polite"
            >
              {countdown.secs > 0 ? (
                <span className="countdown-pulse">Resend in {countdown.secs}s</span>
              ) : (
                <>
                  <RotateCcw size={12} strokeWidth={2.2} aria-hidden="true" />
                  Resend code
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  :root {
    --paiyya-ink:     #1A1523;
    --paiyya-border:  #E8E3DC;
    --paiyya-muted:   #8A8390;
    --paiyya-violet:  #6C3CE1;
    --paiyya-ember:   #E8622A;
    --paiyya-ember-d: #C4531F;
    --paiyya-gold:    #C9A84C;
  }

  .fp-bg {
    background-color: #F7F4F0;
    background-image:
      radial-gradient(ellipse 60% 50% at 15% 30%, rgba(108,60,225,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 85% 70%, rgba(232,98,42,0.06) 0%, transparent 65%),
      radial-gradient(ellipse 35% 30% at 55% 95%, rgba(201,168,76,0.05) 0%, transparent 60%);
  }

  .fp-bg::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(26,21,35,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,21,35,0.025) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .fp-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 8px 40px rgba(26,21,35,0.07), 0 2px 8px rgba(26,21,35,0.04);
  }

  @keyframes fpFade {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fp-fade { animation: fpFade 0.45s cubic-bezier(0.4,0,0.2,1) both; }

  @keyframes successPop {
    0%   { opacity: 0; transform: scale(0.85) translateY(16px); }
    100% { opacity: 1; transform: scale(1) translateY(0); }
  }
  .success-pop { animation: successPop 0.45s cubic-bezier(0.34,1.56,0.64,1) both; }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  .shake { animation: shake 0.38s cubic-bezier(0.36,0.07,0.19,0.97) both; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.5; }
  }
  .countdown-pulse { animation: pulse 1s ease-in-out infinite; }

  @keyframes spin { to { transform: rotate(360deg); } }

  /* Violet spinner (used under OTP boxes, not inside a button) */
  .spinner-violet {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(108,60,225,0.2);
    border-top-color: #6C3CE1;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
`;

export default VerifyOTP;
