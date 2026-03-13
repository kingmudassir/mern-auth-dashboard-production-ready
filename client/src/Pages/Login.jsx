import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

// ── Validation ───────────────────────────────────────────────────
const validate = (f) => {
  const e = {};
  if (!f.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Enter a valid email address';
  if (!f.password) e.password = 'Password is required';
  return e;
};

// ── Field wrapper ────────────────────────────────────────────────
function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[0.7rem] font-semibold text-[#8A8390] uppercase tracking-wider"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          className="flex items-center gap-1 text-[0.74rem] text-[#E8622A]"
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
        relative flex items-center h-11 rounded-xl border bg-[#FAFAF9]
        transition-[border-color,box-shadow,background-color] duration-200
        ${
          error
            ? 'border-[rgba(232,98,42,0.45)] focus-within:border-[#E8622A] focus-within:shadow-[0_0_0_3px_rgba(232,98,42,0.09)]'
            : 'border-[#E8E3DC] focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus-within:bg-white'
        }
      `}
    >
      {Icon && (
        <Icon
          size={15}
          strokeWidth={1.9}
          className="absolute left-3.5 text-[#C4BDD0] pointer-events-none"
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
function Login({ onSuccess }) {
  const [fields, setFields] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => {
    setFields((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
    if (errors.submit) setErrors((p) => ({ ...p, submit: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      // Replace with your actual API call:
      // await axios.post('/api/auth/login', fields);
      await new Promise((r) => setTimeout(r, 1200));
      onSuccess?.();
    } catch (err) {
      setErrors({
        submit: err?.response?.data?.message || 'Invalid email or password.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        .lf-submit {
          background: linear-gradient(135deg, #E8622A 0%, #C4531F 100%);
          box-shadow: 0 2px 10px rgba(232,98,42,0.28);
          position: relative;
          overflow: hidden;
          transition: transform 0.18s ease, box-shadow 0.18s ease;
        }
        .lf-submit::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #D4521C 0%, #AA3E12 100%);
          opacity: 0;
          transition: opacity 0.18s ease;
          border-radius: inherit;
        }
        .lf-submit:not(:disabled):hover::before { opacity: 1; }
        .lf-submit:not(:disabled):hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(232,98,42,0.38);
        }
        .lf-submit:not(:disabled):active { transform: translateY(0); }
        .lf-submit:disabled { opacity: 0.6; cursor: not-allowed; }

        @keyframes lf-spin { to { transform: rotate(360deg); } }
        .lf-spinner {
          width: 17px; height: 17px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: lf-spin 0.7s linear infinite;
          flex-shrink: 0;
        }

        .lf-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #C4BDD0;
          font-size: 0.75rem;
          font-family: 'DM Sans', sans-serif;
        }
        .lf-divider::before,
        .lf-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: #E8E3DC;
        }
      `}</style>

      <form
        onSubmit={handleSubmit}
        noValidate
        aria-label="Login form"
        className="flex flex-col gap-5 w-full"
      >
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
        <Field
          label={
            <span className="flex items-center justify-between w-full">
              <span>Password</span>
              <a
                href="/forgot-password"
                className="text-[#6C3CE1] font-medium normal-case tracking-normal hover:underline text-[0.74rem]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                tabIndex={0}
              >
                Forgot password?
              </a>
            </span>
          }
          error={errors.password}
        >
          <Input
            icon={Lock}
            type={showPw ? 'text' : 'password'}
            placeholder="Enter your password"
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
                className="absolute right-3.5 text-[#C4BDD0] hover:text-[#8A8390] transition-colors duration-150"
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
        </Field>

        {/* ── Server / credentials error ── */}
        {errors.submit && (
          <div
            className="flex items-center gap-2 text-[0.8rem] text-[#E8622A] bg-[rgba(232,98,42,0.07)] border border-[rgba(232,98,42,0.2)] rounded-xl px-4 py-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
            role="alert"
            aria-live="assertive"
          >
            <AlertCircle size={14} strokeWidth={2} className="flex-shrink-0" aria-hidden="true" />
            {errors.submit}
          </div>
        )}

        {/* ── Submit ── */}
        <button
          type="submit"
          disabled={loading}
          className="lf-submit w-full flex items-center justify-center gap-2 text-white text-[0.9rem] font-semibold py-3.5 rounded-xl mt-1"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          aria-label={loading ? 'Logging in…' : 'Log in'}
        >
          {loading ? (
            <>
              <span className="lf-spinner" aria-hidden="true" />
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
        <div className="lf-divider">or</div>

        {/* ── Register CTA ── */}
        <p
          className="text-center text-[0.82rem] text-[#8A8390]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Don't have an account?{' '}
          <a href="/register" className="text-[#6C3CE1] font-semibold hover:underline">
            Create one free
          </a>
        </p>
      </form>
    </>
  );
}
export default Login;
