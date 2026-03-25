import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

// ─────────────────────────────────────────────────────────────────
// 💡 TANSTACK INTEGRATION
//
//  Replace MOCK_CARS + client-side filtering with:
//
//  const { data, isLoading } = useQuery({
//    queryKey: ['cars', filters, page],
//    queryFn: () => axios.get('/api/cars', { params: { ...filters, page, limit: 30 } })
//                        .then(r => r.data),
//    keepPreviousData: true,
//  });
//  const { cars, total, totalPages } = data ?? {};
//
//  Remove the useMemo filtering block and use `cars` directly.
// ─────────────────────────────────────────────────────────────────

// ── Mock data ─────────────────────────────────────────────────────
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
const COLORS = ['White', 'Black', 'Silver', 'Red', 'Blue', 'Grey', 'Brown', 'Green'];

const CAR_NAMES = [
  ['Toyota', 'Corolla', 'Sedan'],
  ['Toyota', 'Fortuner', 'SUV'],
  ['Toyota', 'Yaris', 'Sedan'],
  ['Toyota', 'Hilux', 'Pickup'],
  ['Honda', 'Civic', 'Sedan'],
  ['Honda', 'City', 'Sedan'],
  ['Honda', 'HR-V', 'Crossover'],
  ['Honda', 'BR-V', 'SUV'],
  ['Suzuki', 'Alto', 'Hatchback'],
  ['Suzuki', 'Swift', 'Hatchback'],
  ['Suzuki', 'Cultus', 'Hatchback'],
  ['Suzuki', 'Vitara', 'SUV'],
  ['Hyundai', 'Tucson', 'SUV'],
  ['Hyundai', 'Elantra', 'Sedan'],
  ['Hyundai', 'Sonata', 'Sedan'],
  ['Kia', 'Sportage', 'SUV'],
  ['Kia', 'Picanto', 'Hatchback'],
  ['Kia', 'Stonic', 'Crossover'],
  ['Nissan', 'Sunny', 'Sedan'],
  ['Nissan', 'Dayz', 'Hatchback'],
  ['BMW', '3 Series', 'Sedan'],
  ['BMW', 'X3', 'SUV'],
  ['Mercedes-Benz', 'C-Class', 'Sedan'],
  ['Mercedes-Benz', 'GLC', 'SUV'],
  ['Audi', 'A4', 'Sedan'],
  ['Daihatsu', 'Mira', 'Hatchback'],
  ['Mitsubishi', 'Outlander', 'SUV'],
  ['Changan', 'Alsvin', 'Sedan'],
  ['Changan', 'CS35', 'SUV'],
  ['Toyota', 'Prado', 'SUV'],
];

const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randNum = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const MOCK_CARS = Array.from({ length: 120 }, (_, i) => {
  const [make, model, body] = CAR_NAMES[i % CAR_NAMES.length];
  const year = randNum(2015, 2024);
  const price = randNum(8, 120) * 100000;
  const km = randNum(0, 150000);
  const fuel =
    make === 'BMW' || make === 'Mercedes-Benz' || make === 'Audi'
      ? rand(['Petrol', 'Diesel'])
      : rand(['Petrol', 'Hybrid', 'CNG']);
  return {
    id: i + 1,
    make,
    model,
    bodyType: body,
    year,
    price,
    city: rand(CITIES),
    fuel,
    transmission: rand(TRANSMISSIONS),
    color: rand(COLORS),
    mileage: km,
    condition: km < 10000 ? 'New' : 'Used',
    featured: i % 13 === 0,
    postedAt: `${randNum(1, 30)} days ago`,
    seller: rand(['Ali Khan', 'Sara Ahmed', 'Bilal Motors', 'City Cars', 'Fast Auto']),
  };
});

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
  { value: 'price-asc', label: 'Price: Low → High' },
  { value: 'price-desc', label: 'Price: High → Low' },
  { value: 'mileage-asc', label: 'Lowest Mileage' },
  { value: 'year-desc', label: 'Newest Year' },
];

const PER_PAGE = 30;

// ── Format helpers ────────────────────────────────────────────────
const fmtPrice = (n) => {
  if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(0)} Lac`;
  return `PKR ${n.toLocaleString()}`;
};

const fmtMileage = (n) => (n === 0 ? '0 km' : `${n.toLocaleString()} km`);

// ── Shared primitives ─────────────────────────────────────────────
function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="filter-section">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full py-3"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        aria-expanded={open}
      >
        <span
          className="text-[0.72rem] font-bold uppercase tracking-[0.09em]"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {title}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{
            color: '#C4BDD0',
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          aria-hidden="true"
        />
      </button>
      {open && <div className="pb-3">{children}</div>}
    </div>
  );
}

function CheckPill({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 w-full py-1.5 px-0 text-left transition-colors duration-150"
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      aria-pressed={checked}
    >
      <span
        className="w-4 h-4 rounded-[5px] flex items-center justify-center flex-shrink-0 transition-[background,border] duration-150"
        style={{
          border: checked ? 'none' : '1.5px solid #C4BDD0',
          background: checked ? '#6C3CE1' : 'transparent',
        }}
        aria-hidden="true"
      >
        {checked && <Check size={10} strokeWidth={3} style={{ color: '#fff' }} />}
      </span>
      <span
        className="text-[0.8rem]"
        style={{
          color: checked ? '#1A1523' : '#8A8390',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: checked ? 600 : 400,
        }}
      >
        {label}
      </span>
    </button>
  );
}

// ── Car card ──────────────────────────────────────────────────────
function CarCard({ car, view }) {
  const [liked, setLiked] = useState(false);

  if (view === 'list') {
    return (
      <div className="car-card-list rounded-2xl overflow-hidden flex">
        {/* Image placeholder */}
        <div
          className="flex-shrink-0 flex items-center justify-center relative"
          style={{
            width: '220px',
            background: `linear-gradient(135deg, ${car.featured ? '#1A1523' : '#F2EEE9'} 0%, ${car.featured ? '#231930' : '#EAE5DD'} 100%)`,
          }}
        >
          {car.featured && (
            <span
              className="absolute top-3 left-3 text-[0.62rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
              style={{
                background: '#C9A84C',
                color: '#1A1523',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Featured
            </span>
          )}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem' }} aria-hidden="true">
              🚗
            </div>
            <p
              className="text-[0.7rem] font-semibold mt-1"
              style={{
                color: car.featured ? 'rgba(255,255,255,0.4)' : '#C4BDD0',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {car.year} · {car.color}
            </p>
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <h3
                  className="text-[1rem] font-extrabold tracking-[-0.025em] leading-tight"
                  style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
                >
                  {car.year} {car.make} {car.model}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <MapPin
                    size={11}
                    strokeWidth={2}
                    style={{ color: '#C4BDD0' }}
                    aria-hidden="true"
                  />
                  <span
                    className="text-[0.75rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {car.city}
                  </span>
                  <span style={{ color: '#E8E3DC' }}>·</span>
                  <span
                    className="text-[0.75rem]"
                    style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {car.postedAt}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLiked((p) => !p)}
                className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center transition-colors duration-150"
                style={{ background: liked ? 'rgba(232,98,42,0.1)' : '#F7F4F0' }}
                aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
              >
                <Heart
                  size={14}
                  strokeWidth={2}
                  style={{ color: liked ? '#E8622A' : '#C4BDD0', fill: liked ? '#E8622A' : 'none' }}
                />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { icon: Fuel, val: car.fuel },
                { icon: Gauge, val: fmtMileage(car.mileage) },
                { icon: ArrowUpDown, val: car.transmission },
              ].map(({ icon: Icon, val }) => (
                <span
                  key={val}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-medium"
                  style={{
                    background: '#F2EEE9',
                    color: '#8A8390',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <Icon size={11} strokeWidth={2} aria-hidden="true" />
                  {val}
                </span>
              ))}
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-medium"
                style={{
                  background:
                    car.condition === 'New' ? 'rgba(34,197,94,0.1)' : 'rgba(108,60,225,0.08)',
                  color: car.condition === 'New' ? '#16a34a' : '#6C3CE1',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {car.condition}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p
              className="text-[1.35rem] font-extrabold tracking-[-0.03em]"
              style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
            >
              {fmtPrice(car.price)}
            </p>
            <a
              href={`/cars/${car.id}`}
              className="inline-flex items-center gap-1.5 text-[0.8rem] font-semibold text-white px-4 py-2 rounded-xl transition-transform duration-150 hover:-translate-y-px"
              style={{
                background: 'linear-gradient(135deg, #6C3CE1 0%, #5A2FCA 100%)',
                boxShadow: '0 2px 8px rgba(108,60,225,0.25)',
                textDecoration: 'none',
              }}
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="car-card-grid rounded-2xl overflow-hidden flex flex-col">
      {/* Image area */}
      <div
        className="relative flex items-center justify-center"
        style={{
          height: '160px',
          background: `linear-gradient(135deg, ${car.featured ? '#1A1523' : '#F2EEE9'} 0%, ${car.featured ? '#231930' : '#EAE5DD'} 100%)`,
        }}
      >
        {car.featured && (
          <span
            className="absolute top-3 left-3 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: '#C9A84C', color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
          >
            Featured
          </span>
        )}
        <button
          type="button"
          onClick={() => setLiked((p) => !p)}
          className="absolute top-3 right-3 w-7 h-7 rounded-xl flex items-center justify-center transition-colors duration-150"
          style={{ background: 'rgba(255,255,255,0.9)' }}
          aria-label={liked ? 'Remove from favourites' : 'Add to favourites'}
        >
          <Heart
            size={13}
            strokeWidth={2}
            style={{ color: liked ? '#E8622A' : '#C4BDD0', fill: liked ? '#E8622A' : 'none' }}
          />
        </button>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.8rem' }} aria-hidden="true">
            🚗
          </div>
          <p
            className="text-[0.68rem]"
            style={{
              color: car.featured ? 'rgba(255,255,255,0.35)' : '#C4BDD0',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {car.year} · {car.color}
          </p>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 p-4 flex flex-col gap-3">
        <div>
          <h3
            className="text-[0.92rem] font-extrabold tracking-[-0.025em] leading-tight mb-0.5"
            style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
          >
            {car.year} {car.make} {car.model}
          </h3>
          <div className="flex items-center gap-1">
            <MapPin size={10} strokeWidth={2} style={{ color: '#C4BDD0' }} aria-hidden="true" />
            <span
              className="text-[0.72rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              {car.city} · {car.postedAt}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {[car.fuel, fmtMileage(car.mileage), car.transmission].map((v) => (
            <span
              key={v}
              className="px-2 py-0.5 rounded-full text-[0.68rem] font-medium"
              style={{
                background: '#F2EEE9',
                color: '#8A8390',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {v}
            </span>
          ))}
        </div>

        <div
          className="flex items-center justify-between mt-auto pt-2"
          style={{ borderTop: '1px solid #F2EEE9' }}
        >
          <p
            className="text-[1.05rem] font-extrabold tracking-[-0.03em]"
            style={{ color: '#E8622A', fontFamily: "'Syne', sans-serif" }}
          >
            {fmtPrice(car.price)}
          </p>
          <a
            href={`/cars/${car.id}`}
            className="text-[0.72rem] font-semibold px-3 py-1.5 rounded-lg transition-[background-color,color] duration-150 hover:bg-[rgba(108,60,225,0.1)]"
            style={{
              color: '#6C3CE1',
              textDecoration: 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            View →
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────
function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push('…');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('…');
  if (totalPages > 1) pages.push(totalPages);

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-[background-color,border-color] duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: '#E8E3DC', background: '#FFFFFF', color: '#8A8390' }}
        aria-label="Previous page"
      >
        <ChevronLeft size={15} strokeWidth={2} />
      </button>

      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-[0.8rem]"
            style={{ color: '#C4BDD0' }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="w-9 h-9 rounded-xl text-[0.82rem] font-semibold border transition-all duration-150"
            style={{
              border: page === p ? 'none' : '1.5px solid #E8E3DC',
              background: page === p ? 'linear-gradient(135deg, #6C3CE1, #5A2FCA)' : '#FFFFFF',
              color: page === p ? '#FFFFFF' : '#8A8390',
              boxShadow: page === p ? '0 2px 8px rgba(108,60,225,0.3)' : 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
            aria-current={page === p ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-[background-color,border-color] duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
        style={{ borderColor: '#E8E3DC', background: '#FFFFFF', color: '#8A8390' }}
        aria-label="Next page"
      >
        <ChevronRight size={15} strokeWidth={2} />
      </button>
    </nav>
  );
}

// ── Main component ────────────────────────────────────────────────
export default function CarMarketplace() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial state from URL query params (passed from hero search)
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
  const [view, setView] = useState('grid'); // 'grid' | 'list'
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [page]);

  // Reset page when filters change
  const resetPage = () => setPage(1);

  // Active filter count (for mobile badge)
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

  // ── Client-side filter + sort (replace with useQuery when wiring backend) ──
  const filtered = useMemo(() => {
    let cars = [...MOCK_CARS];

    if (search)
      cars = cars.filter((c) =>
        `${c.make} ${c.model} ${c.year}`.toLowerCase().includes(search.toLowerCase())
      );
    if (selectedMakes.length) cars = cars.filter((c) => selectedMakes.includes(c.make));
    if (selectedCity) cars = cars.filter((c) => c.city === selectedCity);
    if (selectedFuels.length) cars = cars.filter((c) => selectedFuels.includes(c.fuel));
    if (selectedTrans.length) cars = cars.filter((c) => selectedTrans.includes(c.transmission));
    if (selectedBody.length) cars = cars.filter((c) => selectedBody.includes(c.bodyType));
    if (condition) cars = cars.filter((c) => c.condition === condition);
    if (yearMin) cars = cars.filter((c) => c.year >= Number(yearMin));
    if (yearMax) cars = cars.filter((c) => c.year <= Number(yearMax));
    if (priceBand) {
      const band = PRICE_BANDS.find((b) => b.label === priceBand);
      if (band) cars = cars.filter((c) => c.price >= band.min && c.price < band.max);
    }

    switch (sortBy) {
      case 'price-asc':
        cars.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        cars.sort((a, b) => b.price - a.price);
        break;
      case 'mileage-asc':
        cars.sort((a, b) => a.mileage - b.mileage);
        break;
      case 'year-desc':
        cars.sort((a, b) => b.year - a.year);
        break;
      default:
        cars.sort((a, b) => b.id - a.id);
        break;
    }

    return cars;
  }, [
    search,
    selectedMakes,
    selectedCity,
    selectedFuels,
    selectedTrans,
    selectedBody,
    condition,
    yearMin,
    yearMax,
    priceBand,
    sortBy,
  ]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

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
    resetPage();
  };

  // ── Sidebar content (shared between desktop + mobile drawer) ────
  const SidebarContent = () => (
    <div className="flex flex-col gap-0">
      {/* Header */}
      <div
        className="flex items-center justify-between mb-2 pb-3"
        style={{ borderBottom: '1px solid #F2EEE9' }}
      >
        <span
          className="text-[0.88rem] font-bold"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          Filters
        </span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-[0.72rem] font-medium transition-colors duration-150"
            style={{
              color: '#E8622A',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <X size={11} strokeWidth={2.5} />
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Make */}
      <FilterSection title="Make">
        <div className="flex flex-col">
          {MAKES.map((m) => (
            <CheckPill
              key={m}
              label={m}
              checked={selectedMakes.includes(m)}
              onChange={(v) => {
                setSelectedMakes((p) => (v ? [...p, m] : p.filter((x) => x !== m)));
                resetPage();
              }}
            />
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" aria-hidden="true" />

      {/* City */}
      <FilterSection title="City">
        <div className="flex flex-col">
          {CITIES.map((c) => (
            <CheckPill
              key={c}
              label={c}
              checked={selectedCity === c}
              onChange={(v) => {
                setSelectedCity(v ? c : '');
                resetPage();
              }}
            />
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" aria-hidden="true" />

      {/* Price */}
      <FilterSection title="Price Range">
        <div className="flex flex-col">
          {PRICE_BANDS.map((b) => (
            <CheckPill
              key={b.label}
              label={b.label}
              checked={priceBand === b.label}
              onChange={(v) => {
                setPriceBand(v ? b.label : '');
                resetPage();
              }}
            />
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" aria-hidden="true" />

      {/* Year */}
      <FilterSection title="Year">
        <div className="flex gap-2">
          {[
            { placeholder: 'From', value: yearMin, setter: setYearMin },
            { placeholder: 'To', value: yearMax, setter: setYearMax },
          ].map(({ placeholder, value, setter }) => (
            <input
              key={placeholder}
              type="number"
              placeholder={placeholder}
              value={value}
              onChange={(e) => {
                setter(e.target.value);
                resetPage();
              }}
              min={2000}
              max={2025}
              className="flex-1 h-9 rounded-xl border text-[0.8rem] px-3 outline-none transition-[border-color,box-shadow] duration-200 focus:border-[rgba(108,60,225,0.4)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)]"
              style={{
                borderColor: '#E8E3DC',
                background: '#FAFAF9',
                color: '#1A1523',
                fontFamily: "'DM Sans', sans-serif",
              }}
              aria-label={`Year ${placeholder}`}
            />
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" aria-hidden="true" />

      {/* Fuel */}
      <FilterSection title="Fuel Type">
        <div className="flex flex-col">
          {FUELS.map((f) => (
            <CheckPill
              key={f}
              label={f}
              checked={selectedFuels.includes(f)}
              onChange={(v) => {
                setSelectedFuels((p) => (v ? [...p, f] : p.filter((x) => x !== f)));
                resetPage();
              }}
            />
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" aria-hidden="true" />

      {/* Transmission */}
      <FilterSection title="Transmission">
        <div className="flex flex-col">
          {TRANSMISSIONS.map((t) => (
            <CheckPill
              key={t}
              label={t}
              checked={selectedTrans.includes(t)}
              onChange={(v) => {
                setSelectedTrans((p) => (v ? [...p, t] : p.filter((x) => x !== t)));
                resetPage();
              }}
            />
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" aria-hidden="true" />

      {/* Body type */}
      <FilterSection title="Body Type" defaultOpen={false}>
        <div className="flex flex-col">
          {BODY_TYPES.map((b) => (
            <CheckPill
              key={b}
              label={b}
              checked={selectedBody.includes(b)}
              onChange={(v) => {
                setSelectedBody((p) => (v ? [...p, b] : p.filter((x) => x !== b)));
                resetPage();
              }}
            />
          ))}
        </div>
      </FilterSection>

      <div className="filter-divider" aria-hidden="true" />

      {/* Condition */}
      <FilterSection title="Condition" defaultOpen={false}>
        <div className="flex flex-col">
          {['New', 'Used'].map((c) => (
            <CheckPill
              key={c}
              label={c}
              checked={condition === c}
              onChange={(v) => {
                setCondition(v ? c : '');
                resetPage();
              }}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      <style>{STYLES}</style>

      <div className="cm-page" style={{ paddingTop: '66px' }}>
        {/* ── Mobile filter drawer ── */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-40 lg:hidden"
            style={{ background: 'rgba(26,21,35,0.5)', backdropFilter: 'blur(2px)' }}
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
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
          <SidebarContent />
        </div>

        <div className="cm-inner">
          {/* ── Top bar ── */}
          <div className="cm-topbar">
            {/* Search */}
            <div className="cm-search-wrap">
              <Search size={15} strokeWidth={2} className="cm-search-icon" aria-hidden="true" />
              <input
                type="search"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  resetPage();
                }}
                placeholder="Search make, model, keyword…"
                className="cm-search-input"
                aria-label="Search cars"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => {
                    setSearch('');
                    resetPage();
                  }}
                  className="cm-search-clear"
                  aria-label="Clear search"
                >
                  <X size={13} strokeWidth={2.5} />
                </button>
              )}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Mobile filter toggle */}
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

              {/* Sort */}
              <div className="relative cm-sort-wrap">
                <ArrowUpDown
                  size={13}
                  strokeWidth={2}
                  className="cm-sort-icon"
                  aria-hidden="true"
                />
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    resetPage();
                  }}
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

              {/* View toggle */}
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

          {/* Results count + active filters */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            <p
              className="text-[0.8rem]"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
            >
              <span className="font-bold" style={{ color: '#1A1523' }}>
                {filtered.length.toLocaleString()}
              </span>{' '}
              cars found
              {page > 1 && ` · Page ${page} of ${totalPages}`}
            </p>

            {/* Active filter chips */}
            {selectedMakes.map((m) => (
              <ActiveChip
                key={m}
                label={m}
                onRemove={() => {
                  setSelectedMakes((p) => p.filter((x) => x !== m));
                  resetPage();
                }}
              />
            ))}
            {selectedCity && (
              <ActiveChip
                label={selectedCity}
                onRemove={() => {
                  setSelectedCity('');
                  resetPage();
                }}
              />
            )}
            {priceBand && (
              <ActiveChip
                label={priceBand}
                onRemove={() => {
                  setPriceBand('');
                  resetPage();
                }}
              />
            )}
            {selectedFuels.map((f) => (
              <ActiveChip
                key={f}
                label={f}
                onRemove={() => {
                  setSelectedFuels((p) => p.filter((x) => x !== f));
                  resetPage();
                }}
              />
            ))}
            {condition && (
              <ActiveChip
                label={condition}
                onRemove={() => {
                  setCondition('');
                  resetPage();
                }}
              />
            )}
            {(yearMin || yearMax) && (
              <ActiveChip
                label={`${yearMin || '…'} – ${yearMax || '…'}`}
                onRemove={() => {
                  setYearMin('');
                  setYearMax('');
                  resetPage();
                }}
              />
            )}
          </div>

          {/* ── Body ── */}
          <div className="cm-body">
            {/* Desktop sidebar */}
            <aside className="cm-sidebar hidden lg:block" aria-label="Filters">
              <SidebarContent />
            </aside>

            {/* Car grid / list */}
            <main className="cm-results" aria-label="Car listings">
              {paginated.length === 0 ? (
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
                  {paginated.map((car) => (
                    <CarCard key={car.id} car={car} view="grid" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {paginated.map((car) => (
                    <CarCard key={car.id} car={car} view="list" />
                  ))}
                </div>
              )}

              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(p) => {
                  setPage(p);
                }}
              />
            </main>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Active filter chip ────────────────────────────────────────────
function ActiveChip({ label, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-medium"
      style={{
        background: 'rgba(108,60,225,0.08)',
        color: '#6C3CE1',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} filter`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6C3CE1',
          padding: 0,
          display: 'flex',
        }}
      >
        <X size={11} strokeWidth={2.5} />
      </button>
    </span>
  );
}

// ── Styles ────────────────────────────────────────────────────────
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');

  .cm-page {
    background: #F7F4F0;
    min-height: 100vh;
  }

  .cm-inner {
    max-width: 1380px;
    margin: 0 auto;
    padding: 28px 24px 60px;
  }

  /* Top bar */
  .cm-topbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    flex-wrap: wrap;
  }

  .cm-search-wrap {
    position: relative;
    flex: 1;
    min-width: 200px;
    display: flex;
    align-items: center;
    height: 44px;
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 14px;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .cm-search-wrap:focus-within {
    border-color: rgba(108,60,225,0.4);
    box-shadow: 0 0 0 3px rgba(108,60,225,0.08);
  }

  .cm-search-icon {
    position: absolute;
    left: 14px;
    color: #C4BDD0;
    pointer-events: none;
  }

  .cm-search-input {
    flex: 1;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.875rem;
    color: #1A1523;
    padding-left: 40px;
    padding-right: 36px;
    font-family: 'DM Sans', sans-serif;
  }

  .cm-search-input::placeholder { color: #C4BDD0; }

  .cm-search-clear {
    position: absolute;
    right: 12px;
    color: #C4BDD0;
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    padding: 0;
    transition: color 0.15s ease;
  }
  .cm-search-clear:hover { color: #8A8390; }

  /* Sort */
  .cm-sort-wrap {
    position: relative;
    display: flex;
    align-items: center;
    height: 44px;
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 14px;
    min-width: 170px;
    transition: border-color 0.2s ease;
  }

  .cm-sort-wrap:focus-within { border-color: rgba(108,60,225,0.4); }

  .cm-sort-icon {
    position: absolute;
    left: 12px;
    color: #C4BDD0;
    pointer-events: none;
  }

  .cm-sort-select {
    flex: 1;
    height: 100%;
    background: transparent;
    border: none;
    outline: none;
    font-size: 0.82rem;
    font-family: 'DM Sans', sans-serif;
    color: #1A1523;
    padding-left: 34px;
    padding-right: 12px;
    cursor: pointer;
    appearance: none;
    -webkit-appearance: none;
  }

  /* Body layout */
  .cm-body {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  .cm-sidebar {
    width: 224px;
    flex-shrink: 0;
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    border-radius: 20px;
    padding: 16px;
    position: sticky;
    top: 84px;
    max-height: calc(100vh - 100px);
    overflow-y: auto;
  }

  .cm-sidebar::-webkit-scrollbar { width: 4px; }
  .cm-sidebar::-webkit-scrollbar-track { background: transparent; }
  .cm-sidebar::-webkit-scrollbar-thumb { background: #E8E3DC; border-radius: 4px; }

  .cm-results { flex: 1; min-width: 0; }

  /* Grid */
  .cm-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  /* Cards */
  .car-card-grid {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
    transition: box-shadow 0.2s ease, transform 0.2s ease, border-color 0.2s ease;
  }

  .car-card-grid:hover {
    box-shadow: 0 6px 24px rgba(26,21,35,0.1);
    transform: translateY(-2px);
    border-color: rgba(108,60,225,0.2);
  }

  .car-card-list {
    background: #FFFFFF;
    border: 1.5px solid #E8E3DC;
    box-shadow: 0 1px 4px rgba(26,21,35,0.04);
    transition: box-shadow 0.2s ease, border-color 0.2s ease;
  }

  .car-card-list:hover {
    box-shadow: 0 4px 20px rgba(26,21,35,0.08);
    border-color: rgba(108,60,225,0.2);
  }

  /* Filter divider */
  .filter-divider {
    height: 1px;
    background: #F2EEE9;
    margin: 2px 0;
  }

  .filter-section + .filter-section { margin-top: 0; }

  @media (max-width: 640px) {
    .cm-inner { padding: 20px 16px 50px; }
    .cm-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  }

  @media (max-width: 400px) {
    .cm-grid { grid-template-columns: 1fr; }
  }
`;
