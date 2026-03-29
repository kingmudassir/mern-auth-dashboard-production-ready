import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';

const SuccessSection = ({ fields, onReset, onBrowse }) => {
  return (
    <div className="pa-bg min-h-screen flex items-center justify-center px-4 py-20">
      <div className="pa-card success-pop w-full max-w-md rounded-3xl p-10 text-center">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
          style={{ background: 'rgba(108,60,225,0.1)' }}
        >
          <CheckCircle2 size={30} strokeWidth={1.8} style={{ color: '#6C3CE1' }} />
        </div>

        <h2
          className="text-[1.6rem] font-extrabold tracking-[-0.035em] mb-2"
          style={{ color: '#1A1523', fontFamily: "'Syne', sans-serif" }}
        >
          Ad posted!
        </h2>

        <p
          className="text-[0.875rem] leading-relaxed mb-7"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          Your {fields.year} {fields.make} {fields.model} is now live. Buyers can find and contact
          you directly.
        </p>

        <div className="flex flex-col gap-2.5">
          <button
            type="button"
            onClick={onBrowse}
            className="inline-flex items-center justify-center gap-2 w-full text-white text-[0.875rem] font-semibold py-3.5 rounded-xl transition-transform duration-150 hover:-translate-y-px"
            style={{
              background: 'linear-gradient(135deg, #E8622A 0%, #C4531F 100%)',
              boxShadow: '0 2px 12px rgba(232,98,42,0.3)',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Browse Marketplace
            <ArrowRight size={15} strokeWidth={2.2} />
          </button>

          <button
            type="button"
            onClick={onReset}
            className="w-full py-3 rounded-xl text-[0.875rem] font-medium border transition-colors duration-150 hover:bg-gray-50"
            style={{
              color: '#8A8390',
              borderColor: '#E8E3DC',
              background: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Post Another Ad
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuccessSection;
