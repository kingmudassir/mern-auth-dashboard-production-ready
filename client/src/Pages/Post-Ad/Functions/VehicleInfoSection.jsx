// Data Imports
import CAR_DATA from '../../../JSON-DATA/pakwheels_structure.json';
import CITY_DATA from '../../../JSON-DATA/registeration-cities.json';
import BODY_TYPES_DATA from '../../../JSON-DATA/body_types.json';
import COLORS_DATA from '../../../JSON-DATA/colors.json';
import FUEL_DATA from '../../../JSON-DATA/fuel_types.json';
import TRANSMISSION_DATA from '../../../JSON-DATA/transmissions.json';
import ASSEMBLY_DATA from '../../../JSON-DATA/assemblies.json';
import CONDITION_DATA from '../../../JSON-DATA/conditions.json';

// Hook
import { useVariants } from '../../../Hooks/Post-Ad/useVariants';

// Component Imports
import SectionTitle from '../Components/SectionTitle';
import FieldLabel from '../Components/FieldLabel';
import TextInput from '../Components/TextInput';
import FieldError from '../Components/FieldError';
import SectionCard from '../Components/SectionCard';
import SelectInput from '../Components/SelectInput';

// ── Static Constants ──────────────────────────────────────────────

// pakwheels_structure.json is year-keyed: { "2026": { "Toyota": { models: [...] } } }
// Build a unified makes list from all years, deduplicated and sorted.
const ALL_MAKES_SET = new Set();
// Iterating over each year (e.g., "2026", "2025")
Object.keys(CAR_DATA).forEach((makeName) => {
  // Add the key itself (e.g., "Toyota") to the set
  ALL_MAKES_SET.add(makeName);
});
const MAKES = [...ALL_MAKES_SET].sort();
MAKES.push('Other');

const YEARS = [
  ...Array.from({ length: 2026 - 1940 + 1 }, (_, i) => (2026 - i).toString()),
  'Other',
];

const FUEL_TYPES = FUEL_DATA.FUEL_TYPES || [];
const TRANSMISSIONS = TRANSMISSION_DATA.TRANSMISSIONS || [];
const ASSEMBLIES = ASSEMBLY_DATA.ASSEMBLIES || [];
const CONDITIONS = CONDITION_DATA.CONDITIONS || [];
const BODY_TYPES = BODY_TYPES_DATA.BODY_TYPES || [];
const COLORS = COLORS_DATA.COLORS || [];

const allCities = Object.values(CITY_DATA).flat();
const REGISTERED_IN = [...new Set(allCities)].sort();
if (!REGISTERED_IN.includes('Un-registered')) REGISTERED_IN.push('Un-registered');

// ── Helper: extract engine CC number from a string like "1800 cc" ─
function parseEngineCC(engineStr) {
  if (!engineStr) return '';
  const match = String(engineStr).match(/\d+/);
  return match ? match[0] : '';
}

// ── Component ─────────────────────────────────────────────────────

/**
 * VehicleInfoSection
 *
 * Props:
 *   fields      - current form state object
 *   errors      - validation errors object
 *   set         - (key) => (event) => void  — standard field setter from PostAd
 *   setFields   - full state setter for batch updates (autofill)
 *   setFeatures - (features: string[]) => void — for autofilling feature checkboxes
 */
const VehicleInfoSection = ({ fields, errors, set, setFields, setFeatures }) => {
  // ── Derived: models for the selected year + make ──────────────
  const availableModels =
    fields.make && CAR_DATA[fields.make]
      ? [...CAR_DATA[fields.make].models.map((m) => m.name).sort(), 'Other']
      : fields.make === 'Other'
        ? ['Other']
        : [];

  // ── Dynamic variant fetching ──────────────────────────────────
  const { data: variantOptions = [], isFetching: variantsLoading } = useVariants(
    fields.make,
    fields.model,
    fields.year
  );

  // Build the <select> options list. We always include "Other" as escape hatch.
  const variantSelectOptions =
    variantOptions.length > 0 ? [...variantOptions.map((v) => v.variant_name), 'Other'] : ['Other'];

  // ── Autofill when a variant is selected ───────────────────────
  const handleVariantChange = (e) => {
    const selectedName = e.target.value;

    if (!selectedName || selectedName === 'Other') {
      setFields((p) => ({ ...p, variant: selectedName }));
      return;
    }

    const match = variantOptions.find((v) => v.variant_name === selectedName);

    if (match) {
      setFields((p) => ({
        ...p,
        variant: selectedName,
        // Autofill specs — only overwrite if the field is currently empty
        // so the user doesn't lose manual edits on re-selection.
        engineCC: parseEngineCC(match.specs?.engine) || p.engineCC,
        transmission: match.specs?.transmission || p.transmission,
        fuel: match.specs?.fuel || p.fuel,
        // Assembly isn't in specs — leave as-is
      }));

      // Autofill features if the parent gave us a setter
      if (typeof setFeatures === 'function' && Array.isArray(match.features)) {
        setFeatures(match.features);
      }
    } else {
      setFields((p) => ({ ...p, variant: selectedName }));
    }
  };

  // ── Reset model + variant when make changes ───────────────────
  const handleMakeChange = (e) => {
    const newMake = e.target.value;
    setFields((p) => ({ ...p, make: newMake, model: '', variant: '' }));
  };

  // ── Reset model + variant when year changes ───────────────────
  const handleYearChange = (e) => {
    const newYear = e.target.value;
    setFields((p) => ({ ...p, year: newYear, make: '', model: '', variant: '' }));
  };

  const isOtherMake = fields.make === 'Other';
  const isOtherModel = fields.model === 'Other';

  return (
    <SectionCard id="step-vehicle">
      <SectionTitle step="1" sub="Provide accurate details to get better leads">
        Vehicle Information
      </SectionTitle>

      {/* ── Cluster 1: Identity (Year → Make → Model → Variant) ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Year */}
        <div>
          <FieldLabel required>Year</FieldLabel>
          <SelectInput value={fields.year} onChange={handleYearChange} error={errors.year}>
            <option value="">Select Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.year} />
        </div>

        {/* Make */}
        <div>
          <FieldLabel required>Make</FieldLabel>
          <SelectInput
            value={fields.make}
            onChange={handleMakeChange}
            error={errors.make}
            disabled={!fields.year}
          >
            <option value="">Select Make</option>
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.make} />
        </div>

        {/* Model */}
        <div>
          <FieldLabel required>Model</FieldLabel>
          <SelectInput
            value={fields.model}
            onChange={set('model')}
            error={errors.model}
            disabled={!fields.make}
          >
            <option value="">Select Model</option>
            {availableModels.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.model} />
        </div>

        {/* Variant — populated from backend via useVariants */}
        <div>
          <FieldLabel>
            Variant
            {variantsLoading && (
              <span className="ml-2 text-[0.65rem] font-medium" style={{ color: '#6C3CE1' }}>
                loading…
              </span>
            )}
          </FieldLabel>

          {/* Show the select if we're not in "Other" make/model territory */}
          {!isOtherMake && !isOtherModel ? (
            <SelectInput
              value={fields.variant}
              onChange={handleVariantChange}
              error={errors.variant}
              disabled={!fields.model || variantsLoading}
            >
              <option value="">
                {variantOptions.length === 0 && !variantsLoading && fields.model
                  ? 'No variants found — select Other'
                  : 'Select Variant'}
              </option>
              {variantSelectOptions.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </SelectInput>
          ) : (
            // Other make/model: free-text input
            <TextInput
              placeholder="Enter variant (optional)"
              value={fields.variant || ''}
              onChange={set('variant')}
            />
          )}

          {/* Custom variant free-text when "Other" is selected in the dropdown */}
          {fields.variant === 'Other' && !isOtherMake && !isOtherModel && (
            <div className="mt-2 animate-in fade-in duration-300">
              <TextInput
                placeholder="Specify variant…"
                value={fields.customVariant || ''}
                onChange={set('customVariant')}
              />
            </div>
          )}

          {/* Autofill confirmation badge */}
          {fields.variant &&
            fields.variant !== 'Other' &&
            variantOptions.find((v) => v.variant_name === fields.variant) && (
              <p className="text-[0.65rem] mt-1 font-medium" style={{ color: '#059669' }}>
                ✓ Specs auto-filled from variant data
              </p>
            )}
        </div>
      </div>

      <hr className="mb-6 border-[#E8E3DC]" />

      {/* ── Cluster 2: Mechanical Specs ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div>
          <FieldLabel required>Fuel Type</FieldLabel>
          <SelectInput value={fields.fuel} onChange={set('fuel')} error={errors.fuel}>
            <option value="">Select</option>
            {FUEL_TYPES.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.fuel} />
        </div>

        <div>
          <FieldLabel required>Transmission</FieldLabel>
          <SelectInput
            value={fields.transmission}
            onChange={set('transmission')}
            error={errors.transmission}
          >
            <option value="">Select</option>
            {TRANSMISSIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.transmission} />
        </div>

        <div>
          <FieldLabel>Engine (CC)</FieldLabel>
          <TextInput
            type="number"
            placeholder="e.g. 1300"
            value={fields.engineCC}
            onChange={set('engineCC')}
          />
        </div>

        <div>
          <FieldLabel>Assembly</FieldLabel>
          <div className="flex gap-1 h-11 bg-[#F5F5F4] p-1 rounded-xl">
            {ASSEMBLIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setFields((p) => ({ ...p, assembly: a }))}
                className="flex-1 rounded-lg text-[0.75rem] font-bold transition-all"
                style={{
                  background: fields.assembly === a ? '#FFF' : 'transparent',
                  color: fields.assembly === a ? '#6C3CE1' : '#8A8390',
                  boxShadow: fields.assembly === a ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Cluster 3: Condition & Aesthetics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="sm:col-span-1 lg:col-span-1">
          <FieldLabel required>Condition</FieldLabel>
          <div className="flex gap-1 h-11 bg-[#F5F5F4] p-1 rounded-xl">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFields((p) => ({ ...p, condition: c }))}
                className="flex-1 rounded-lg text-[0.75rem] font-bold transition-all"
                style={{
                  background: fields.condition === c ? '#FFF' : 'transparent',
                  color: fields.condition === c ? '#6C3CE1' : '#8A8390',
                  boxShadow: fields.condition === c ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel required={fields.condition !== 'New'}>Mileage (km)</FieldLabel>
          <TextInput
            type="number"
            placeholder="e.g. 45000"
            value={fields.mileage}
            onChange={set('mileage')}
            error={errors.mileage}
          />
          <FieldError msg={errors.mileage} />
        </div>

        <div>
          <FieldLabel required>Body Type</FieldLabel>
          <SelectInput value={fields.bodyType} onChange={set('bodyType')} error={errors.bodyType}>
            <option value="">Select</option>
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.bodyType} />
        </div>

        <div>
          <FieldLabel required>Exterior Color</FieldLabel>
          <SelectInput value={fields.color} onChange={set('color')} error={errors.color}>
            <option value="">Select Color</option>
            {COLORS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.color} />
        </div>

        <div>
          <FieldLabel>Registered In</FieldLabel>
          <SelectInput
            value={fields.registeredIn}
            onChange={set('registeredIn')}
            error={errors.registeredIn}
          >
            <option value="">Select City</option>
            {REGISTERED_IN.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.registeredIn} />
        </div>
      </div>
    </SectionCard>
  );
};

export default VehicleInfoSection;
