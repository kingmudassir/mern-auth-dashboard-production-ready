import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trash2,
  Search,
  RotateCcw,
  ShieldOff,
  ChevronLeft,
  ChevronRight,
  Clock,
  X,
  Eye,
  AlertTriangle,
} from 'lucide-react';
import ConfirmModal from '../../User-Profile/Components/Common/ConfirmModal';
import Toast from '../../User-Profile/Components/Common/Toast';
import { useDeletedUsers } from '../../../../Hooks/Admin-Hook/All-Users/useDeletedUsers';
import { useRestoreUser } from '../../../../Hooks/Admin-Hook/All-Users/useRestoreUser';

const PAGE_SIZE = 5;

// ── Helpers ───────────────────────────────────────────────────────
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
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
};

// Avatar colors pool — cycles by index
const AVATAR_COLORS = [
  { bg: 'rgba(108,60,225,0.1)', color: '#6C3CE1' },
  { bg: 'rgba(232,98,42,0.1)', color: '#C4531F' },
  { bg: 'rgba(201,168,76,0.15)', color: '#92700a' },
  { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
];

// ── Sub-components ────────────────────────────────────────────────
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

function RolePill({ role }) {
  return (
    <span
      className="text-[0.68rem] font-semibold px-2 py-0.5 rounded-full"
      style={{
        background: role === 'moderator' ? 'rgba(201,168,76,0.15)' : 'rgba(108,60,225,0.08)',
        color: role === 'moderator' ? '#92700a' : '#6C3CE1',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {role}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function DeletedUsers() {
  const navigate = useNavigate();
  const { data, isLoading } = useDeletedUsers();
  const { mutate: restoreUser, isPending: isRestoringAny } = useRestoreUser();
  const users = data?.users ?? [];

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [modal, setModal] = useState(null); // { type: 'restore'|'purge', user }

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  // ── Filter + paginate ─────────────────────────────────────────
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

  // ── Actions ───────────────────────────────────────────────────
  const handleRestore = () => {
    const { user } = modal;
    restoreUser(user._id, {
      onSuccess: () => {
        showToast(`${user.name}'s account has been restored`);
        setModal(null);
      },
      onError: (err) => {
        showToast(err?.message || 'Failed to restore account.', 'error');
        setModal(null);
      },
    });
  };

  const handlePurge = () => {
    setModal(null);
    showToast('Permanent purge is not implemented yet.', 'error');
  };

  // ── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const today = users.filter((u) => {
      const deletedAt = u.softDeletedAt || u.deletedAt || u.updatedAt || u.createdAt;
      const diff = Date.now() - new Date(deletedAt).getTime();
      return diff < 86400000;
    }).length;
    return { total: users.length, today };
  }, [users]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      {/* Modals */}
      <ConfirmModal
        open={modal?.type === 'restore'}
        title={`Restore ${modal?.user?.name}?`}
        message="Their account will be reactivated. All previous data and listings will be accessible again. Review their profile after restoring."
        confirmLabel="Restore Account"
        onConfirm={handleRestore}
        onCancel={() => setModal(null)}
      />
      <ConfirmModal
        open={modal?.type === 'purge'}
        title="Permanently delete this account?"
        message="This will wipe all data associated with this user from the database. This cannot be undone under any circumstances."
        confirmLabel="Permanently Delete"
        onConfirm={handlePurge}
        onCancel={() => setModal(null)}
        danger
      />

      <div className="max-w-400 mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
          <div>
            <h1
              className="text-[1.35rem] font-extrabold tracking-[-0.035em]"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Deleted Users
            </h1>
            <p
              className="text-[0.8rem] mt-0.5"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Soft-deleted accounts — restore or permanently remove them
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-5">
          <StatCard
            icon={Trash2}
            label="Total deleted"
            value={stats.total}
            accent={{ bg: 'rgba(232,98,42,0.1)', color: '#C4531F' }}
          />
          <StatCard
            icon={Clock}
            label="Deleted today"
            value={stats.today}
            accent={{ bg: 'rgba(201,168,76,0.15)', color: '#92700a' }}
          />
          <StatCard
            icon={RotateCcw}
            label="Restorable"
            value={stats.total}
            accent={{ bg: 'rgba(108,60,225,0.08)', color: '#6C3CE1' }}
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

        {/* ── Banner if empty ── */}
        {!isLoading && filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl"
            style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(108,60,225,0.08)' }}
            >
              <ShieldOff size={20} strokeWidth={1.8} style={{ color: '#6C3CE1' }} />
            </div>
            <p
              className="text-[0.85rem] font-semibold"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              {search ? 'No matching deleted users' : 'No deleted users'}
            </p>
            <p
              className="text-[0.75rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {search ? 'Try a different search term' : 'Deleted accounts will appear here'}
            </p>
          </div>
        )}

        {/* ── Table ── */}
        {!isLoading && filtered.length > 0 && (
          <>
            {/* Desktop table */}
            <div
              className="hidden md:block rounded-2xl overflow-hidden"
              style={{ border: '1.5px solid #E8E3DC', background: '#FFFFFF' }}
            >
              {/* Table head */}
              <div
                className="grid items-center px-5 py-3"
                style={{
                  gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr auto',
                  borderBottom: '1px solid #F2EEE9',
                  background: '#FAFAF9',
                }}
              >
                {['User', 'Reason', 'Deleted', 'Role', 'Listings', 'Actions'].map((h) => (
                  <span
                    key={h}
                    className="text-[0.7rem] font-semibold uppercase tracking-widest"
                    style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {paginated.map((u, i) => {
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const isRestoring = isRestoringAny && modal?.user?._id === u._id;
                const isPurging = false;

                return (
                  <div
                    key={u._id}
                    className="grid items-center px-5 py-4 transition-colors duration-100 du-row"
                    style={{
                      gridTemplateColumns: '2fr 1.4fr 1fr 1fr 1fr auto',
                      borderBottom: i < paginated.length - 1 ? '1px solid #F2EEE9' : 'none',
                    }}
                  >
                    {/* User */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-[0.72rem] font-extrabold shrink-0 relative"
                        style={{
                          background: avatarColor.bg,
                          color: avatarColor.color,
                          fontFamily: "'Syne', sans-serif",
                        }}
                      >
                        {initials(u.name)}
                        {/* Deleted overlay dot */}
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                          style={{ background: '#E8622A' }}
                        />
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

                    {/* Reason */}
                    <div className="min-w-0 pr-3">
                      <p
                        className="text-[0.75rem] truncate"
                        style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        title={u.banReason}
                      >
                        {u.banReason || '—'}
                      </p>
                    </div>

                    {/* Deleted at */}
                    <div>
                      <p
                        className="text-[0.75rem] font-medium"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {timeAgo(u.softDeletedAt || u.deletedAt || u.updatedAt || u.createdAt)}
                      </p>
                      <p
                        className="text-[0.68rem]"
                        style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {formatDate(u.softDeletedAt || u.deletedAt || u.updatedAt || u.createdAt)}
                      </p>
                    </div>

                    {/* Role */}
                    <div>
                      <RolePill role={u.role} />
                    </div>

                    {/* Listings */}
                    <div>
                      <span
                        className="text-[0.78rem] font-semibold"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {u.listings ?? 0}
                      </span>
                      <span
                        className="text-[0.7rem] ml-1"
                        style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        total
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* View profile */}
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                        className="du-action-btn"
                        title="View profile"
                        style={{ color: '#8A8390' }}
                      >
                        <Eye size={13} strokeWidth={2} />
                      </button>

                      {/* Restore */}
                      <button
                        type="button"
                        onClick={() => setModal({ type: 'restore', user: u })}
                        disabled={isRestoring || isPurging}
                        className="du-action-btn du-restore"
                        title="Restore account"
                      >
                        {isRestoring ? (
                          <span className="spinner-xs" />
                        ) : (
                          <RotateCcw size={13} strokeWidth={2} />
                        )}
                      </button>

                      {/* Purge */}
                      <button
                        type="button"
                        onClick={() => setModal({ type: 'purge', user: u })}
                        disabled
                        className="du-action-btn du-purge"
                        title="Purge not available"
                      >
                        {isPurging ? (
                          <span className="spinner-xs-red" />
                        ) : (
                          <Trash2 size={13} strokeWidth={2} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Mobile cards ── */}
            <div className="flex flex-col gap-3 md:hidden">
              {paginated.map((u, i) => {
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const isRestoring = isRestoringAny && modal?.user?._id === u._id;
                const isPurging = false;

                return (
                  <div
                    key={u._id}
                    className="rounded-2xl p-4"
                    style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center text-[0.72rem] font-extrabold shrink-0 relative"
                          style={{
                            background: avatarColor.bg,
                            color: avatarColor.color,
                            fontFamily: "'Syne', sans-serif",
                          }}
                        >
                          {initials(u.name)}
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                            style={{ background: '#E8622A' }}
                          />
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
                      <RolePill role={u.role} />
                    </div>

                    <div
                      className="flex flex-col gap-1.5 pt-3 mb-3"
                      style={{ borderTop: '1px solid #F2EEE9' }}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                        <span
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {u.banReason || 'No reason provided'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                        <span
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Deleted{' '}
                          {timeAgo(u.softDeletedAt || u.deletedAt || u.updatedAt || u.createdAt)} ·{' '}
                          {formatDate(u.softDeletedAt || u.deletedAt || u.updatedAt || u.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[0.75rem] font-semibold border transition-colors duration-150"
                        style={{
                          color: '#8A8390',
                          borderColor: '#E8E3DC',
                          background: '#FAFAF9',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        <Eye size={12} strokeWidth={2} />
                        View
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ type: 'restore', user: u })}
                        disabled={isRestoring || isPurging}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[0.75rem] font-semibold border transition-colors duration-150 disabled:opacity-50"
                        style={{
                          color: '#6C3CE1',
                          borderColor: 'rgba(108,60,225,0.3)',
                          background: 'rgba(108,60,225,0.06)',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {isRestoring ? (
                          <span className="spinner-xs" />
                        ) : (
                          <RotateCcw size={12} strokeWidth={2} />
                        )}
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ type: 'purge', user: u })}
                        disabled
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[0.75rem] font-semibold border transition-colors duration-150 disabled:opacity-50"
                        style={{
                          color: '#C4531F',
                          borderColor: 'rgba(232,98,42,0.3)',
                          background: 'rgba(232,98,42,0.06)',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {isPurging ? (
                          <span className="spinner-xs-red" />
                        ) : (
                          <Trash2 size={12} strokeWidth={2} />
                        )}
                        Purge
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* ── Pagination ── */}
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
                    style={{
                      color: '#8A8390',
                      borderColor: '#E8E3DC',
                      background: '#FFFFFF',
                    }}
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
                    style={{
                      color: '#8A8390',
                      borderColor: '#E8E3DC',
                      background: '#FFFFFF',
                    }}
                  >
                    <ChevronRight size={14} strokeWidth={2} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="flex items-center justify-center h-40">
            <p
              className="text-[0.82rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Loading deleted users…
            </p>
          </div>
        )}
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

  .spinner-xs-red {
    display: inline-block;
    width: 12px; height: 12px;
    border: 1.5px solid rgba(232,98,42,0.25);
    border-top-color: #E8622A;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  .du-row:hover {
    background: #FAFAF9;
  }

  .du-action-btn {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid #E8E3DC;
    background: #FAFAF9;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .du-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }

  .du-action-btn:hover {
    background: #F2EEE9;
    border-color: #C4BDD0;
    color: #1A1523;
  }

  .du-restore { color: #6C3CE1; border-color: rgba(108,60,225,0.25); background: rgba(108,60,225,0.04); }
  .du-restore:hover { background: rgba(108,60,225,0.1); border-color: rgba(108,60,225,0.4); }

  .du-purge { color: #C4531F; border-color: rgba(232,98,42,0.25); background: rgba(232,98,42,0.04); }
  .du-purge:hover { background: rgba(232,98,42,0.1); border-color: rgba(232,98,42,0.4); }
`;
