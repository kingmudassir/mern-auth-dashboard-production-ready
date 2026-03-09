import { Car, DollarSign, MessageSquareText, Scale, User, Menu, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';


const CompanyLogo = ({size = 26, className }) => (
  <img src="/wheel.svg" alt="logo" width={size} height={size} className={className}/>
)

const NAV_LINKS = [
  {
    label: "Buy Cars",
    href: "#buy",
    icon: <Car size={16}/>,
    highlighted: false
  },

  {
    label: "Sell Cars",
    href: "#sell",
    icon: <DollarSign size={16}/>,
    highlighted: true
  },

  {
    label: "Compare",
    href: "#compare",
    icon: <MessageSquareText size={16}/>,
    highlighted: false
  },

  {
    label: "Forums",
    href: "#forums",
    icon: <Scale size={16}/>,
    highlighted: false
  },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    // Main navbar
<nav className="border-b paiyya-nav-border-bottom">

  {/* Inner main navbar */}
  <div className="flex justify-between items-center container mx-auto max-w-7xl px-4 py-2">

    {/* Logo and text */}
    <div className="group flex justify-center items-center space-x-1 shrink-0">
      <div className="paiyya-gradient-wrap rounded-lg p-2">
        <CompanyLogo className="transition-all duration-300 group-hover:rotate-360"/>
      </div>

      <div className="leading-none">
        <h1 className="paiyya-logo-name">
          Paiyya
        </h1>

        <span className="text-xs paiyya-logo-tagline">
          Pakistan's Car Marketplace
        </span>
      </div>
    </div>

    {/* Middle Items */}
    <ul className="hidden lg:flex justify-between items-center space-x-5 text-xs paiyya-text-accent">
      {NAV_LINKS.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className={`relative flex items-center justify-center gap-1 p-3 rounded-lg ${item.highlighted ? "bg-red-50 text-red-700 hover:bg-red-100 hover:text-red-800" : "hover:bg-red-100 hover:text-red-800"}`}
        >
          <span>{item.icon}</span>
          {item.label}
          <span className="paiyya-nav-link-dot" />
        </a>
      ))}
    </ul>

    {/* End Items */}
    <div className="hidden lg:flex justify-center items-center space-x-1 px-4 py-2 paiyya-gradient-wrap text-white rounded-xl hover:scale-105 transition-transform text-sm">
      <User size={16} className=''/>
      <span>Register</span>
    </div>

    {/* Mobile Screens / Small Screens */}
    <div className="lg:hidden">
      <Menu onClick={toggleMenu} className='text-black cursor-pointer'/>
    </div>
  </div>

  <div
    ref={menuRef}
    className={`paiyya-text-accent lg:hidden fixed top-0 right-0 h-full w-full md:w-1/2 bg-white border z-50 transition-transform duration-300
      ${menuOpen ? "translate-x-0" : "translate-x-full"}`}
  >
    <div className="flex items-center justify-end px-4 pt-4 border-b pb-[17.2px]">
      <X onClick={toggleMenu} className="text-black cursor-pointer" />
    </div>

    <ul className="flex flex-col p-4 space-y-3">
      {NAV_LINKS.map((item) => (
        <li key={item.label} className="paiyya-text-accent rounded-lg hover:bg-red-100 hover:text-red-800">
          <a
            href={item.href}
            className="flex items-center gap-2 p-3 rounded-lg hover:bg-red-100"
          >
            <span className="paiyya-gradient-wrap text-black w-7 h-7 rounded-lg flex items-center justify-center">
              {item.icon}
            </span> 
            {item.label}
          </a>
        </li>
      ))}
    </ul>

    <div className="p-4 flex justify-center w-full items-center">
      <div className="max-w-2xl w-full flex justify-center items-center space-x-1 paiyya-gradient-wrap text-white rounded-xl hover:scale-105 transition-transform text-sm p-3">
        <User size={16}/>
        <span>Register</span>
      </div>
    </div>
  </div>
</nav>
  )
}

export default Navbar