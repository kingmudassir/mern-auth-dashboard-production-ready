// FILE: pages/Admin/Dashboard/Dashboard.jsx
import { useState, useEffect } from 'react';
import {
  Users,
  Car,
  ShieldOff,
  Clock,
  Flag,
  AlertTriangle,
  ArrowUpRight,
  Activity,
  MapPin,
} from 'lucide-react';
import { useAllListings } from '../../../Hooks/Admin-Hook/All-Listings/useAllListings';
import { useAdminStats } from '../../../Hooks/Admin-Hook/useAdminStats';
import StatCards from '../Components/StatCards';
import WeeklyActivityCard from '../Components/WeeklyActivityCard';

// ── Static ────────────────────────────────────────────────────────
const TOP_CITIES = [
  { city: 'Karachi', listings: 2841, pct: 34 },
  { city: 'Lahore', listings: 2108, pct: 25 },
  { city: 'Islamabad', listings: 1347, pct: 16 },
  { city: 'Rawalpindi', listings: 923, pct: 11 },
  { city: 'Faisalabad', listings: 671, pct: 8 },
  { city: 'Multan', listings: 452, pct: 5.4 },
];

const STATUS_CONFIG = {
  active: { label: 'Active', dot: '#059669', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
  pending: { label: 'Pending', dot: '#D97706', bg: 'rgba(217,119,6,0.08)', text: '#D97706' },
  rejected: { label: 'Rejected', dot: '#DC2626', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  sold: { label: 'Sold', dot: '#6B7280', bg: 'rgba(107,114,128,0.08)', text: '#6B7280' },
  banned: { label: 'Banned', dot: '#DC2626', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  flagged: { label: 'Flagged', dot: '#E8622A', bg: 'rgba(232,98,42,0.08)', text: '#E8622A' },
  approved: { label: 'Approved', dot: '#059669', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
};

const PRIORITY_CONFIG = {
  high: { label: 'High', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  medium: { label: 'Med', bg: 'rgba(217,119,6,0.08)', text: '#D97706' },
  low: { label: 'Low', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
};

// ── Helpers ───────────────────────────────────────────────────────
const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || '??';

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[0.7rem] font-semibold"
      style={{ background: cfg.bg, color: cfg.text, fontFamily: "'DM Sans', sans-serif" }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
      {cfg.label}
    </span>
  );
}

function AvatarBubble({ name = '', size = 32 }) {
  // Deterministic color from name string so it's stable across renders
  const COLORS = [
    '#6C3CE1',
    '#2563EB',
    '#059669',
    '#D97706',
    '#DC2626',
    '#0891B2',
    '#7C3AED',
    '#E8622A',
  ];
  const idx = name.charCodeAt(0) % COLORS.length || 0;
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: COLORS[idx],
        fontSize: size * 0.3,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {initials(name)}
    </div>
  );
}

function MiniBarChart({ data }) {
  const maxListings = Math.max(...data.map((d) => d.listings), 1);
  const maxUsers = Math.max(...data.map((d) => d.users), 1);
  return (
    <div className="flex items-end gap-1.5 h-20">
      {data.map((d, i) => (
        <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex gap-0.5 items-end" style={{ height: '60px' }}>
            <div
              className="flex-1 rounded-sm transition-all duration-500"
              style={{
                height: `${(d.listings / maxListings) * 60}px`,
                background: 'rgba(108,60,225,0.7)',
                animationDelay: `${i * 50}ms`,
              }}
            />
            <div
              className="flex-1 rounded-sm transition-all duration-500"
              style={{
                height: `${(d.users / maxUsers) * 60}px`,
                background: 'rgba(232,98,42,0.6)',
                animationDelay: `${i * 50 + 25}ms`,
              }}
            />
          </div>
          <span
            className="text-[0.58rem]"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            {d.day}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────
export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const { data: statsData } = useAdminStats();
  const { data: listingsData } = useAllListings({ limit: 5 });

  const s = statsData?.stats;

  const formatChange = (pct, dir) => {
    if (pct === undefined || pct === null) return '';
    if (pct > 0) return `+${pct}%`;
    if (pct < 0) return `${pct}%`;
    if (dir === 'up') return '+0%';
    if (dir === 'down') return '-0%';
    return '';
  };

  // ── Stat cards (all real data) ────────────────────────────────
  const statCards = [
    {
      id: 'total_users',
      label: 'Total Users',
      value: s?.totals?.users ?? '—',
      sub: 'vs last month',
      change: formatChange(s?.activeUsers?.trend, s?.activeUsers?.direction),
      trend: s?.activeUsers?.direction ?? 'neutral',
      icon: Users,
      bg: 'rgba(108,60,225,0.08)',
      accent: '#6C3CE1',
    },
    {
      id: 'active_listings',
      label: 'Active Listings',
      value: s?.totals?.activeListings ?? '—',
      sub: 'vs last month',
      change: formatChange(s?.activeListings?.trend, s?.activeListings?.direction),
      trend: s?.activeListings?.direction ?? 'neutral',
      icon: Car,
      accent: '#2563EB',
      bg: 'rgba(37,99,235,0.08)',
    },
    {
      id: 'banned_users',
      label: 'Banned Users',
      value: s?.totals?.bannedUsers ?? '—',
      sub: 'vs last month',
      change: formatChange(s?.bannedUsers?.trend, s?.bannedUsers?.direction),
      trend: s?.bannedUsers?.direction ?? 'neutral',
      icon: ShieldOff,
      accent: '#E8622A',
      bg: 'rgba(232,98,42,0.08)',
    },
    {
      id: 'pending_approval',
      label: 'Pending Approval',
      value: s?.totals?.pendingListings ?? '—',
      sub: 'vs last month',
      change: formatChange(s?.pendingListings?.trend, s?.pendingListings?.direction),
      trend: s?.pendingListings?.direction ?? 'neutral',
      icon: Clock,
      accent: '#059669',
      bg: 'rgba(5,150,105,0.08)',
    },
  ];

  // ── Chart ─────────────────────────────────────────────────────
  const weeklyData = s?.weeklyActivity || [];
  const legends = [
    { label: 'Listings', color: 'rgba(108,60,225,0.7)' },
    { label: 'Users', color: 'rgba(232,98,42,0.6)' },
  ];
  const weeklyStats = [
    {
      label: 'New listings this week',
      value: weeklyData.reduce((a, d) => a + (d.listings || 0), 0),
      icon: Car,
      color: '#6C3CE1',
    },
    {
      label: 'New users this week',
      value: s?.newUsers?.thisWeek ?? 0,
      icon: Users,
      color: '#E8622A',
    },
  ];

  // ── Reports queue (from backend via stats endpoint) ───────────
  const reports = s?.recentReports || [];

  // ── Recent users ──────────────────────────────────────────────
  const recentUsers = s?.recentUsers || [];

  // ── Recent listings (prefer stats endpoint, fall back to useAllListings) ──
  const recentListings = s?.recentListings || listingsData?.listings?.slice(0, 5) || [];

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-PK', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className="dashboard-root"
      style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-7 flex-wrap gap-3">
        <div>
          <h1 className="dash-title">Overview</h1>
          <p className="dash-sub">
            {dateStr} · {timeStr}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="dash-badge">
            <Activity size={12} strokeWidth={2} />
            All systems operational
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <StatCards stats={statCards} />

      {/* ── Row 2: Chart + Reports Queue ── */}
      <div className="two-col mb-6">
        <WeeklyActivityCard
          data={weeklyData}
          legends={legends}
          stats={weeklyStats}
          ChartComponent={MiniBarChart}
        />

        {/* Reports Queue */}
        <div className="card">
          <div className="card-header mb-4">
            <div>
              <p className="card-title">Reports Queue</p>
              <p className="card-sub">{s?.totals?.openReports ?? 0} open · needs attention</p>
            </div>
            <a href="/admin/reports" className="view-all">
              View all <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="flex flex-col gap-2.5">
            {reports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <Flag size={20} className="mb-2" style={{ color: '#C4BDD0' }} />
                <p className="text-[0.75rem]" style={{ color: '#8A8390' }}>
                  No open reports
                </p>
              </div>
            ) : (
              reports.map((r) => {
                const pri = PRIORITY_CONFIG[r.priority] || PRIORITY_CONFIG.low;
                return (
                  <div key={r._id} className="report-row">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: pri.bg }}
                    >
                      <AlertTriangle size={13} strokeWidth={2} style={{ color: pri.text }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-[0.78rem] font-semibold text-[#1A1523] truncate"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {r.type}
                      </p>
                      <p
                        className="text-[0.68rem] text-[#8A8390] truncate"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        {r.target} · by {r.reporter}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0">
                      <span
                        className="text-[0.65rem] font-semibold px-1.5 py-0.5 rounded"
                        style={{ background: pri.bg, color: pri.text }}
                      >
                        {pri.label}
                      </span>
                      <span className="text-[0.62rem] text-[#C4BDD0]">{r.time}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* ── Row 3: Recent Users + Recent Listings ── */}
      <div className="two-col mb-6">
        {/* Recent Users */}
        <div className="card">
          <div className="card-header mb-4">
            <div>
              <p className="card-title">Recent Sign-ups</p>
              <p className="card-sub">Latest registered accounts</p>
            </div>
            <a href="/admin/users" className="view-all">
              View all <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {recentUsers.length > 0 ? (
              recentUsers.map((u) => (
                <div key={u._id} className="user-row">
                  <AvatarBubble name={u.name} size={34} />
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-[0.8rem] font-semibold text-[#1A1523] truncate"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {u.name}
                    </p>
                    <p
                      className="text-[0.67rem] text-[#8A8390] truncate"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {u.email}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <StatusBadge status="active" />
                    <span className="text-[0.62rem] text-[#C4BDD0]">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-[#E5E7EB] rounded-xl bg-[#F9FAFB]">
                <Users size={24} className="text-[#C4BDD0] mb-2" />
                <p className="text-[0.75rem] font-medium text-[#8A8390]">No recent sign-ups</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Listings */}
        <div className="card">
          <div className="card-header mb-4">
            <div>
              <p className="card-title">Recent Listings</p>
              <p className="card-sub">Latest submitted vehicles</p>
            </div>
            <a href="/admin/listings" className="view-all">
              View all <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {recentListings.map((l, i) => (
              <div key={l._id || i} className="user-row">
                <div
                  className="w-9 h-9 rounded-xl overflow-hidden shrink-0"
                  style={{ background: '#F2EEE9' }}
                >
                  {l.img ? (
                    <img src={l.img} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-lg">🚗</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[0.8rem] font-semibold text-[#1A1523] truncate"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {l.title}
                  </p>
                  <p
                    className="text-[0.67rem] text-[#8A8390] truncate"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <span style={{ color: '#6C3CE1', fontWeight: 600 }}>{l.price}</span> ·{' '}
                    {l.seller?.name || l.seller} · {l.city}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <StatusBadge status={l.status} />
                  <span className="text-[0.62rem] text-[#C4BDD0]">{l.posted}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 4: Top Cities + Quick Actions ── */}
      <div className="two-col">
        {/* Top Cities */}
        <div className="card">
          <div className="card-header mb-4">
            <div>
              <p className="card-title">Listings by City</p>
              <p className="card-sub">Top performing locations</p>
            </div>
            <a href="/admin/catalogue/cities" className="view-all">
              Manage <ArrowUpRight size={11} />
            </a>
          </div>
          <div className="flex flex-col gap-3">
            {TOP_CITIES.map((c, i) => (
              <div key={c.city}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[0.6rem] font-bold"
                      style={{
                        background: i === 0 ? 'rgba(108,60,225,0.12)' : '#F2EEE9',
                        color: i === 0 ? '#6C3CE1' : '#8A8390',
                        fontFamily: "'Syne', sans-serif",
                      }}
                    >
                      {i + 1}
                    </span>
                    <span
                      className="text-[0.78rem] font-medium text-[#1A1523]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {c.city}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[0.72rem] font-semibold text-[#1A1523]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {c.listings.toLocaleString()}
                    </span>
                    <span
                      className="text-[0.65rem] text-[#8A8390]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {c.pct}%
                    </span>
                  </div>
                </div>
                <div className="city-bar-track">
                  <div
                    className="city-bar-fill"
                    style={{
                      width: `${c.pct}%`,
                      background:
                        i === 0
                          ? 'linear-gradient(90deg, #6C3CE1, #9B7FF4)'
                          : i === 1
                            ? 'rgba(108,60,225,0.5)'
                            : 'rgba(108,60,225,0.25)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <div className="card-header mb-4">
            <div>
              <p className="card-title">Quick Actions</p>
              <p className="card-sub">Common admin tasks</p>
            </div>
          </div>
          <div className="quick-grid">
            {[
              {
                label: 'Review Pending',
                desc: `${s?.totals?.pendingListings ?? 0} listings waiting`,
                href: '/admin/listings/pending',
                icon: Clock,
                accent: '#D97706',
                bg: 'rgba(217,119,6,0.08)',
              },
              {
                label: 'Flagged Content',
                desc: 'View flagged ads',
                href: '/admin/listings/flagged',
                icon: Flag,
                accent: '#E8622A',
                bg: 'rgba(232,98,42,0.08)',
              },
              {
                label: 'Banned Users',
                desc: `${s?.totals?.bannedUsers ?? 0} accounts`,
                href: '/admin/users/banned',
                icon: ShieldOff,
                accent: '#DC2626',
                bg: 'rgba(220,38,38,0.08)',
              },
              {
                label: 'Add City',
                desc: 'Expand coverage',
                href: '/admin/catalogue/cities',
                icon: MapPin,
                accent: '#0891B2',
                bg: 'rgba(8,145,178,0.08)',
              },
              {
                label: 'All Reports',
                desc: `${s?.totals?.openReports ?? 0} open reports`,
                href: '/admin/reports',
                icon: AlertTriangle,
                accent: '#7C3AED',
                bg: 'rgba(124,58,237,0.08)',
              },
              {
                label: 'Admin Accounts',
                desc: 'Manage admins',
                href: '/admin/accounts',
                icon: Users,
                accent: '#059669',
                bg: 'rgba(5,150,105,0.08)',
              },
            ].map(({ label, desc, href, icon: Icon, accent, bg }) => (
              <a key={label} href={href} className="quick-card">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                  style={{ background: bg }}
                >
                  <Icon size={15} strokeWidth={2} style={{ color: accent }} />
                </div>
                <p
                  className="text-[0.78rem] font-semibold text-[#1A1523] leading-tight"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {label}
                </p>
                <p
                  className="text-[0.65rem] text-[#8A8390] mt-0.5"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {desc}
                </p>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
