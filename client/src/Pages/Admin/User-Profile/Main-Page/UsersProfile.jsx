import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Car,
  Shield,
  ShieldOff,
  ShieldCheck,
  AlertTriangle,
  Send,
  Trash2,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Clock,
  Flag,
  MoreHorizontal,
  ExternalLink,
  RefreshCw,
  Lock,
  Pencil,
  X,
  Check,
} from 'lucide-react';

// ─────────────────────────────────────────────────────────────────
// 💡 TANSTACK INTEGRATION POINTS
//
//  const { data: user, isLoading } = useQuery({
//    queryKey: ['admin-user', userId],
//    queryFn: () => axios.get(`/api/admin/users/${userId}`).then(r => r.data),
//  });
//
//  Each action has a clearly marked ← REPLACE block.
//  Swap simulate() calls with your useMutation hooks.
// ─────────────────────────────────────────────────────────────────

// ── Mock user — replace with useQuery ───────────────────────────
const MOCK_USER = {
  id: '64f3a1b2c9e1d2f3a4b5c6d7',
  name: 'Muhammad Ali Khan',
  email: 'ali.khan@example.com',
  phone: '03001234567',
  city: 'Lahore',
  role: 'Seller',
  status: 'active',
  emailVerified: true,
  phoneVerified: false,
  joinedAt: '12 January 2024',
  lastLogin: '2 hours ago',
  listings: 4,
  flaggedCount: 1,
  reportCount: 2,
  avatar: null,
  notes: '',
};

const MOCK_LISTINGS = [
  {
    id: 1,
    title: 'Toyota Corolla 2021',
    price: '28 Lac',
    status: 'active',
    city: 'Lahore',
    createdAt: '3 days ago',
  },
  {
    id: 2,
    title: 'Honda City 2019',
    price: '18 Lac',
    status: 'flagged',
    city: 'Lahore',
    createdAt: '1 week ago',
  },
  {
    id: 3,
    title: 'Suzuki Alto 2023',
    price: '16 Lac',
    status: 'pending',
    city: 'Karachi',
    createdAt: '1 day ago',
  },
  {
    id: 4,
    title: 'Kia Picanto 2020',
    price: '20 Lac',
    status: 'active',
    city: 'Lahore',
    createdAt: '2 weeks ago',
  },
];

const MOCK_ACTIVITY = [
  { id: 1, event: 'Listing created', detail: 'Toyota Corolla 2021', time: '3 days ago' },
  { id: 2, event: 'Account logged in', detail: 'Lahore, PK', time: '2 hours ago' },
  { id: 3, event: 'Listing flagged', detail: 'Honda City 2019', time: '5 days ago' },
  { id: 4, event: 'Profile updated', detail: 'Email changed', time: '1 week ago' },
  { id: 5, event: 'Account registered', detail: 'via email signup', time: '12 Jan 2024' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Active', color: '#16a34a', bg: 'rgba(34,197,94,0.1)' },
  { value: 'banned', label: 'Banned', color: '#C4531F', bg: 'rgba(232,98,42,0.1)' },
  { value: 'pending', label: 'Pending', color: '#92700a', bg: 'rgba(201,168,76,0.15)' },
];

// ── Helpers ───────────────────────────────────────────────────────
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isPhone = (v) => /^(\+92|0)[0-9]{10}$/.test(v);
const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// ── Shared primitives ─────────────────────────────────────────────
function SectionCard({ children, danger = false }) {
  return (
    <div
      className="rounded-2xl p-6"
      style={{
        background: danger ? '#FFFAF9' : '#FFFFFF',
        border: `1.5px solid ${danger ? 'rgba(232,98,42,0.2)' : '#E8E3DC'}`,
        boxShadow: '0 1px 4px rgba(26,21,35,0.04)',
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-5">
      <h2
        className="text-[0.95rem] font-bold tracking-[-0.02em]"
        style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
      >
        {children}
      </h2>
      {sub && (
        <p
          className="text-[0.75rem] mt-0.5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {sub}
        </p>
      )}
    </div>
  );
}

function FieldLabel({ children }) {
  return (
    <p
      className="text-[0.68rem] font-semibold uppercase tracking-wider mb-1"
      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
    >
      {children}
    </p>
  );
}

function StatusBadge({ status }) {
  const s = STATUS_OPTIONS.find((o) => o.value === status) ?? STATUS_OPTIONS[0];
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[0.7rem] font-semibold"
      style={{ background: s.bg, color: s.color, fontFamily: "'DM Sans', sans-serif" }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ background: s.color }}
        aria-hidden="true"
      />
      {s.label}
    </span>
  );
}

function ListingBadge({ status }) {
  const map = {
    active: { bg: 'rgba(34,197,94,0.1)', color: '#16a34a', label: 'Active' },
    pending: { bg: 'rgba(201,168,76,0.15)', color: '#92700a', label: 'Pending' },
    flagged: { bg: 'rgba(239,68,68,0.1)', color: '#dc2626', label: 'Flagged' },
  };
  const s = map[status] ?? map.active;
  return (
    <span
      className="inline-flex px-2 py-0.5 rounded-full text-[0.68rem] font-semibold"
      style={{ background: s.bg, color: s.color, fontFamily: "'DM Sans', sans-serif" }}
    >
      {s.label}
    </span>
  );
}

function Toast({ msg, type = 'success', onDismiss }) {
  if (!msg) return null;
  const ok = type === 'success';
  return (
    <div
      className="flex items-center gap-2 px-4 py-3 rounded-xl text-[0.8rem] font-medium"
      style={{
        background: ok ? 'rgba(34,197,94,0.1)' : 'rgba(232,98,42,0.08)',
        border: `1px solid ${ok ? 'rgba(34,197,94,0.25)' : 'rgba(232,98,42,0.2)'}`,
        color: ok ? '#16a34a' : '#C4531F',
        fontFamily: "'DM Sans', sans-serif",
      }}
      role="status"
      aria-live="polite"
    >
      {ok ? <CheckCircle2 size={14} strokeWidth={2} /> : <AlertCircle size={14} strokeWidth={2} />}
      <span className="flex-1">{msg}</span>
      <button type="button" onClick={onDismiss} aria-label="Dismiss">
        <X size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

// ── Inline editable field ─────────────────────────────────────────
function EditableField({ label, value, onSave, validate, type = 'text', icon: Icon }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (validate) {
      const err = validate(draft);
      if (err) {
        setError(err);
        return;
      }
    }
    setSaving(true);
    await onSave(draft);
    setSaving(false);
    setEditing(false);
    setError('');
  };

  const handleCancel = () => {
    setDraft(value);
    setError('');
    setEditing(false);
  };

  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {editing ? (
        <div className="flex flex-col gap-1.5">
          <div
            className="flex items-center border rounded-xl h-10 bg-[#FAFAF9] transition-[border-color,box-shadow] duration-200 focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus-within:bg-white"
            style={{ borderColor: error ? 'rgba(232,98,42,0.5)' : '#E8E3DC' }}
          >
            {Icon && (
              <Icon
                size={13}
                strokeWidth={1.9}
                className="absolute"
                style={{ color: '#C4BDD0', marginLeft: '12px', pointerEvents: 'none' }}
                aria-hidden="true"
              />
            )}
            <input
              type={type}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setError('');
              }}
              className="flex-1 h-full bg-transparent outline-none border-none text-[0.85rem] text-[#1A1523]"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                paddingLeft: Icon ? '36px' : '12px',
                paddingRight: '8px',
              }}
              autoFocus
              aria-label={label}
            />
            <div className="flex items-center gap-1 pr-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-50 transition-colors duration-150 disabled:opacity-50"
                aria-label="Save"
              >
                {saving ? (
                  <span className="spinner-xs" aria-hidden="true" />
                ) : (
                  <Check size={12} strokeWidth={2.5} />
                )}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-6 h-6 rounded-lg flex items-center justify-center hover:bg-[#F2EEE9] transition-colors duration-150"
                style={{ color: '#8A8390' }}
                aria-label="Cancel"
              >
                <X size={12} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          {error && (
            <span
              className="flex items-center gap-1 text-[0.72rem]"
              style={{ color: '#E8622A', fontFamily: "'DM Sans', sans-serif" }}
            >
              <AlertCircle size={10} strokeWidth={2} />
              {error}
            </span>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2 group">
          <span
            className="text-[0.875rem] font-medium"
            style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
          >
            {value || <span style={{ color: '#C4BDD0' }}>Not set</span>}
          </span>
          <button
            type="button"
            onClick={() => {
              setDraft(value);
              setEditing(true);
            }}
            className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center transition-[opacity,background-color] duration-150 hover:bg-[#F2EEE9]"
            style={{ color: '#8A8390' }}
            aria-label={`Edit ${label}`}
          >
            <Pencil size={11} strokeWidth={2} />
          </button>
        </div>
      )}
    </div>
  );
}

// ── Action button ─────────────────────────────────────────────────
function ActionBtn({ label, icon: Icon, onClick, loading, variant = 'default', disabled }) {
  const styles = {
    default: { color: '#1A1523', border: '#E8E3DC', bg: '#FFFFFF', hover: '#F7F4F0' },
    violet: {
      color: '#6C3CE1',
      border: 'rgba(108,60,225,0.28)',
      bg: 'rgba(108,60,225,0.05)',
      hover: 'rgba(108,60,225,0.1)',
    },
    danger: {
      color: '#C4531F',
      border: 'rgba(232,98,42,0.28)',
      bg: 'rgba(232,98,42,0.05)',
      hover: 'rgba(232,98,42,0.1)',
    },
    red: {
      color: '#dc2626',
      border: 'rgba(239,68,68,0.28)',
      bg: 'rgba(239,68,68,0.05)',
      hover: 'rgba(239,68,68,0.1)',
    },
  };
  const s = styles[variant];

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={loading || disabled}
      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-[0.8rem] font-medium transition-[background-color,border-color] duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        color: s.color,
        border: `1.5px solid ${s.border}`,
        background: s.bg,
        fontFamily: "'DM Sans', sans-serif",
      }}
      onMouseEnter={(e) => {
        if (!loading && !disabled) e.currentTarget.style.background = s.hover;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = s.bg;
      }}
      aria-label={label}
    >
      {loading ? (
        <span className="spinner-xs" aria-hidden="true" />
      ) : (
        <Icon size={13} strokeWidth={2} aria-hidden="true" />
      )}
      {label}
    </button>
  );
}

// ── Confirm modal ─────────────────────────────────────────────────
function ConfirmModal({ open, title, message, confirmLabel, onConfirm, onCancel, danger = false }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white rounded-2xl p-7 w-full max-w-sm"
        style={{ border: '1.5px solid #E8E3DC', boxShadow: '0 20px 60px rgba(26,21,35,0.2)' }}
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
          style={{ background: danger ? 'rgba(232,98,42,0.1)' : 'rgba(108,60,225,0.1)' }}
        >
          {danger ? (
            <AlertTriangle size={18} strokeWidth={2} style={{ color: '#E8622A' }} />
          ) : (
            <Shield size={18} strokeWidth={2} style={{ color: '#6C3CE1' }} />
          )}
        </div>
        <h3
          className="text-[1rem] font-extrabold mb-1.5 tracking-[-0.025em]"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          {title}
        </h3>
        <p
          className="text-[0.8rem] leading-relaxed mb-5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {message}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 text-[0.82rem] font-medium py-2.5 rounded-xl border transition-colors duration-150"
            style={{
              color: '#8A8390',
              borderColor: '#E8E3DC',
              background: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl transition-opacity duration-150"
            style={{
              background: danger
                ? 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)'
                : 'linear-gradient(135deg, #6C3CE1 0%, #5A2FCA 100%)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function UsersProfile() {
  const { userId } = useParams();
  const navigate = useNavigate();

  // ← REPLACE with: const { data: user, isLoading } = useQuery(...)
  const [user, setUser] = useState({ ...MOCK_USER });

  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [modal, setModal] = useState(null); // { type, ... }
  const [loading, setLoading] = useState({}); // { [action]: bool }
  const [notes, setNotes] = useState(user.notes ?? '');
  const [notesSaving, setNotesSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' | 'activity'
  const [pwVisible, setPwVisible] = useState(false);
  const [newPw, setNewPw] = useState('');
  const [pwErr, setPwErr] = useState('');

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  // ── Actions ───────────────────────────────────────────────────
  const handleSaveName = async (name) => {
    // ← REPLACE with: updateUserMutation.mutate({ userId, name })
    await new Promise((r) => setTimeout(r, 800));
    setUser((p) => ({ ...p, name }));
    showToast('Name updated successfully');
  };

  const handleSaveEmail = async (email) => {
    // ← REPLACE with: updateUserMutation.mutate({ userId, email })
    await new Promise((r) => setTimeout(r, 800));
    setUser((p) => ({ ...p, email, emailVerified: false }));
    showToast('Email updated. Verification status reset.');
  };

  const handleSavePhone = async (phone) => {
    // ← REPLACE with: updateUserMutation.mutate({ userId, phone })
    await new Promise((r) => setTimeout(r, 800));
    setUser((p) => ({ ...p, phone }));
    showToast('Phone number updated');
  };

  const handleSaveCity = async (city) => {
    // ← REPLACE with: updateUserMutation.mutate({ userId, city })
    await new Promise((r) => setTimeout(r, 800));
    setUser((p) => ({ ...p, city }));
    showToast('City updated');
  };

  const handleStatusChange = async (status) => {
    setLoad('status', true);
    // ← REPLACE with: changeStatusMutation.mutate({ userId, status })
    await new Promise((r) => setTimeout(r, 900));
    setLoad('status', false);
    setUser((p) => ({ ...p, status }));
    showToast(`User status changed to ${status}`);
    setModal(null);
  };

  const handleRoleChange = async (role) => {
    setLoad('role', true);
    // ← REPLACE with: changeRoleMutation.mutate({ userId, role })
    await new Promise((r) => setTimeout(r, 900));
    setLoad('role', false);
    setUser((p) => ({ ...p, role }));
    showToast(`Role changed to ${role}`);
    setModal(null);
  };

  const handleResendVerification = async (type) => {
    setLoad(`resend-${type}`, true);
    // ← REPLACE with: resendVerificationMutation.mutate({ userId, type })
    await new Promise((r) => setTimeout(r, 900));
    setLoad(`resend-${type}`, false);
    showToast(`Verification ${type === 'email' ? 'email' : 'SMS'} sent`);
  };

  const handleVerifyManually = async (type) => {
    setLoad(`verify-${type}`, true);
    // ← REPLACE with: verifyManuallyMutation.mutate({ userId, type })
    await new Promise((r) => setTimeout(r, 700));
    setLoad(`verify-${type}`, false);
    setUser((p) => ({ ...p, [`${type}Verified`]: true }));
    showToast(`${type === 'email' ? 'Email' : 'Phone'} marked as verified`);
    setModal(null);
  };

  const handleResetPassword = async () => {
    if (newPw.length < 8) {
      setPwErr('Minimum 8 characters');
      return;
    }
    setLoad('resetpw', true);
    // ← REPLACE with: resetPasswordMutation.mutate({ userId, password: newPw })
    await new Promise((r) => setTimeout(r, 1000));
    setLoad('resetpw', false);
    setNewPw('');
    setPwErr('');
    showToast("User's password has been reset");
    setModal(null);
  };

  const handleSendPasswordReset = async () => {
    setLoad('sendpwreset', true);
    // ← REPLACE with: sendPasswordResetMutation.mutate({ userId })
    await new Promise((r) => setTimeout(r, 800));
    setLoad('sendpwreset', false);
    showToast('Password reset link sent to user');
  };

  const handleSaveNotes = async () => {
    setNotesSaving(true);
    // ← REPLACE with: saveNotesMutation.mutate({ userId, notes })
    await new Promise((r) => setTimeout(r, 700));
    setNotesSaving(false);
    showToast('Notes saved');
  };

  const handleDeleteAccount = async () => {
    setLoad('delete', true);
    // ← REPLACE with: deleteUserMutation.mutate({ userId })
    await new Promise((r) => setTimeout(r, 1200));
    setLoad('delete', false);
    setModal(null);
    navigate('/admin/users');
  };

  const handleDeleteListings = async () => {
    setLoad('deletelistings', true);
    // ← REPLACE with: deleteAllListingsMutation.mutate({ userId })
    await new Promise((r) => setTimeout(r, 1000));
    setLoad('deletelistings', false);
    setUser((p) => ({ ...p, listings: 0 }));
    showToast("All user's listings removed");
    setModal(null);
  };

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      {/* Confirm modals */}
      <ConfirmModal
        open={modal?.type === 'ban'}
        title="Ban this user?"
        message="The user will lose access to their account and all listings will be hidden. You can unban them at any time."
        confirmLabel="Ban User"
        onConfirm={() => handleStatusChange('banned')}
        onCancel={() => setModal(null)}
        danger
      />
      <ConfirmModal
        open={modal?.type === 'activate'}
        title="Activate this user?"
        message="The user's account will be restored to active status and their listings will become visible again."
        confirmLabel="Activate"
        onConfirm={() => handleStatusChange('active')}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.type === 'verify-email'}
        title="Manually verify email?"
        message="This will mark the user's email as verified without them clicking a link. Use only if you've confirmed ownership."
        confirmLabel="Verify Email"
        onConfirm={() => handleVerifyManually('email')}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.type === 'verify-phone'}
        title="Manually verify phone?"
        message="This will mark the user's phone as verified. Use only if you've confirmed the number belongs to them."
        confirmLabel="Verify Phone"
        onConfirm={() => handleVerifyManually('phone')}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.type === 'delete-listings'}
        title="Delete all listings?"
        message="This will permanently remove all listings by this user. This cannot be undone."
        confirmLabel="Delete All Listings"
        onConfirm={handleDeleteListings}
        onCancel={() => setModal(null)}
        danger
      />
      <ConfirmModal
        open={modal?.type === 'delete-account'}
        title="Delete this account?"
        message="This will permanently delete the user's account, all listings, and all associated data. This cannot be undone."
        confirmLabel="Delete Account"
        onConfirm={handleDeleteAccount}
        onCancel={() => setModal(null)}
        danger
      />

      {/* Reset password modal */}
      {modal?.type === 'reset-pw' && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(26,21,35,0.55)', backdropFilter: 'blur(4px)' }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl p-7 w-full max-w-sm"
            style={{ border: '1.5px solid #E8E3DC', boxShadow: '0 20px 60px rgba(26,21,35,0.2)' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
              style={{ background: 'rgba(108,60,225,0.1)' }}
            >
              <KeyRound size={18} strokeWidth={2} style={{ color: '#6C3CE1' }} />
            </div>
            <h3
              className="text-[1rem] font-extrabold mb-1.5 tracking-[-0.025em]"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Set new password
            </h3>
            <p
              className="text-[0.8rem] mb-4 leading-relaxed"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Set a temporary password for this user. Advise them to change it on next login.
            </p>
            <div
              className="relative flex items-center border rounded-xl h-11 bg-[#FAFAF9] mb-1.5 transition-[border-color,box-shadow] duration-200 focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)]"
              style={{ borderColor: pwErr ? 'rgba(232,98,42,0.5)' : '#E8E3DC' }}
            >
              <Lock
                size={13}
                strokeWidth={1.9}
                className="absolute left-3.5"
                style={{ color: '#C4BDD0', pointerEvents: 'none' }}
              />
              <input
                type={pwVisible ? 'text' : 'password'}
                value={newPw}
                onChange={(e) => {
                  setNewPw(e.target.value);
                  setPwErr('');
                }}
                placeholder="New password (min. 8 chars)"
                className="flex-1 h-full bg-transparent outline-none border-none text-[0.875rem] pl-9 pr-10"
                style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                autoFocus
              />
              <button
                type="button"
                onClick={() => setPwVisible((p) => !p)}
                className="absolute right-3.5"
                style={{ color: '#C4BDD0' }}
              >
                {pwVisible ? (
                  <EyeOff size={13} strokeWidth={1.9} />
                ) : (
                  <Eye size={13} strokeWidth={1.9} />
                )}
              </button>
            </div>
            {pwErr && (
              <p
                className="text-[0.72rem] mb-3"
                style={{ color: '#E8622A', fontFamily: "'DM Sans', sans-serif" }}
              >
                {pwErr}
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                onClick={() => {
                  setModal(null);
                  setNewPw('');
                  setPwErr('');
                }}
                className="flex-1 text-[0.82rem] font-medium py-2.5 rounded-xl border"
                style={{
                  color: '#8A8390',
                  borderColor: '#E8E3DC',
                  background: 'transparent',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetPassword}
                disabled={loading.resetpw}
                className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #6C3CE1 0%, #5A2FCA 100%)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {loading.resetpw ? 'Setting…' : 'Set Password'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Page ── */}
      <div className="max-w-[980px] mx-auto">
        {/* Back + toast */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[0.8rem] font-medium transition-colors duration-150"
            style={{
              color: '#8A8390',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#1A1523';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#8A8390';
            }}
            aria-label="Go back"
          >
            <ArrowLeft size={14} strokeWidth={2} />
            Back to Users
          </button>
          {toast.msg && (
            <Toast
              msg={toast.msg}
              type={toast.type}
              onDismiss={() => setToast({ msg: '', type: 'success' })}
            />
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 items-start">
          {/* ── LEFT COLUMN ───────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Identity card */}
            <SectionCard>
              <div className="flex flex-col items-center text-center gap-3">
                {/* Avatar */}
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-[1.5rem] font-extrabold"
                  style={{
                    background: 'rgba(108,60,225,0.1)',
                    color: '#6C3CE1',
                    fontFamily: "'Syne', sans-serif",
                  }}
                  aria-label={`Avatar for ${user.name}`}
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt=""
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    initials(user.name)
                  )}
                </div>

                <div>
                  <h1
                    className="text-[1.15rem] font-extrabold tracking-[-0.03em] leading-tight"
                    style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                  >
                    {user.name}
                  </h1>
                  <p
                    className="text-[0.78rem] mt-0.5"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {user.email}
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap justify-center">
                  <StatusBadge status={user.status} />
                  <span
                    className="text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'rgba(108,60,225,0.1)',
                      color: '#6C3CE1',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              </div>

              <div
                className="mt-5 pt-4 flex flex-col gap-2.5"
                style={{ borderTop: '1px solid #F2EEE9' }}
              >
                {[
                  { icon: Calendar, label: 'Joined', value: user.joinedAt },
                  { icon: Clock, label: 'Last login', value: user.lastLogin },
                  { icon: Car, label: 'Listings', value: `${user.listings} total` },
                  { icon: Flag, label: 'Reports against', value: `${user.reportCount} reports` },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2.5">
                    <Icon
                      size={13}
                      strokeWidth={1.9}
                      style={{ color: '#C4BDD0', flexShrink: 0 }}
                      aria-hidden="true"
                    />
                    <span
                      className="text-[0.75rem]"
                      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </span>
                    <span
                      className="text-[0.75rem] font-semibold ml-auto"
                      style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              {/* User ID */}
              <div className="mt-4 pt-3" style={{ borderTop: '1px solid #F2EEE9' }}>
                <FieldLabel>User ID</FieldLabel>
                <p className="text-[0.72rem] font-mono break-all" style={{ color: '#8A8390' }}>
                  {user.id}
                </p>
              </div>
            </SectionCard>

            {/* Status control */}
            <SectionCard>
              <SectionTitle sub="Change this user's account standing">Account Status</SectionTitle>
              <div className="flex flex-col gap-2">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    onClick={() => {
                      if (s.value === user.status) return;
                      setModal({
                        type:
                          s.value === 'banned'
                            ? 'ban'
                            : s.value === 'active'
                              ? 'activate'
                              : s.value,
                      });
                    }}
                    disabled={loading.status}
                    className="flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-150 disabled:opacity-50"
                    style={{
                      border:
                        user.status === s.value ? `1.5px solid ${s.color}` : '1.5px solid #E8E3DC',
                      background: user.status === s.value ? s.bg : '#FAFAF9',
                      cursor: user.status === s.value ? 'default' : 'pointer',
                    }}
                    aria-pressed={user.status === s.value}
                  >
                    <span
                      className="text-[0.82rem] font-semibold"
                      style={{
                        color: user.status === s.value ? s.color : '#8A8390',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {s.label}
                    </span>
                    {user.status === s.value && (
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        style={{ color: s.color }}
                        aria-label="Current status"
                      />
                    )}
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* Role control */}
            <SectionCard>
              <SectionTitle sub="Change what this user can do">Role</SectionTitle>
              <div className="flex flex-col gap-2">
                {['Buyer', 'Seller', 'Dealer'].map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      if (r === user.role) return;
                      handleRoleChange(r);
                    }}
                    disabled={loading.role}
                    className="flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all duration-150 disabled:opacity-50"
                    style={{
                      border: user.role === r ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
                      background: user.role === r ? 'rgba(108,60,225,0.06)' : '#FAFAF9',
                      cursor: user.role === r ? 'default' : 'pointer',
                    }}
                    aria-pressed={user.role === r}
                  >
                    <span
                      className="text-[0.82rem] font-semibold"
                      style={{
                        color: user.role === r ? '#6C3CE1' : '#8A8390',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {r}
                    </span>
                    {user.role === r && (
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        style={{ color: '#6C3CE1' }}
                        aria-label="Current role"
                      />
                    )}
                  </button>
                ))}
              </div>
            </SectionCard>

            {/* Admin notes */}
            <SectionCard>
              <SectionTitle sub="Internal notes — not visible to user">Admin Notes</SectionTitle>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add internal notes about this user…"
                rows={4}
                className="w-full rounded-xl border bg-[#FAFAF9] text-[0.82rem] p-3 outline-none resize-none transition-[border-color,box-shadow] duration-200 focus:border-[rgba(108,60,225,0.4)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus:bg-white"
                style={{
                  borderColor: '#E8E3DC',
                  color: '#1A1523',
                  fontFamily: "'DM Sans', sans-serif",
                }}
                aria-label="Admin notes"
              />
              <button
                type="button"
                onClick={handleSaveNotes}
                disabled={notesSaving}
                className="mt-2 w-full py-2.5 rounded-xl text-[0.8rem] font-semibold text-white transition-opacity duration-150 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {notesSaving ? 'Saving…' : 'Save Notes'}
              </button>
            </SectionCard>
          </div>

          {/* ── RIGHT COLUMN ──────────────────────────────────── */}
          <div className="flex flex-col gap-4">
            {/* Editable info */}
            <SectionCard>
              <SectionTitle sub="Hover a field to edit inline">Personal Information</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                <EditableField
                  label="Full Name"
                  value={user.name}
                  icon={User}
                  onSave={handleSaveName}
                  validate={(v) => (!v.trim() ? 'Name is required' : null)}
                />
                <EditableField
                  label="City"
                  value={user.city}
                  icon={MapPin}
                  onSave={handleSaveCity}
                />
                <EditableField
                  label="Email Address"
                  value={user.email}
                  type="email"
                  icon={Mail}
                  onSave={handleSaveEmail}
                  validate={(v) => (!isEmail(v) ? 'Invalid email address' : null)}
                />
                <EditableField
                  label="Phone Number"
                  value={user.phone}
                  type="tel"
                  icon={Phone}
                  onSave={handleSavePhone}
                  validate={(v) => (!isPhone(v) ? 'Invalid Pakistani number' : null)}
                />
              </div>
            </SectionCard>

            {/* Verification */}
            <SectionCard>
              <SectionTitle sub="Manage email and phone verification status">
                Verification
              </SectionTitle>
              <div className="flex flex-col gap-3">
                {/* Email */}
                <div
                  className="flex items-center justify-between gap-4 p-4 rounded-xl"
                  style={{ border: '1.5px solid #E8E3DC', background: '#FAFAF9' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: user.emailVerified
                          ? 'rgba(34,197,94,0.12)'
                          : 'rgba(232,98,42,0.1)',
                      }}
                    >
                      {user.emailVerified ? (
                        <ShieldCheck
                          size={15}
                          strokeWidth={2}
                          style={{ color: '#16a34a' }}
                          aria-hidden="true"
                        />
                      ) : (
                        <ShieldOff
                          size={15}
                          strokeWidth={2}
                          style={{ color: '#E8622A' }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="text-[0.82rem] font-semibold"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Email
                      </p>
                      <p
                        className="text-[0.72rem]"
                        style={{
                          color: user.emailVerified ? '#16a34a' : '#E8622A',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {user.emailVerified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {!user.emailVerified && (
                      <ActionBtn
                        label="Resend"
                        icon={Send}
                        loading={loading['resend-email']}
                        onClick={() => handleResendVerification('email')}
                        variant="violet"
                      />
                    )}
                    {!user.emailVerified && (
                      <ActionBtn
                        label="Verify manually"
                        icon={ShieldCheck}
                        onClick={() => setModal({ type: 'verify-email' })}
                      />
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div
                  className="flex items-center justify-between gap-4 p-4 rounded-xl"
                  style={{ border: '1.5px solid #E8E3DC', background: '#FAFAF9' }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{
                        background: user.phoneVerified
                          ? 'rgba(34,197,94,0.12)'
                          : 'rgba(232,98,42,0.1)',
                      }}
                    >
                      {user.phoneVerified ? (
                        <ShieldCheck
                          size={15}
                          strokeWidth={2}
                          style={{ color: '#16a34a' }}
                          aria-hidden="true"
                        />
                      ) : (
                        <ShieldOff
                          size={15}
                          strokeWidth={2}
                          style={{ color: '#E8622A' }}
                          aria-hidden="true"
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="text-[0.82rem] font-semibold"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Phone
                      </p>
                      <p
                        className="text-[0.72rem]"
                        style={{
                          color: user.phoneVerified ? '#16a34a' : '#E8622A',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {user.phoneVerified ? 'Verified' : 'Not verified'}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    {!user.phoneVerified && (
                      <ActionBtn
                        label="Resend OTP"
                        icon={Send}
                        loading={loading['resend-phone']}
                        onClick={() => handleResendVerification('phone')}
                        variant="violet"
                      />
                    )}
                    {!user.phoneVerified && (
                      <ActionBtn
                        label="Verify manually"
                        icon={ShieldCheck}
                        onClick={() => setModal({ type: 'verify-phone' })}
                      />
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            {/* Password */}
            <SectionCard>
              <SectionTitle sub="Force a password change or send a reset link">
                Password Management
              </SectionTitle>
              <div className="flex gap-3 flex-wrap">
                <ActionBtn
                  label="Set new password"
                  icon={KeyRound}
                  onClick={() => setModal({ type: 'reset-pw' })}
                  variant="violet"
                />
                <ActionBtn
                  label="Send reset link"
                  icon={Send}
                  loading={loading.sendpwreset}
                  onClick={handleSendPasswordReset}
                />
              </div>
            </SectionCard>

            {/* Listings + activity tabs */}
            <SectionCard>
              {/* Tab bar */}
              <div className="flex gap-1 p-1 rounded-xl mb-5" style={{ background: '#F2EEE9' }}>
                {[
                  { id: 'listings', label: `Listings (${user.listings})` },
                  { id: 'activity', label: 'Activity Log' },
                ].map(({ id, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setActiveTab(id)}
                    className="flex-1 py-1.5 rounded-lg text-[0.78rem] font-semibold transition-[background-color,color,box-shadow] duration-150"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      background: activeTab === id ? '#FFFFFF' : 'transparent',
                      color: activeTab === id ? '#6C3CE1' : '#8A8390',
                      boxShadow: activeTab === id ? '0 1px 4px rgba(26,21,35,0.08)' : 'none',
                    }}
                    aria-selected={activeTab === id}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Listings tab */}
              {activeTab === 'listings' && (
                <div className="flex flex-col gap-2">
                  {MOCK_LISTINGS.map((l) => (
                    <div
                      key={l.id}
                      className="flex items-center justify-between gap-3 p-3.5 rounded-xl transition-colors duration-100"
                      style={{ border: '1.5px solid #E8E3DC', background: '#FAFAF9' }}
                    >
                      <div className="flex-1 min-w-0">
                        <p
                          className="text-[0.82rem] font-semibold truncate"
                          style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {l.title}
                        </p>
                        <p
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {l.city} · {l.createdAt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="text-[0.78rem] font-bold"
                          style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {l.price}
                        </span>
                        <ListingBadge status={l.status} />
                        <a
                          href={`/admin/listings/${l.id}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
                          style={{ color: '#8A8390' }}
                          aria-label={`View listing ${l.title}`}
                        >
                          <ExternalLink size={12} strokeWidth={2} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Activity tab */}
              {activeTab === 'activity' && (
                <div className="flex flex-col">
                  {MOCK_ACTIVITY.map((a, i) => (
                    <div
                      key={a.id}
                      className="flex gap-3 pb-4 relative"
                      style={{ paddingLeft: '22px' }}
                    >
                      {/* Timeline line */}
                      {i < MOCK_ACTIVITY.length - 1 && (
                        <div
                          className="absolute left-[7px] top-[18px] bottom-0 w-px"
                          style={{ background: '#E8E3DC' }}
                          aria-hidden="true"
                        />
                      )}
                      {/* Dot */}
                      <div
                        className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white flex-shrink-0"
                        style={{
                          background: '#6C3CE1',
                          boxShadow: '0 0 0 2px rgba(108,60,225,0.2)',
                        }}
                        aria-hidden="true"
                      />
                      <div>
                        <p
                          className="text-[0.8rem] font-semibold"
                          style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {a.event}
                        </p>
                        <p
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {a.detail}
                        </p>
                        <p
                          className="text-[0.68rem] mt-0.5"
                          style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {a.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            {/* Danger zone */}
            <div
              className="rounded-2xl p-6"
              style={{ background: '#FFFAF9', border: '1.5px solid rgba(232,98,42,0.2)' }}
            >
              <SectionTitle sub="Irreversible actions — proceed with caution">
                Danger Zone
              </SectionTitle>
              <div className="flex gap-3 flex-wrap">
                <ActionBtn
                  label="Delete all listings"
                  icon={Trash2}
                  onClick={() => setModal({ type: 'delete-listings' })}
                  loading={loading.deletelistings}
                  variant="danger"
                />
                <ActionBtn
                  label="Delete account"
                  icon={Trash2}
                  onClick={() => setModal({ type: 'delete-account' })}
                  loading={loading.delete}
                  variant="red"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  @keyframes spin { to { transform: rotate(360deg); } }

  .spinner-xs {
    display: inline-block;
    width: 12px; height: 12px;
    border: 1.5px solid rgba(108,60,225,0.25);
    border-top-color: #6C3CE1;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }
`;
