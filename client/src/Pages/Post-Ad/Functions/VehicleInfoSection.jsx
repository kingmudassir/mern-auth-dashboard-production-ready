// Data Imports
import CAR_DATA from '../../../JSON-DATA/make_model.json';
import CITY_DATA from '../../../JSON-DATA/registeration-cities.json';
import BODY_TYPES_DATA from '../../../JSON-DATA/body_types.json';
import COLORS_DATA from '../../../JSON-DATA/colors.json';
import FUEL_DATA from '../../../JSON-DATA/fuel_types.json';
import TRANSMISSION_DATA from '../../../JSON-DATA/transmissions.json';
import ASSEMBLY_DATA from '../../../JSON-DATA/assemblies.json';
import CONDITION_DATA from '../../../JSON-DATA/conditions.json';

// Component Imports (Update paths to match your folder structure)
import SectionTitle from '../Components/SectionTitle';
import FieldLabel from '../Components/FieldLabel';
import TextInput from '../Components/TextInput';
import FieldError from '../Components/FieldError';
import SectionCard from '../Components/SectionCard';
import SelectInput from '../Components/SelectInput';

// Static Constants
const MAKES = [...Object.keys(CAR_DATA).sort(), 'Other'];
const YEARS = [
  ...Array.from({ length: 2026 - 1970 + 1 }, (_, i) => (2026 - i).toString()),
  'Other',
];
// Data from JSON files
const FUEL_TYPES = FUEL_DATA.FUEL_TYPES || [];
const TRANSMISSIONS = TRANSMISSION_DATA.TRANSMISSIONS || [];
const ASSEMBLIES = ASSEMBLY_DATA.ASSEMBLIES || [];
const CONDITIONS = CONDITION_DATA.CONDITIONS || [];

// Logic-based Constants
const BODY_TYPES = BODY_TYPES_DATA.BODY_TYPES || [];
const COLORS = COLORS_DATA.COLORS || [];

// Flatten Cities Logic
const allCities = Object.values(CITY_DATA).flat();
const REGISTERED_IN = [...new Set(allCities)].sort();
if (!REGISTERED_IN.includes('Un-registered')) REGISTERED_IN.push('Un-registered');

const VehicleInfoSection = ({ fields, errors, set, setFields }) => {
  // Dynamic logic based on current state
  const isOtherSelected = fields.make === 'Other' || fields.model === 'Other';

  const availableModels =
    fields.make && fields.make !== 'Other'
      ? [...(CAR_DATA[fields.make] || []).sort(), 'Other']
      : fields.make === 'Other'
        ? ['Other']
        : [];

  return (
    <SectionCard id="step-vehicle">
      <SectionTitle step="1" sub="Tell buyers what you're selling">
        Vehicle Information
      </SectionTitle>

      {/* Make / Model / Variant */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <FieldLabel required>Make</FieldLabel>
          <SelectInput value={fields.make} onChange={set('make')} error={errors.make}>
            <option value="">Select Make</option>
            {MAKES.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.make} />
        </div>

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

        <div>
          <FieldLabel>Variant</FieldLabel>
          <TextInput
            type="text"
            placeholder={isOtherSelected ? 'Type variant here...' : "Locked (Select 'Other')"}
            value={fields.variant}
            onChange={set('variant')}
            disabled={!isOtherSelected}
            style={{
              backgroundColor: !isOtherSelected ? '#f5f5f5' : 'white',
              cursor: !isOtherSelected ? 'not-allowed' : 'text',
            }}
          />
        </div>
      </div>

      {/* Year / Condition / Body type */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <FieldLabel required>Year</FieldLabel>
          <SelectInput value={fields.year} onChange={set('year')} error={errors.year}>
            <option value="">Select Year</option>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.year} />
        </div>

        <div>
          <FieldLabel required>Condition</FieldLabel>
          <div className="flex gap-2 h-11">
            {CONDITIONS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setFields((p) => ({ ...p, condition: c }))}
                className="flex-1 rounded-xl border text-[0.82rem] font-semibold transition-all duration-150"
                style={{
                  border: fields.condition === c ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
                  background: fields.condition === c ? 'rgba(108,60,225,0.07)' : '#FAFAF9',
                  color: fields.condition === c ? '#6C3CE1' : '#8A8390',
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel required>Body Type</FieldLabel>
          <SelectInput value={fields.bodyType} onChange={set('bodyType')} error={errors.bodyType}>
            <option value="">Select Body Type</option>
            {BODY_TYPES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.bodyType} />
        </div>
      </div>

      {/* Fuel / Transmission / Engine / Assembly */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
        <div>
          <FieldLabel required>Fuel</FieldLabel>
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
            placeholder="e.g. 1600"
            value={fields.engineCC}
            onChange={set('engineCC')}
          />
        </div>

        <div>
          <FieldLabel>Assembly</FieldLabel>
          <div className="flex gap-2 h-11">
            {ASSEMBLIES.map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setFields((p) => ({ ...p, assembly: a }))}
                className="flex-1 rounded-xl border text-[0.78rem] font-semibold transition-all duration-150"
                style={{
                  border: fields.assembly === a ? '1.5px solid #6C3CE1' : '1.5px solid #E8E3DC',
                  background: fields.assembly === a ? 'rgba(108,60,225,0.07)' : '#FAFAF9',
                  color: fields.assembly === a ? '#6C3CE1' : '#8A8390',
                }}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mileage / Color / Registered in */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <FieldLabel required={fields.condition !== 'New'}>
            Mileage (km){fields.condition === 'New' && ' (optional)'}
          </FieldLabel>
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
          <FieldLabel required>Color</FieldLabel>
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
