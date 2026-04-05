import React from 'react';

/**
 * SkeletonCard Component
 * @param {string} view - 'grid' or 'list' layout toggle to match CarCard loading state
 */
export default function SkeletonCard({ view }) {
  if (view === 'list') {
    return (
      <div className="car-card-list rounded-2xl overflow-hidden flex animate-pulse border border-[#F2EEE9]">
        <div style={{ width: '220px', background: '#F2EEE9', flexShrink: 0 }} />
        <div className="flex-1 p-5 flex flex-col gap-3 justify-between">
          <div className="flex flex-col gap-2">
            <div
              style={{ height: '18px', width: '60%', background: '#F2EEE9', borderRadius: '8px' }}
            />
            <div
              style={{ height: '13px', width: '35%', background: '#F2EEE9', borderRadius: '8px' }}
            />
            <div className="flex gap-2 mt-2">
              {[80, 100, 90].map((w, i) => (
                <div
                  key={i}
                  style={{
                    height: '26px',
                    width: `${w}px`,
                    background: '#F2EEE9',
                    borderRadius: '999px',
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div
              style={{ height: '22px', width: '100px', background: '#F2EEE9', borderRadius: '8px' }}
            />
            <div
              style={{
                height: '34px',
                width: '100px',
                background: '#F2EEE9',
                borderRadius: '12px',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Grid Skeleton (Default)
  return (
    <div className="car-card-grid rounded-2xl overflow-hidden flex flex-col animate-pulse border border-[#F2EEE9]">
      <div style={{ height: '160px', background: '#F2EEE9' }} />
      <div className="p-4 flex flex-col gap-3">
        <div style={{ height: '16px', width: '70%', background: '#F2EEE9', borderRadius: '8px' }} />
        <div style={{ height: '12px', width: '40%', background: '#F2EEE9', borderRadius: '8px' }} />
        <div className="flex gap-1.5">
          {[60, 80, 70].map((w, i) => (
            <div
              key={i}
              style={{
                height: '22px',
                width: `${w}px`,
                background: '#F2EEE9',
                borderRadius: '999px',
              }}
            />
          ))}
        </div>
        <div style={{ height: '1px', background: '#F2EEE9' }} />
        <div className="flex justify-between">
          <div
            style={{ height: '20px', width: '80px', background: '#F2EEE9', borderRadius: '8px' }}
          />
          <div
            style={{ height: '20px', width: '50px', background: '#F2EEE9', borderRadius: '8px' }}
          />
        </div>
      </div>
    </div>
  );
}
