import { useState, useEffect, useRef } from 'react';
import { Menu, X, ChevronRight, UserCircle, LogOut, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '../../Services/authService.js';
import { useLogout } from '../../Hooks/useLogout.js';
import { useUser } from '../../Hooks/useUser.js';

const AUTH_PAGES = ['/login', '/register', '/verifyotp'];

export default function Navbar() {
  const {
    mutateAsync: logout,
    isPending: isLoggingOut,
    isError: logoutErrorState,
    error: logoutError,
    isSuccess: isLogoutSuccessful,
  } = useLogout();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const isAuthPage = AUTH_PAGES.includes(location.pathname);
  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkIfAlreadyLoggedIn = async () => {
      try {
        const data = await authService.checkAuth();
        console.log('Navbar: checkAuth response:', data);

        if (data.alreadyLoggedIn) {
          const userData = await authService.getUser();
          setUser(userData);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setChecking(false);
      }
    };

    checkIfAlreadyLoggedIn();
  }, [location.pathname]);

  // if (checking) return null;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // silent — clear local state regardless
    }
    setUser(null);
    navigate('/');
  };

  return (
    <>
      <div className="font-dm" role="banner">
        <header
          className={`
            fixed top-0 left-0 right-0 z-50
            transition-[background-color,box-shadow] duration-300
            ${isScrolled || isMobileOpen ? 'navbar-scrolled' : 'bg-transparent'}
          `}
        >
          {/* ── Main row ── */}
          <div className="max-w-7xl mx-auto px-6 h-16.5 flex items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-2.25 no-underline shrink-0"
              aria-label="Paiyya — Go to homepage"
            >
              {/* Logo */}
              <img
                src="/wheel.svg"
                alt=""
                className="w-7 h-7 object-contain block"
                aria-hidden="true"
              />
              <div className="font-syne font-extrabold text-[1.3rem] tracking-[-0.045em] text-[#1A1523] leading-none flex items-start">
                <span>
                  Pai<em className="not-italic text-[#6C3CE1]">yya</em>
                </span>
                <span
                  className="inline-block w-1.25 h-1.25 rounded-full bg-[#C9A84C] ml-0.5 mt-0.75 shrink-0"
                  aria-hidden="true"
                />
              </div>
            </a>

            {/* Desktop nav — hidden on auth pages */}
            {!isAuthPage && (
              <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
                {checking ? null : user ? (
                  <>
                    <div className="relative" ref={dropdownRef}>
                      <button
                        onClick={() => setDropdownOpen((p) => !p)}
                        className="
                        flex items-center gap-2
                        text-sm font-medium text-[#1A1523]
                        px-[1.1rem] py-2 rounded-full
                        border border-transparent
                        transition-[color,border-color,background-color] duration-200
                        hover:text-[#6C3CE1] hover:border-[rgba(108,60,225,0.22)] hover:bg-[rgba(108,60,225,0.05)]
                        cursor-pointer
                      "
                        aria-label="Open profile menu"
                        aria-expanded={dropdownOpen}
                      >
                        <UserCircle size={18} strokeWidth={1.8} />
                        <span>{user.name?.split(' ')[0] ?? 'Profile'}</span>
                      </button>

                      {dropdownOpen && (
                        <div
                          className="
                        absolute right-0 top-full mt-2
                        w-48 rounded-xl
                        bg-white border border-[#E8E3DC]
                        shadow-lg overflow-hidden
                        z-50
                      "
                        >
                          <a
                            href="/profile"
                            onClick={() => setDropdownOpen(false)}
                            className="
                            flex items-center gap-2.5
                            px-4 py-3
                            text-sm text-[#1A1523] font-medium
                            no-underline
                            hover:bg-[rgba(108,60,225,0.05)] hover:text-[#6C3CE1]
                            transition-colors duration-150
                          "
                          >
                            <User size={15} strokeWidth={1.8} />
                            User Profile
                          </a>
                          <button
                            onClick={handleLogout}
                            className="
                            w-full flex items-center gap-2.5
                            px-4 py-3
                            text-sm text-[#E53E3E] font-medium
                            hover:bg-[rgba(229,62,62,0.05)]
                            transition-colors duration-150
                            cursor-pointer border-t border-[#E8E3DC]
                          "
                          >
                            <LogOut size={15} strokeWidth={1.8} />
                            Log out
                          </button>
                        </div>
                      )}
                    </div>{' '}
                    <a
                      href="/register"
                      className="
                        btn-register
                        relative overflow-hidden
                        inline-flex items-center gap-1
                        text-sm font-semibold text-white
                        px-5 py-[0.55rem] rounded-full
                        no-underline whitespace-nowrap
                        transition-transform duration-200
                        hover:-translate-y-px active:translate-y-0
                      "
                      aria-label="Post your car listing"
                    >
                      <span className="relative z-10">Post Your Car</span>
                      <ChevronRight
                        size={13}
                        strokeWidth={2.5}
                        className="relative z-10"
                        aria-hidden="true"
                      />
                    </a>
                  </>
                ) : (
                  /* ── Not logged in: original buttons ── */
                  <>
                    <a
                      href="/login"
                      className="
                        text-sm font-medium text-[#8A8390]
                        px-[1.1rem] py-2 rounded-full
                        border border-transparent
                        no-underline whitespace-nowrap
                        transition-[color,border-color,background-color] duration-200
                        hover:text-[#6C3CE1] hover:border-[rgba(108,60,225,0.22)] hover:bg-[rgba(108,60,225,0.05)]
                      "
                      aria-label="Log in to your account"
                    >
                      Log in
                    </a>

                    <a
                      href="/register"
                      className="
                        btn-register
                        relative overflow-hidden
                        inline-flex items-center gap-1
                        text-sm font-semibold text-white
                        px-5 py-[0.55rem] rounded-full
                        no-underline whitespace-nowrap
                        transition-transform duration-200
                        hover:-translate-y-px active:translate-y-0
                      "
                      aria-label="Post your car listing"
                    >
                      <span className="relative z-10">Post Your Car</span>
                      <ChevronRight
                        size={13}
                        strokeWidth={2.5}
                        className="relative z-10"
                        aria-hidden="true"
                      />
                    </a>
                  </>
                )}
              </nav>
            )}

            {/* Hamburger — mobile only, hidden on auth pages */}
            {!isAuthPage && (
              <button
                className="
                  md:hidden flex items-center justify-center
                  w-9.5 h-9.5 rounded-[10px]
                  border border-[#E8E3DC] bg-transparent
                  text-[#1A1523] cursor-pointer shrink-0
                  transition-[background-color,border-color] duration-180
                  hover:bg-[rgba(108,60,225,0.06)] hover:border-[rgba(108,60,225,0.28)]
                "
                onClick={() => setIsMobileOpen((p) => !p)}
                aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileOpen}
                aria-controls="navbar-mobile-drawer"
              >
                {isMobileOpen ? (
                  <X size={18} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Menu size={18} strokeWidth={2} aria-hidden="true" />
                )}
              </button>
            )}
          </div>

          {/* ── Mobile drawer — hidden on auth pages ── */}
          {!isAuthPage && isMobileOpen && (
            <nav
              id="navbar-mobile-drawer"
              className="drawer-drop md:hidden border-t border-[#E8E3DC] bg-white"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="max-w-7xl mx-auto px-6 pt-3 pb-4 flex flex-col gap-2">
                {checking ? null : user ? (
                  <>
                    <a
                      href="/userprofile"
                      onClick={() => setIsMobileOpen(false)}
                      className="
                        flex items-center justify-center gap-2 w-full
                        text-[0.9rem] font-medium text-[#1A1523]
                        px-4 py-[0.78rem] rounded-xl
                        border border-[#E8E3DC] bg-transparent
                        no-underline
                        transition-[background-color,border-color,color] duration-180
                        hover:bg-[rgba(108,60,225,0.05)] hover:border-[rgba(108,60,225,0.28)] hover:text-[#6C3CE1]
                      "
                    >
                      <User size={15} strokeWidth={1.8} />
                      User Profile
                    </a>
                    <button
                      onClick={handleLogout}
                      className="
                        flex items-center justify-center gap-2 w-full
                        text-[0.9rem] font-medium text-[#E53E3E]
                        px-4 py-[0.78rem] rounded-xl
                        border border-[rgba(229,62,62,0.25)] bg-transparent
                        transition-[background-color,border-color] duration-180
                        hover:bg-[rgba(229,62,62,0.05)]
                        cursor-pointer
                      "
                    >
                      <LogOut size={15} strokeWidth={1.8} />
                      Log out
                    </button>
                  </>
                ) : (
                  <>
                    <a
                      href="/login"
                      className="
                        flex items-center justify-center w-full
                        text-[0.9rem] font-medium text-[#1A1523]
                        px-4 py-[0.78rem] rounded-xl
                        border border-[#E8E3DC] bg-transparent
                        no-underline
                        transition-[background-color,border-color,color] duration-180
                        hover:bg-[rgba(108,60,225,0.05)] hover:border-[rgba(108,60,225,0.28)] hover:text-[#6C3CE1]
                      "
                      onClick={() => setIsMobileOpen(false)}
                      aria-label="Log in to your account"
                    >
                      Log in
                    </a>

                    <a
                      href="/register"
                      className="
                        btn-register
                        relative overflow-hidden
                        flex items-center justify-center gap-1.25 w-full
                        text-[0.9rem] font-semibold text-white
                        px-4 py-[0.78rem] rounded-xl
                        no-underline
                        transition-transform duration-200
                        hover:-translate-y-px active:translate-y-0
                      "
                      onClick={() => setIsMobileOpen(false)}
                      aria-label="Post your car listing"
                    >
                      <span className="relative z-10">Post Your Car</span>
                      <ChevronRight
                        size={13}
                        strokeWidth={2.5}
                        className="relative z-10"
                        aria-hidden="true"
                      />
                    </a>
                  </>
                )}
              </div>
            </nav>
          )}
        </header>
      </div>
    </>
  );
}
