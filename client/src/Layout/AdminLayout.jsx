import { useState, useEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate, NavLink } from 'react-router-dom';
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
  Menu,
  X,
  Bell,
  LogOut,
  ChevronRight,
  Trash2,
} from 'lucide-react';
import { useUser } from '../Hooks/useUser.js';
import { useLogout } from '../Hooks/useLogout.js';

// ── Nav structure ─────────────────────────────────────────────────
const NAV = [
  {
    label: null,
    items: [{ path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true }],
  },
  {
    label: 'USERS',
    items: [
      { path: '/admin/users', icon: Users, label: 'All Users', end: true },
      { path: '/admin/users/banned', icon: ShieldOff, label: 'Banned Users', end: true },
      { path: '/admin/users/deleted', icon: Trash2, label: 'Deleted Users', end: true },
    ],
  },
  {
    label: 'LISTINGS',
    items: [
      { path: '/admin/listings', icon: Car, label: 'All Listings', end: true },
      { path: '/admin/listings/pending', icon: Clock, label: 'Pending Approval', end: true },
      { path: '/admin/listings/flagged', icon: Flag, label: 'Flagged Listings', end: true },
    ],
  },
  {
    label: 'REPORTS',
    items: [{ path: '/admin/reports', icon: AlertTriangle, label: 'Reports Queue', end: true }],
  },
  {
    label: 'CATALOGUE',
    items: [
      { path: '/admin/catalogue/makes', icon: BookOpen, label: 'Makes & Models', end: true },
      { path: '/admin/catalogue/cities', icon: MapPin, label: 'Cities & Locations', end: true },
    ],
  },
  {
    label: 'SYSTEM',
    items: [
      { path: '/admin/accounts', icon: Shield, label: 'Admin Accounts', end: true },
      { path: '/admin/settings', icon: Settings, label: 'Settings', end: true },
    ],
  },
];

// ── Initials helper ───────────────────────────────────────────────
const initials = (name = '') =>
  name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase() || 'A';

// ── Sidebar ───────────────────────────────────────────────────────
function Sidebar({ collapsed, fullWidth, onToggle, onClose, user, onLogout, pendinglogout }) {
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  return (
    <aside
      className="admin-sidebar flex flex-col h-full"
      style={{
        width: fullWidth ? '100%' : collapsed ? '60px' : '220px',
        transition: 'width 0.3s ease',
      }}
      aria-label="Admin navigation"
    >
      {' '}
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
                onClick={onLogout}
                disabled={pendinglogout}
                className="flex-1 text-[0.82rem] font-semibold text-white py-2.5 rounded-xl transition-opacity duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  background: 'linear-gradient(135deg, #6C3CE1 0%, #5429C4 100%)',
                }}
              >
                {pendinglogout ? 'Logging out…' : 'Log out'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Logo row */}
      <div
        className="flex items-center h-15 border-b shrink-0 px-3"
        style={{
          borderColor: 'rgba(255,255,255,0.07)',
          justifyContent: collapsed ? 'center' : 'space-between',
        }}
      >
        {!collapsed && (
          <a
            href="/admin"
            className="flex items-center gap-2 no-underline"
            aria-label="Paiyya Admin"
          >
            <img
              src="/wheel.svg"
              alt=""
              className="w-6 h-6 object-contain"
              style={{ filter: 'brightness(0) invert(1)', opacity: 0.9 }}
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
          className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors duration-150"
          style={{ color: 'rgba(255,255,255,0.45)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            e.currentTarget.style.color = '#fff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
          }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu size={15} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
      {/* Nav items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2" aria-label="Admin menu">
        {NAV.map((group, gi) => (
          <div key={gi} className={gi > 0 ? 'mt-4' : ''}>
            {group.label && !collapsed && (
              <p
                className="px-2.5 mb-1.5 text-[0.6rem] font-bold uppercase tracking-[0.12em]"
                style={{ color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans', sans-serif" }}
              >
                {group.label}
              </p>
            )}
            {group.items.map(({ path, icon: Icon, label, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end ?? true}
                onClick={onClose}
                className={({ isActive }) => `
                  flex items-center gap-2.5 px-2.5 py-2 rounded-xl mb-0.5
                  no-underline transition-[background-color,color] duration-150
                  ${collapsed ? 'justify-center' : ''}
                  ${isActive ? 'text-white' : 'text-white/50 hover:text-white'}
                `}
                style={({ isActive }) => ({
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                })}
                title={collapsed ? label : undefined}
                aria-label={label}
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={15}
                      strokeWidth={isActive ? 2.2 : 1.9}
                      className="shrink-0"
                      aria-hidden="true"
                    />

                    {!collapsed && (
                      <>
                        <span
                          className={`text-[0.8rem] truncate ${isActive ? 'font-semibold' : 'font-medium'}`}
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                        >
                          {label}
                        </span>
                        {isActive && (
                          <span
                            className="ml-auto w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ background: '#E8622A' }}
                            aria-hidden="true"
                          />
                        )}
                      </>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      {/* Bottom — admin user */}
      <div
        className="flex items-center gap-2.5 p-3 shrink-0"
        style={{
          borderTop: '1px solid rgba(255,255,255,0.07)',
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <div
          className="w-7 h-7 rounded-xl flex items-center justify-center text-[0.65rem] font-bold text-white shrink-0"
          style={{ background: 'rgba(108,60,225,0.4)', fontFamily: "'Syne', sans-serif" }}
          aria-hidden="true"
        >
          {initials(user?.name)}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p
                className="text-[0.75rem] font-semibold text-white truncate"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {user?.name ?? 'Admin'}
              </p>
              <p
                className="text-[0.65rem] truncate"
                style={{ color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif" }}
              >
                {user?.email ?? ''}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setLogoutConfirmOpen(true)}
              className="shrink-0 transition-colors duration-150"
              style={{
                color: 'rgba(255,255,255,0.4)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'rgba(255,255,255,0.4)';
              }}
              aria-label="Log out"
              title="Log out"
            >
              <LogOut size={14} strokeWidth={2} aria-hidden="true" />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}

// ── AdminLayout ───────────────────────────────────────────────────
export default function AdminLayout() {
  const { data: user } = useUser();
  const { mutateAsync: logout, isPending: isLoggingOut } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Derive active label for breadcrumb
  const activeItem = NAV.flatMap((g) => g.items).find((i) =>
    i.path === '/admin' ? location.pathname === '/admin' : location.pathname.startsWith(i.path)
  );
  const activeLabel = activeItem?.label ?? 'Dashboard';

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      /* silent */
    }
    setLogoutConfirmOpen(false);
    navigate('/');
  };

  return (
    <>
      <style>{STYLES}</style>

      <div className="admin-layout-root">
        {/* ── Mobile overlay ── */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-30 lg:hidden"
            style={{ background: 'rgba(26,21,35,0.5)', backdropFilter: 'blur(2px)' }}
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
        )}

        {/* ── Sidebar ── */}
        <div
          className="fixed inset-y-0 left-0 z-40 lg:static lg:flex shrink-0"
          style={{
            width: mobileOpen ? '100%' : undefined,
            transform: mobileOpen ? 'translateX(0)' : undefined,
            display: mobileOpen ? 'flex' : undefined,
          }}
          aria-hidden={!mobileOpen ? true : undefined}
        >
          <div className="hidden lg:flex h-full">
            <Sidebar
              collapsed={collapsed}
              onToggle={() => setCollapsed((p) => !p)}
              onClose={() => {}}
              user={user}
              onLogout={handleLogout}
              pendinglogout={isLoggingOut}
            />
          </div>
          {/* Mobile sidebar (always full width) */}
          <div
            className="lg:hidden h-full w-full"
            style={{ display: mobileOpen ? 'flex' : 'none' }}
          >
            <Sidebar
              collapsed={false}
              fullWidth={true}
              onToggle={() => setMobileOpen(false)}
              onClose={() => setMobileOpen(false)}
              user={user}
              onLogout={handleLogout}
            />
          </div>
        </div>

        {/* ── Main column ── */}
        <div className="admin-main flex flex-col min-w-0 overflow-hidden">
          {/* Top bar */}
          <header
            className="admin-topbar flex items-center justify-between px-5 shrink-0"
            style={{ height: '60px' }}
          >
            <div className="flex items-center gap-3">
              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors duration-150"
                style={{ color: '#8A8390' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F2EEE9';
                  e.currentTarget.style.color = '#1A1523';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#8A8390';
                }}
                aria-label="Open navigation menu"
              >
                <Menu size={17} strokeWidth={2} aria-hidden="true" />
              </button>

              {/* Breadcrumb */}
              <nav aria-label="Breadcrumb">
                <ol
                  className="flex items-center gap-1.5"
                  style={{ listStyle: 'none', margin: 0, padding: 0 }}
                >
                  <li>
                    <span
                      className="text-[0.75rem]"
                      style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Admin
                    </span>
                  </li>
                  <li aria-hidden="true">
                    <ChevronRight size={12} strokeWidth={2} style={{ color: '#C4BDD0' }} />
                  </li>
                  <li>
                    <span
                      className="text-[0.75rem] font-semibold"
                      style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
                      aria-current="page"
                    >
                      {activeLabel}
                    </span>
                  </li>
                </ol>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                className="relative w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150"
                style={{ color: '#8A8390' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#F2EEE9';
                  e.currentTarget.style.color = '#1A1523';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#8A8390';
                }}
                aria-label="Notifications"
              >
                <Bell size={16} strokeWidth={1.9} aria-hidden="true" />
                {/* Unread dot — hide when no notifications */}
                <span
                  className="absolute top-1 right-1 w-2 h-2 rounded-full"
                  style={{ background: '#E8622A' }}
                  aria-label="Unread notifications"
                />
              </button>

              {/* Admin avatar */}
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-[0.65rem] font-bold"
                style={{
                  background: 'rgba(108,60,225,0.1)',
                  color: '#6C3CE1',
                  fontFamily: "'Syne', sans-serif",
                }}
                aria-label={`Logged in as ${user?.name ?? 'Admin'}`}
              >
                {initials(user?.name)}
              </div>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-y-auto p-5 md:p-7">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .admin-layout-root {
    display: flex;
    height: 100vh;
    overflow: hidden;
    background: #F7F4F0;
    font-family: 'DM Sans', sans-serif;
  }

  .admin-sidebar {
    background: linear-gradient(180deg, #1A1523 0%, #1F1A2E 100%);
    border-right: 1px solid rgba(255,255,255,0.06);
    overflow: hidden;
  }

  .admin-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
    overflow: hidden;
  }

  .admin-topbar {
    background: #FFFFFF;
    border-bottom: 1px solid #E8E3DC;
    flex-shrink: 0;
  }
`;
