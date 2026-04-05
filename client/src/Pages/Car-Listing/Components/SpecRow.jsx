import React from 'react';

/**
 * SpecRow Component
 * Displays a single row of data with an icon, label, and value.
 * * @param {React.ElementType} icon - Lucide icon component
 * @param {string} label - The metadata label (e.g., "Mileage")
 * @param {string|number} value - The actual data value
 */
export default function SpecRow({ icon: Icon, label, value }) {
  if (!value) return null;

  return (
    <div
      className="flex items-center justify-between py-4 group transition-colors hover:bg-[#F7F4F0]/30 px-1 -mx-1 rounded-lg"
      style={{ borderBottom: '1px solid #F7F4F0' }}
    >
      <div className="flex items-center gap-3">
        {/* Icon Wrapper */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
          style={{ background: 'rgba(108,60,225,0.08)' }}
        >
          <Icon size={16} strokeWidth={2} className="text-[#6C3CE1]" aria-hidden="true" />
        </div>

        {/* Label */}
        <span
          className="text-[0.82rem] font-medium tracking-tight"
          style={{
            color: '#8A8390',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </span>
      </div>

      {/* Value */}
      <span
        className="text-[0.875rem] font-bold text-right ml-4"
        style={{
          color: '#1A1523',
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: '60%',
          wordBreak: 'break-word',
          lineHeight: '1.2',
        }}
      >
        {value}
      </span>
    </div>
  );
}
