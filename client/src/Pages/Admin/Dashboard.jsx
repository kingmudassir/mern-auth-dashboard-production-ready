import { useState, useEffect } from 'react';
import {
  Users,
  Car,
  ShieldOff,
  Clock,
  TrendingUp,
  TrendingDown,
  Flag,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MoreHorizontal,
  ArrowUpRight,
  Activity,
  DollarSign,
  MapPin,
} from 'lucide-react';

// ── Mock Data ─────────────────────────────────────────────────────
const STATS = [
  {
    id: 'total_users',
    label: 'Total Users',
    value: '24,891',
    change: '+12.4%',
    trend: 'up',
    sub: 'vs last month',
    icon: Users,
    accent: '#6C3CE1',
    bg: 'rgba(108,60,225,0.08)',
  },
  {
    id: 'active_listings',
    label: 'Active Listings',
    value: '8,342',
    change: '+7.1%',
    trend: 'up',
    sub: 'vs last month',
    icon: Car,
    accent: '#2563EB',
    bg: 'rgba(37,99,235,0.08)',
  },
  {
    id: 'banned_users',
    label: 'Banned Users',
    value: '183',
    change: '+3.2%',
    trend: 'up',
    sub: 'vs last month',
    icon: ShieldOff,
    accent: '#E8622A',
    bg: 'rgba(232,98,42,0.08)',
  },
  {
    id: 'pending_approval',
    label: 'Pending Approval',
    value: '56',
    change: '-18.7%',
    trend: 'down',
    sub: 'vs last month',
    icon: Clock,
    accent: '#059669',
    bg: 'rgba(5,150,105,0.08)',
  },
];

const RECENT_USERS = [
  {
    id: 1,
    name: 'Malaika Khan',
    email: 'malaika.k@gmail.com',
    city: 'Karachi',
    listings: 3,
    status: 'active',
    joined: '2 min ago',
    avatar: 'AK',
  },
  {
    id: 2,
    name: 'Bilal Raza',
    email: 'bilal.raza@outlook.com',
    city: 'Lahore',
    listings: 1,
    status: 'active',
    joined: '14 min ago',
    avatar: 'BR',
  },
  {
    id: 3,
    name: 'Khan Mirza',
    email: 'sana.m@gmail.com',
    city: 'Islamabad',
    listings: 0,
    status: 'pending',
    joined: '1 hr ago',
    avatar: 'SM',
  },
  {
    id: 4,
    name: 'Usman Tariq',
    email: 'usmantariq@yahoo.com',
    city: 'Rawalpindi',
    listings: 5,
    status: 'active',
    joined: '2 hr ago',
    avatar: 'UT',
  },
  {
    id: 5,
    name: 'Hina Baig',
    email: 'hina.baig@gmail.com',
    city: 'Faisalabad',
    listings: 2,
    status: 'banned',
    joined: '3 hr ago',
    avatar: 'HB',
  },
  {
    id: 6,
    name: 'Kamran Ali',
    email: 'k.ali@hotmail.com',
    city: 'Multan',
    listings: 0,
    status: 'active',
    joined: '5 hr ago',
    avatar: 'KA',
  },
];

const RECENT_LISTINGS = [
  {
    id: 1,
    title: 'Toyota Corolla 2021',
    price: 'PKR 42L',
    seller: 'Ayesha Khan',
    city: 'Karachi',
    status: 'pending',
    posted: '5 min ago',
    img: '🚗',
  },
  {
    id: 2,
    title: 'Honda Civic 2020',
    price: 'PKR 55L',
    seller: 'Bilal Raza',
    city: 'Lahore',
    status: 'flagged',
    posted: '22 min ago',
    img: '🚙',
  },
  {
    id: 3,
    title: 'Suzuki Alto 2022',
    price: 'PKR 21L',
    seller: 'Usman Tariq',
    city: 'Rawalpindi',
    status: 'approved',
    posted: '1 hr ago',
    img: '🚘',
  },
  {
    id: 4,
    title: 'Kia Sportage 2023',
    price: 'PKR 98L',
    seller: 'Kamran Ali',
    city: 'Multan',
    status: 'pending',
    posted: '2 hr ago',
    img: '🚕',
  },
  {
    id: 5,
    title: 'Toyota Prado 2019',
    price: 'PKR 1.8Cr',
    seller: 'Sana Mirza',
    city: 'Islamabad',
    status: 'approved',
    posted: '4 hr ago',
    img: '🛻',
  },
];

const REPORTS = [
  {
    id: 1,
    type: 'Fraudulent Listing',
    target: 'Honda Civic 2020',
    reporter: 'M. Farhan',
    priority: 'high',
    time: '10 min ago',
  },
  {
    id: 2,
    type: 'Fake Seller',
    target: 'Hina Baig',
    reporter: 'A. Siddiqui',
    priority: 'high',
    time: '45 min ago',
  },
  {
    id: 3,
    type: 'Wrong Price',
    target: 'Toyota Prado 2019',
    reporter: 'Z. Ahmed',
    priority: 'low',
    time: '2 hr ago',
  },
  {
    id: 4,
    type: 'Spam Listing',
    target: 'Mehran 2015',
    reporter: 'S. Naqvi',
    priority: 'medium',
    time: '3 hr ago',
  },
];

const WEEKLY_DATA = [
  { day: 'Mon', users: 34, listings: 82 },
  { day: 'Tue', users: 51, listings: 110 },
  { day: 'Wed', users: 46, listings: 95 },
  { day: 'Thu', users: 72, listings: 140 },
  { day: 'Fri', users: 89, listings: 172 },
  { day: 'Sat', users: 103, listings: 198 },
  { day: 'Sun', users: 67, listings: 131 },
];

const TOP_CITIES = [
  { city: 'Karachi', listings: 2841, pct: 34 },
  { city: 'Lahore', listings: 2108, pct: 25 },
  { city: 'Islamabad', listings: 1347, pct: 16 },
  { city: 'Rawalpindi', listings: 923, pct: 11 },
  { city: 'Faisalabad', listings: 671, pct: 8 },
  { city: 'Multan', listings: 452, pct: 5.4 },
];

// ── Helpers ───────────────────────────────────────────────────────
const STATUS_CONFIG = {
  active: { label: 'Active', dot: '#059669', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
  pending: { label: 'Pending', dot: '#D97706', bg: 'rgba(217,119,6,0.08)', text: '#D97706' },
  banned: { label: 'Banned', dot: '#DC2626', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  flagged: { label: 'Flagged', dot: '#E8622A', bg: 'rgba(232,98,42,0.08)', text: '#E8622A' },
  approved: { label: 'Approved', dot: '#059669', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
};

const PRIORITY_CONFIG = {
  high: { label: 'High', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  medium: { label: 'Med', bg: 'rgba(217,119,6,0.08)', text: '#D97706' },
  low: { label: 'Low', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.active;
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

function AvatarBubble({ initials: text, size = 32, accent = '#6C3CE1' }) {
  const colors = {
    AK: '#6C3CE1',
    BR: '#2563EB',
    SM: '#059669',
    UT: '#D97706',
    HB: '#DC2626',
    KA: '#0891B2',
  };
  const bg = colors[text] || accent;
  return (
    <div
      className="rounded-xl flex items-center justify-center font-bold text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: bg,
        fontSize: size * 0.3,
        fontFamily: "'Syne', sans-serif",
      }}
    >
      {text}
    </div>
  );
}

// ── Mini Bar Chart ────────────────────────────────────────────────
function MiniBarChart({ data }) {
  const maxListings = Math.max(...data.map((d) => d.listings));
  const maxUsers = Math.max(...data.map((d) => d.users));
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

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-PK', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <style>{CSS}</style>

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
        <div className="stat-grid mb-6">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.id} className="stat-card" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: s.bg }}
                  >
                    <Icon size={16} strokeWidth={2} style={{ color: s.accent }} />
                  </div>
                  <span
                    className="flex items-center gap-1 text-[0.72rem] font-semibold"
                    style={{
                      color: s.trend === 'up' ? '#059669' : '#DC2626',
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {s.trend === 'up' ? (
                      <TrendingUp size={12} strokeWidth={2} />
                    ) : (
                      <TrendingDown size={12} strokeWidth={2} />
                    )}
                    {s.change}
                  </span>
                </div>
                <p className="stat-value">{s.value}</p>
                <p className="stat-label">{s.label}</p>
                <p className="stat-sub">{s.sub}</p>
              </div>
            );
          })}
        </div>

        {/* ── Row 2: Chart + Reports ── */}
        <div className="two-col mb-6">
          {/* Weekly Activity Chart */}
          <div className="card">
            <div className="card-header">
              <div>
                <p className="card-title">Weekly Activity</p>
                <p className="card-sub">New listings & signups this week</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="legend-dot" style={{ '--c': 'rgba(108,60,225,0.7)' }}>
                  Listings
                </span>
                <span className="legend-dot" style={{ '--c': 'rgba(232,98,42,0.6)' }}>
                  Users
                </span>
              </div>
            </div>
            <MiniBarChart data={WEEKLY_DATA} />
            <div
              className="flex justify-between mt-4 pt-4"
              style={{ borderTop: '1px solid #F2EEE9' }}
            >
              {[
                { label: 'Listings this week', value: '928', icon: Car, color: '#6C3CE1' },
                { label: 'New users this week', value: '462', icon: Users, color: '#E8622A' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: `${color}14` }}
                  >
                    <Icon size={13} style={{ color }} />
                  </div>
                  <div>
                    <p
                      className="text-[0.78rem] font-bold text-[#1A1523]"
                      style={{ fontFamily: "'Syne', sans-serif" }}
                    >
                      {value}
                    </p>
                    <p
                      className="text-[0.65rem] text-[#8A8390]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reports Queue */}
          <div className="card">
            <div className="card-header mb-4">
              <div>
                <p className="card-title">Reports Queue</p>
                <p className="card-sub">Needs your attention</p>
              </div>
              <a href="/admin/reports" className="view-all">
                View all <ArrowUpRight size={11} />
              </a>
            </div>
            <div className="flex flex-col gap-2.5">
              {REPORTS.map((r) => {
                const pri = PRIORITY_CONFIG[r.priority];
                return (
                  <div key={r.id} className="report-row">
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
              })}
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
              {RECENT_USERS.map((u) => (
                <div key={u.id} className="user-row">
                  <AvatarBubble initials={u.avatar} size={34} />
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
                    <StatusBadge status={u.status} />
                    <span className="text-[0.62rem] text-[#C4BDD0]">{u.joined}</span>
                  </div>
                </div>
              ))}
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
              {RECENT_LISTINGS.map((l) => (
                <div key={l.id} className="user-row">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: '#F2EEE9' }}
                  >
                    {l.img}
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
                      {l.seller} · {l.city}
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
                  desc: '56 listings waiting',
                  href: '/admin/listings/pending',
                  icon: Clock,
                  accent: '#D97706',
                  bg: 'rgba(217,119,6,0.08)',
                },
                {
                  label: 'Flagged Content',
                  desc: '12 items flagged',
                  href: '/admin/listings/flagged',
                  icon: Flag,
                  accent: '#E8622A',
                  bg: 'rgba(232,98,42,0.08)',
                },
                {
                  label: 'Banned Users',
                  desc: '183 accounts',
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
                  desc: '28 open reports',
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
    </>
  );
}

// ── CSS ───────────────────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .dashboard-root {
    font-family: 'DM Sans', sans-serif;
    max-width: 1280px;
  }

  /* Header */
  .dash-title {
    font-family: 'Syne', sans-serif;
    font-size: 1.55rem;
    font-weight: 800;
    color: #1A1523;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin: 0 0 4px;
  }
  .dash-sub {
    font-size: 0.78rem;
    color: #8A8390;
    margin: 0;
  }
  .dash-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #059669;
    background: rgba(5,150,105,0.08);
    border: 1px solid rgba(5,150,105,0.15);
    padding: 5px 10px;
    border-radius: 20px;
    font-family: 'DM Sans', sans-serif;
  }

  /* Stat grid */
  .stat-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
  }
  @media (max-width: 900px) { .stat-grid { grid-template-columns: repeat(2, 1fr); } }
  @media (max-width: 500px) { .stat-grid { grid-template-columns: 1fr; } }

  .stat-card {
    background: #fff;
    border: 1px solid #E8E3DC;
    border-radius: 16px;
    padding: 18px;
    animation: fadeSlideUp 0.4s ease both;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
  }
  .stat-card:hover {
    box-shadow: 0 4px 20px rgba(26,21,35,0.08);
    transform: translateY(-1px);
  }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 1.7rem;
    font-weight: 800;
    color: #1A1523;
    letter-spacing: -0.04em;
    margin: 0 0 2px;
    line-height: 1;
  }
  .stat-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: #1A1523;
    margin: 0 0 2px;
  }
  .stat-sub {
    font-size: 0.65rem;
    color: #8A8390;
    margin: 0;
  }

  /* Cards */
  .card {
    background: #fff;
    border: 1px solid #E8E3DC;
    border-radius: 16px;
    padding: 20px;
    transition: box-shadow 0.2s ease;
  }
  .card:hover { box-shadow: 0 4px 20px rgba(26,21,35,0.06); }

  .card-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 8px;
  }
  .card-title {
    font-family: 'Syne', sans-serif;
    font-size: 0.9rem;
    font-weight: 700;
    color: #1A1523;
    letter-spacing: -0.025em;
    margin: 0 0 2px;
  }
  .card-sub {
    font-size: 0.68rem;
    color: #8A8390;
    margin: 0;
  }
  .view-all {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 0.72rem;
    font-weight: 600;
    color: #6C3CE1;
    text-decoration: none;
    white-space: nowrap;
    transition: opacity 0.15s;
  }
  .view-all:hover { opacity: 0.7; }

  /* Two-col layout */
  .two-col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  @media (max-width: 800px) { .two-col { grid-template-columns: 1fr; } }

  /* Rows */
  .user-row, .report-row {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 10px;
    border-radius: 10px;
    transition: background 0.15s;
  }
  .user-row:hover, .report-row:hover {
    background: #F7F4F0;
  }

  /* Legend */
  .legend-dot {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-size: 0.68rem;
    color: #8A8390;
  }
  .legend-dot::before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 2px;
    background: var(--c);
  }

  /* City bars */
  .city-bar-track {
    height: 4px;
    background: #F2EEE9;
    border-radius: 4px;
    overflow: hidden;
  }
  .city-bar-fill {
    height: 100%;
    border-radius: 4px;
    transition: width 0.6s ease;
  }

  /* Quick actions grid */
  .quick-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }
  @media (max-width: 600px) { .quick-grid { grid-template-columns: repeat(2, 1fr); } }

  .quick-card {
    background: #F7F4F0;
    border: 1px solid #E8E3DC;
    border-radius: 12px;
    padding: 14px 12px;
    text-decoration: none;
    display: block;
    transition: background 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .quick-card:hover {
    background: #fff;
    box-shadow: 0 4px 16px rgba(26,21,35,0.08);
    transform: translateY(-1px);
  }

  /* Animations */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;
