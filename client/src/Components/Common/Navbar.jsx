import { useState, useEffect } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileOpen]);

  return (
    <>
      <div className="font-dm" role="banner">
        <header
          className={`
            fixed top-0 left-0 right-0 z-50
            transition-[background-color,box-shadow] duration-300
            ${isScrolled ? 'navbar-scrolled' : 'bg-transparent'}
          `}
        >
          {/* ── Main row ── */}
          <div className="max-w-7xl mx-auto px-6 h-16.5 flex items-center justify-between">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center gap-2.25 no-underline shrink-0"
              aria-label="Paiyya — Go to homepage"
            >
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

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1" aria-label="Primary navigation">
              {/* Login pill */}
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

              {/* Register CTA */}
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
            </nav>

            {/* Hamburger — mobile only */}
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
          </div>

          {/* ── Mobile drawer ── */}
          {isMobileOpen && (
            <nav
              id="navbar-mobile-drawer"
              className="drawer-drop md:hidden border-t border-[#E8E3DC] bg-white"
              role="navigation"
              aria-label="Mobile navigation"
            >
              <div className="max-w-7xl mx-auto px-6 pt-3 pb-4 flex flex-col gap-2">
                {/* Mobile login */}
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

                {/* Mobile register */}
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
              </div>
            </nav>
          )}
        </header>
      </div>
    </>
  );
}
