import React from 'react';
import { MapPin, Phone, Check } from 'lucide-react';

// Data Imports
import CITY_DATA from '../../../JSON-DATA/cities.json';

// Component Imports
import SectionCard from '../Components/SectionCard';
import SectionTitle from '../Components/SectionTitle';
import FieldLabel from '../Components/FieldLabel';
import SelectInput from '../Components/SelectInput';
import TextInput from '../Components/TextInput';
import FieldError from '../Components/FieldError';

// Process city list (removing 'Un-registered' if it exists in this list)
const CITIES = Object.values(CITY_DATA)
  .flat()
  .filter((city) => city !== 'Un-registered')
  .sort();

const LocationContactSection = ({ fields, errors, set }) => {
  return (
    <SectionCard id="step-contact">
      <SectionTitle step="6" sub="Where is the car located and how can buyers reach you">
        Location & Contact
      </SectionTitle>

      {/* City & Area */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <FieldLabel required>City</FieldLabel>
          <SelectInput
            value={fields.city}
            onChange={set('city')}
            error={errors.city}
            aria-label="City"
          >
            <option value="">Select City</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </SelectInput>
          <FieldError msg={errors.city} />
        </div>

        <div>
          <FieldLabel>Area / Neighbourhood</FieldLabel>
          <div className="relative">
            <MapPin
              size={14}
              strokeWidth={1.9}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#C4BDD0' }}
              aria-hidden="true"
            />
            <TextInput
              type="text"
              placeholder="e.g. DHA Phase 5"
              value={fields.area}
              onChange={set('area')}
              style={{ paddingLeft: '38px' }}
              aria-label="Area or neighbourhood"
            />
          </div>
        </div>
      </div>

      {/* Phone & WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Contact Number</FieldLabel>
          <div className="relative">
            <Phone
              size={14}
              strokeWidth={1.9}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: '#C4BDD0' }}
              aria-hidden="true"
            />
            <TextInput
              type="tel"
              placeholder="03001234567"
              value={fields.phone}
              onChange={set('phone')}
              error={errors.phone}
              style={{ paddingLeft: '38px' }}
              autoComplete="tel"
              aria-label="Contact phone number"
            />
          </div>
          <FieldError msg={errors.phone} />
        </div>

        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative flex-shrink-0">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={fields.whatsapp}
                onChange={set('whatsapp')}
                aria-label="WhatsApp available on this number"
              />
              <div
                className="w-5 h-5 rounded-md border flex items-center justify-center transition-[background,border] duration-150"
                style={{
                  border: fields.whatsapp ? 'none' : '1.5px solid #C4BDD0',
                  background: fields.whatsapp ? '#25D366' : 'transparent',
                }}
                aria-hidden="true"
              >
                {fields.whatsapp && <Check size={11} strokeWidth={3} style={{ color: '#fff' }} />}
              </div>
            </div>
            <div>
              <p
                className="text-[0.82rem] font-semibold"
                style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
              >
                WhatsApp available
              </p>
              <p
                className="text-[0.72rem]"
                style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
              >
                Show WhatsApp button on your listing
              </p>
            </div>
          </label>
        </div>
      </div>
    </SectionCard>
  );
};

export default LocationContactSection;
