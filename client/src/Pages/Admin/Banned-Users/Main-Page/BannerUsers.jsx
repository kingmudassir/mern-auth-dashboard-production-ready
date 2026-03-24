import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldOff,
  Search,
  RotateCcw,
  ShieldCheck,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Eye,
  X,
  Flag,
  User,
  Gavel,
} from 'lucide-react';
import Toast from '../../User-Profile/Components/Common/Toast';
import ConfirmModal from '../../User-Profile/Components/Common/ConfirmModal';

// ── Mock data ─────────────────────────────────────────────────────
const MOCK_BANNED_USERS = [
  {
    _id: 'usr_b01abc',
    name: 'Kamran Iqbal',
    email: 'kamran.iq@gmail.com',
    phone: '03001112233',
    role: 'user',
    listings: 8,
    reportCount: 9,
    bannedAt: '2024-03-12T10:30:00Z',
    createdAt: '2023-05-14T00:00:00Z',
    bannedBy: 'admin',
    reason: 'Repeated fraudulent listings',
  },
  {
    _id: 'usr_b02def',
    name: 'Zara Siddiqui',
    email: 'zara.s@hotmail.com',
    phone: '03211223344',
    role: 'user',
    listings: 2,
    reportCount: 4,
    bannedAt: '2024-03-09T08:15:00Z',
    createdAt: '2023-10-01T00:00:00Z',
    bannedBy: 'admin',
    reason: 'Harassment of other users',
  },
  {
    _id: 'usr_b03ghi',
    name: 'Asad Mehmood',
    email: 'asad.m@yahoo.com',
    phone: '03451223344',
    role: 'moderator',
    listings: 0,
    reportCount: 12,
    bannedAt: '2024-03-01T14:00:00Z',
    createdAt: '2022-11-20T00:00:00Z',
    bannedBy: 'super_admin',
    reason: 'Abuse of moderator role',
  },
  {
    _id: 'usr_b04jkl',
    name: 'Hina Baig',
    email: 'hina.b@gmail.com',
    phone: '03011223344',
    role: 'user',
    listings: 15,
    reportCount: 6,
    bannedAt: '2024-02-22T11:45:00Z',
    createdAt: '2022-07-30T00:00:00Z',
    bannedBy: 'admin',
    reason: 'Price manipulation & fake bids',
  },
  {
    _id: 'usr_b05mno',
    name: 'Tariq Nawaz',
    email: 'tariq.n@outlook.com',
    phone: '03331223344',
    role: 'user',
    listings: 4,
    reportCount: 2,
    bannedAt: '2024-02-18T09:00:00Z',
    createdAt: '2023-08-12T00:00:00Z',
    bannedBy: 'admin',
    reason: 'Spam messaging',
  },
  {
    _id: 'usr_b06pqr',
    name: 'Mariam Yousuf',
    email: 'mariam.y@gmail.com',
    phone: '03121223344',
    role: 'user',
    listings: 1,
    reportCount: 5,
    bannedAt: '2024-02-10T16:20:00Z',
    createdAt: '2023-02-05T00:00:00Z',
    bannedBy: 'admin',
    reason: 'Scam attempts via chat',
  },
  {
    _id: 'usr_b07stu',
    name: 'Danish Rehman',
    email: 'danish.r@gmail.com',
    phone: '03051223344',
    role: 'user',
    listings: 3,
    reportCount: 8,
    bannedAt: '2024-01-30T13:10:00Z',
    createdAt: '2023-01-10T00:00:00Z',
    bannedBy: 'admin',
    reason: 'Stolen vehicle listing',
  },
];

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

const AVATAR_COLORS = [
  { bg: 'rgba(108,60,225,0.1)', color: '#6C3CE1' },
  { bg: 'rgba(201,168,76,0.15)', color: '#92700a' },
  { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
  { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
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

function ReportDot({ count }) {
  const color = count >= 8 ? '#C4531F' : count >= 4 ? '#92700a' : '#8A8390';
  const bg =
    count >= 8
      ? 'rgba(232,98,42,0.1)'
      : count >= 4
        ? 'rgba(201,168,76,0.15)'
        : 'rgba(138,131,144,0.1)';
  return (
    <span
      className="inline-flex items-center gap-1 text-[0.72rem] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: bg, color, fontFamily: "'DM Sans', sans-serif" }}
    >
      <Flag size={9} strokeWidth={2.5} />
      {count}
    </span>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function BannedUsers() {
  const navigate = useNavigate();

  // TODO: replace with → const { data, isLoading } = useBannedUsers();
  const [users] = useState(MOCK_BANNED_USERS);
  const isLoading = false;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState({ msg: '', type: 'success' });
  const [modal, setModal] = useState(null); // { type: 'unban', user }
  const [actionLoading, setActionLoading] = useState({});

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast({ msg: '', type: 'success' }), 4000);
  };

  const setLoad = (id, val) => setActionLoading((p) => ({ ...p, [id]: val }));

  // ── Filter + paginate ─────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
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
  const handleUnban = async () => {
    const { user } = modal;
    setLoad(user._id, true);
    setModal(null);
    // TODO: unbanUserMutation.mutate(user._id)
    await new Promise((r) => setTimeout(r, 900));
    setLoad(user._id, false);
    showToast(`${user.name}'s account has been unbanned`);
  };

  // ── Stats ─────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const highRisk = users.filter((u) => u.reportCount >= 8).length;
    const bannedToday = users.filter((u) => {
      const diff = Date.now() - new Date(u.bannedAt).getTime();
      return diff < 86400000;
    }).length;
    return { total: users.length, highRisk, bannedToday };
  }, [users]);

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      <ConfirmModal
        open={modal?.type === 'unban'}
        title={`Unban ${modal?.user?.name}?`}
        message="Their account will be restored to active status. All listings will become visible again. Monitor their activity closely after unbanning."
        confirmLabel="Unban User"
        onConfirm={handleUnban}
        onCancel={() => setModal(null)}
      />

      <div className="max-w-245 mx-auto">
        {/* Header */}
        <div className="flex items-start justify-between mb-5 gap-4 flex-wrap">
          <div>
            <h1
              className="text-[1.35rem] font-extrabold tracking-[-0.035em]"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              Banned Users
            </h1>
            <p
              className="text-[0.8rem] mt-0.5"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              Accounts blocked from accessing Paiyya — review and unban if resolved
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
            icon={ShieldOff}
            label="Total banned"
            value={stats.total}
            accent={{ bg: 'rgba(232,98,42,0.1)', color: '#C4531F' }}
          />
          <StatCard
            icon={Flag}
            label="High-risk (8+ reports)"
            value={stats.highRisk}
            accent={{ bg: 'rgba(201,168,76,0.15)', color: '#92700a' }}
          />
          <StatCard
            icon={Gavel}
            label="Banned today"
            value={stats.bannedToday}
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

        {/* Empty state */}
        {!isLoading && filtered.length === 0 && (
          <div
            className="flex flex-col items-center justify-center gap-3 py-16 rounded-2xl"
            style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(232,98,42,0.08)' }}
            >
              <ShieldCheck size={20} strokeWidth={1.8} style={{ color: '#C4531F' }} />
            </div>
            <p
              className="text-[0.85rem] font-semibold"
              style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
            >
              {search ? 'No matching banned users' : 'No banned users'}
            </p>
            <p
              className="text-[0.75rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {search ? 'Try a different search term' : 'Banned accounts will appear here'}
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
                  gridTemplateColumns: '2fr 1.6fr 1fr 1fr 0.8fr 0.8fr auto',
                  borderBottom: '1px solid #F2EEE9',
                  background: '#FAFAF9',
                }}
              >
                {['User', 'Reason', 'Banned', 'Role', 'Reports', 'Listings', 'Actions'].map((h) => (
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
                const isUnbanning = actionLoading[u._id];

                return (
                  <div
                    key={u._id}
                    className="bu-row grid items-center px-5 py-4"
                    style={{
                      gridTemplateColumns: '2fr 1.6fr 1fr 1fr 0.8fr 0.8fr auto',
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
                          opacity: 0.7,
                        }}
                      >
                        {initials(u.name)}
                        {/* Ban indicator */}
                        <span
                          className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white flex items-center justify-center"
                          style={{ background: '#C4531F' }}
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
                        title={u.reason}
                      >
                        {u.reason || '—'}
                      </p>
                    </div>

                    {/* Banned at */}
                    <div>
                      <p
                        className="text-[0.75rem] font-medium"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {timeAgo(u.bannedAt)}
                      </p>
                      <p
                        className="text-[0.68rem]"
                        style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {formatDate(u.bannedAt)}
                      </p>
                    </div>

                    {/* Role */}
                    <div>
                      <RolePill role={u.role} />
                    </div>

                    {/* Reports */}
                    <div>
                      <ReportDot count={u.reportCount} />
                    </div>

                    {/* Listings */}
                    <div>
                      <span
                        className="text-[0.78rem] font-semibold"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {u.listings}
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
                      <button
                        type="button"
                        onClick={() => navigate(`/admin/users/${u._id}`)}
                        className="bu-action-btn"
                        title="View profile"
                        style={{ color: '#8A8390' }}
                      >
                        <Eye size={13} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setModal({ type: 'unban', user: u })}
                        disabled={isUnbanning}
                        className="bu-action-btn bu-unban"
                        title="Unban user"
                      >
                        {isUnbanning ? (
                          <span className="spinner-xs" />
                        ) : (
                          <ShieldCheck size={13} strokeWidth={2} />
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
                const isUnbanning = actionLoading[u._id];

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
                            opacity: 0.7,
                          }}
                        >
                          {initials(u.name)}
                          <span
                            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white"
                            style={{ background: '#C4531F' }}
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
                          {u.reason || 'No reason provided'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                        <span
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          Banned {timeAgo(u.bannedAt)} · {formatDate(u.bannedAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag size={11} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                        <span
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {u.reportCount} reports · {u.listings} listings
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
                        onClick={() => setModal({ type: 'unban', user: u })}
                        disabled={isUnbanning}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[0.75rem] font-semibold border transition-colors duration-150 disabled:opacity-50"
                        style={{
                          color: '#6C3CE1',
                          borderColor: 'rgba(108,60,225,0.3)',
                          background: 'rgba(108,60,225,0.06)',
                          fontFamily: "'DM Sans', sans-serif",
                        }}
                      >
                        {isUnbanning ? (
                          <span className="spinner-xs" />
                        ) : (
                          <ShieldCheck size={12} strokeWidth={2} />
                        )}
                        Unban
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
              Loading banned users…
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

  .bu-row {
    transition: background 0.1s;
  }
  .bu-row:hover {
    background: #FAFAF9;
  }

  .bu-action-btn {
    width: 30px; height: 30px;
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    border: 1.5px solid #E8E3DC;
    background: #FAFAF9;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
  }
  .bu-action-btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .bu-action-btn:hover {
    background: #F2EEE9;
    border-color: #C4BDD0;
    color: #1A1523;
  }

  .bu-unban { color: #6C3CE1; border-color: rgba(108,60,225,0.25); background: rgba(108,60,225,0.04); }
  .bu-unban:hover { background: rgba(108,60,225,0.1); border-color: rgba(108,60,225,0.4); }
`;
