import { useState } from 'react';
import { Mail, Phone, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ── Validators ───────────────────────────────────────────────────
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^(\+92|0)[0-9]{10}$/.test(v);

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [mode, setMode] = useState('email');
  const [contact, setContact] = useState('');
  const [contactErr, setContactErr] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setContactErr('');

    if (!contact.trim()) {
      setContactErr(mode === 'email' ? 'Email address is required' : 'Phone number is required');
      return;
    }
    if (mode === 'email' && !isEmail(contact)) {
      setContactErr('Enter a valid email address');
      return;
    }
    if (mode === 'phone' && !isPhone(contact)) {
      setContactErr('Enter a valid Pakistani number (e.g. 03001234567)');
      return;
    }

    setLoading(true);
    // Swap for: await axios.post('/api/auth/forgot-password', { contact, type: mode })
    await new Promise((r) => setTimeout(r, 1300));
    setLoading(false);

    // Pass contact + mode to the OTP page via router state
    navigate('/verifyotp', { state: { contact, type: mode } });
  };

  return (
    <>
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
              className="text-[0.875rem] text-[#8A8390] leading-relaxed max-w-[290px] mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Enter your email or phone number and we'll send you a verification code.
            </p>
          </div>

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
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-white text-[0.9rem] font-semibold py-3.5 rounded-xl"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                aria-label="Send verification code"
              >
                {loading ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span className="relative z-10">Sending code…</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Send Verification Code</span>
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
