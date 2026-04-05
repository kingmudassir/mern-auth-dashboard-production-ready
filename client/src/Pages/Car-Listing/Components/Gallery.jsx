import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Gallery Component
 * * @param {Array} images - Array of objects with { url, publicId }
 * @param {string} make - Vehicle make for alt tags/placeholder
 * @param {string} model - Vehicle model
 * @param {string|number} year - Vehicle year
 */
export default function Gallery({ images = [], make, model, year }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const count = images.length || 1;
  const hasRealImages = images.length > 0;
  const currentUrl = hasRealImages ? images[active]?.url : null;

  // Background gradients for placeholder mode
  const BG_GRADIENTS = [
    ['#1A1523', '#231930'],
    ['#F2EEE9', '#EAE5DD'],
    ['#1F1A2E', '#2D2440'],
    ['#F7F4F0', '#EDE8E2'],
    ['#1A1523', '#1F1A2E'],
    ['#EDE8E2', '#E8E3DC'],
    ['#231930', '#2D2440'],
  ];

  const getBgGradient = (i) => {
    const pair = BG_GRADIENTS[i % BG_GRADIENTS.length];
    return `linear-gradient(135deg, ${pair[0]}, ${pair[1]})`;
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setLightbox(false);
      if (lightbox) {
        if (e.key === 'ArrowLeft') setActive((p) => (p - 1 + count) % count);
        if (e.key === 'ArrowRight') setActive((p) => (p + 1) % count);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightbox, count]);

  // Sub-components
  const Placeholder = ({ size = '6rem' }) => (
    <div className="text-center select-none">
      <div style={{ fontSize: size }} aria-hidden="true">
        🚗
      </div>
      <p
        style={{
          color: 'rgba(255,255,255,0.35)',
          fontSize: '0.75rem',
          fontFamily: "'DM Sans', sans-serif",
          marginTop: '6px',
        }}
      >
        {year} {make} {model}
      </p>
    </div>
  );

  const NavBtn = ({ onClick, label, children, style = {} }) => (
    <button
      type="button"
      onClick={onClick}
      className="absolute top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl flex items-center justify-center transition-colors hover:bg-white/25"
      style={{
        background: 'rgba(255,255,255,0.15)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        zIndex: 10,
        ...style,
      }}
      aria-label={label}
    >
      {children}
    </button>
  );

  return (
    <>
      {/* Lightbox Overlay */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10"
          style={{ background: 'rgba(26,21,35,0.98)' }}
          onClick={() => setLightbox(false)}
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20 transition-colors"
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Lightbox Controls */}
          <button
            type="button"
            className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setActive((p) => (p - 1 + count) % count);
            }}
          >
            <ChevronLeft size={28} />
          </button>

          <div
            className="relative max-w-5xl w-full h-full flex items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {currentUrl ? (
              <img
                src={currentUrl}
                alt={`${year} ${make} ${model} gallery`}
                className="max-w-full max-h-full object-contain shadow-2xl"
              />
            ) : (
              <Placeholder size="8rem" />
            )}
          </div>

          <button
            type="button"
            className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center bg-white/10 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              setActive((p) => (p + 1) % count);
            }}
          >
            <ChevronRight size={28} />
          </button>

          <div className="absolute bottom-8 text-white/60 font-medium">
            {active + 1} / {count}
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="w-full">
        {/* Hero Image Section */}
        <div
          className="aspect-video rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden group shadow-lg"
          style={{ background: currentUrl ? '#0D0B12' : getBgGradient(active) }}
          onClick={() => setLightbox(true)}
          role="button"
          tabIndex={0}
          aria-label="Open photo gallery"
          onKeyDown={(e) => e.key === 'Enter' && setLightbox(true)}
        >
          {currentUrl ? (
            <img
              src={currentUrl}
              alt={`${year} ${make} ${model}`}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <Placeholder />
          )}

          {count > 1 && (
            <>
              <NavBtn
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((p) => (p - 1 + count) % count);
                }}
                label="Previous photo"
                style={{ left: '12px' }}
              >
                <ChevronLeft size={18} />
              </NavBtn>
              <NavBtn
                onClick={(e) => {
                  e.stopPropagation();
                  setActive((p) => (p + 1) % count);
                }}
                label="Next photo"
                style={{ right: '12px' }}
              >
                <ChevronRight size={18} />
              </NavBtn>
            </>
          )}

          <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full text-[0.72rem] font-bold bg-black/60 text-white backdrop-blur-md">
            {active + 1} / {count}
          </div>

          {!currentUrl && (
            <p className="absolute bottom-3 left-3 text-[0.72rem] text-white/30 italic">
              tap to expand
            </p>
          )}
        </div>

        {/* Thumbnails Row */}
        {count > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.publicId || i}
                type="button"
                onClick={() => setActive(i)}
                className={`relative shrink-0 rounded-xl overflow-hidden transition-all duration-200 ${
                  i === active
                    ? 'ring-2 ring-[#E8622A] opacity-100'
                    : 'opacity-60 hover:opacity-100'
                }`}
                style={{ width: '80px', height: '60px', background: '#0D0B12' }}
                aria-label={`View photo ${i + 1}`}
                aria-pressed={i === active}
              >
                <img
                  src={img.url}
                  alt={`Thumbnail ${i + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
