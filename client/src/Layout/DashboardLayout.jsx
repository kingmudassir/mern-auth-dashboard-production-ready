import { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  User,
  Heart,
  Car,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  Shield,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

// ← REPLACE with your actual hooks
// import { useUser } from '@/Hooks/useUser';
// import { useLogout } from '@/Hooks/useLogout';

const NAV_ITEMS = [
  { key: 'info', label: 'My Profile', icon: User, path: '/profile/info' },
  { key: 'my-ads', label: 'My Ads', icon: Car, path: '/profile/my-ads', badge: null },
  { key: 'saved-ads', label: 'Saved Ads', icon: Heart, path: '/profile/saved-ads', badge: null },
  {
    key: 'messages',
    label: 'Messages',
    icon: MessageSquare,
    path: '/profile/messages',
    badge: null,
  },
  {
    key: 'notifications',
    label: 'Notifications',
    icon: Bell,
    path: '/profile/notifications',
    badge: null,
  },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/profile/settings' },
];

export default function DashboardLayout() {
  const [avatarError, setAvatarError] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const dropRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If the user is exactly on /profile, move them to /profile/info
    if (location.pathname === '/profile' || location.pathname === '/profile/') {
      navigate('/profile/info', { replace: true });
    }
  }, [location.pathname, navigate]);

  const user = {
    name: 'Mudassir Khan',
    email: 'mudassir@paiyya.pk',
    avatar: null,
    isVerified: true,
    memberSince: '2024',
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '?';

  const handleLogout = () => {
    // ← REPLACE: logout(); then navigate
    navigate('/');
  };

  // Close everything on route change
  useEffect(() => {
    setMobileOpen(false);
    setProfileDropOpen(false);
  }, [location.pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) {
        setProfileDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <div className="dl-root">
      <header className="dl-header" role="banner">
        <div className="dl-header-accent" aria-hidden="true" />

        <div className="dl-header-inner">
          {/* ── Logo ── */}
          <a href="/" className="dl-logo" aria-label="Paiyya — Go to homepage">
            <img src="/wheel.svg" alt="" className="dl-logo-icon" aria-hidden="true" />
            <span className="dl-logo-wordmark">
              Pai<em>yya</em>
            </span>
            <span className="dl-logo-dot" aria-hidden="true" />
          </a>

          {/* ── Desktop: tab nav (fills remaining space) ── */}
          <nav className="dl-tabs" aria-label="Account navigation">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) => `dl-tab${isActive ? ' dl-tab--active' : ''}`}
              >
                <item.icon size={13} className="dl-tab-icon" aria-hidden="true" />
                <span className="dl-tab-label">{item.label}</span>
                {item.badge != null && item.badge > 0 && (
                  <span className="dl-badge" aria-label={`${item.badge} unread`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* ── Desktop: right-side actions ── */}
          <div className="dl-right">
            {/* Post Your Car CTA */}
            <a href="/post-ad" className="dl-post-btn" aria-label="Post your car listing">
              <span>Post Your Car</span>
              <ChevronRight size={12} strokeWidth={2.5} aria-hidden="true" />
            </a>

            {/* Avatar + dropdown */}
            <div className="dl-avatar-wrap" ref={dropRef}>
              <button
                className="dl-avatar-btn"
                onClick={() => setProfileDropOpen((p) => !p)}
                aria-expanded={profileDropOpen}
                aria-haspopup="menu"
                aria-label="Open account menu"
              >
                {user?.avatar && !avatarError ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="dl-avatar-img"
                    onError={() => setAvatarError(true)}
                  />
                ) : (
                  <span className="dl-avatar-initials" aria-hidden="true">
                    {initials}
                  </span>
                )}
                {user?.isVerified && (
                  <span
                    className="dl-verified-dot"
                    aria-label="Verified account"
                    title="Verified account"
                  >
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" aria-hidden="true">
                      <polyline
                        points="2,6 5,9 10,3"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
                <ChevronDown
                  size={11}
                  className="dl-avatar-chevron"
                  style={{ transform: profileDropOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  aria-hidden="true"
                />
              </button>

              {profileDropOpen && (
                <div className="dl-dropdown" role="menu" aria-label="Account menu">
                  {/* Identity header */}
                  <div className="dl-dd-header">
                    <p className="dl-dd-name">{user?.name}</p>
                    <p className="dl-dd-email">{user?.email}</p>
                    <span className="dl-dd-badge">
                      <Shield size={9} aria-hidden="true" />
                      Member since {user?.memberSince}
                    </span>
                  </div>
                  <div className="dl-dd-sep" aria-hidden="true" />
                  <a
                    href="/profile/info"
                    className="dl-dd-item"
                    role="menuitem"
                    onClick={() => setProfileDropOpen(false)}
                  >
                    <User size={13} strokeWidth={1.8} aria-hidden="true" />
                    Edit Profile
                  </a>
                  <a
                    href="/profile/settings"
                    className="dl-dd-item"
                    role="menuitem"
                    onClick={() => setProfileDropOpen(false)}
                  >
                    <Settings size={13} strokeWidth={1.8} aria-hidden="true" />
                    Settings
                  </a>
                  <div className="dl-dd-sep" aria-hidden="true" />
                  <button
                    className="dl-dd-item dl-dd-item--logout"
                    role="menuitem"
                    onClick={handleLogout}
                  >
                    <LogOut size={13} strokeWidth={1.8} aria-hidden="true" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Mobile: hamburger ── */}
          <button
            className="dl-hamburger"
            onClick={() => setMobileOpen((p) => !p)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-controls="dl-mobile-drawer"
          >
            {mobileOpen ? (
              <X size={18} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Menu size={18} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        {mobileOpen && (
          <nav
            id="dl-mobile-drawer"
            className="dl-mobile-drawer"
            role="navigation"
            aria-label="Mobile account navigation"
          >
            {/* User identity strip */}
            <div className="dl-mob-identity">
              <div className="dl-mob-avatar" aria-hidden="true">
                {user?.avatar && !avatarError ? (
                  <img
                    src={user.avatar}
                    alt=""
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div>
                <p className="dl-mob-name">{user?.name}</p>
                <p className="dl-mob-email">{user?.email}</p>
              </div>
            </div>

            <div className="dl-mob-sep" aria-hidden="true" />

            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.key}
                to={item.path}
                className={({ isActive }) => `dl-mob-link${isActive ? ' dl-mob-link--active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                <item.icon size={15} aria-hidden="true" />
                {item.label}
                {item.badge != null && item.badge > 0 && (
                  <span className="dl-badge">{item.badge}</span>
                )}
              </NavLink>
            ))}

            <div className="dl-mob-sep" aria-hidden="true" />

            <a href="/post-ad" className="dl-mob-post-btn" onClick={() => setMobileOpen(false)}>
              <span>Post Your Car</span>
              <ChevronRight size={13} strokeWidth={2.5} aria-hidden="true" />
            </a>

            <button className="dl-mob-link dl-mob-link--logout" onClick={handleLogout}>
              <LogOut size={15} aria-hidden="true" />
              Log out
            </button>
          </nav>
        )}
      </header>

      {/* ── Page content ── */}
      <main className="dl-content">
        <Outlet />
      </main>
    </div>
  );
}
