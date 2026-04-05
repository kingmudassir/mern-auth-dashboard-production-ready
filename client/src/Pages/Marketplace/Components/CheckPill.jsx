import React from 'react';
import { Check } from 'lucide-react';

/**
 * CheckPill Component
 * @param {string} label - The text label for the filter option
 * @param {boolean} checked - Whether the option is currently active
 * @param {function} onChange - Callback function returning the new boolean state
 */
export default function CheckPill({ label, checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2 w-full py-1.5 px-0 text-left transition-colors duration-150 focus:outline-none"
      style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      aria-pressed={checked}
    >
      <span
        className="w-4 h-4 rounded-[5px] flex items-center justify-center shrink-0 transition-[background,border] duration-150"
        style={{
          border: checked ? 'none' : '1.5px solid #C4BDD0',
          background: checked ? '#6C3CE1' : 'transparent',
        }}
        aria-hidden="true"
      >
        {checked && <Check size={10} strokeWidth={3} style={{ color: '#fff' }} />}
      </span>
      <span
        className="text-[0.8rem]"
        style={{
          color: checked ? '#1A1523' : '#8A8390',
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: checked ? 600 : 400,
        }}
      >
        {label}
      </span>
    </button>
  );
}
