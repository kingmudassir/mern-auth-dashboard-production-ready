import { useState, useRef, useEffect } from 'react';
import {
  Pencil,
  User,
  Phone,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Trash2,
  ArrowRight,
  Camera,
  Shield,
  LogOut,
} from 'lucide-react';
import { useUser } from '../../Hooks/useUser';
import { useUpdateProfile } from '../../Hooks/useUpdateProfile';
import authService from '../../Services/authService';
import { replace, useNavigate } from 'react-router-dom';
import { validatePhone } from '../../utilities/PhoneValidator';
import { useEmailChange } from '../../Hooks/useEmailChange';
import { validateEmail } from '../../utilities/EmailValidator';
import { useChangePassword } from '../../Hooks/useChangePassword';
import { validatePasswordStrict } from '../../utilities/PasswordValidator';
import { useLogout } from '../../Hooks/useLogout';
import { useDeleteAccount } from '../../Hooks/useDeleteAccount';

// ── Helpers ──────────────────────────────────────────────────────
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^(\+92|0)[0-9]{10}$/.test(v);

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

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// ── Shared primitives ────────────────────────────────────────────
function FieldLabel({ children }) {
  return (
    <label
      className="text-[0.72rem] font-semibold text-[#8A8390] uppercase tracking-wider"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
    </label>
  );
}

function TextInput({ icon: Icon, error, disabled, ...props }) {
  return (
    <div
      className={`
        relative flex items-center border rounded-xl h-11
        transition-[border-color,box-shadow,background-color] duration-200
        ${
          disabled
            ? 'bg-[#F7F4F0] border-[#E8E3DC] opacity-60 cursor-not-allowed'
            : error
              ? 'bg-[#FAFAF9] border-[rgba(232,98,42,0.45)] focus-within:border-[#E8622A] focus-within:shadow-[0_0_0_3px_rgba(232,98,42,0.08)]'
              : 'bg-[#FAFAF9] border-[#E8E3DC] focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus-within:bg-white'
        }
      `}
    >
      {Icon && (
        <Icon
          size={14}
          strokeWidth={1.9}
          className="absolute left-3.5 text-[#C4BDD0] pointer-events-none"
          aria-hidden="true"
        />
      )}
      <input
        disabled={disabled}
        className={`
          flex-1 h-full bg-transparent outline-none border-none
          text-[0.875rem] text-[#1A1523] placeholder-[#C4BDD0]
          ${Icon ? 'pl-10' : 'pl-3.5'} pr-3.5
        `}
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        {...props}
      />
    </div>
  );
}

function PwInput({ error, show, onToggle, disabled, ...props }) {
  return (
    <div
      className={`
        relative flex items-center border rounded-xl h-11
        transition-[border-color,box-shadow,background-color] duration-200
        ${
          disabled
            ? 'bg-[#F7F4F0] border-[#E8E3DC] opacity-60'
            : error
              ? 'bg-[#FAFAF9] border-[rgba(232,98,42,0.45)] focus-within:border-[#E8622A] focus-within:shadow-[0_0_0_3px_rgba(232,98,42,0.08)]'
              : 'bg-[#FAFAF9] border-[#E8E3DC] focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus-within:bg-white'
        }
      `}
    >
      <Lock
        size={14}
        strokeWidth={1.9}
        className="absolute left-3.5 text-[#C4BDD0] pointer-events-none"
        aria-hidden="true"
      />
      <input
        type={show ? 'text' : 'password'}
        disabled={disabled}
        className="flex-1 h-full bg-transparent outline-none border-none text-[0.875rem] text-[#1A1523] placeholder-[#C4BDD0] pl-10 pr-11"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
        {...props}
      />
      <button
        type="button"
        onClick={onToggle}
        disabled={disabled}
        className="absolute right-3.5 text-[#C4BDD0] hover:text-[#8A8390] transition-colors duration-150 disabled:cursor-not-allowed"
        aria-label={show ? 'Hide' : 'Show'}
      >
        {show ? <EyeOff size={14} strokeWidth={1.9} /> : <Eye size={14} strokeWidth={1.9} />}
      </button>
    </div>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <span
      className="flex items-center gap-1 text-[0.73rem] text-[#E8622A]"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      role="alert"
    >
      <AlertCircle size={11} strokeWidth={2} aria-hidden="true" />
      {msg}
    </span>
  );
}

function SaveBtn({ loading, disabled, label = 'Save Changes' }) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className="save-btn inline-flex items-center gap-2 text-white text-[0.82rem] font-semibold px-5 py-2.5 rounded-xl"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {loading ? (
        <>
          <span className="spinner" aria-hidden="true" />
          <span className="relative z-10">Saving…</span>
        </>
      ) : (
        <span className="relative z-10">{label}</span>
      )}
    </button>
  );
}

function Toast({ msg, type = 'success' }) {
  if (!msg) return null;
  const ok = type === 'success';
  return (
    <div
      className={`flex items-center gap-2 text-[0.78rem] font-medium px-3 py-2 rounded-xl ${
        ok
          ? 'bg-[rgba(34,197,94,0.1)] text-green-600 border border-[rgba(34,197,94,0.2)]'
          : 'bg-[rgba(232,98,42,0.08)] text-[#C4531F] border border-[rgba(232,98,42,0.2)]'
      }`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
      role="status"
      aria-live="polite"
    >
      {ok ? (
        <CheckCircle2 size={13} strokeWidth={2} aria-hidden="true" />
      ) : (
        <AlertCircle size={13} strokeWidth={2} aria-hidden="true" />
      )}
      {msg}
    </div>
  );
}

function SectionCard({ children }) {
  return <div className="profile-card rounded-2xl p-6 flex flex-col gap-5">{children}</div>;
}

function SectionHeader({ title, subtitle }) {
  return (
    <div className="flex flex-col gap-0.5">
      <h2
        className="text-[1rem] font-bold text-[#1A1523] tracking-[-0.02em]"
        style={{ fontFamily: "'Syne', sans-serif" }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="text-[0.78rem] text-[#8A8390]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// AvatarPane
// ─────────────────────────────────────────────────────────────────
function AvatarPane({ user }) {
  const fileRef = useRef(null);
  const [preview, setPreview] = useState(user?.avatar ?? null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    // ← REPLACE with: uploadAvatarMutation.mutate(file)
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setToast('Profile photo updated');
    setTimeout(() => setToast(''), 3000);
  };

  const removeAvatar = async () => {
    setPreview(null);
    setLoading(true);
    // ← REPLACE with: removeAvatarMutation.mutate()
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setToast('Photo removed');
    setTimeout(() => setToast(''), 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate();
    const month = date.toLocaleString('en-GB', { month: 'long' });
    const year = date.getFullYear();

    const getOrdinal = (n) => {
      if (n > 3 && n < 21) return 'th';
      switch (n % 10) {
        case 1:
          return 'st';
        case 2:
          return 'nd';
        case 3:
          return 'rd';
        default:
          return 'th';
      }
    };

    return `${day}${getOrdinal(day)} ${month}, ${year}`;
  };

  return (
    <SectionCard>
      <SectionHeader title="Profile Photo" subtitle="Click the photo to upload a new one" />

      <div className="flex items-center gap-5">
        {/* Avatar circle */}
        <div className="relative shrink-0 group">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="avatar-trigger w-20 h-20 rounded-2xl overflow-hidden flex items-center justify-center"
            aria-label="Change profile photo"
            disabled={loading}
          >
            {preview ? (
              <img src={preview} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span
                className="text-[1.4rem] font-extrabold text-[#6C3CE1]"
                style={{ fontFamily: "'Syne', sans-serif" }}
                aria-hidden="true"
              >
                {initials(user?.name)}
              </span>
            )}
            {/* Hover overlay */}
            <div
              className="avatar-overlay absolute inset-0 rounded-2xl flex items-center justify-center"
              aria-hidden="true"
            >
              {loading ? (
                <span className="spinner-sm" />
              ) : (
                <Camera size={18} strokeWidth={2} className="text-white" />
              )}
            </div>
          </button>

          {/* Pencil badge */}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="pencil-badge absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full border-2 border-white flex items-center justify-center"
            aria-label="Edit profile photo"
            disabled={loading}
          >
            <Pencil size={11} strokeWidth={2.2} className="text-white" aria-hidden="true" />
          </button>
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFile}
          aria-label="Upload profile photo"
        />

        {/* Info + actions */}
        <div className="flex flex-col gap-2">
          <div>
            <p
              className="text-[0.9rem] font-semibold text-[#1A1523] leading-none mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {user?.name}
            </p>
            <p
              className="text-[0.75rem] text-[#8A8390]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {user?.role} · Joined {user?.createdAt && formatDate(user.createdAt)}
            </p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={loading}
              className="text-[0.75rem] font-medium text-[#6C3CE1] border border-[rgba(108,60,225,0.25)] bg-[rgba(108,60,225,0.05)] hover:bg-[rgba(108,60,225,0.1)] px-3 py-1.5 rounded-lg transition-colors duration-150 disabled:opacity-50"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Upload photo
            </button>
            {preview && (
              <button
                type="button"
                onClick={removeAvatar}
                disabled={loading}
                className="text-[0.75rem] font-medium text-[#8A8390] border border-[#E8E3DC] bg-transparent hover:border-[#C4B8B0] hover:text-[#1A1523] px-3 py-1.5 rounded-lg transition-colors duration-150 disabled:opacity-50"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Remove
              </button>
            )}
          </div>
          {toast && <Toast msg={toast} />}
        </div>
      </div>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// PersonalInfoCard
// ─────────────────────────────────────────────────────────────────
function PersonalInfoCard({ user }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(user?.phone ?? '');
  const [errors, setErrors] = useState({});

  const {
    mutate: updateProfile,
    isPending: isUpdatingProfile,
    isError: isUpdateProfileError,
    isSuccess: isUpdateProfileSuccessful,
    error: updateProfileError,
    reset: resetUpdateProfile,
  } = useUpdateProfile();

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Name is required';
    const phoneError = validatePhone(phone);
    if (phoneError) e.phone = phoneError;
    return e;
  };

  const handleSave = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    updateProfile({ name, phone });
  };

  return (
    <SectionCard>
      <SectionHeader title="Personal Information" subtitle="Update your name and phone number" />
      <form onSubmit={handleSave} noValidate aria-label="Personal info form">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Full Name</FieldLabel>
              <TextInput
                icon={User}
                type="text"
                placeholder={user?.name ?? 'Full Name'}
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((p) => ({ ...p, name: '' }));
                  resetUpdateProfile();
                }}
                error={errors.name}
                aria-label="Full name"
              />
              <FieldError msg={errors.name} />
            </div>

            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Phone Number</FieldLabel>
              <TextInput
                icon={Phone}
                type="tel"
                placeholder={user?.phone ?? '03001234567'}
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((p) => ({ ...p, phone: '' }));
                  resetUpdateProfile();
                }}
                error={errors.phone}
                aria-label="Phone number"
              />
              <FieldError msg={errors.phone} />
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <SaveBtn loading={isUpdatingProfile} />

            {isUpdateProfileSuccessful && (
              <Toast msg="Personal info updated successfully" type="success" />
            )}

            {isUpdateProfileError && (
              <Toast msg={updateProfileError?.message || 'Something went wrong.'} type="error" />
            )}
          </div>
        </div>
      </form>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// EmailCard
// ─────────────────────────────────────────────────────────────────
function EmailCard({ user }) {
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ msg: '', type: 'success' });

  const {
    mutateAsync: requestEmailChange,
    isPending,
    isError,
    error: emailChangeError,
    reset,
  } = useEmailChange();

  const handleSave = async (ev) => {
    ev.preventDefault();

    const emailError = validateEmail(newEmail);
    if (emailError) {
      setError(emailError);
      return;
    }

    setError('');

    try {
      await requestEmailChange({ newEmail });
      setToast({ msg: 'Verification link sent. Check your new inbox.', type: 'success' });
      setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
      setNewEmail('');
    } catch {
      // error handled via isError
    }
  };

  return (
    <SectionCard>
      <SectionHeader
        title="Email Address"
        subtitle="A verification link will be sent to the new address"
      />
      <form onSubmit={handleSave} noValidate aria-label="Email form">
        <div className="flex flex-col gap-4">
          {/* Current email — read only */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Current Email</FieldLabel>
            <TextInput
              icon={Mail}
              type="email"
              disabled
              value={user?.email ?? ''}
              aria-label="Current email address"
            />
          </div>

          {/* New email */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>New Email</FieldLabel>
            <TextInput
              icon={Mail}
              type="email"
              placeholder="you@example.com"
              value={newEmail}
              onChange={(e) => {
                setNewEmail(e.target.value);
                setError('');
                if (isError) reset();
              }}
              error={error || (isError ? emailChangeError?.message : '')}
              aria-label="New email address"
            />
            <FieldError msg={error || (isError ? emailChangeError?.message : '')} />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <SaveBtn loading={isPending} label="Update Email" />
            {toast.msg && <Toast msg={toast.msg} type={toast.type} />}
          </div>
        </div>
      </form>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// PasswordCard
// ─────────────────────────────────────────────────────────────────
function PasswordCard() {
  const [fields, setFields] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState({});

  const {
    mutate: changePassword,
    isPending,
    isError,
    isSuccess,
    error,
    reset,
  } = useChangePassword();

  const strength = pwStrength(fields.next);

  const set = (key) => (e) => {
    setFields((p) => ({ ...p, [key]: e.target.value }));
    setErrors((p) => ({ ...p, [key]: '' }));
    reset();
  };

  const toggle = (key) => setShow((p) => ({ ...p, [key]: !p[key] }));

  const validate = () => {
    const e = {};

    if (!fields.current) e.current = 'Current password is required';

    const passwordError = validatePasswordStrict(fields.next);
    if (passwordError) e.next = passwordError;

    if (!fields.confirm) {
      e.confirm = 'Please confirm your new password';
    } else if (fields.next !== fields.confirm) {
      e.confirm = 'Passwords do not match';
    }

    return e;
  };

  const handleSave = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    changePassword(
      {
        currentPassword: fields.current,
        newPassword: fields.next,
        confirmNewPassword: fields.confirm,
      },
      {
        onSuccess: () => {
          setFields({ current: '', next: '', confirm: '' });
        },
      }
    );
  };

  return (
    <SectionCard>
      <SectionHeader title="Password" subtitle="Use a strong password you haven't used before" />
      <form onSubmit={handleSave} noValidate aria-label="Change password form">
        <div className="flex flex-col gap-4">
          {/* Current */}
          <div className="flex flex-col gap-1.5">
            <FieldLabel>Current Password</FieldLabel>
            <PwInput
              placeholder="Your current password"
              value={fields.current}
              onChange={set('current')}
              show={show.current}
              onToggle={() => toggle('current')}
              error={errors.current}
              autoComplete="current-password"
              aria-label="Current password"
            />
            <FieldError msg={errors.current} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* New */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>New Password</FieldLabel>
              <PwInput
                placeholder="Min. 8 characters"
                value={fields.next}
                onChange={set('next')}
                show={show.next}
                onToggle={() => toggle('next')}
                error={errors.next}
                autoComplete="new-password"
                aria-label="New password"
              />
              <FieldError msg={errors.next} />
              {fields.next && (
                <div className="mt-0.5">
                  <div className="flex gap-1 mb-1" aria-hidden="true">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="flex-1 h-0.75 rounded-full transition-colors duration-200"
                        style={{ background: i <= strength ? STRENGTH_COLOR[strength] : '#E8E3DC' }}
                      />
                    ))}
                  </div>
                  <span
                    className="text-[0.7rem] font-medium"
                    style={{ color: STRENGTH_COLOR[strength], fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {STRENGTH_LABEL[strength]}
                  </span>
                </div>
              )}
            </div>

            {/* Confirm */}
            <div className="flex flex-col gap-1.5">
              <FieldLabel>Confirm New Password</FieldLabel>
              <PwInput
                placeholder="Re-enter new password"
                value={fields.confirm}
                onChange={set('confirm')}
                show={show.confirm}
                onToggle={() => toggle('confirm')}
                error={errors.confirm}
                autoComplete="new-password"
                aria-label="Confirm new password"
              />
              <FieldError msg={errors.confirm} />
              {fields.confirm && fields.next && (
                <span
                  className={`flex items-center gap-1 text-[0.72rem] font-medium ${fields.confirm === fields.next ? 'text-green-500' : 'text-[#E8622A]'}`}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  aria-live="polite"
                >
                  <CheckCircle2 size={10} strokeWidth={2.5} aria-hidden="true" />
                  {fields.confirm === fields.next ? 'Passwords match' : 'Passwords do not match'}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <SaveBtn loading={isPending} label="Change Password" />

            {isSuccess && <Toast msg="Password changed successfully" type="success" />}

            {isError && <Toast msg={error?.message || 'Something went wrong.'} type="error" />}
          </div>
        </div>
      </form>
    </SectionCard>
  );
}

// ─────────────────────────────────────────────────────────────────
// DangerZoneCard
// ─────────────────────────────────────────────────────────────────
function DangerZoneCard() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePw, setShowDeletePw] = useState(false);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  const navigate = useNavigate();

  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();
  const {
    mutateAsync: deleteAccount,
    isPending: isDeleting,
    isError,
    error,
    reset,
  } = useDeleteAccount();

  const handleDeleteAccount = async () => {
    if (!deletePassword) return;

    try {
      await deleteAccount({ currentPassword: deletePassword });
      setConfirmOpen(false);
      setDeletePassword('');
      setShowDeletePw(false);
      navigate('/', { replace: true });
    } catch {
      // error shown via isError/error
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // silent — clear local state regardless
    }
    setLogoutConfirmOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <div
      className="rounded-2xl p-6 flex flex-col gap-5"
      style={{ background: '#FFFAF9', border: '1.5px solid rgba(232,98,42,0.18)' }}
    >
      {/* Logout confirm modal */}
      {logoutConfirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(26,21,35,0.5)', backdropFilter: 'blur(4px)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm logout"
        >
          <div
            className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-[0_20px_60px_rgba(26,21,35,0.2)]"
            style={{ border: '1.5px solid #E8E3DC' }}
          >
            <div className="w-11 h-11 rounded-xl bg-[rgba(108,60,225,0.08)] flex items-center justify-center mb-4">
              <LogOut size={18} strokeWidth={2} className="text-[#6C3CE1]" aria-hidden="true" />
            </div>
            <h3
              className="text-[1.1rem] font-extrabold text-[#1A1523] mb-1.5 tracking-[-0.025em]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Log out?
            </h3>
            <p
              className="text-[0.8rem] text-[#8A8390] leading-relaxed mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              You'll be signed out of your account on this device.
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLogoutConfirmOpen(false)}
                className="flex-1 text-[0.82rem] font-medium text-[#8A8390] border border-[#E8E3DC] py-2.5 rounded-xl hover:border-[#C4B8B0] hover:text-[#1A1523] transition-colors duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: 'linear-gradient(135deg, #6C3CE1 0%, #5429C4 100%)',
                }}
              >
                {isLoggingOut ? 'Logging out…' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        <h2
          className="text-[1rem] font-bold text-[#1A1523] tracking-[-0.02em]"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          Danger Zone
        </h2>
        <p
          className="text-[0.78rem] text-[#8A8390]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Irreversible actions — proceed with caution
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* Log out */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E8E3DC]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#F2EEE9] flex items-center justify-center shrink-0">
              <LogOut size={14} strokeWidth={2} className="text-[#8A8390]" aria-hidden="true" />
            </div>
            <div>
              <p
                className="text-[0.82rem] font-semibold text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Log out
              </p>
              <p
                className="text-[0.72rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Sign out of your account on this device
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLogoutConfirmOpen(true)}
            className="text-[0.78rem] font-medium text-[#8A8390] border border-[#E8E3DC] px-3.5 py-2 rounded-lg hover:border-[#C4B8B0] hover:text-[#1A1523] transition-colors duration-150 whitespace-nowrap shrink-0"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Log out
          </button>
        </div>

        {/* Delete account */}
        <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[rgba(232,98,42,0.2)]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[rgba(232,98,42,0.08)] flex items-center justify-center shrink-0">
              <Trash2 size={14} strokeWidth={2} className="text-[#E8622A]" aria-hidden="true" />
            </div>
            <div>
              <p
                className="text-[0.82rem] font-semibold text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Delete account
              </p>
              <p
                className="text-[0.72rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Permanently remove your account and all listings
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setConfirmOpen(true)}
            className="text-[0.78rem] font-medium text-[#E8622A] border border-[rgba(232,98,42,0.3)] bg-[rgba(232,98,42,0.05)] px-3.5 py-2 rounded-lg hover:bg-[rgba(232,98,42,0.1)] transition-colors duration-150 whitespace-nowrap shrink-0"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Confirm delete modal */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(26,21,35,0.5)', backdropFilter: 'blur(4px)' }}
          role="dialog"
          aria-modal="true"
          aria-label="Confirm account deletion"
        >
          <div
            className="bg-white rounded-2xl p-7 w-full max-w-sm shadow-[0_20px_60px_rgba(26,21,35,0.2)]"
            style={{ border: '1.5px solid #E8E3DC' }}
          >
            <div className="w-11 h-11 rounded-xl bg-[rgba(232,98,42,0.1)] flex items-center justify-center mb-4">
              <Trash2 size={18} strokeWidth={2} className="text-[#E8622A]" aria-hidden="true" />
            </div>
            <h3
              className="text-[1.1rem] font-extrabold text-[#1A1523] mb-1.5 tracking-[-0.025em]"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Delete your account?
            </h3>
            <p
              className="text-[0.8rem] text-[#8A8390] leading-relaxed mb-5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              This will permanently delete your account, listings, and all data. Enter your current
              password to confirm.
            </p>

            {/* Password input */}
            <div
              className="relative flex items-center border border-[#E8E3DC] rounded-xl h-11 bg-[#FAFAF9] mb-4
                   focus-within:border-[rgba(232,98,42,0.4)] focus-within:shadow-[0_0_0_3px_rgba(232,98,42,0.08)]
                   transition-[border-color,box-shadow] duration-200"
            >
              <Lock
                size={14}
                strokeWidth={1.9}
                className="absolute left-3.5 text-[#C4BDD0] pointer-events-none"
                aria-hidden="true"
              />
              <input
                type={showDeletePw ? 'text' : 'password'}
                value={deletePassword}
                onChange={(e) => {
                  setDeletePassword(e.target.value);
                  if (isError) reset();
                }}
                placeholder="Current password"
                className="flex-1 h-full bg-transparent outline-none border-none text-[0.875rem] text-[#1A1523] placeholder-[#C4BDD0] pl-10 pr-11"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
                autoComplete="current-password"
                aria-label="Current password"
              />
              <button
                type="button"
                onClick={() => setShowDeletePw((p) => !p)}
                className="absolute right-3.5 text-[#C4BDD0] hover:text-[#8A8390] transition-colors duration-150"
                aria-label={showDeletePw ? 'Hide password' : 'Show password'}
              >
                {showDeletePw ? (
                  <EyeOff size={14} strokeWidth={1.9} aria-hidden="true" />
                ) : (
                  <Eye size={14} strokeWidth={1.9} aria-hidden="true" />
                )}
              </button>
            </div>

            {isError && (
              <p
                className="text-[0.78rem] text-[#E8622A] font-medium mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {error?.message || 'Something went wrong. Please try again.'}
              </p>
            )}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmOpen(false);
                  setDeletePassword('');
                  setShowDeletePw(false);
                  reset();
                }}
                className="flex-1 text-[0.82rem] font-medium text-[#8A8390] border border-[#E8E3DC] py-2.5 rounded-xl hover:border-[#C4B8B0] hover:text-[#1A1523] transition-colors duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteAccount}
                disabled={!deletePassword || isDeleting}
                className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
                }}
              >
                {isDeleting ? 'Deleting…' : 'Delete Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="profile-page-bg min-h-screen pt-16.5">
      <div className="max-w-215 mx-auto px-4 sm:px-6 py-10 md:py-14">
        {/* Page heading */}
        <div className="mb-8 flex flex-col gap-2">
          <div className="w-32 h-3 rounded bg-gray-200 animate-pulse" />
          <div className="w-44 h-8 rounded-md bg-gray-200 animate-pulse" />
          <div className="w-80 h-4 rounded bg-gray-200 animate-pulse" />
        </div>

        <div className="flex flex-col gap-4">
          {/* AvatarPane */}
          <div className="profile-card rounded-2xl p-6 flex flex-col gap-5">
            {/* Section header */}
            <div className="flex flex-col gap-1.5">
              <div className="w-28 h-4 rounded bg-gray-200 animate-pulse" />
              <div className="w-48 h-3 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center gap-5">
              {/* Avatar circle */}
              <div className="w-20 h-20 rounded-2xl bg-gray-200 animate-pulse shrink-0" />
              {/* Info + buttons */}
              <div className="flex flex-col gap-2 flex-1">
                <div className="w-36 h-4 rounded bg-gray-200 animate-pulse" />
                <div className="w-48 h-3 rounded bg-gray-200 animate-pulse" />
                <div className="flex gap-2">
                  <div className="w-24 h-7 rounded-lg bg-gray-200 animate-pulse" />
                </div>
              </div>
            </div>
          </div>

          {/* PersonalInfoCard */}
          <div className="profile-card rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="w-40 h-4 rounded bg-gray-200 animate-pulse" />
              <div className="w-56 h-3 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="w-16 h-3 rounded bg-gray-200 animate-pulse" />
                <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="w-24 h-3 rounded bg-gray-200 animate-pulse" />
                <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div className="w-28 h-9 rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* EmailCard */}
          <div className="profile-card rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="w-28 h-4 rounded bg-gray-200 animate-pulse" />
              <div className="w-64 h-3 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="w-10 h-3 rounded bg-gray-200 animate-pulse" />
                <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="w-16 h-3 rounded bg-gray-200 animate-pulse" />
                <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div className="w-28 h-9 rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* PasswordCard */}
          <div className="profile-card rounded-2xl p-6 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <div className="w-20 h-4 rounded bg-gray-200 animate-pulse" />
              <div className="w-60 h-3 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex flex-col gap-1.5">
              <div className="w-32 h-3 rounded bg-gray-200 animate-pulse" />
              <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <div className="w-24 h-3 rounded bg-gray-200 animate-pulse" />
                <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
                {/* Strength bars */}
                <div className="flex gap-1 mt-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-0.75 flex-1 rounded-full bg-gray-200 animate-pulse" />
                  ))}
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="w-36 h-3 rounded bg-gray-200 animate-pulse" />
                <div className="w-full h-11 rounded-xl bg-gray-200 animate-pulse" />
              </div>
            </div>
            <div className="w-36 h-9 rounded-xl bg-gray-200 animate-pulse" />
          </div>

          {/* DangerZoneCard */}
          <div
            className="rounded-2xl p-6 flex flex-col gap-5"
            style={{ background: '#FFFAF9', border: '1.5px solid rgba(232,98,42,0.18)' }}
          >
            <div className="flex flex-col gap-1.5">
              <div className="w-24 h-4 rounded bg-gray-200 animate-pulse" />
              <div className="w-56 h-3 rounded bg-gray-200 animate-pulse" />
            </div>
            <div className="flex flex-col gap-3">
              {/* Logout row */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[#E8E3DC]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="w-12 h-3.5 rounded bg-gray-200 animate-pulse" />
                    <div className="w-44 h-3 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="w-16 h-8 rounded-lg bg-gray-200 animate-pulse shrink-0" />
              </div>
              {/* Delete row */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white border border-[rgba(232,98,42,0.2)]">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-200 animate-pulse shrink-0" />
                  <div className="flex flex-col gap-1.5">
                    <div className="w-24 h-3.5 rounded bg-gray-200 animate-pulse" />
                    <div className="w-52 h-3 rounded bg-gray-200 animate-pulse" />
                  </div>
                </div>
                <div className="w-16 h-8 rounded-lg bg-gray-200 animate-pulse shrink-0" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Profile (page root)
// ─────────────────────────────────────────────────────────────────
export default function Profile() {
  const navigate = useNavigate();

  const {
    data: authenticatedUser,
    isPending: isFetchingUser,
    isError: isUserFetchError,
    isSuccess: isUserFetchSuccessful,
    error: userFetchError,
    reset: resetUserState,
  } = useUser();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      try {
        const data = await authService.checkAuth();
        if (!data.alreadyLoggedIn) {
          navigate('/');
        }
      } catch (err) {
      } finally {
        setChecking(false);
      }
    };

    checkIfAlreadyLoggedIn();
  }, []);

  if (checking) return <ProfileSkeleton />; // Prevent rendering profile form while checking

  return (
    <>
      <style>{STYLES}</style>

      <div className="profile-page-bg min-h-screen pt-16.5">
        <div className="max-w-215 mx-auto px-4 sm:px-6 py-10 md:py-14">
          {/* Page heading */}
          <div className="mb-8">
            <div className="flex items-center gap-2.5 mb-1">
              <Shield size={16} strokeWidth={1.9} className="text-[#6C3CE1]" aria-hidden="true" />
              <span
                className="text-[0.72rem] font-semibold text-[#6C3CE1] uppercase tracking-wider"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Account Settings
              </span>
            </div>
            <h1
              className="text-[1.9rem] font-extrabold text-[#1A1523] tracking-[-0.04em] leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Your Profile
            </h1>
            <p
              className="text-[0.875rem] text-[#8A8390] mt-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Manage your personal details, login credentials, and account preferences.
            </p>
          </div>

          {/* Cards stack */}
          <div className="flex flex-col gap-4">
            <AvatarPane user={authenticatedUser} />
            <PersonalInfoCard user={authenticatedUser} />
            <EmailCard user={authenticatedUser} />
            <PasswordCard />
            <DangerZoneCard />
          </div>
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────
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

  .profile-page-bg {
    background-color: #F7F4F0;
    background-image:
      radial-gradient(ellipse 55% 40% at 5% 20%, rgba(108,60,225,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 45% 35% at 95% 80%, rgba(232,98,42,0.04) 0%, transparent 65%);
  }

  .profile-card {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 2px 12px rgba(26,21,35,0.04), 0 1px 3px rgba(26,21,35,0.03);
    transition: box-shadow 0.2s ease;
  }

  .profile-card:hover {
    box-shadow: 0 4px 20px rgba(26,21,35,0.07), 0 1px 4px rgba(26,21,35,0.04);
  }

  /* Avatar */
  .avatar-trigger {
    background: linear-gradient(135deg, rgba(108,60,225,0.08) 0%, rgba(108,60,225,0.04) 100%);
    border: 2px solid rgba(108,60,225,0.15);
    position: relative;
    cursor: pointer;
    transition: border-color 0.2s ease;
  }

  .avatar-trigger:hover { border-color: rgba(108,60,225,0.4); }

  .avatar-overlay {
    background: rgba(26,21,35,0);
    transition: background-color 0.2s ease;
  }

  .avatar-trigger:hover .avatar-overlay {
    background: rgba(26,21,35,0.45);
  }

  .pencil-badge {
    background: linear-gradient(135deg, #6C3CE1 0%, #5A2FCA 100%);
    box-shadow: 0 2px 6px rgba(108,60,225,0.35);
    cursor: pointer;
    transition: transform 0.18s ease;
  }

  .pencil-badge:hover { transform: scale(1.1); }

  /* Save button */
  .save-btn {
    background: linear-gradient(135deg, #E8622A 0%, #C4531F 100%);
    box-shadow: 0 2px 8px rgba(232,98,42,0.25);
    position: relative; overflow: hidden;
    transition: transform 0.18s ease, box-shadow 0.18s ease;
  }

  .save-btn::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #D4521C 0%, #AA3E12 100%);
    opacity: 0;
    transition: opacity 0.18s ease;
    border-radius: inherit;
  }

  .save-btn:not(:disabled):hover::before { opacity: 1; }
  .save-btn:not(:disabled):hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 16px rgba(232,98,42,0.35);
  }
  .save-btn:not(:disabled):active { transform: translateY(0); }
  .save-btn:disabled { opacity: 0.55; cursor: not-allowed; }

  /* Spinners */
  @keyframes spin { to { transform: rotate(360deg); } }

  .spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  .spinner-sm {
    display: inline-block;
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
`;
