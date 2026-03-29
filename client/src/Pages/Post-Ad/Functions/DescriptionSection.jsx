import React from 'react';

// Component Imports
import SectionCard from '../Components/SectionCard';
import SectionTitle from '../Components/SectionTitle';
import FieldLabel from '../Components/FieldLabel';
import FieldError from '../Components/FieldError';

const DescriptionSection = ({ fields, errors, set }) => {
  const charCount = fields.description?.length || 0;
  const minChars = 30;

  return (
    <SectionCard id="step-details">
      <SectionTitle step="4" sub="Describe your car honestly — mention any issues too">
        Description
      </SectionTitle>
      <div>
        <FieldLabel required>Ad Description</FieldLabel>
        <textarea
          value={fields.description}
          onChange={set('description')}
          placeholder={`Describe your ${fields.make || 'vehicle'} in detail. Include condition, any recent repairs, accessories, reason for selling, etc.\n\nMinimum ${minChars} characters.`}
          rows={7}
          className="w-full rounded-xl border bg-[#FAFAF9] text-[0.875rem] p-4 outline-none resize-none transition-[border-color,box-shadow] duration-200 focus:border-[rgba(108,60,225,0.4)] focus:shadow-[0_0_0_3px_rgba(108,60,225,0.08)] focus:bg-white"
          style={{
            borderColor: errors.description ? 'rgba(232,98,42,0.5)' : '#E8E3DC',
            color: '#1A1523',
            fontFamily: "'DM Sans', sans-serif",
          }}
          aria-label="Ad description"
          aria-invalid={!!errors.description}
          aria-describedby="desc-count"
        />
        <div className="flex items-center justify-between mt-1">
          <FieldError msg={errors.description} />
          <span
            id="desc-count"
            className="text-[0.68rem] ml-auto"
            style={{
              color: charCount < minChars ? '#E8622A' : '#8A8390',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {charCount} characters
            {charCount < minChars ? ` (${minChars - charCount} more needed)` : ''}
          </span>
        </div>
      </div>
    </SectionCard>
  );
};

export default DescriptionSection;
