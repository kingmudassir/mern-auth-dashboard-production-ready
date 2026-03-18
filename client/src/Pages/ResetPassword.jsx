import { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Lock, Eye, EyeOff, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useResetPassword } from '../Hooks/useResetPassword';
import { validatePasswordStrict } from '../utilities/PasswordValidator';

// ── Password strength ────────────────────────────────────────────
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

// ── Validator ────────────────────────────────────────────────────
const validate = ({ password, confirm }) => {
  const errs = {};
  const pwError = validatePasswordStrict(password);
  if (pwError) errs.password = pwError;
  if (!confirm) errs.confirm = 'Please confirm your password';
  else if (confirm !== password) errs.confirm = 'Passwords do not match';

  return errs;
};

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

// ── Password input ───────────────────────────────────────────────
function PasswordInput({ error, show, onToggle, ...props }) {
  return (
    <div
      className={`
        relative flex items-center
        border rounded-xl h-11 bg-[#FAFAF9]
        transition-[border-color,box-shadow,background-color] duration-200
        ${
          error
            ? 'border-[rgba(232,98,42,0.5)] focus-within:border-[#E8622A] focus-within:shadow-[0_0_0_3px_rgba(232,98,42,0.1)]'
            : 'border-[#E8E3DC] focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus-within:bg-white'
        }
      `}
    >
      <Lock
        size={15}
        strokeWidth={1.9}
        className="absolute left-3.5 text-[#B0AABA] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type={show ? 'text' : 'password'}
        className="flex-1 h-full bg-transparent outline-none border-none text-[0.875rem] text-[#1A1523] placeholder-[#C4BDD0] pl-10 pr-11"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        {...props}
      />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3.5 text-[#B0AABA] hover:text-[#8A8390] transition-colors duration-150"
        aria-label={show ? 'Hide password' : 'Show password'}
      >
        {show ? (
          <EyeOff size={15} strokeWidth={1.9} aria-hidden="true" />
        ) : (
          <Eye size={15} strokeWidth={1.9} aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────
function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [fields, setFields] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [errors, setErrors] = useState({});
  const [globalErr, setGlobalErr] = useState('');

  const {
    mutateAsync: requestPasswordReset,
    isPending: isRequestingPasswordReset,
    isError: isPasswordResetRequestError,
    error: passwordResetRequestError,
    isSuccess: isPasswordResetRequestSuccessful,
    reset: resetPasswordResetState,
  } = useResetPassword();

  const [passwordMessage, setPasswordMessage] = useState('');

  const set = (key) => (e) => {
    setFields((p) => ({ ...p, [key]: e.target.value }));
    if (errors[key]) setErrors((p) => ({ ...p, [key]: '' }));
    if (globalErr) setGlobalErr('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(fields);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    try {
      const data = await requestPasswordReset({
        token,
        password: fields.password,
        confirmPassword: fields.confirm,
      });
      setPasswordMessage(data.message);
    } catch {
      // error already handled via isPasswordResetRequestError
    }
  };

  const strength = pwStrength(fields.password);

  // ── Success screen ───────────────────────────────────────────────
  if (isPasswordResetRequestSuccessful) {
    return (
      <>
        <style>{STYLES}</style>
        <div className="rp-bg relative min-h-screen flex items-center justify-center px-4 py-20">
          <div className="rp-card success-pop relative z-10 w-full max-w-[420px] rounded-3xl p-10 text-center">
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
              Password updated!
            </h2>
            <p
              className="text-[#8A8390] text-[0.9rem] leading-relaxed mb-7 max-w-[270px] mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {/* Your password has been reset successfully. Log in with your new credentials. */}
              {passwordMessage}
            </p>
            <button
              onClick={() => navigate('/login', { replace: true })}
              className="inline-flex items-center justify-center gap-2 w-full text-white text-[0.875rem] font-semibold py-3.5 rounded-xl transition-transform duration-200 hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
                boxShadow: '0 2px 12px rgba(232,98,42,0.3)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <span>Go to Login</span>
              <ArrowRight size={15} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </>
    );
  }

  // ── Form ─────────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      <div className="rp-bg relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="rp-card rp-fade relative z-10 w-full max-w-[420px] rounded-3xl p-8 md:p-10">
          {/* ── Header ── */}
          <div className="text-center mb-8">
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
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <h1
              className="text-[1.65rem] font-extrabold text-[#1A1523] leading-tight tracking-[-0.035em] mb-2"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Set new password
            </h1>
            <p
              className="text-[0.875rem] text-[#8A8390] leading-relaxed max-w-[290px] mx-auto"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Choose a strong password you haven't used before.
            </p>
          </div>

          {/* ── Global error ── */}
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

          <form onSubmit={handleSubmit} noValidate aria-label="Reset password form">
            <div className="flex flex-col gap-5">
              {/* ── New password ── */}
              <Field label="New Password" error={errors.password}>
                <PasswordInput
                  placeholder="Min. 8 characters"
                  value={fields.password}
                  onChange={(e) => {
                    set('password')(e);

                    if (isPasswordResetRequestError) {
                      resetPasswordResetState();
                    }
                  }}
                  show={showPw}
                  onToggle={() => setShowPw((p) => !p)}
                  error={errors.password}
                  autoComplete="new-password"
                  aria-label="New password"
                  aria-invalid={!!errors.password}
                />
                {/* Strength meter */}
                {fields.password && (
                  <div className="mt-1">
                    <div className="flex gap-1 mb-1" aria-hidden="true">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="flex-1 h-[3px] rounded-full transition-colors duration-250"
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
              <Field label="Confirm New Password" error={errors.confirm}>
                <PasswordInput
                  placeholder="Re-enter your password"
                  value={fields.confirm}
                  onChange={set('confirm')}
                  show={showCf}
                  onToggle={() => setShowCf((p) => !p)}
                  error={errors.confirm}
                  autoComplete="new-password"
                  aria-label="Confirm new password"
                  aria-invalid={!!errors.confirm}
                />
                {/* Match indicator */}
                {fields.confirm && fields.password && (
                  <span
                    className={`flex items-center gap-1 text-[0.72rem] font-medium ${
                      fields.confirm === fields.password ? 'text-green-500' : 'text-[#E8622A]'
                    }`}
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

              {/* ── Requirements checklist ── */}
              <ul className="flex flex-col gap-1.5" aria-label="Password requirements">
                {[
                  { label: 'At least 8 characters', met: fields.password.length >= 8 },
                  { label: 'One uppercase letter', met: /[A-Z]/.test(fields.password) },
                  { label: 'One number', met: /[0-9]/.test(fields.password) },
                  { label: 'One special character', met: /[^A-Za-z0-9]/.test(fields.password) },
                ].map(({ label, met }) => (
                  <li
                    key={label}
                    className="flex items-center gap-2"
                    aria-label={`${label}: ${met ? 'met' : 'not met'}`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${
                        met ? 'bg-[rgba(34,197,94,0.15)]' : 'bg-[#F2EEE9]'
                      }`}
                      aria-hidden="true"
                    >
                      {met ? (
                        <CheckCircle2 size={10} strokeWidth={2.5} className="text-green-500" />
                      ) : (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D4CFC9]" />
                      )}
                    </span>
                    <span
                      className={`text-[0.75rem] transition-colors duration-200 ${met ? 'text-[#1A1523]' : 'text-[#B0AABA]'}`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* ── Submit ── */}
              <button
                type="submit"
                disabled={isRequestingPasswordReset}
                className="btn-primary w-full flex items-center justify-center gap-2 text-white text-[0.9rem] font-semibold py-3.5 rounded-xl mt-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                aria-label="Reset password"
              >
                {isRequestingPasswordReset ? (
                  <>
                    <span className="spinner" aria-hidden="true" />
                    <span className="relative z-10">Updating password…</span>
                  </>
                ) : (
                  <>
                    <span className="relative z-10">Reset Password</span>
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
    </>
  );
}

// ── Styles ───────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .rp-bg {
    background-color: #F7F4F0;
    background-image:
      radial-gradient(ellipse 60% 50% at 15% 30%, rgba(108,60,225,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 50% 40% at 85% 70%, rgba(232,98,42,0.06) 0%, transparent 65%),
      radial-gradient(ellipse 35% 30% at 55% 95%, rgba(201,168,76,0.05) 0%, transparent 60%);
  }

  .rp-bg::before {
    content: '';
    position: fixed; inset: 0;
    background-image:
      linear-gradient(rgba(26,21,35,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(26,21,35,0.025) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  .rp-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 8px 40px rgba(26,21,35,0.07), 0 2px 8px rgba(26,21,35,0.04);
  }

  .btn-primary {
    background: linear-gradient(135deg, #E8622A 0%, #C4531F 100%);
    box-shadow: 0 2px 10px rgba(232,98,42,0.3);
    position: relative;
    overflow: hidden;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .btn-primary::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #D4521C 0%, #AA3E12 100%);
    opacity: 0;
    transition: opacity 0.18s ease;
    border-radius: inherit;
  }

  .btn-primary:not(:disabled):hover::before { opacity: 1; }
  .btn-primary:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 20px rgba(232,98,42,0.38);
  }
  .btn-primary:not(:disabled):active { transform: translateY(0); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

  @keyframes rp-fade {
    from { opacity: 0; transform: translateY(14px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .rp-fade { animation: rp-fade 0.45s cubic-bezier(0.4,0,0.2,1) both; }

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

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
`;
export default ResetPassword;
