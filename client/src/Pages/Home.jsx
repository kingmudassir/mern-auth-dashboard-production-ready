import { useState } from 'react';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  ChevronDown,
  X,
  TrendingUp,
  Shield,
  Clock,
} from 'lucide-react';

// ── Static data ──────────────────────────────────────────────
const MAKES = [
  'Toyota',
  'Honda',
  'Suzuki',
  'Hyundai',
  'Kia',
  'Nissan',
  'BMW',
  'Mercedes-Benz',
  'Audi',
  'Daihatsu',
];
const CITIES = [
  'Karachi',
  'Lahore',
  'Islamabad',
  'Rawalpindi',
  'Faisalabad',
  'Peshawar',
  'Quetta',
  'Multan',
];
const YEAR_RANGE = Array.from({ length: 26 }, (_, i) => 2025 - i);
const PRICE_RANGES = [
  'Under 10 Lac',
  '10–20 Lac',
  '20–40 Lac',
  '40–70 Lac',
  '70 Lac – 1 Crore',
  'Above 1 Crore',
];
const TRENDING = ['Toyota Corolla', 'Honda Civic', 'Suzuki Alto', 'Hyundai Tucson', 'Kia Sportage'];
const STATS = [
  { icon: TrendingUp, value: '24,000+', label: 'Active Listings' },
  { icon: Shield, value: 'Verified', label: 'Seller Profiles' },
  { icon: Clock, value: 'Daily', label: 'New Arrivals' },
];

// ── Reusable select ───────────────────────────────────────────
function FilterSelect({ placeholder, options, value, onChange }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          appearance-none w-full h-full
          bg-transparent
          text-[0.82rem] font-medium text-[#1A1523]
          pl-3 pr-7 py-0
          border-0 outline-none cursor-pointer
          focus:ring-0
        "
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        size={13}
        strokeWidth={2.2}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#8A8390] pointer-events-none"
      />
    </div>
  );
}

// ── Main component ────────────────────────────────────────────
function Home() {
  const [query, setQuery] = useState('');
  const [make, setMake] = useState('');
  const [city, setCity] = useState('');
  const [year, setYear] = useState('');
  const [price, setPrice] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const activeFilterCount = [make, city, year, price].filter(Boolean).length;

  const handleSearch = (e) => {
    e.preventDefault();
    // wire up to router / API
    console.log({ query, make, city, year, price });
  };

  const clearAll = () => {
    setMake('');
    setCity('');
    setYear('');
    setPrice('');
    setQuery('');
  };

  return (
    <>
      <style>{`
        /* Fonts already loaded by Navbar — no duplicate import needed if used together.
           Included here so Hero works standalone too. */
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

        :root {
          --paiyya-ink:     #1A1523;
          --paiyya-border:  #E8E3DC;
          --paiyya-muted:   #8A8390;
          --paiyya-violet:  #6C3CE1;
          --paiyya-ember:   #E8622A;
          --paiyya-ember-d: #C4531F;
          --paiyya-gold:    #C9A84C;
        }

        /* ── Background mesh ── */
        .hero-bg {
          background-color: #F7F4F0;
          background-image:
            radial-gradient(ellipse 70% 55% at 15% 40%, rgba(108,60,225,0.07) 0%, transparent 70%),
            radial-gradient(ellipse 50% 40% at 85% 20%, rgba(232,98,42,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 40% 30% at 60% 90%, rgba(201,168,76,0.06) 0%, transparent 60%);
        }

        /* ── Grid texture overlay ── */
        .hero-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(26,21,35,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,21,35,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        /* ── Headline ── */
        .hero-headline {
          font-family: 'Syne', sans-serif;
          font-weight: 800;
          line-height: 1.07;
          letter-spacing: -0.04em;
          color: var(--paiyya-ink);
        }

        .hero-headline-accent {
          position: relative;
          color: var(--paiyya-violet);
          display: inline-block;
        }

        /* Underline squiggle */
        .hero-headline-accent::after {
          content: '';
          position: absolute;
          bottom: -6px;
          left: 0; right: 0;
          height: 4px;
          border-radius: 999px;
          background: linear-gradient(90deg, var(--paiyya-ember), var(--paiyya-gold));
          opacity: 0.7;
        }

        /* ── Search box ── */
        .search-box {
          background: #FFFFFF;
          border: 1.5px solid var(--paiyya-border);
          box-shadow: 0 4px 24px rgba(26,21,35,0.07), 0 1px 4px rgba(26,21,35,0.04);
          transition: box-shadow 0.2s ease, border-color 0.2s ease;
        }

        .search-box:focus-within {
          border-color: rgba(108,60,225,0.35);
          box-shadow: 0 4px 24px rgba(26,21,35,0.07), 0 0 0 4px rgba(108,60,225,0.08);
        }

        /* Search input */
        .search-input {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          color: var(--paiyya-ink);
          background: transparent;
          border: none;
          outline: none;
          width: 100%;
        }

        .search-input::placeholder { color: #B0AABA; }

        /* Dividers between filter chips */
        .filter-divider {
          width: 1px;
          height: 28px;
          background: var(--paiyya-border);
          flex-shrink: 0;
        }

        /* ── Search button ── */
        .btn-search {
          background: linear-gradient(135deg, var(--paiyya-ember) 0%, var(--paiyya-ember-d) 100%);
          box-shadow: 0 2px 10px rgba(232,98,42,0.3);
          transition: transform 0.18s ease, box-shadow 0.18s ease, filter 0.18s ease;
          position: relative;
          overflow: hidden;
        }

        .btn-search::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, #D4521C 0%, #AA3E12 100%);
          opacity: 0;
          transition: opacity 0.18s ease;
          border-radius: inherit;
        }

        .btn-search:hover::before { opacity: 1; }
        .btn-search:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 20px rgba(232,98,42,0.4);
        }
        .btn-search:active { transform: translateY(0); }

        /* ── Filter panel ── */
        .filter-panel {
          animation: filterDrop 0.2s cubic-bezier(0.4,0,0.2,1) both;
        }

        @keyframes filterDrop {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Stat cards ── */
        .stat-card {
          background: rgba(255,255,255,0.75);
          border: 1px solid rgba(232,227,220,0.8);
          backdrop-filter: blur(8px);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(26,21,35,0.08);
        }

        /* ── Trending pills ── */
        .trending-pill {
          font-family: 'DM Sans', sans-serif;
          font-size: 0.78rem;
          font-weight: 500;
          color: #5A4E6E;
          background: rgba(108,60,225,0.07);
          border: 1px solid rgba(108,60,225,0.14);
          transition: background-color 0.18s ease, color 0.18s ease, border-color 0.18s ease, transform 0.18s ease;
          cursor: pointer;
        }

        .trending-pill:hover {
          background: rgba(108,60,225,0.13);
          color: var(--paiyya-violet);
          border-color: rgba(108,60,225,0.28);
          transform: translateY(-1px);
        }

        /* ── Entrance animations ── */
        .hero-fade-up {
          animation: heroFadeUp 0.55s cubic-bezier(0.4,0,0.2,1) both;
        }

        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .delay-1 { animation-delay: 0.08s; }
        .delay-2 { animation-delay: 0.16s; }
        .delay-3 { animation-delay: 0.24s; }
        .delay-4 { animation-delay: 0.32s; }
        .delay-5 { animation-delay: 0.4s; }

        /* ── Floating badge ── */
        .floating-badge {
          background: linear-gradient(135deg, #1A1523 0%, #2D2440 100%);
          box-shadow: 0 4px 16px rgba(26,21,35,0.2);
          animation: badgeFloat 3s ease-in-out infinite;
        }

        @keyframes badgeFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-5px); }
        }
      `}</style>

      <section className="hero-bg relative overflow-hidden pt-[66px]" aria-label="Search for cars">
        {/* ── Decorative blobs ── */}
        <div
          className="absolute top-12 right-[8%] w-64 h-64 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(232,98,42,0.08) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-[5%] w-80 h-48 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(201,168,76,0.07) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-[1280px] mx-auto px-6 py-16 md:py-24">
          {/* ── Badge ── */}
          <div className="hero-fade-up flex justify-center mb-6">
            <span
              className="floating-badge inline-flex items-center gap-2 text-white text-[0.75rem] font-medium px-4 py-1.5 rounded-full"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] flex-shrink-0"
                aria-hidden="true"
              />
              Pakistan's Trusted Car Marketplace
            </span>
          </div>

          {/* ── Headline ── */}
          <div className="hero-fade-up delay-1 text-center mb-4">
            <h1 className="hero-headline text-[2.6rem] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[5rem]">
              Find Your
              <br />
              <span className="hero-headline-accent">Perfect Drive</span>
            </h1>
          </div>

          {/* ── Sub ── */}
          <div className="hero-fade-up delay-2 text-center mb-10 md:mb-12">
            <p
              className="text-[#8A8390] text-[1rem] md:text-[1.1rem] max-w-[480px] mx-auto leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Browse thousands of verified cars across Pakistan — from budget hatchbacks to premium
              SUVs.
            </p>
          </div>

          {/* ── Search + Filter box ── */}
          <div className="hero-fade-up delay-3 max-w-[780px] mx-auto mb-6">
            <form onSubmit={handleSearch} aria-label="Car search form">
              {/* Main search row */}
              <div className="search-box rounded-2xl p-2 flex items-center gap-2">
                {/* Search icon + input */}
                <div className="flex items-center gap-3 flex-1 pl-3 min-w-0">
                  <Search
                    size={18}
                    strokeWidth={2}
                    className="text-[#8A8390] flex-shrink-0"
                    aria-hidden="true"
                  />
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by make, model, or keyword…"
                    className="search-input"
                    aria-label="Search cars"
                  />
                  {query && (
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="flex-shrink-0 text-[#8A8390] hover:text-[#1A1523] transition-colors duration-150"
                      aria-label="Clear search"
                    >
                      <X size={15} strokeWidth={2} />
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="filter-divider hidden sm:block" aria-hidden="true" />

                {/* City quick-select */}
                <div className="hidden sm:block w-[130px] h-9">
                  <div className="flex items-center gap-1.5 h-full pl-1">
                    <MapPin
                      size={13}
                      strokeWidth={2}
                      className="text-[#8A8390] flex-shrink-0"
                      aria-hidden="true"
                    />
                    <FilterSelect
                      placeholder="All Cities"
                      options={CITIES}
                      value={city}
                      onChange={setCity}
                    />
                  </div>
                </div>

                {/* Divider */}
                <div className="filter-divider hidden sm:block" aria-hidden="true" />

                {/* Filter toggle */}
                <button
                  type="button"
                  onClick={() => setFiltersOpen((p) => !p)}
                  className={`
                    hidden sm:flex items-center gap-1.5
                    text-[0.82rem] font-medium px-3 py-2 rounded-xl
                    border transition-all duration-200 flex-shrink-0
                    ${
                      filtersOpen || activeFilterCount > 0
                        ? 'text-[#6C3CE1] border-[rgba(108,60,225,0.3)] bg-[rgba(108,60,225,0.06)]'
                        : 'text-[#8A8390] border-[#E8E3DC] bg-transparent hover:text-[#1A1523] hover:border-[#C4B8B0]'
                    }
                  `}
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  aria-expanded={filtersOpen}
                  aria-controls="hero-filter-panel"
                  aria-label="Toggle advanced filters"
                >
                  <SlidersHorizontal size={14} strokeWidth={2} aria-hidden="true" />
                  Filters
                  {activeFilterCount > 0 && (
                    <span className="w-4 h-4 rounded-full bg-[#6C3CE1] text-white text-[0.65rem] font-semibold flex items-center justify-center leading-none">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Search submit */}
                <button
                  type="submit"
                  className="btn-search relative overflow-hidden flex items-center gap-2 text-white text-[0.875rem] font-semibold px-5 py-2.5 rounded-xl flex-shrink-0"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                  aria-label="Search cars"
                >
                  <Search
                    size={15}
                    strokeWidth={2.2}
                    className="relative z-10"
                    aria-hidden="true"
                  />
                  <span className="relative z-10 hidden sm:inline">Search</span>
                </button>
              </div>

              {/* ── Expanded filter panel ── */}
              {filtersOpen && (
                <div
                  id="hero-filter-panel"
                  className="filter-panel mt-2 bg-white border border-[#E8E3DC] rounded-2xl p-4"
                  style={{ boxShadow: '0 4px 20px rgba(26,21,35,0.06)' }}
                >
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Make */}
                    <div>
                      <label
                        className="block text-[0.7rem] font-semibold text-[#8A8390] uppercase tracking-wider mb-1.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Make
                      </label>
                      <div className="relative border border-[#E8E3DC] rounded-xl h-10 bg-[#FAFAF9] hover:border-[#C4B8B0] transition-colors duration-150">
                        <FilterSelect
                          placeholder="Any Make"
                          options={MAKES}
                          value={make}
                          onChange={setMake}
                        />
                      </div>
                    </div>

                    {/* Year */}
                    <div>
                      <label
                        className="block text-[0.7rem] font-semibold text-[#8A8390] uppercase tracking-wider mb-1.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Year
                      </label>
                      <div className="relative border border-[#E8E3DC] rounded-xl h-10 bg-[#FAFAF9] hover:border-[#C4B8B0] transition-colors duration-150">
                        <FilterSelect
                          placeholder="Any Year"
                          options={YEAR_RANGE.map(String)}
                          value={year}
                          onChange={setYear}
                        />
                      </div>
                    </div>

                    {/* Price */}
                    <div>
                      <label
                        className="block text-[0.7rem] font-semibold text-[#8A8390] uppercase tracking-wider mb-1.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Price Range
                      </label>
                      <div className="relative border border-[#E8E3DC] rounded-xl h-10 bg-[#FAFAF9] hover:border-[#C4B8B0] transition-colors duration-150">
                        <FilterSelect
                          placeholder="Any Price"
                          options={PRICE_RANGES}
                          value={price}
                          onChange={setPrice}
                        />
                      </div>
                    </div>

                    {/* City (mobile) */}
                    <div className="sm:hidden">
                      <label
                        className="block text-[0.7rem] font-semibold text-[#8A8390] uppercase tracking-wider mb-1.5"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        City
                      </label>
                      <div className="relative border border-[#E8E3DC] rounded-xl h-10 bg-[#FAFAF9] hover:border-[#C4B8B0] transition-colors duration-150">
                        <FilterSelect
                          placeholder="All Cities"
                          options={CITIES}
                          value={city}
                          onChange={setCity}
                        />
                      </div>
                    </div>

                    {/* Clear filters */}
                    {activeFilterCount > 0 && (
                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={clearAll}
                          className="
                            flex items-center gap-1.5 h-10 px-4
                            text-[0.82rem] font-medium text-[#E8622A]
                            border border-[rgba(232,98,42,0.25)] rounded-xl
                            bg-[rgba(232,98,42,0.05)]
                            hover:bg-[rgba(232,98,42,0.1)] hover:border-[rgba(232,98,42,0.4)]
                            transition-all duration-150 w-full justify-center
                          "
                          style={{ fontFamily: "'DM Sans', sans-serif" }}
                          aria-label="Clear all filters"
                        >
                          <X size={13} strokeWidth={2} />
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* ── Trending searches ── */}
          <div className="hero-fade-up delay-4 flex flex-wrap items-center justify-center gap-2 mb-14 md:mb-20">
            <span
              className="text-[0.75rem] text-[#8A8390] font-medium mr-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Trending:
            </span>
            {TRENDING.map((term) => (
              <button
                key={term}
                type="button"
                onClick={() => setQuery(term)}
                className="trending-pill px-3 py-1 rounded-full"
                aria-label={`Search for ${term}`}
              >
                {term}
              </button>
            ))}
          </div>

          {/* ── Stats row ── */}
          <div className="hero-fade-up delay-5">
            <div className="grid grid-cols-3 gap-3 max-w-[500px] mx-auto">
              {STATS.map(({ icon: Icon, value, label }) => (
                <div
                  key={label}
                  className="stat-card rounded-2xl px-4 py-4 flex flex-col items-center text-center gap-1.5"
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    className="text-[#6C3CE1] opacity-80"
                    aria-hidden="true"
                  />
                  <span
                    className="text-[1rem] font-bold text-[#1A1523] leading-none"
                    style={{ fontFamily: "'Syne', sans-serif", letterSpacing: '-0.02em' }}
                  >
                    {value}
                  </span>
                  <span
                    className="text-[0.72rem] text-[#8A8390] font-medium leading-tight"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Bottom fade into page ── */}
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, rgba(247,244,240,0.6))' }}
          aria-hidden="true"
        />
      </section>
    </>
  );
}

export default Home;
