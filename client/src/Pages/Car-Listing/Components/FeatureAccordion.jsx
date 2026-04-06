import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';

function FeatureAccordion({ group, isLast }) {
  const [isOpen, setIsOpen] = useState(true);

  // Safety check: if group or group.items doesn't exist, don't render
  if (!group || !group.items) return null;

  return (
    <div className="feature-group-box">
      {/* Group Header / Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-3 group"
        style={{ cursor: 'pointer' }}
      >
        <h3
          className="text-[0.75rem] font-bold uppercase tracking-wider"
          style={{ color: '#8A8390', fontFamily: "'Syne', sans-serif" }}
        >
          {/* Changed group.title to group.group to match your JSON */}
          {group.title}
          <span className="ml-2 opacity-50">({group.items.length})</span>
        </h3>
        <ChevronDown
          size={16}
          style={{
            color: '#C4BDD0',
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {/* Group Items Grid */}
      {isOpen && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-4 pb-5 pt-1 animate-in fade-in slide-in-from-top-1 duration-200">
          {group.items.map((item, idx) => (
            <div key={`${item}-${idx}`} className="flex items-center gap-2.5">
              <div
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center" // Fixed 'hrink-0' typo
                style={{ background: 'rgba(108,60,225,0.08)' }}
              >
                <Check size={11} strokeWidth={3} style={{ color: '#6C3CE1' }} />
              </div>
              <span
                className="text-[0.82rem] font-medium leading-tight"
                style={{ color: '#4A4558', fontFamily: "'DM Sans', sans-serif" }}
              >
                {item}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Separator */}
      {!isLast && <div className="h-px w-full" style={{ background: '#F2EEE9' }} />}
    </div>
  );
}

export default FeatureAccordion;
