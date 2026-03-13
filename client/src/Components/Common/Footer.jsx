import { ArrowUpRight, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

const LINKS = {
  browse: [
    { label: 'New Cars', href: '/cars/new' },
    { label: 'Used Cars', href: '/cars/used' },
    { label: 'Bikes', href: '/bikes' },
    { label: 'Commercial', href: '/commercial' },
    { label: 'Electric Vehicles', href: '/cars/ev' },
  ],
  sellers: [
    { label: 'Post Your Car', href: '/register' },
    { label: 'Dealer Accounts', href: '/dealers' },
    { label: 'Pricing Plans', href: '/pricing' },
    { label: 'Seller Tips', href: '/blog/seller-tips' },
  ],
  company: [
    { label: 'About Paiyya', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Contact Us', href: '/contact' },
  ],
  legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

const SOCIALS = [
  { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
  { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter / X' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="cmp-footer-root" role="contentinfo" aria-label="Site footer">
        {/* ── Dark top ── */}
        <div className="cmp-footer-top">
          <div className="cmp-footer-inner">
            <div className="cmp-footer-grid">
              {/* Brand column */}
              <div className="cmp-footer-brand-col">
                <a href="/" className="cmp-footer-logo" aria-label="Paiyya homepage">
                  <img src="/wheel.svg" alt="" className="cmp-footer-logo-img" aria-hidden="true" />
                  <div className="cmp-footer-wordmark">
                    <span>
                      Pai<em>yya</em>
                    </span>
                    <span className="cmp-footer-logo-dot" aria-hidden="true" />
                  </div>
                </a>
                <p className="cmp-footer-tagline">
                  Pakistan's trusted marketplace for buying and selling cars. Find your perfect
                  drive.
                </p>
                <div className="cmp-footer-socials" aria-label="Social media links">
                  {SOCIALS.map(({ icon: Icon, href, label }) => (
                    <a
                      key={label}
                      href={href}
                      className="cmp-footer-social-btn"
                      aria-label={label}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Icon size={15} strokeWidth={1.8} aria-hidden="true" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Browse */}
              <div>
                <p className="cmp-footer-col-heading">Browse</p>
                <ul className="cmp-footer-link-list" aria-label="Browse links">
                  {LINKS.browse.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="cmp-footer-link">
                        {label}
                        <ArrowUpRight size={11} strokeWidth={2} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sellers */}
              <div>
                <p className="cmp-footer-col-heading">Sellers</p>
                <ul className="cmp-footer-link-list" aria-label="Seller links">
                  {LINKS.sellers.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="cmp-footer-link">
                        {label}
                        <ArrowUpRight size={11} strokeWidth={2} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company */}
              <div>
                <p className="cmp-footer-col-heading">Company</p>
                <ul className="cmp-footer-link-list" aria-label="Company links">
                  {LINKS.company.map(({ label, href }) => (
                    <li key={label}>
                      <a href={href} className="cmp-footer-link">
                        {label}
                        <ArrowUpRight size={11} strokeWidth={2} aria-hidden="true" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Rule + CTA strip */}
            <div className="cmp-footer-rule" aria-hidden="true" />
            <div className="cmp-footer-cta-strip">
              <p className="cmp-footer-cta-text">
                <strong>Ready to sell your car?</strong> List it in under 3 minutes — completely
                free.
              </p>
              <a
                href="/register"
                className="cmp-footer-cta-btn"
                aria-label="Post your car listing for free"
              >
                <span>Post Your Car Free</span>
                <ArrowUpRight size={13} strokeWidth={2.5} aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>

        {/* ── Light bottom strip ── */}
        <div className="cmp-footer-bottom">
          <div className="cmp-footer-bottom-inner">
            <p className="cmp-footer-copy">
              © {year} <a href="/">Paiyya</a>. All rights reserved. Made in Pakistan 🇵🇰
            </p>
            <nav className="cmp-footer-legal-links" aria-label="Legal links">
              {LINKS.legal.map(({ label, href }, i) => (
                <span key={label} style={{ display: 'contents' }}>
                  {i > 0 && <span className="cmp-footer-legal-sep" aria-hidden="true" />}
                  <a href={href} className="cmp-footer-legal-link">
                    {label}
                  </a>
                </span>
              ))}
            </nav>
          </div>
        </div>
      </footer>
    </>
  );
}
