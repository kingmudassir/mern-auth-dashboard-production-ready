import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Pagination Component
 * @param {number} page - Current active page
 * @param {number} totalPages - Total number of pages available
 * @param {function} onChange - Callback function to handle page change
 */
export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const delta = 2;
  const left = Math.max(2, page - delta);
  const right = Math.min(totalPages - 1, page + delta);

  pages.push(1);
  if (left > 2) pages.push('…');
  for (let i = left; i <= right; i++) pages.push(i);
  if (right < totalPages - 1) pages.push('…');
  if (totalPages > 1) pages.push(totalPages);

  const buttonBaseStyle = {
    borderColor: '#E8E3DC',
    background: '#FFFFFF',
    color: '#8A8390',
  };

  return (
    <nav className="flex items-center justify-center gap-1.5 mt-10" aria-label="Pagination">
      {/* Previous Button */}
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-[background-color,border-color] duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        style={buttonBaseStyle}
        aria-label="Previous page"
      >
        <ChevronLeft size={15} strokeWidth={2} />
      </button>

      {/* Page Numbers */}
      {pages.map((p, i) =>
        p === '…' ? (
          <span
            key={`ellipsis-${i}`}
            className="w-9 h-9 flex items-center justify-center text-[0.8rem]"
            style={{ color: '#C4BDD0' }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            className="w-9 h-9 rounded-xl text-[0.82rem] font-semibold border transition-all duration-150 focus:outline-none"
            style={{
              border: page === p ? 'none' : '1.5px solid #E8E3DC',
              background: page === p ? 'linear-gradient(135deg, #6C3CE1, #5A2FCA)' : '#FFFFFF',
              color: page === p ? '#FFFFFF' : '#8A8390',
              boxShadow: page === p ? '0 2px 8px rgba(108,60,225,0.3)' : 'none',
              fontFamily: "'DM Sans', sans-serif",
            }}
            aria-current={page === p ? 'page' : undefined}
          >
            {p}
          </button>
        )
      )}

      {/* Next Button */}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-xl flex items-center justify-center border transition-[background-color,border-color] duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none"
        style={buttonBaseStyle}
        aria-label="Next page"
      >
        <ChevronRight size={15} strokeWidth={2} />
      </button>
    </nav>
  );
}
