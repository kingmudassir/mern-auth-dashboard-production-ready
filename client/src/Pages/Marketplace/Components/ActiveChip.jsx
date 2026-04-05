import React from 'react';
import { X } from 'lucide-react';

/**
 * ActiveChip Component
 * @param {string} label - The text to display for the active filter
 * @param {function} onRemove - Callback function to remove the filter
 */
export default function ActiveChip({ label, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[0.72rem] font-medium transition-all duration-150"
      style={{
        background: 'rgba(108,60,225,0.08)',
        color: '#6C3CE1',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="focus:outline-none hover:opacity-70 transition-opacity"
        aria-label={`Remove ${label} filter`}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          color: '#6C3CE1',
          padding: 0,
          display: 'flex',
        }}
      >
        <X size={11} strokeWidth={2.5} />
      </button>
    </span>
  );
}
