import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Search,
  ShieldOff,
  Eye,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  UserCog,
  Users,
  Clock,
  Phone,
  Calendar,
  ArrowLeftRight,
  Crown,
} from 'lucide-react';
import Toast from '../../User-Profile/Components/Common/Toast';
import ConfirmModal from '../../User-Profile/Components/Common/ConfirmModal';
import { useAdminAccounts } from '../../../../Hooks/Admin-Hook/All-Users/useAdminAccounts';
import { useChangeRole } from '../../../../Hooks/Admin-Hook/All-Users/useChangeRole';
import { useBanAdminUser } from '../../../../Hooks/Admin-Hook/All-Users/useBanAdminUser';
import { useDeleteAdminUser } from '../../../../Hooks/Admin-Hook/All-Users/useDeleteAdminUser';

const PAGE_SIZE = 5;

// ── Helpers ────────────────────────────────────────────────────────
const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

const AVATAR_COLORS = [
  { bg: 'rgba(108,60,225,0.1)', color: '#6C3CE1' },
  { bg: 'rgba(201,168,76,0.15)', color: '#92700a' },
  { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
  { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
];

// ── Sub-components ─────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl"
      style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
    >
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent.bg }}
      >
        <Icon size={15} strokeWidth={2} style={{ color: accent.color }} />
      </div>
      <div>
        <p
          className="text-[1.05rem] font-extrabold tracking-[-0.03em]"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          {value}
        </p>
        <p
          className="text-[0.72rem]"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === 'admin';
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: isAdmin ? 'rgba(108,60,225,0.08)' : 'rgba(138,131,144,0.1)',
        color: isAdmin ? '#6C3CE1' : '#8A8390',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {isAdmin && <Crown size={8} strokeWidth={2.5} />}
      {role}
    </span>
  );
}

function StatusDot({ isBanned }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 text-[0.72rem] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: isBanned ? 'rgba(232,98,42,0.1)' : 'rgba(34,197,94,0.1)',
        color: isBanned ? '#C4531F' : '#16a34a',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full"
        style={{ background: isBanned ? '#C4531F' : '#16a34a' }}
      />
      {isBanned ? 'Banned' : 'Active'}
    </span>
  );
}

// ── Role Switch Modal ──────────────────────────────────────────────
function RoleSwitchModal({ user, onConfirm, onCancel, isPending }) {
  if (!user) return null;
  const targetRole = user.role === 'admin' ? 'user' : 'admin';
  const isDowngrade = targetRole === 'user';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(26,21,35,0.45)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
      >
        {/* Icon */}
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
          style={{
            background: isDowngrade ? 'rgba(138,131,144,0.1)' : 'rgba(108,60,225,0.08)',
          }}
        >
          <ArrowLeftRight
            size={18}
            strokeWidth={2}
            style={{ color: isDowngrade ? '#8A8390' : '#6C3CE1' }}
          />
        </div>

        <h2
          className="text-[1rem] font-extrabold tracking-[-0.03em] mb-1"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          {isDowngrade ? 'Remove Admin Access' : 'Grant Admin Access'}
        </h2>
        <p
          className="text-[0.8rem] leading-relaxed mb-5"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {isDowngrade
            ? `${user.name} will lose all admin privileges and be downgraded to a regular user. They will no longer have access to the admin panel.`
            : `${user.name} will be granted admin access and can manage users, listings, and reports on the platform.`}
        </p>

        {/* Role preview */}
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl mb-5"
          style={{ background: '#FAFAF9', border: '1px solid #F2EEE9' }}
        >
          <RoleBadge role={user.role} />
          <ArrowLeftRight size={12} strokeWidth={2} style={{ color: '#C4BDD0' }} />
          <RoleBadge role={targetRole} />
          <span
            className="text-[0.72rem] ml-auto"
            style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
          >
            {user.name}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl text-[0.8rem] font-semibold border transition-colors duration-150"
            style={{
              color: '#8A8390',
              borderColor: '#E8E3DC',
              background: '#FAFAF9',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-xl text-[0.8rem] font-semibold transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
            style={{
              color: isDowngrade ? '#8A8390' : '#6C3CE1',
              background: isDowngrade ? 'rgba(138,131,144,0.1)' : 'rgba(108,60,225,0.08)',
              border: `1.5px solid ${isDowngrade ? 'rgba(138,131,144,0.2)' : 'rgba(108,60,225,0.25)'}`,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {isPending ? (
              <span className="spinner-xs" />
            ) : (
              <>
                <ArrowLeftRight size={13} strokeWidth={2} />
                {isDowngrade ? 'Downgrade' : 'Promote'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────
export default function AdminAccounts() {
  const navigate = useNavigate();
  const { data, isLoading } = useAdminAccounts();
  const { mutate: changeRole, isPending: isChangingRole } = useChangeRole();
  const { mutate: banUser, isPending: isBanning } = useBanAdminUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteAdminUser();

  const users = data?.users ?? [];

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [modal, setModal] = useState(null);
  // modal types: 'role' | 'ban' | 'unban' | 'delete'

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  // ── Filter + paginate ──────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        (u.phone || '').includes(q) ||
        u._id.includes(q)
    );
  }, [users, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
  };

  // ── Stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = users.filter((u) => !u.isBanned).length;
    const banned = users.filter((u) => u.isBanned).length;
    const recentlyActive = users.filter((u) => {
      const lastActive = u.lastActive || u.lastLoginAt || u.updatedAt;
      if (!lastActive) return false;
      return Date.now() - new Date(lastActive).getTime() < 86400000 * 7;
    }).length;
    return { total: users.length, active, banned, recentlyActive };
  }, [users]);

  // ── Actions ────────────────────────────────────────────────────
  const handleRoleChange = () => {
    const { user } = modal;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    changeRole(
      { userId: user._id, role: newRole },
      {
        onSuccess: () => {
          showToast(`${user.name}'s role changed to ${newRole}`);
          setModal(null);
        },
        onError: (err) => {
          showToast(err?.message || 'Failed to change role.', 'error');
          setModal(null);
        },
      }
    );
  };

  const handleBanToggle = () => {
    const { user } = modal;
    const isBanned = user.isBanned;
    banUser(
      { userId: user._id, ban: !isBanned },
      {
        onSuccess: () => {
          showToast(`${user.name}'s account has been ${isBanned ? 'unbanned' : 'banned'}`);
          setModal(null);
        },
        onError: (err) => {
          showToast(err?.message || 'Failed to update ban status.', 'error');
          setModal(null);
        },
      }
    );
  };

  const handleDelete = () => {
    const { user } = modal;
    deleteUser(user._id, {
      onSuccess: () => {
        showToast(`${user.name}'s account has been permanently deleted`, 'success');
        setModal(null);
      },
      onError: (err) => {
        showToast(err?.message || 'Failed to delete account.', 'error');
        setModal(null);
      },
    });
  };

  const isAnyPending = isChangingRole || isBanning || isDeleting;

  // ── Render ─────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      {/* Role switch modal */}
      {modal?.type === 'role' && (
        <RoleSwitchModal
          user={modal.user}
          onConfirm={handleRoleChange}
          onCancel={() => setModal(null)}
          isPending={isChangingRole}
        />
      )}

      {/* Ban / Unban confirm */}
      <ConfirmModal
        open={modal?.type === 'ban' || modal?.type === 'unban'}
        title={
          modal?.type === 'unban' ? `Unban ${modal?.user?.name}?` : `Ban ${modal?.user?.name}?`
        }
        message={
          modal?.type === 'unban'
            ? 'Their account will be restored to active status. They will regain access to the platform.'
            : 'This admin account will be blocked from accessing the platform. Their listings will be hidden.'
        }
        confirmLabel={modal?.type === 'unban' ? 'Unban Account' : 'Ban Account'}
        onConfirm={handleBanToggle}
        onCancel={() => setModal(null)}
      />

      {/* Delete confirm */}
      <ConfirmModal
        open={modal?.type === 'delete'}
        title={`Delete ${modal?.user?.name}?`}
        message="This action is permanent and cannot be undone. All data associated with this account will be removed from the platform."
        confirmLabel="Delete Permanently"
        onConfirm={handleDelete}
        onCancel={() => setModal(null)}
        isDanger
      />

      <div className="max-w-245 mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
          <div>
            <h1
              className="text-[1.35rem] font-extrabold tracking-[-0.035em]"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Admin Accounts
            </h1>
            <p
              className="text-[0.8rem] mt-0.5"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Manage admin access, roles, and account status across the platform
            </p>
          </div>
          {toast.msg && (
            <Toast
              msg={toast.msg}
              type={toast.type}
              onDismiss={() => setToast({ msg: '', type: 'success' })}
            />
          )}
        </div>

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard
            icon={UserCog}
            label="Total admins"
            value={stats.total}
            accent={{ bg: 'rgba(108,60,225,0.08)', color: '#6C3CE1' }}
          />
          <StatCard
            icon={ShieldCheck}
            label="Active"
            value={stats.active}
            accent={{ bg: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
          />
          <StatCard
            icon={ShieldOff}
            label="Banned"
            value={stats.banned}
            accent={{ bg: 'rgba(232,98,42,0.1)', color: '#C4531F' }}
          />
          <StatCard
            icon={Clock}
            label="Active this week"
            value={stats.recentlyActive}
            accent={{ bg: 'rgba(201,168,76,0.15)', color: '#92700a' }}
          />
        </div>

        {/* Search */}
        <div
          className="flex items-center gap-3 px-4 h-11 rounded-xl border mb-4 transition-[border-color,box-shadow] duration-200 focus-within:border-[rgba(108,60,225,0.4)] focus-within:shadow-[0_0_0_3px_rgba(108,60,225,0.08)]"
          style={{ background: '#FFFFFF', borderColor: '#E8E3DC' }}
        >
          <Search size={14} strokeWidth={2} style={{ color: '#C4BDD0', flexShrink: 0 }} />
          <input
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search by name, email, phone or ID…"
            className="flex-1 h-full bg-transparent outline-none border-none text-[0.85rem]"
            style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
          />
          {search && (
            <button type="button" onClick={() => handleSearch('')} style={{ color: '#C4BDD0' }}>
              <X size={13} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl"
            style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(108,60,225,0.08)' }}
            >
              <Users size={20} strokeWidth={1.8} style={{ color: '#6C3CE1' }} />
            </div>
            <p
              className="text-[0.85rem] font-semibold"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              {search ? 'No matching admins' : 'No admin accounts'}
            </p>
            <p
              className="text-[0.75rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {search ? 'Try a different search term' : 'Admin accounts will appear here'}
            </p>
          </div>
        )}

        {/* Desktop table */}
        {!isLoading && filtered.length > 0 && (
          <>
            <div
              className="hidden md:block rounded-2xl overflow-hidden"
              style={{ border: '1.5px solid #E8E3DC', background: '#FFFFFF' }}
            >
              {/* Head */}
              <div
                className="grid items-center px-5 py-3"
                style={{
                  gridTemplateColumns: '1.5fr 1.2fr 1fr 1.1fr 148px',
                  borderBottom: '1px solid #F2EEE9',
                  background: '#FAFAF9',
                }}
              >
                {['Admin', 'Phone', 'Last Active', 'Status', 'Actions'].map((h) => (
                  <span
                    key={h}
                    className="text-[0.7rem] font-semibold uppercase tracking-widest flex justify-center "
                    style={{
                      color: '#C4BDD0',
                      fontFamily: "'DM Sans', sans-serif",
                      ...(h === 'Actions' && { textAlign: 'right' }),
                    }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {paginated.map((u, i) => {
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const isPendingThis = isAnyPending && modal?.user?._id === u._id;
                const lastActive = u.lastActive || u.lastLoginAt || u.updatedAt;

                return (
                  <div
                    key={u._id}
                    className="aa-row grid items-center px-5 py-4"
                    style={{
                      gridTemplateColumns: '2fr 1.2fr 1.1fr 0.85fr 148px',
                      borderBottom: i < paginated.length - 1 ? '1px solid #F2EEE9' : 'none',
                      opacity: u.isBanned ? 0.75 : 1,
                    }}
                  >
                    {/* Admin */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[0.72rem] font-extrabold shrink-0"
                        style={{
                          background: avatarColor.bg,
                          color: avatarColor.color,
                          fontFamily: "'Syne', sans-serif",
                        }}
                      >
                        {initials(u.name)}
                      </div>
                      <div className="min-w-0">
                        <p
                          className="text-[0.82rem] font-semibold truncate"
                          style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {u.name}
                        </p>
                        <p
                          className="text-[0.72rem] truncate"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {u.email}
                        </p>
                      </div>
                    </div>

                    {/* Phone */}
                    <div>
                      <p
                        className="text-[0.75rem]"
                        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {u.phone || '—'}
                      </p>
                    </div>

                    {/* Last active */}
                    <div>
                      {lastActive ? (
                        <>
                          <p
                            className="text-[0.75rem] font-medium"
                            style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {timeAgo(lastActive)}
                          </p>
                          <p
                            className="text-[0.68rem]"
                            style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {formatDate(lastActive)}
                          </p>
                        </>
                      ) : (
                        <p
                          className="text-[0.75rem]"
                          style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          —
                        </p>
                      )}
                    </div>

                    {/* Status */}
                    <div>
                      <StatusDot isBanned={u.isBanned} />
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 justify-end">
                      {/* View */}
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                        className="aa-action-btn"
                        title="View profile"
                        style={{ color: '#8A8390' }}
                      >
                        <Eye size={13} strokeWidth={2} />
                      </button>

                      {/* Change role */}
                      <button
                        type="button"
                        onClick={() => setModal({ type: 'role', user: u })}
                        disabled={isPendingThis}
                        className="aa-action-btn aa-role"
                        title={u.role === 'admin' ? 'Downgrade to user' : 'Promote to admin'}
                      >
                        {isPendingThis && modal?.type === 'role' ? (
                          <span className="spinner-xs" />
                        ) : (
                          <ArrowLeftRight size={13} strokeWidth={2} />
                        )}
                      </button>

                      {/* Ban / Unban */}
                      <button
                        type="button"
                        onClick={() => setModal({ type: u.isBanned ? 'unban' : 'ban', user: u })}
                        disabled={isPendingThis}
                        className={`aa-action-btn ${u.isBanned ? 'aa-unban' : 'aa-ban'}`}
                        title={u.isBanned ? 'Unban account' : 'Ban account'}
                      >
                        {isPendingThis && (modal?.type === 'ban' || modal?.type === 'unban') ? (
                          <span className="spinner-xs" />
                        ) : u.isBanned ? (
                          <ShieldCheck size={13} strokeWidth={2} />
                        ) : (
                          <ShieldOff size={13} strokeWidth={2} />
                        )}
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => setModal({ type: 'delete', user: u })}
                        disabled={isPendingThis}
                        className="aa-action-btn aa-delete"
                        title="Delete account"
                      >
                        {isPendingThis && modal?.type === 'delete' ? (
                          <span className="spinner-xs" />
                        ) : (
                          <Trash2 size={13} strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {paginated.map((u, i) => {
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const isPendingThis = isAnyPending && modal?.user?._id === u._id;
                const lastActive = u.lastActive || u.lastLoginAt || u.updatedAt;

                return (
                  <div
                    key={u._id}
                    className="rounded-2xl p-4"
                    style={{
                      background: '#FFFFFF',
                      border: '1.5px solid #E8E3DC',
                      opacity: u.isBanned ? 0.8 : 1,
                    }}
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-[0.72rem] font-extrabold shrink-0"
                          style={{
                            background: avatarColor.bg,
                            color: avatarColor.color,
                            fontFamily: "'Syne', sans-serif",
                          }}
                        >
                          {initials(u.name)}
                        </div>
                        <div className="min-w-0">
                          <p
                            className="text-[0.82rem] font-semibold"
                            style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {u.name}
                          </p>
                          <p
                            className="text-[0.72rem] truncate"
                            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {u.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <RoleBadge role={u.role} />
                        <StatusDot isBanned={u.isBanned} />
                      </div>
                    </div>

                    {/* Detail rows */}
                    <div
                      className="flex flex-col gap-1.5 pt-3 mb-3"
                      style={{ borderTop: '1px solid #F2EEE9' }}
                    >
                      {u.phone && (
                        <div className="flex items-center gap-2">
                          <Phone size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                          <span
                            className="text-[0.72rem]"
                            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            {u.phone}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                        <span
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Joined {formatDate(u.createdAt)}
                        </span>
                      </div>
                      {lastActive && (
                        <div className="flex items-center gap-2">
                          <Clock size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                          <span
                            className="text-[0.72rem]"
                            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                          >
                            Last active {timeAgo(lastActive)}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <UserCog size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                        <span
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {u.listings ?? 0} listings
                        </span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-4 gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                        className="aa-mobile-btn"
                        style={{ color: '#8A8390', borderColor: '#E8E3DC', background: '#FAFAF9' }}
                      >
                        <Eye size={12} strokeWidth={2} />
                        <span>View</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModal({ type: 'role', user: u })}
                        disabled={isPendingThis}
                        className="aa-mobile-btn"
                        style={{
                          color: '#6C3CE1',
                          borderColor: 'rgba(108,60,225,0.25)',
                          background: 'rgba(108,60,225,0.06)',
                        }}
                      >
                        {isPendingThis && modal?.type === 'role' ? (
                          <span className="spinner-xs" />
                        ) : (
                          <ArrowLeftRight size={12} strokeWidth={2} />
                        )}
                        <span>Role</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModal({ type: u.isBanned ? 'unban' : 'ban', user: u })}
                        disabled={isPendingThis}
                        className="aa-mobile-btn"
                        style={
                          u.isBanned
                            ? {
                                color: '#16a34a',
                                borderColor: 'rgba(34,197,94,0.25)',
                                background: 'rgba(34,197,94,0.06)',
                              }
                            : {
                                color: '#C4531F',
                                borderColor: 'rgba(232,98,42,0.25)',
                                background: 'rgba(232,98,42,0.06)',
                              }
                        }
                      >
                        {isPendingThis && (modal?.type === 'ban' || modal?.type === 'unban') ? (
                          <span className="spinner-xs" />
                        ) : u.isBanned ? (
                          <ShieldCheck size={12} strokeWidth={2} />
                        ) : (
                          <ShieldOff size={12} strokeWidth={2} />
                        )}
                        <span>{u.isBanned ? 'Unban' : 'Ban'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setModal({ type: 'delete', user: u })}
                        disabled={isPendingThis}
                        className="aa-mobile-btn"
                        style={{
                          color: '#C4531F',
                          borderColor: 'rgba(232,98,42,0.2)',
                          background: 'rgba(232,98,42,0.05)',
                        }}
                      >
                        {isPendingThis && modal?.type === 'delete' ? (
                          <span className="spinner-xs" />
                        ) : (
                          <Trash2 size={12} strokeWidth={2} />
                        )}
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p
                  className="text-[0.75rem]"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)}{' '}
                  of {filtered.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-150 disabled:opacity-40"
                    style={{ color: '#8A8390', borderColor: '#E8E3DC', background: '#FFFFFF' }}
                  >
                    <ChevronLeft size={14} strokeWidth={2} />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPage(p)}
                      className="w-8 h-8 rounded-lg flex items-center justify-center border text-[0.78rem] font-semibold transition-all duration-150"
                      style={{
                        borderColor: page === p ? '#6C3CE1' : '#E8E3DC',
                        background: page === p ? 'rgba(108,60,225,0.08)' : '#FFFFFF',
                        color: page === p ? '#6C3CE1' : '#8A8390',
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="w-8 h-8 rounded-lg flex items-center justify-center border transition-colors duration-150 disabled:opacity-40"
                    style={{ color: '#8A8390', borderColor: '#E8E3DC', background: '#FFFFFF' }}
                  >
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <p
              className="text-[0.82rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Loading admin accounts…
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ── Styles ─────────────────────────────────────────────────────────
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

  .aa-row {
    transition: background 0.1s;
  }
  .aa-row:hover {
    background: #FAFAF9;
  }

  .aa-action-btn {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid #E8E3DC;
    background: #FAFAF9;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .aa-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .aa-action-btn:hover { background: #F2EEE9; border-color: #C4BDD0; }

  .aa-role       { color: #6C3CE1; border-color: rgba(108,60,225,0.25); background: rgba(108,60,225,0.04); }
  .aa-role:hover { background: rgba(108,60,225,0.1); border-color: rgba(108,60,225,0.4); }

  .aa-ban       { color: #C4531F; border-color: rgba(232,98,42,0.2); background: rgba(232,98,42,0.04); }
  .aa-ban:hover { background: rgba(232,98,42,0.1); border-color: rgba(232,98,42,0.35); }

  .aa-unban       { color: #16a34a; border-color: rgba(34,197,94,0.25); background: rgba(34,197,94,0.04); }
  .aa-unban:hover { background: rgba(34,197,94,0.1); border-color: rgba(34,197,94,0.4); }

  .aa-delete       { color: #C4531F; border-color: rgba(232,98,42,0.2); background: rgba(232,98,42,0.04); }
  .aa-delete:hover { background: rgba(232,98,42,0.12); border-color: rgba(232,98,42,0.4); }

  .aa-mobile-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3px;
    padding: 8px 4px;
    border-radius: 10px;
    font-size: 0.68rem;
    font-weight: 600;
    border: 1.5px solid;
    cursor: pointer;
    transition: opacity 0.15s;
    font-family: 'DM Sans', sans-serif;
  }
  .aa-mobile-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .aa-mobile-btn:active { opacity: 0.75; }
`;
