import React from 'react';
import { Check } from 'lucide-react'; // Or your specific icon library

// Component Imports
import SectionCard from '../Components/SectionCard';
import SectionTitle from '../Components/SectionTitle';
import FieldLabel from '../Components/FieldLabel';
import TextInput from '../Components/TextInput';
import FieldError from '../Components/FieldError';

const PriceSection = ({ fields, errors, set }) => {
  // Logic to format PKR into Lac/Crore for better readability
  const getPriceInWords = (price) => {
    const num = Number(price);
    if (!num || isNaN(num) || num <= 0) return null;

    if (num >= 10000000) {
      return `${(num / 10000000).toFixed(2)} Crore`;
    } else if (num >= 100000) {
      return `${(num / 100000).toFixed(1)} Lac`;
    }
    return null;
  };

  const priceInWords = getPriceInWords(fields.price);

  return (
    <SectionCard id="step-price">
      <SectionTitle step="5" sub="Set your asking price in PKR">
        Price
      </SectionTitle>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <FieldLabel required>Asking Price (PKR)</FieldLabel>
          <div className="relative">
            <span
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[0.8rem] font-semibold pointer-events-none"
              style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
              aria-hidden="true"
            >
              PKR
            </span>
            <TextInput
              type="number"
              placeholder="e.g. 2500000"
              value={fields.price}
              onChange={set('price')}
              error={errors.price}
              min={0}
              style={{ paddingLeft: '52px' }}
              aria-label="Asking price in PKR"
            />
          </div>
          <FieldError msg={errors.price} />

          {priceInWords && (
            <p
              className="text-[0.72rem] mt-1 font-medium animate-fadeIn"
              style={{ color: '#6C3CE1', fontFamily: "'DM Sans', sans-serif" }}
            >
              ≈ {priceInWords}
            </p>
          )}
        </div>

        {/* Negotiable Checkbox */}
        <div className="flex items-end pb-0.5">
          <label className="flex items-center gap-3 cursor-pointer group">
            <div className="relative shrink-0">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={fields.negotiable}
                onChange={set('negotiable')}
                aria-label="Price is negotiable"
              />
              <div
                className="w-5 h-5 rounded-md border transition-[background,border] duration-150 flex items-center justify-center"
                style={{
                  border: fields.negotiable ? 'none' : '1.5px solid #C4BDD0',
                  background: fields.negotiable ? '#6C3CE1' : 'transparent',
                }}
              >
                {fields.negotiable && <Check size={11} strokeWidth={3} style={{ color: '#fff' }} />}
              </div>
            </div>
            <div>
              <p
                className="text-[0.82rem] font-semibold"
                style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
              >
                Price is negotiable
              </p>
              <p
                className="text-[0.72rem]"
                style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
              >
                Buyers will know they can make an offer
              </p>
            </div>
          </label>
        </div>
      </div>
    </SectionCard>
  );
};

export default PriceSection;
