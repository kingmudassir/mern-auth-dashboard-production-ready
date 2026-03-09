import { Car, DollarSign, MessageSquareText, Scale } from "lucide-react";

const CompanyLogo = ({ size = 26, className }) => (
  <img src="/wheel.svg" alt="logo" width={size} height={size} className={className} />
);

const FOOTER_LINKS = [
  {
    title: "Marketplace",
    links: [
      { label: "Buy Cars", icon: <Car size={16} />, href: "#buy" },
      { label: "Sell Cars", icon: <DollarSign size={16} />, href: "#sell" },
      { label: "Compare Cars", icon: <MessageSquareText size={16} />, href: "#compare" },
      { label: "Forums", icon: <Scale size={16} />, href: "#forums" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "#" },
      { label: "Contact", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Cookie Policy", href: "#" },
    ],
  },
];

function Footer() {
  return (
    <footer className="border-t paiyya-nav-border-bottom mt-16">

      <div className="mx-auto max-w-7xl px-6 py-12
                      grid grid-cols-2 gap-x-8 gap-y-10
                      sm:grid-cols-3
                      lg:grid-cols-[auto_1fr_1fr_1fr_auto]
                      lg:items-start">

        {/* Brand — full width on mobile, own column on lg */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-4 max-w-xs">
          <div className="flex items-center gap-3">
            <div className="paiyya-gradient-wrap rounded-lg p-2 shrink-0">
              <CompanyLogo />
            </div>
            <div className="leading-none">
              <h1 className="paiyya-logo-name">Paiyya</h1>
              <span className="paiyya-logo-tagline">Pakistan's Car Marketplace</span>
            </div>
          </div>
          <p className="text-sm paiyya-text-accent leading-relaxed">
            A modern marketplace to buy, sell and compare cars across Pakistan.
          </p>
        </div>

        {/* Link columns — each gets its own explicit grid cell */}
        {FOOTER_LINKS.map((section) => (
          <div key={section.title}>
            <h3 className="font-semibold mb-3 text-[#1A1208] text-sm tracking-wide uppercase">
              {section.title}
            </h3>
            <ul className="space-y-2.5 text-sm paiyya-text-accent">
              {section.links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="flex items-center gap-2 hover:text-red-700 transition-colors">
                    {link.icon && <span className="opacity-70">{link.icon}</span>}
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Connect — own column on lg, wraps naturally on smaller screens */}
        <div>
          <h3 className="font-semibold mb-3 text-[#1A1208] text-sm tracking-wide uppercase">Connect</h3>
          <ul className="space-y-2.5 text-sm paiyya-text-accent">
            <li><a href="#" className="hover:text-red-700 transition-colors">Register</a></li>
            <li><a href="#" className="hover:text-red-700 transition-colors">Contact</a></li>
            <li><a href="#" className="hover:text-red-700 transition-colors">Social</a></li>
          </ul>
        </div>

      </div>

      <div className="border-t paiyya-nav-border-bottom py-5 text-center text-xs paiyya-text-accent">
        © {new Date().getFullYear()} Paiyya. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;