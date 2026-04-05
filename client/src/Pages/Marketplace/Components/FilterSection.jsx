import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * FilterSection Component
 * @param {string} title - The header text for the section
 * @param {ReactNode} children - The filter inputs/content
 * @param {boolean} defaultOpen - Initial accordion state
 */
export default function FilterSection({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="filter-section">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center justify-between w-full py-3 focus:outline-none"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        aria-expanded={open}
      >
        <span
          className="text-[0.72rem] font-bold uppercase tracking-[0.09em]"
          style={{ color: '#8A8390', fontFamily: "'DM Sans', sans-serif" }}
        >
          {title}
        </span>
        <ChevronDown
          size={14}
          strokeWidth={2}
          style={{
            color: '#C4BDD0',
            transition: 'transform 0.2s ease',
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
          aria-hidden="true"
        />
      </button>

      {open && <div className="pb-3 transition-all duration-200 ease-in-out">{children}</div>}
    </div>
  );
}
