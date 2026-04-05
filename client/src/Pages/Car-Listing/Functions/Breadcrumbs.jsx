import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Breadcrumbs Component
 * Handles back navigation and hierarchical links for the listing page.
 * @param {Object} car - The car data object
 */
export default function Breadcrumbs({ car }) {
  const navigate = useNavigate();

  // Guard clause for when data is still loading
  if (!car) return null;

  const Separator = () => (
    <span className="hidden sm:inline mx-1" style={{ color: '#E8E3DC' }}>
      /
    </span>
  );

  const breadcrumbStyle = {
    color: '#8A8390',
    textDecoration: 'none',
    fontFamily: "'DM Sans', sans-serif",
  };

  return (
    <nav className="flex items-center gap-1.5 mb-6 flex-wrap" aria-label="Breadcrumb">
      {/* Back Button - Visible on all screens */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-[0.82rem] font-bold group transition-colors"
        style={{
          color: '#8A8390',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          padding: '6px 0',
          minHeight: '36px',
        }}
      >
        <ArrowLeft
          size={14}
          strokeWidth={2.5}
          className="group-hover:-translate-x-1 transition-transform"
        />
        <span>Back</span>
      </button>

      {/* Desktop Breadcrumbs */}
      <Separator />

      <a
        href="/"
        className="hidden sm:inline text-[0.78rem] hover:text-[#6C3CE1] transition-colors"
        style={breadcrumbStyle}
      >
        Home
      </a>

      <Separator />

      <a
        href="/cars"
        className="hidden sm:inline text-[0.78rem] hover:text-[#6C3CE1] transition-colors"
        style={breadcrumbStyle}
      >
        Cars
      </a>

      <Separator />

      <a
        href={`/cars?make=${encodeURIComponent(car.make)}`}
        className="hidden sm:inline text-[0.78rem] hover:text-[#6C3CE1] transition-colors"
        style={breadcrumbStyle}
      >
        {car.make}
      </a>

      <Separator />

      <span
        className="hidden sm:inline text-[0.78rem] font-bold"
        style={{ color: '#1A1523', fontFamily: "'DM Sans', sans-serif" }}
      >
        {car.model}
      </span>
    </nav>
  );
}
