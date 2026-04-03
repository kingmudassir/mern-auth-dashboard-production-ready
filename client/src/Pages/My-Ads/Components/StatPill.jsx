import React from 'react';

const StatPill = ({ icon: Icon, value, label }) => {
  return (
    <div
      className="flex items-center gap-3 rounded-2xl px-5 py-4"
      style={{
        background: '#FFFFFF',
        border: '1.5px solid #E8E3DC',
        minWidth: 'fit-content',
      }}
    >
      {/* Icon Container */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: 'rgba(108,60,225,0.07)' }}
      >
        {Icon && (
          <Icon size={16} strokeWidth={1.8} style={{ color: '#6C3CE1' }} aria-hidden="true" />
        )}
      </div>

      {/* Text Content */}
      <div>
        <p
          className="text-[1.15rem] font-extrabold tracking-[-0.03em] leading-none"
          style={{
            color: '#1A1523',
            fontFamily: "'Syne', sans-serif",
          }}
        >
          {value}
        </p>
        <p
          className="text-[0.68rem] mt-0.5"
          style={{
            color: '#8A8390',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          {label}
        </p>
      </div>
    </div>
  );
};

export default StatPill;
