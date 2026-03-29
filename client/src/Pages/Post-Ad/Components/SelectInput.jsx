import { ChevronDown } from 'lucide-react';

function SelectInput({ error, children, ...props }) {
  return (
    <div className="relative">
      <select
        className="pa-select"
        style={{ borderColor: error ? 'rgba(232,98,42,0.5)' : undefined }}
        aria-invalid={!!error}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        size={13}
        strokeWidth={2.2}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
        style={{ color: '#C4BDD0' }}
        aria-hidden="true"
      />
    </div>
  );
}
export default SelectInput;
