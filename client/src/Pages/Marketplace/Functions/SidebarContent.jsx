import { X } from 'lucide-react';
import FilterSection from '../Components/FilterSection';
import CheckPill from '../Components/CheckPill';

/**
 * SidebarContent Component
 * @param {Object} props - All filter states and setter functions from the parent
 */
export default function SidebarContent({
  // Constants
  MAKES,
  CITIES,
  PRICE_BANDS,
  FUELS,
  TRANSMISSIONS,
  BODY_TYPES,
  // States & Setters
  activeFilterCount,
  clearAll,
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
}) {
  return (
    <div className="flex flex-col gap-0">
      <div
        className="flex items-center justify-between mb-2 pb-3"
        style={{ borderBottom: '1px solid #F2EEE9' }}
      >
        <span className="text-[0.88rem] font-bold text-[#1A1523] font-['Syne']">Filters</span>
        {activeFilterCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-[0.72rem] font-medium transition-colors duration-150 text-[#E8622A] bg-none border-none cursor-pointer font-['DM_Sans'] focus:outline-none"
          >
            <X size={11} strokeWidth={2.5} />
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterSection title="Make">
        <div className="flex flex-col">
          {MAKES.map((m) => (
            <CheckPill
              key={m}
              label={m}
              checked={selectedMakes.includes(m)}
              onChange={(v) => setSelectedMakes((p) => (v ? [...p, m] : p.filter((x) => x !== m)))}
            />
          ))}
        </div>
      </FilterSection>
      <div className="filter-divider" aria-hidden="true" />

      <FilterSection title="City">
        <div className="flex flex-col">
          {CITIES.map((c) => (
            <CheckPill
              key={c}
              label={c}
              checked={selectedCity === c}
              onChange={(v) => setSelectedCity(v ? c : '')}
            />
          ))}
        </div>
      </FilterSection>
      <div className="filter-divider" aria-hidden="true" />

      <FilterSection title="Price Range">
        <div className="flex flex-col">
          {PRICE_BANDS.map((b) => (
            <CheckPill
              key={b.label}
              label={b.label}
              checked={priceBand === b.label}
              onChange={(v) => setPriceBand(v ? b.label : '')}
            />
          ))}
        </div>
      </FilterSection>
      <div className="filter-divider" aria-hidden="true" />

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
              onChange={(e) => setter(e.target.value)}
              min={2000}
              max={new Date().getFullYear() + 1}
              className="flex-1 h-9 rounded-xl border text-[0.8rem] px-3 outline-none transition-all duration-200 focus:border-[rgba(108,60,225,0.4)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] bg-[#FAFAF9] text-[#1A1523] font-['DM_Sans'] border-[#E8E3DC]"
              aria-label={`Year ${placeholder}`}
            />
          ))}
        </div>
      </FilterSection>
      <div className="filter-divider" aria-hidden="true" />

      <FilterSection title="Fuel Type">
        <div className="flex flex-col">
          {FUELS.map((f) => (
            <CheckPill
              key={f}
              label={f}
              checked={selectedFuels.includes(f)}
              onChange={(v) => setSelectedFuels((p) => (v ? [...p, f] : p.filter((x) => x !== f)))}
            />
          ))}
        </div>
      </FilterSection>
      <div className="filter-divider" aria-hidden="true" />

      <FilterSection title="Transmission">
        <div className="flex flex-col">
          {TRANSMISSIONS.map((t) => (
            <CheckPill
              key={t}
              label={t}
              checked={selectedTrans.includes(t)}
              onChange={(v) => setSelectedTrans((p) => (v ? [...p, t] : p.filter((x) => x !== t)))}
            />
          ))}
        </div>
      </FilterSection>
      <div className="filter-divider" aria-hidden="true" />

      <FilterSection title="Body Type" defaultOpen={false}>
        <div className="flex flex-col">
          {BODY_TYPES.map((b) => (
            <CheckPill
              key={b}
              label={b}
              checked={selectedBody.includes(b)}
              onChange={(v) => setSelectedBody((p) => (v ? [...p, b] : p.filter((x) => x !== b)))}
            />
          ))}
        </div>
      </FilterSection>
      <div className="filter-divider" aria-hidden="true" />

      <FilterSection title="Condition" defaultOpen={false}>
        <div className="flex flex-col">
          {['New', 'Used'].map((c) => (
            <CheckPill
              key={c}
              label={c}
              checked={condition === c}
              onChange={(v) => setCondition(v ? c : '')}
            />
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
