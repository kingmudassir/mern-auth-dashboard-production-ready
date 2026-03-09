const Logo = ({ size = 32 }) => (
  <img src="/wheel.svg" alt="logo" width={size} height={size} />
)

const navLinks = [
  { label: "Buy Cars", href: "#", highlight: false },
  { label: "Sell Your Car", href: "#", highlight: true },
  { label: "Compare", href: "#", highlight: false },
  { label: "Forums", href: "#", highlight: false },
];

function Navbar() {
  return (
    <nav className="border-2">
      
      <div className="border-2 border-dashed border-red-500 container mx-auto flex justify-between items-center py-4">

        {/* **********          LOGO          ********** */}
        <a href="/" className="flex items-center gap-2.5 shrink-0 no-underline">
          <Logo />

          <div className="flex flex-col leading-none">
            <div className="oswald font-bold text-3xl tracking-wide text-teal-500">
              Paiyya
            </div>

            <div className="text-gray-400 text-xs tracking-widest uppercase">
              Pakistan's Car Market
            </div>
          </div>
        </a>

        {/* **********          CENTER ITEMS          ********** */}
        <div className="">
          <ul className="flex items-center gap-4">
            {navLinks.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className={
                    item.highlight
                      ? "text-lg font-medium px-4 py-2 rounded-md transition-all duration-150 text-teal-400 border border-teal-500/40 hover:bg-teal-500/10"
                      : "text-lg font-medium px-4 py-2  rounded-md transition-all duration-150 text-gray-400 hover:text-teal-400 hover:bg-teal-500/10"
                  }
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* End Items */}
        <div className="border-2">
          <div className="">
            Register
          </div>
        </div>


      </div>
    </nav>
  )
}

export default Navbar