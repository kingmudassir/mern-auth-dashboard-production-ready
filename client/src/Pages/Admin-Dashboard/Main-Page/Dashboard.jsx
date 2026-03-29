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
import { useAllUsers } from '../../../Hooks/Admin-Hook/useAllUsers';
import { useAllListings } from '../../../Hooks/Admin-Hook/All-Listings/useAllListings';
import { useReports } from '../../../Hooks/Admin-Hook/Reports/useReports';
import { useAdminStats } from '../../../Hooks/Admin-Hook/useAdminStats';
import StatCards from '../Components/StatCards';
import WeeklyActivityCard from '../Components/WeeklyActivityCard';

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

const TOP_CITIES = [
  { city: 'Karachi', listings: 2841, pct: 34 },
  { city: 'Lahore', listings: 2108, pct: 25 },
  { city: 'Islamabad', listings: 1347, pct: 16 },
  { city: 'Rawalpindi', listings: 923, pct: 11 },
  { city: 'Faisalabad', listings: 671, pct: 8 },
  { city: 'Multan', listings: 452, pct: 5.4 },
];

//TODO: This will stay.
const STATUS_CONFIG = {
  active: { label: 'Active', dot: '#059669', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
  pending: { label: 'Pending', dot: '#D97706', bg: 'rgba(217,119,6,0.08)', text: '#D97706' },
  banned: { label: 'Banned', dot: '#DC2626', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  flagged: { label: 'Flagged', dot: '#E8622A', bg: 'rgba(232,98,42,0.08)', text: '#E8622A' },
  approved: { label: 'Approved', dot: '#059669', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
};

//TODO: This will stay.
const PRIORITY_CONFIG = {
  high: { label: 'High', bg: 'rgba(220,38,38,0.08)', text: '#DC2626' },
  medium: { label: 'Med', bg: 'rgba(217,119,6,0.08)', text: '#D97706' },
  low: { label: 'Low', bg: 'rgba(5,150,105,0.08)', text: '#059669' },
};

//TODO: This will go.
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

const initials = (name = '') => {
  if (!name) return '??'; // Fallback for missing names
  return name
    .split(' ')
    .filter(Boolean) // Remove extra spaces
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
};

//TODO: This will be replaced by a function that gets only first two initials from the name and puts them as the image.
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

//TODO: Fetch real data here. Fetch listings of this week. Fetch new users from this week. [New listings = Purple] [New users = Orange].
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

  // Fetch real data
  const { data: statsData } = useAdminStats();
  const { data: usersData } = useAllUsers();
  const { data: listingsData } = useAllListings({ limit: 5 });
  const { data: reportsData } = useReports({ status: 'open', limit: 5 });

  const stats = STATS;

  const recentUsers =
    usersData?.users
      ?.filter((u) => u.status === 'active' || (!u.isBanned && u.isAccountVerified))
      ?.slice(0, 6) || [];
  const recentListings = listingsData?.listings?.slice(0, 5) || RECENT_LISTINGS;
  const reports = reportsData?.reports || REPORTS;

  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-PK', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('en-PK', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formatChange = (percentage, direction) => {
    if (percentage > 0) return `+${percentage}%`;
    if (percentage < 0) return `${percentage}%`;
    if (direction === 'up') return '+0%';
    if (direction === 'down') return '-0%';
    return ''; // neutral
  };

  //TODO:WORKING HERE RIGHT NOW
  //TOTAL USERS STATS CARD LOGIC
  const totalUsers = statsData?.stats?.totals?.users || 0;
  const totalUsersTrend = statsData?.stats?.activeUsers?.trend ?? 0;
  const totalUsersDirection = statsData?.stats?.activeUsers?.direction ?? 'neutral';

  //Banned USERS STATS CARD LOGIC
  const bannedUsers = statsData?.stats?.totals?.bannedUsers || 0;
  const bannedUsersTrend = statsData?.stats?.bannedUsers?.trend ?? 0;
  const bannedUsersDirection = statsData?.stats?.bannedUsers?.direction ?? 'neutral';
  const data_for_status_cards = [
    {
      id: 'total_users',
      label: 'Total Users',
      value: totalUsers || 0,
      sub: 'vs last month',
      change: formatChange(totalUsersTrend),
      trend: totalUsersDirection,
      icon: Users,
      bg: 'rgba(108,60,225,0.08)',
      accent: '#6C3CE1',
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
      value: bannedUsers || 0,
      change: formatChange(bannedUsersTrend, bannedUsersDirection),
      trend: bannedUsersDirection,
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

  //TODO:WORKING HERE RIGHT NOW
  //WEEKLY CHART CARD LOGIC
  const newUsersThisWeek = statsData?.stats?.newUsers?.thisWeek ?? 0;

  const legends = [
    { label: 'Listings', color: 'rgba(108,60,225,0.7)' },
    { label: 'Users', color: 'rgba(232,98,42,0.6)' },
  ];

  const weeklystats = [
    { label: 'Listings this week', value: '928', icon: Car, color: '#6C3CE1' },
    { label: 'New users this week', value: newUsersThisWeek, icon: Users, color: '#E8622A' },
  ];

  const weeklyData = statsData?.stats?.weeklyActivity || [];

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
      <StatCards stats={data_for_status_cards} />
      {/* ── Row 2: Chart + Reports ── */}
      <div className="two-col mb-6">
        {/* Weekly Activity Chart */}
        <WeeklyActivityCard
          data={weeklyData}
          legends={legends}
          stats={weeklystats}
          ChartComponent={MiniBarChart}
        />
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
            {reports.map((r) => {
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
            {recentUsers.length > 0 ? (
              recentUsers.map((u, i) => (
                <div key={i} className="user-row">
                  <AvatarBubble initials={initials(u.name)} size={34} />
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
              ))
            ) : (
              /* Empty State Component */
              <div className="flex flex-col items-center justify-center py-8 px-4 border border-dashed border-[#E5E7EB] rounded-xl bg-[#F9FAFB]">
                <Users size={24} className="text-[#C4BDD0] mb-2" />
                <p
                  className="text-[0.75rem] font-medium text-[#8A8390]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  No recent sign-ups
                </p>
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
            {recentListings.map((l) => (
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
  );
}
