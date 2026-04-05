import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGetCars } from '../Hooks/Car-MarketPlace/useGetCars';
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Fuel,
  Gauge,
  Calendar,
  Heart,
  ArrowUpDown,
  LayoutGrid,
  List,
  Check,
} from 'lucide-react';
import FilterSection from './Marketplace/Components/FilterSection';
import CheckPill from './Marketplace/Components/CheckPill';
import CarCard from './Marketplace/Components/CarCard';
import SkeletonCard from './Marketplace/Components/SkeletonCard';
import Pagination from './Marketplace/Components/Pagination';
import ActiveChip from './Marketplace/Components/ActiveChip';
import SidebarContent from './Marketplace/Functions/SidebarContent';

// ── Static option lists ───────────────────────────────────────────
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
  'Mitsubishi',
  'Changan',
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
const FUELS = ['Petrol', 'Diesel', 'Hybrid', 'Electric', 'CNG'];
const TRANSMISSIONS = ['Automatic', 'Manual'];
const BODY_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Pickup', 'Van', 'Coupe', 'Crossover'];

const PRICE_BANDS = [
  { label: 'Under 10 Lac', min: 0, max: 1000000 },
  { label: '10 – 20 Lac', min: 1000000, max: 2000000 },
  { label: '20 – 40 Lac', min: 2000000, max: 4000000 },
  { label: '40 – 70 Lac', min: 4000000, max: 7000000 },
  { label: '70 Lac – 1 Crore', min: 7000000, max: 10000000 },
  { label: 'Above 1 Crore', min: 10000000, max: Infinity },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'year_desc', label: 'Newest Year' },
];

const PER_PAGE = 20; // match your controller's default limit

// ── Main component ────────────────────────────────────────────────
export default function CarMarketplace() {
  const [searchParams] = useSearchParams();

  // ── Filter state ──────────────────────────────────────────────
  const [search, setSearch] = useState(searchParams.get('q') ?? '');
  const [selectedMakes, setSelectedMakes] = useState(() =>
    searchParams.get('make') ? [searchParams.get('make')] : []
  );
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') ?? '');
  const [selectedFuels, setSelectedFuels] = useState([]);
  const [selectedTrans, setSelectedTrans] = useState([]);
  const [selectedBody, setSelectedBody] = useState([]);
  const [yearMin, setYearMin] = useState(searchParams.get('year') ?? '');
  const [yearMax, setYearMax] = useState('');
  const [priceBand, setPriceBand] = useState(searchParams.get('price') ?? '');
  const [condition, setCondition] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [view, setView] = useState('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ── Debounce search so we don't fire on every keystroke ───────
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  // Reset to page 1 whenever any filter changes
  // (but not on page change itself — that's intentional)
  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    selectedMakes,
    selectedCity,
    selectedFuels,
    selectedTrans,
    selectedBody,
    yearMin,
    yearMax,
    priceBand,
    condition,
    sortBy,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // ── Build query params for the backend ────────────────────────
  const band = PRICE_BANDS.find((b) => b.label === priceBand);

  const queryParams = {
    ...(debouncedSearch && { model: debouncedSearch }), // backend uses `model` regex — or add a `q` param server-side
    ...(selectedMakes.length === 1 && { make: selectedMakes[0] }), // single make; see note below
    ...(selectedCity && { city: selectedCity }),
    ...(selectedFuels.length === 1 && { fuel: selectedFuels[0] }),
    ...(selectedTrans.length === 1 && { transmission: selectedTrans[0] }),
    ...(selectedBody.length === 1 && { bodyType: selectedBody[0] }),
    ...(condition && { condition }),
    ...(yearMin && { minYear: yearMin }),
    ...(yearMax && { maxYear: yearMax }),
    ...(band && { minPrice: band.min, ...(band.max !== Infinity && { maxPrice: band.max }) }),
    sort: sortBy,
    page,
    limit: PER_PAGE,
  };

  const { data, isLoading, isError, error } = useGetCars(queryParams);

  const cars = data?.cars ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.pages ?? 1;

  // ── Active filter count ───────────────────────────────────────
  const activeFilterCount = [
    selectedMakes.length > 0,
    !!selectedCity,
    selectedFuels.length > 0,
    selectedTrans.length > 0,
    selectedBody.length > 0,
    !!yearMin || !!yearMax,
    !!priceBand,
    !!condition,
  ].filter(Boolean).length;

  const clearAll = () => {
    setSearch('');
    setSelectedMakes([]);
    setSelectedCity('');
    setSelectedFuels([]);
    setSelectedTrans([]);
    setSelectedBody([]);
    setYearMin('');
    setYearMax('');
    setPriceBand('');
    setCondition('');
  };

  const filterProps = {
    // Constants
    MAKES,
    CITIES,
    PRICE_BANDS,
    FUELS,
    TRANSMISSIONS,
    BODY_TYPES,
    // Logic
    activeFilterCount,
    clearAll: () => {
      clearAll();
      setSidebarOpen(false); // Optional: close mobile sidebar on clear
    },
    // States & Setters
    selectedMakes,
    setSelectedMakes,
    selectedCity,
    setSelectedCity,
    priceBand,
    setPriceBand,
    yearMin,
    setYearMin,
    yearMax,
    setYearMax,
    selectedFuels,
    setSelectedFuels,
    selectedTrans,
    setSelectedTrans,
    selectedBody,
    setSelectedBody,
    condition,
    setCondition,
  };

  // ── Sidebar content ───────────────────────────────────────────
  return (
    <div className="cm-page" style={{ paddingTop: '66px' }}>
      {/* Mobile drawer backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(26,21,35,0.5)', backdropFilter: 'blur(2px)' }}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className="fixed top-0 left-0 bottom-0 z-50 lg:hidden overflow-y-auto"
        style={{
          width: '300px',
          background: '#FFFFFF',
          borderRight: '1px solid #E8E3DC',
          padding: '20px 16px',
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        }}
        aria-label="Filter panel"
      >
        <div className="flex items-center justify-between mb-4">
          <span
            className="text-[1rem] font-bold"
            style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
          >
            Filters
          </span>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A8390' }}
            aria-label="Close filters"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>
        <SidebarContent {...filterProps} />
      </div>

      <div className="cm-inner">
        {/* Top bar */}
        <div className="cm-topbar">
          <div className="cm-search-wrap">
            <Search size={15} strokeWidth={2} className="cm-search-icon" aria-hidden="true" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, keyword…"
              className="cm-search-input"
              aria-label="Search cars"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="cm-search-clear"
                aria-label="Clear search"
              >
                <X size={13} strokeWidth={2.5} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3.5 py-2 rounded-xl border text-[0.8rem] font-medium transition-colors duration-150"
              style={{
                borderColor: '#E8E3DC',
                background: '#FFFFFF',
                color: '#1A1523',
                fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label="Open filters"
            >
              <SlidersHorizontal size={14} strokeWidth={2} />
              Filters
              {activeFilterCount > 0 && (
                <span
                  className="w-4 h-4 rounded-full text-white text-[0.6rem] font-bold flex items-center justify-center"
                  style={{ background: '#6C3CE1' }}
                >
                  {activeFilterCount}
                </span>
              )}
            </button>

            <div className="relative cm-sort-wrap">
              <ArrowUpDown size={13} strokeWidth={2} className="cm-sort-icon" aria-hidden="true" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="cm-sort-select"
                aria-label="Sort by"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <div
              className="hidden sm:flex items-center border rounded-xl overflow-hidden"
              style={{ borderColor: '#E8E3DC' }}
            >
              {[
                { id: 'grid', Icon: LayoutGrid },
                { id: 'list', Icon: List },
              ].map(({ id, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setView(id)}
                  className="w-9 h-9 flex items-center justify-center transition-colors duration-150"
                  style={{
                    background: view === id ? '#6C3CE1' : '#FFFFFF',
                    color: view === id ? '#FFFFFF' : '#8A8390',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  aria-label={`${id} view`}
                  aria-pressed={view === id}
                >
                  <Icon size={14} strokeWidth={2} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count + active chips */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <p
            className="text-[0.8rem]"
            style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
          >
            {isLoading ? (
              <span style={{ color: '#C4BDD0' }}>Loading…</span>
            ) : (
              <>
                <span className="font-bold" style={{ color: '#1A1523' }}>
                  {total.toLocaleString()}
                </span>{' '}
                cars found{page > 1 && ` · Page ${page} of ${totalPages}`}
              </>
            )}
          </p>
          {selectedMakes.map((m) => (
            <ActiveChip
              key={m}
              label={m}
              onRemove={() => setSelectedMakes((p) => p.filter((x) => x !== m))}
            />
          ))}
          {selectedCity && <ActiveChip label={selectedCity} onRemove={() => setSelectedCity('')} />}
          {priceBand && <ActiveChip label={priceBand} onRemove={() => setPriceBand('')} />}
          {selectedFuels.map((f) => (
            <ActiveChip
              key={f}
              label={f}
              onRemove={() => setSelectedFuels((p) => p.filter((x) => x !== f))}
            />
          ))}
          {condition && <ActiveChip label={condition} onRemove={() => setCondition('')} />}
          {(yearMin || yearMax) && (
            <ActiveChip
              label={`${yearMin || '…'} – ${yearMax || '…'}`}
              onRemove={() => {
                setYearMin('');
                setYearMax('');
              }}
            />
          )}
        </div>

        {/* Body */}
        <div className="cm-body">
          <aside className="cm-sidebar hidden lg:block" aria-label="Filters">
            <SidebarContent {...filterProps} />
          </aside>

          <main className="cm-results" aria-label="Car listings">
            {isError ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div style={{ fontSize: '3rem', marginBottom: '16px' }} aria-hidden="true">
                  ⚠️
                </div>
                <h3
                  className="text-[1.1rem] font-extrabold mb-2"
                  style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                >
                  Something went wrong
                </h3>
                <p
                  className="text-[0.85rem]"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                >
                  {error?.response?.data?.message ?? 'Could not load listings. Try again.'}
                </p>
              </div>
            ) : isLoading ? (
              view === 'grid' ? (
                <div className="cm-grid">
                  {Array.from({ length: PER_PAGE }).map((_, i) => (
                    <SkeletonCard key={i} view="grid" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} view="list" />
                  ))}
                </div>
              )
            ) : cars.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div style={{ fontSize: '3rem', marginBottom: '16px' }} aria-hidden="true">
                  🔍
                </div>
                <h3
                  className="text-[1.1rem] font-extrabold mb-2"
                  style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                >
                  No cars found
                </h3>
                <p
                  className="text-[0.85rem] mb-5"
                  style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                >
                  Try adjusting your filters or search term.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-[0.82rem] font-semibold text-white px-5 py-2.5 rounded-xl"
                  style={{
                    background: 'linear-gradient(135deg, #E8622A, #C4531F)',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Clear all filters
                </button>
              </div>
            ) : view === 'grid' ? (
              <div className="cm-grid">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} view="grid" />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {cars.map((car) => (
                  <CarCard key={car._id} car={car} view="list" />
                ))}
              </div>
            )}

            {!isLoading && !isError && (
              <Pagination page={page} totalPages={totalPages} onChange={setPage} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
