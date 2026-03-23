import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  ShieldOff,
  Car,
  Clock,
  Flag,
  AlertTriangle,
  BookOpen,
  MapPin,
  Shield,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Search,
  MoreHorizontal,
  ArrowUpRight,
  Bell,
  LogOut,
  Pencil,
  Trash2,
} from 'lucide-react';
import StatCard from '../../Admin-Components/Dashboard/StatCard';
import { useAdminStats } from '../../Hooks/Admin-Hook/useAdminStats';
import RecentUsersSection from '../../Admin-Components/Dashboard/RecentUsersSection';
import AllUsersPanel from '../../Pages/Admin/AllUsersPanel.jsx';
import PanelHeader from '../../Admin-Components/Dashboard/PanelHeader.jsx';
import SearchBar from '../../Admin-Components/Dashboard/SearchBar.jsx';
import AdminTable from '../../Admin-Components/Dashboard/AdminTable.jsx';
import ActionMenu from '../../Admin-Components/Dashboard/ActionMenu.jsx';
import TableHeader from '../../Admin-Components/Dashboard/TableHeader.jsx';
import Badge from '../../Admin-Components/Dashboard/Badge.jsx';
// ─────────────────────────────────────────────────────────────────
// 💡 TANSTACK / DATA INTEGRATION
//  Replace each panel's mock data + simulate() calls with:
//    const { data, isLoading } = useQuery({ queryKey: [...], queryFn: ... })
//    const mutation = useMutation({ ... })
// ─────────────────────────────────────────────────────────────────

// ── Mock data ────────────────────────────────────────────────────
const MOCK_USERS = [
  {
    id: 1,
    name: 'Ali Khan',
    email: 'ali@example.com',
    role: 'Seller',
    status: 'active',
    joined: '12 Jan 2024',
    listings: 4,
  },
  {
    id: 2,
    name: 'Sara Ahmed',
    email: 'sara@example.com',
    role: 'Buyer',
    status: 'active',
    joined: '3 Feb 2024',
    listings: 0,
  },
  {
    id: 3,
    name: 'Bilal Raza',
    email: 'bilal@example.com',
    role: 'Dealer',
    status: 'banned',
    joined: '22 Mar 2023',
    listings: 14,
  },
  {
    id: 4,
    name: 'Hira Malik',
    email: 'hira@example.com',
    role: 'Seller',
    status: 'active',
    joined: '5 Apr 2024',
    listings: 2,
  },
  {
    id: 5,
    name: 'Usman Tariq',
    email: 'usman@example.com',
    role: 'Buyer',
    status: 'banned',
    joined: '18 May 2023',
    listings: 0,
  },
  {
    id: 6,
    name: 'Fatima Noor',
    email: 'fatima@example.com',
    role: 'Seller',
    status: 'active',
    joined: '9 Jun 2024',
    listings: 7,
  },
];

const MOCK_LISTINGS = [
  {
    id: 1,
    title: 'Toyota Corolla 2021',
    seller: 'Ali Khan',
    city: 'Lahore',
    price: '28 Lac',
    status: 'active',
    flagged: false,
    createdAt: '2 days ago',
  },
  {
    id: 2,
    title: 'Honda Civic 2020',
    seller: 'Fatima Noor',
    city: 'Karachi',
    price: '42 Lac',
    status: 'pending',
    flagged: false,
    createdAt: '5 hours ago',
  },
  {
    id: 3,
    title: 'Suzuki Alto 2023',
    seller: 'Hira Malik',
    city: 'Islamabad',
    price: '19 Lac',
    status: 'active',
    flagged: true,
    createdAt: '1 day ago',
  },
  {
    id: 4,
    title: 'Hyundai Tucson 2022',
    seller: 'Ali Khan',
    city: 'Rawalpindi',
    price: '65 Lac',
    status: 'pending',
    flagged: false,
    createdAt: '3 hours ago',
  },
  {
    id: 5,
    title: 'Kia Sportage 2021',
    seller: 'Fatima Noor',
    city: 'Lahore',
    price: '58 Lac',
    status: 'active',
    flagged: true,
    createdAt: '4 days ago',
  },
  {
    id: 6,
    title: 'Daihatsu Mira 2019',
    seller: 'Hira Malik',
    city: 'Peshawar',
    price: '14 Lac',
    status: 'active',
    flagged: false,
    createdAt: '1 week ago',
  },
];

const MOCK_REPORTS = [
  {
    id: 1,
    type: 'Listing',
    subject: 'Toyota Corolla 2021',
    reporter: 'Sara Ahmed',
    reason: 'Misleading price',
    status: 'open',
    date: '1 hour ago',
  },
  {
    id: 2,
    type: 'User',
    subject: 'Bilal Raza',
    reporter: 'Ali Khan',
    reason: 'Scam behaviour',
    status: 'resolved',
    date: '2 days ago',
  },
  {
    id: 3,
    type: 'Listing',
    subject: 'Kia Sportage 2021',
    reporter: 'Usman Tariq',
    reason: 'Duplicate listing',
    status: 'open',
    date: '30 min ago',
  },
  {
    id: 4,
    type: 'User',
    subject: 'Hira Malik',
    reporter: 'Bilal Raza',
    reason: 'Fake contact number',
    status: 'pending',
    date: '5 hours ago',
  },
];

const MOCK_MAKES = [
  { id: 1, name: 'Toyota', models: 12, country: 'Japan' },
  { id: 2, name: 'Honda', models: 9, country: 'Japan' },
  { id: 3, name: 'Suzuki', models: 7, country: 'Japan' },
  { id: 4, name: 'Hyundai', models: 6, country: 'S. Korea' },
  { id: 5, name: 'Kia', models: 5, country: 'S. Korea' },
];

const MOCK_CITIES = [
  { id: 1, name: 'Karachi', province: 'Sindh', listings: 3820 },
  { id: 2, name: 'Lahore', province: 'Punjab', listings: 4210 },
  { id: 3, name: 'Islamabad', province: 'ICT', listings: 1540 },
  { id: 4, name: 'Rawalpindi', province: 'Punjab', listings: 980 },
  { id: 5, name: 'Peshawar', province: 'KPK', listings: 620 },
];

const MOCK_ADMINS = [
  {
    id: 1,
    name: 'Super Admin',
    email: 'super@paiyya.com',
    role: 'Super Admin',
    lastActive: 'Just now',
  },
  {
    id: 2,
    name: 'Ops Manager',
    email: 'ops@paiyya.com',
    role: 'Moderator',
    lastActive: '2 hours ago',
  },
  {
    id: 3,
    name: 'Support Lead',
    email: 'support@paiyya.com',
    role: 'Moderator',
    lastActive: '1 day ago',
  },
];

// ── Nav structure ─────────────────────────────────────────────────
const NAV = [
  {
    label: null,
    items: [{ id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    label: 'USERS',
    items: [
      { id: 'all-users', icon: Users, label: 'All Users' },
      { id: 'banned-users', icon: ShieldOff, label: 'Banned Users' },
    ],
  },
  {
    label: 'LISTINGS',
    items: [
      { id: 'all-listings', icon: Car, label: 'All Listings' },
      { id: 'pending-listings', icon: Clock, label: 'Pending Approval' },
      { id: 'flagged-listings', icon: Flag, label: 'Flagged Listings' },
    ],
  },
  {
    label: 'REPORTS',
    items: [{ id: 'reports', icon: AlertTriangle, label: 'Reports Queue' }],
  },
  {
    label: 'CATALOGUE',
    items: [
      { id: 'makes', icon: BookOpen, label: 'Makes & Models' },
      { id: 'cities', icon: MapPin, label: 'Cities & Locations' },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { id: 'admin-accounts', icon: Shield, label: 'Admin Accounts' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ],
  },
];

<SearchBar placeholder />;
<AdminTable children />;
// ── Panels ────────────────────────────────────────────────────────

function DashboardPanel() {
  const { data, isLoading } = useAdminStats();
  const recentUsers = data?.stats?.recentUsers ?? [];

  const getStatus = (user) => {
    if (user.isBanned) return 'banned';
    if (user.deleteAccountRequestAt) return 'pending'; // scheduled for deletion
    return 'active';
  };

  return (
    <div className="flex flex-col gap-6">
      <PanelHeader title="Dashboard" subtitle="Platform overview and key metrics" />

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Users"
          value={isLoading ? '...' : (data?.stats?.totalUsers ?? 0)}
          trend={isLoading ? 0 : (data?.stats?.userTrend ?? 0)}
          icon={Users}
          color="#6C3CE1"
          sub={`↑ ${data?.stats?.usersThisMonth ?? 0} this month`}
        />
        <StatCard
          label="Active Listings"
          value="3,920"
          trend={8}
          icon={Car}
          color="#E8622A"
          sub="↑ 310 this week"
        />
        <StatCard
          label="Pending Review"
          value="47"
          trend={-3}
          icon={Clock}
          color="#C9A84C"
          sub="Needs attention"
        />
        <StatCard
          label="Open Reports"
          value="12"
          trend={-18}
          icon={AlertTriangle}
          color="#ef4444"
          sub="↓ 3 since yesterday"
        />
      </div>

      <RecentUsersSection recentUsers={recentUsers} isLoading={isLoading} status={getStatus} />

      {/* Recent listings */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-[0.9rem] font-bold text-[#1A1523]"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Recent Listings
          </h3>
          <button
            className="text-[0.75rem] font-medium text-[#6C3CE1] flex items-center gap-1 hover:underline"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            View all <ArrowUpRight size={12} strokeWidth={2.2} />
          </button>
        </div>
        <AdminTable>
          <TableHeader cols={['Title', 'Seller', 'City', 'Price', 'Status', '']} />
          <tbody>
            {MOCK_LISTINGS.slice(0, 4).map((l) => (
              <tr
                key={l.id}
                className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
              >
                <td
                  className="px-4 py-3 text-[0.82rem] font-medium text-[#1A1523]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {l.title}
                </td>
                <td
                  className="px-4 py-3 text-[0.82rem] text-[#8A8390]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {l.seller}
                </td>
                <td
                  className="px-4 py-3 text-[0.82rem] text-[#8A8390]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {l.city}
                </td>
                <td
                  className="px-4 py-3 text-[0.82rem] font-semibold text-[#1A1523]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {l.price}
                </td>
                <td className="px-4 py-3">
                  <Badge status={l.flagged ? 'flagged' : l.status} />
                </td>
                <td className="px-4 py-3">
                  <ActionMenu
                    actions={[
                      { label: 'View', icon: Eye },
                      { label: 'Remove', icon: Trash2, danger: true },
                    ]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </AdminTable>
      </div>
    </div>
  );
}

function BannedUsersPanel() {
  const banned = MOCK_USERS.filter((u) => u.status === 'banned');
  return (
    <div>
      <PanelHeader
        title="Banned Users"
        subtitle={`${banned.length} accounts currently banned`}
        action={<SearchBar placeholder="Search banned users…" />}
      />
      <AdminTable>
        <TableHeader cols={['User', 'Role', 'Listings', 'Joined', '']} />
        <tbody>
          {banned.map((u) => (
            <tr
              key={u.id}
              className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[0.7rem] font-bold text-[#E8622A] flex-shrink-0"
                    style={{ background: 'rgba(232,98,42,0.1)', fontFamily: "'Syne', sans-serif" }}
                  >
                    {u.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p
                      className="text-[0.82rem] font-semibold text-[#1A1523]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {u.name}
                    </p>
                    <p
                      className="text-[0.72rem] text-[#8A8390]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {u.email}
                    </p>
                  </div>
                </div>
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {u.role}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {u.listings}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {u.joined}
              </td>
              <td className="px-4 py-3.5">
                <ActionMenu
                  actions={[
                    { label: 'Unban User', icon: CheckCircle },
                    { label: 'Delete Account', icon: Trash2, danger: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function AllListingsPanel() {
  return (
    <div>
      <PanelHeader
        title="All Listings"
        subtitle={`${MOCK_LISTINGS.length} total listings`}
        action={<SearchBar placeholder="Search listings…" />}
      />
      <AdminTable>
        <TableHeader cols={['Listing', 'Seller', 'City', 'Price', 'Status', 'Posted', '']} />
        <tbody>
          {MOCK_LISTINGS.map((l) => (
            <tr
              key={l.id}
              className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
            >
              <td
                className="px-4 py-3.5 text-[0.82rem] font-medium text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.title}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.seller}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.city}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] font-semibold text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.price}
              </td>
              <td className="px-4 py-3.5">
                <Badge status={l.flagged ? 'flagged' : l.status} />
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.createdAt}
              </td>
              <td className="px-4 py-3.5">
                <ActionMenu
                  actions={[
                    { label: 'View', icon: Eye },
                    { label: 'Approve', icon: CheckCircle },
                    { label: 'Remove', icon: Trash2, danger: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function PendingListingsPanel() {
  const pending = MOCK_LISTINGS.filter((l) => l.status === 'pending');
  return (
    <div>
      <PanelHeader
        title="Pending Approval"
        subtitle={`${pending.length} listings awaiting review`}
        action={<SearchBar placeholder="Search…" />}
      />
      <AdminTable>
        <TableHeader cols={['Listing', 'Seller', 'City', 'Price', 'Submitted', '']} />
        <tbody>
          {pending.map((l) => (
            <tr
              key={l.id}
              className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
            >
              <td
                className="px-4 py-3.5 text-[0.82rem] font-medium text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.title}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.seller}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.city}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] font-semibold text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.price}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.createdAt}
              </td>
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-1.5">
                  <button
                    className="flex items-center gap-1 text-[0.72rem] font-medium text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-lg hover:bg-green-100 transition-colors duration-150"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <CheckCircle size={11} strokeWidth={2.2} /> Approve
                  </button>
                  <button
                    className="flex items-center gap-1 text-[0.72rem] font-medium text-[#E8622A] bg-[rgba(232,98,42,0.08)] border border-[rgba(232,98,42,0.2)] px-2.5 py-1 rounded-lg hover:bg-[rgba(232,98,42,0.15)] transition-colors duration-150"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    <XCircle size={11} strokeWidth={2.2} /> Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function FlaggedListingsPanel() {
  const flagged = MOCK_LISTINGS.filter((l) => l.flagged);
  return (
    <div>
      <PanelHeader
        title="Flagged Listings"
        subtitle={`${flagged.length} listings flagged for review`}
      />
      <AdminTable>
        <TableHeader cols={['Listing', 'Seller', 'City', 'Price', 'Posted', '']} />
        <tbody>
          {flagged.map((l) => (
            <tr
              key={l.id}
              className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-2">
                  <span
                    className="text-[0.82rem] font-medium text-[#1A1523]"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {l.title}
                  </span>
                  <Badge status="flagged" />
                </div>
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.seller}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.city}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] font-semibold text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.price}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {l.createdAt}
              </td>
              <td className="px-4 py-3.5">
                <ActionMenu
                  actions={[
                    { label: 'View', icon: Eye },
                    { label: 'Clear Flag', icon: CheckCircle },
                    { label: 'Remove Listing', icon: Trash2, danger: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function ReportsPanel() {
  return (
    <div>
      <PanelHeader
        title="Reports Queue"
        subtitle={`${MOCK_REPORTS.length} reports — ${MOCK_REPORTS.filter((r) => r.status === 'open').length} open`}
        action={<SearchBar placeholder="Search reports…" />}
      />
      <AdminTable>
        <TableHeader cols={['Type', 'Subject', 'Reporter', 'Reason', 'Status', 'Date', '']} />
        <tbody>
          {MOCK_REPORTS.map((r) => (
            <tr
              key={r.id}
              className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
            >
              <td className="px-4 py-3.5">
                <span
                  className="text-[0.72rem] font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: r.type === 'User' ? 'rgba(108,60,225,0.1)' : 'rgba(232,98,42,0.1)',
                    color: r.type === 'User' ? '#6C3CE1' : '#E8622A',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {r.type}
                </span>
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] font-medium text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {r.subject}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {r.reporter}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {r.reason}
              </td>
              <td className="px-4 py-3.5">
                <Badge status={r.status} />
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {r.date}
              </td>
              <td className="px-4 py-3.5">
                <ActionMenu
                  actions={[
                    { label: 'Review', icon: Eye },
                    { label: 'Resolve', icon: CheckCircle },
                    { label: 'Dismiss', icon: XCircle, danger: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function MakesPanel() {
  return (
    <div>
      <PanelHeader
        title="Makes & Models"
        subtitle="Manage the car makes and their models"
        action={
          <button
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white px-4 py-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #E8622A, #C4531F)',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 2px 8px rgba(232,98,42,0.25)',
            }}
          >
            + Add Make
          </button>
        }
      />
      <AdminTable>
        <TableHeader cols={['Make', 'Country', 'Models', '']} />
        <tbody>
          {MOCK_MAKES.map((m) => (
            <tr
              key={m.id}
              className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
            >
              <td
                className="px-4 py-3.5 text-[0.82rem] font-semibold text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {m.name}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {m.country}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {m.models} models
              </td>
              <td className="px-4 py-3.5">
                <ActionMenu
                  actions={[
                    { label: 'Edit', icon: Pencil },
                    { label: 'Delete', icon: Trash2, danger: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function CitiesPanel() {
  return (
    <div>
      <PanelHeader
        title="Cities & Locations"
        subtitle="Manage supported cities across Pakistan"
        action={
          <button
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white px-4 py-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #E8622A, #C4531F)',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 2px 8px rgba(232,98,42,0.25)',
            }}
          >
            + Add City
          </button>
        }
      />
      <AdminTable>
        <TableHeader cols={['City', 'Province', 'Listings', '']} />
        <tbody>
          {MOCK_CITIES.map((c) => (
            <tr
              key={c.id}
              className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
            >
              <td
                className="px-4 py-3.5 text-[0.82rem] font-semibold text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {c.name}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {c.province}
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {c.listings.toLocaleString()}
              </td>
              <td className="px-4 py-3.5">
                <ActionMenu
                  actions={[
                    { label: 'Edit', icon: Pencil },
                    { label: 'Delete', icon: Trash2, danger: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function AdminAccountsPanel() {
  return (
    <div>
      <PanelHeader
        title="Admin Accounts"
        subtitle="Manage admin and moderator access"
        action={
          <button
            className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white px-4 py-2 rounded-xl"
            style={{
              background: 'linear-gradient(135deg, #E8622A, #C4531F)',
              fontFamily: "'DM Sans', sans-serif",
              boxShadow: '0 2px 8px rgba(232,98,42,0.25)',
            }}
          >
            + Invite Admin
          </button>
        }
      />
      <AdminTable>
        <TableHeader cols={['Admin', 'Role', 'Last Active', '']} />
        <tbody>
          {MOCK_ADMINS.map((a) => (
            <tr
              key={a.id}
              className="border-b border-[#F2EEE9] last:border-0 hover:bg-[#FAFAF9] transition-colors duration-100"
            >
              <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-[0.7rem] font-bold text-[#6C3CE1] flex-shrink-0"
                    style={{ background: 'rgba(108,60,225,0.1)', fontFamily: "'Syne', sans-serif" }}
                  >
                    {a.name
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .slice(0, 2)}
                  </div>
                  <div>
                    <p
                      className="text-[0.82rem] font-semibold text-[#1A1523]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {a.name}
                    </p>
                    <p
                      className="text-[0.72rem] text-[#8A8390]"
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {a.email}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3.5">
                <span
                  className="text-[0.72rem] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{
                    background:
                      a.role === 'Super Admin' ? 'rgba(108,60,225,0.1)' : 'rgba(201,168,76,0.15)',
                    color: a.role === 'Super Admin' ? '#6C3CE1' : '#92700a',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  {a.role}
                </span>
              </td>
              <td
                className="px-4 py-3.5 text-[0.82rem] text-[#8A8390]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {a.lastActive}
              </td>
              <td className="px-4 py-3.5">
                <ActionMenu
                  actions={[
                    { label: 'Edit Role', icon: Pencil },
                    { label: 'Revoke Access', icon: XCircle, danger: true },
                  ]}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div>
      <PanelHeader title="Settings" subtitle="Platform-wide configuration" />
      <div className="flex flex-col gap-4">
        {[
          {
            label: 'Listing Approval',
            desc: 'Require admin approval before listings go live',
            enabled: true,
          },
          {
            label: 'User Registration',
            desc: 'Allow new users to register on the platform',
            enabled: true,
          },
          {
            label: 'Email Notifications',
            desc: 'Send email alerts for reports and flagged items',
            enabled: true,
          },
          {
            label: 'Maintenance Mode',
            desc: 'Take the platform offline for maintenance',
            enabled: false,
          },
        ].map(({ label, desc, enabled }) => (
          <div
            key={label}
            className="admin-table-card rounded-2xl p-5 flex items-center justify-between gap-6"
          >
            <div>
              <p
                className="text-[0.88rem] font-semibold text-[#1A1523]"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {label}
              </p>
              <p
                className="text-[0.75rem] text-[#8A8390] mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {desc}
              </p>
            </div>
            <button
              type="button"
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 flex-shrink-0 ${enabled ? 'bg-[#6C3CE1]' : 'bg-[#E8E3DC]'}`}
              aria-checked={enabled}
              role="switch"
              aria-label={label}
            >
              <span
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0.5'}`}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Panel router ──────────────────────────────────────────────────
const PANELS = {
  dashboard: DashboardPanel,
  'all-users': AllUsersPanel,
  'banned-users': BannedUsersPanel,
  'all-listings': AllListingsPanel,
  'pending-listings': PendingListingsPanel,
  'flagged-listings': FlaggedListingsPanel,
  reports: ReportsPanel,
  makes: MakesPanel,
  cities: CitiesPanel,
  'admin-accounts': AdminAccountsPanel,
  settings: SettingsPanel,
};

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ active, onSelect, collapsed, onToggle }) {
  return (
    <aside
      className={`admin-sidebar flex flex-col shrink-0 transition-[width] duration-300 ${collapsed ? 'w-15' : 'w-55'}`}
      aria-label="Admin navigation"
    >
      {/* Logo row */}
      <div
        className={`flex items-center h-15 px-4 border-b border-[rgba(255,255,255,0.07)] shrink-0 ${collapsed ? 'justify-center' : 'justify-between'}`}
      >
        {!collapsed && (
          <a href="/admin" className="flex items-center gap-2" aria-label="Paiyya homepage">
            <img
              src="/wheel.svg"
              alt=""
              className="w-6 h-6 object-contain brightness-0 invert opacity-90"
              aria-hidden="true"
            />
            <span
              className="font-extrabold text-[1.1rem] tracking-[-0.04em] text-white leading-none"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Pai
              <em className="not-italic" style={{ color: '#9B7FF4' }}>
                yya
              </em>
            </span>
          </a>
        )}
        <button
          type="button"
          onClick={onToggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors duration-150"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-0.5">
        {NAV.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-3' : ''}>
            {group.label && !collapsed && (
              <p
                className="text-[0.6rem] font-bold text-white/25 uppercase tracking-[0.12em] px-2.5 mb-1.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {group.label}
              </p>
            )}
            {group.items.map(({ id, icon: Icon, label }) => {
              const isActive = active === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onSelect(id)}
                  className={`
                    w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl text-left
                    transition-[background-color,color] duration-150
                    ${collapsed ? 'justify-center' : ''}
                    ${
                      isActive
                        ? 'bg-white/12 text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/07'
                    }
                  `}
                  title={collapsed ? label : undefined}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    size={15}
                    strokeWidth={isActive ? 2.2 : 1.9}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                  {!collapsed && (
                    <span
                      className={`text-[0.8rem] ${isActive ? 'font-semibold' : 'font-medium'} truncate`}
                      style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                      {label}
                    </span>
                  )}
                  {!collapsed && isActive && (
                    <span
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8622A] flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Bottom — admin user */}
      <div
        className={`border-t border-white/07 p-3 flex items-center gap-2.5 ${collapsed ? 'justify-center' : ''}`}
      >
        <div
          className="w-7 h-7 rounded-xl bg-[rgba(108,60,225,0.4)] flex items-center justify-center text-[0.65rem] font-bold text-white flex-shrink-0"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          SA
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p
                className="text-[0.75rem] font-semibold text-white truncate"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Super Admin
              </p>
              <p
                className="text-[0.65rem] text-white/40 truncate"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                super@paiyya.com
              </p>
            </div>
            <button
              type="button"
              className="text-white/40 hover:text-white transition-colors duration-150 flex-shrink-0"
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={14} strokeWidth={2} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

// ── Root ──────────────────────────────────────────────────────────
export default function Dashboard() {
  const [active, setActive] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const ActivePanel = PANELS[active] ?? DashboardPanel;

  const activeLabel =
    NAV.flatMap((g) => g.items).find((i) => i.id === active)?.label ?? 'Dashboard';

  return (
    <>
      <style>{STYLES}</style>

      <div className="admin-root flex h-screen overflow-hidden">
        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 bg-[rgba(26,21,35,0.5)] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar — hidden on mobile, drawer on tap */}
        <div
          className={`
          fixed lg:static inset-y-0 left-0 z-40
          lg:flex shrink-0
          transition-transform duration-300
          ${mobileOpen ? 'flex translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
        >
          <Sidebar
            active={active}
            onSelect={(id) => {
              setActive(id);
              setMobileOpen(false);
            }}
            collapsed={collapsed}
            onToggle={() => setCollapsed((p) => !p)}
          />
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header className="admin-topbar h-[60px] flex items-center justify-between px-5 flex-shrink-0 border-b border-[#E8E3DC]">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-[#8A8390] hover:bg-[#F2EEE9] hover:text-[#1A1523] transition-colors duration-150"
                aria-label="Open menu"
              >
                <Menu size={17} strokeWidth={2} />
              </button>

              {/* Breadcrumb */}
              <div className="flex items-center gap-1.5">
                <span
                  className="text-[0.75rem] text-[#8A8390]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Admin
                </span>
                <ChevronRight
                  size={12}
                  strokeWidth={2}
                  className="text-[#C4BDD0]"
                  aria-hidden="true"
                />
                <span
                  className="text-[0.75rem] font-semibold text-[#1A1523]"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {activeLabel}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative w-8 h-8 rounded-xl flex items-center justify-center text-[#8A8390] hover:bg-[#F2EEE9] hover:text-[#1A1523] transition-colors duration-150"
                aria-label="Notifications"
              >
                <Bell size={16} strokeWidth={1.9} />
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#E8622A]"
                  aria-hidden="true"
                />
              </button>
              <div
                className="w-8 h-8 rounded-xl bg-[rgba(108,60,225,0.1)] flex items-center justify-center text-[0.65rem] font-bold text-[#6C3CE1]"
                style={{ fontFamily: "'Syne', sans-serif" }}
                aria-label="Admin avatar"
              >
                SA
              </div>
            </div>
          </header>

          {/* Panel content */}
          <main className="flex-1 overflow-y-auto p-5 md:p-7">
            <ActivePanel key={active} />
          </main>
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  /* Sidebar nav hover bg */
  .hover\\:bg-white\\/07:hover { background-color: rgba(255,255,255,0.07); }
  .bg-white\\/12 { background-color: rgba(255,255,255,0.12); }
  .border-white\\/07 { border-color: rgba(255,255,255,0.07); }

  @keyframes spin { to { transform: rotate(360deg); } }
`;
