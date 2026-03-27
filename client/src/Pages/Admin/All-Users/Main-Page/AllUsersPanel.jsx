import { useState, useMemo } from 'react';
import {
  Eye,
  Pencil,
  Ban,
  Search,
  X,
  Users,
  ShieldOff,
  Clock,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import ActionMenu from '../../../../Admin-Components/Dashboard/ActionMenu';
import { Link, useNavigate } from 'react-router-dom';
import { useAllUsers } from '../../../../Hooks/Admin-Hook/All-Users/useAllUsers.hook';
import SectionHeader from '../Components/SectionHeader';
import StatCard from '../Components/StatCard';
import RolePill from '../Components/RolePill';
import StatusPill from '../Components/StatusPill';
import ReportDot from '../Components/ReportDot';

const PAGE_SIZE = 5;

const getStatus = (user) => {
  if (user.isBanned) return 'banned';
  if (user.deleteAccountRequestAt) return 'pending';
  return 'active';
};

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

const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

const AVATAR_COLORS = [
  { bg: 'rgba(108,60,225,0.1)', color: '#6C3CE1' },
  { bg: 'rgba(201,168,76,0.15)', color: '#92700a' },
  { bg: 'rgba(34,197,94,0.1)', color: '#16a34a' },
  { bg: 'rgba(59,130,246,0.1)', color: '#2563eb' },
];

const STATUS_STYLES = {
  banned: { bg: 'rgba(232,98,42,0.1)', color: '#C4531F', label: 'Banned' },
  pending: { bg: 'rgba(201,168,76,0.15)', color: '#92700a', label: 'Pending' },
  active: { bg: 'rgba(34,197,94,0.1)', color: '#16a34a', label: 'Active' },
};

// ── Main component ────────────────────────────────────────────────
function AllUsersPanel() {
  const navigate = useNavigate();
  const { data, isLoading } = useAllUsers();
  const users = data?.users ?? [];

  const totalUsers = data?.stats?.totalUsers ?? 0;
  const totalBannedUsers = data?.stats?.totalBannedUsers ?? 0;
  const deleteRequests = data?.stats?.deleteRequests ?? 0;
  const usersJoinedToday = data?.stats?.usersJoinedToday ?? 0;

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const handleSearch = (v) => {
    setSearch(v);
    setPage(1);
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

  // ── Render ────────────────────────────────────────────────────
  return (
    <>
      <style>{STYLES}</style>

      <div className="max-w-400 mx-auto">
        {/* Header */}
        <SectionHeader
          title="All Users"
          subtitle={`${data?.count ?? 0} registered users on Paiyya`}
          isLoading={isLoading}
        />

        {/* Stat strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <StatCard
            icon={Users}
            label="Total users"
            value={totalUsers}
            accent={{ bg: 'rgba(108,60,225,0.08)', color: '#6C3CE1' }}
          />
          <StatCard
            icon={ShieldOff}
            label="Banned"
            value={totalBannedUsers}
            accent={{ bg: 'rgba(232,98,42,0.1)', color: '#C4531F' }}
          />
          <StatCard
            icon={Clock}
            label="Pending deletion"
            value={deleteRequests}
            accent={{ bg: 'rgba(201,168,76,0.15)', color: '#92700a' }}
          />
          <StatCard
            icon={Users}
            label="Joined today"
            value={usersJoinedToday}
            accent={{ bg: 'rgba(34,197,94,0.1)', color: '#16a34a' }}
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
              {search ? 'No matching users' : 'No users yet'}
            </p>
            <p
              className="text-[0.75rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {search ? 'Try a different search term' : 'Registered users will appear here'}
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
                  gridTemplateColumns: '2fr 1fr 1fr 1.2fr 0.8fr 0.8fr auto',
                  borderBottom: '1px solid #F2EEE9',
                  background: '#FAFAF9',
                }}
              >
                {['User', 'Role', 'Status', 'Joined', 'Reports', 'Listings', 'Actions'].map((h) => (
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
                const status = getStatus(u);
                return (
                  <div
                    key={u._id}
                    onClick={() => navigate(`/admin/users/${u._id}`)}
                    className="au-row grid items-center px-5 py-4 cursor-pointer"
                    style={{
                      gridTemplateColumns: '2fr 1fr 1fr 1.2fr 0.8fr 0.8fr auto',
                      borderBottom: i < paginated.length - 1 ? '1px solid #F2EEE9' : 'none',
                    }}
                  >
                    {/* User */}
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

                    {/* Role */}
                    <div>
                      <RolePill role={u.role} />
                    </div>

                    {/* Status */}
                    <div>
                      <StatusPill status={status} statusStyles={STATUS_STYLES} />
                    </div>

                    {/* Joined */}
                    <div>
                      <p
                        className="text-[0.75rem] font-medium"
                        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {timeAgo(u.createdAt)}
                      </p>
                      <p
                        className="text-[0.68rem]"
                        style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {formatDate(u.createdAt)}
                      </p>
                    </div>

                    {/* Reports */}
                    <div>
                      <ReportDot count={u.reportCount ?? 0} />
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
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <ActionMenu
                        actions={[
                          {
                            label: 'View Profile',
                            icon: Eye,
                            onClick: (e) => {
                              navigate(`/admin/users/${u._id}`);
                            },
                          },
                          { label: 'Edit', icon: Pencil },
                          { label: u.isBanned ? 'Unban' : 'Ban', icon: Ban, danger: true },
                        ]}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {paginated.map((u, i) => {
                const avatarColor = AVATAR_COLORS[i % AVATAR_COLORS.length];
                const status = getStatus(u);

                return (
                  <div
                    key={u._id}
                    onClick={() => navigate(`/admin/users/${u._id}`)}
                    className="rounded-2xl p-4 cursor-pointer"
                    style={{ background: '#FFFFFF', border: '1.5px solid #E8E3DC' }}
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
                      <StatusPill status={status} statusStyles={STATUS_STYLES} />
                    </div>

                    {/* Meta */}
                    <div
                      className="flex items-center justify-between pt-3"
                      style={{ borderTop: '1px solid #F2EEE9' }}
                    >
                      <div className="flex items-center gap-2">
                        <RolePill role={u.role} />
                        <ReportDot count={u.reportCount ?? 0} />
                        <span
                          className="text-[0.72rem]"
                          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {u.listings ?? 0} listings
                        </span>
                      </div>
                      <span
                        className="text-[0.72rem]"
                        style={{ color: '#C4BDD0', fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {timeAgo(u.createdAt)}
                      </span>
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
              Loading users…
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default AllUsersPanel;

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .au-row { transition: background 0.1s; }
  .au-row:hover { background: #FAFAF9; }
`;
