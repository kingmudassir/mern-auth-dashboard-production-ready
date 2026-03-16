import { AlertCircle } from 'lucide-react';

// ── Field wrapper ────────────────────────────────────────────────
export function Field({ label, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="text-[0.72rem] font-semibold text-[#8A8390] uppercase tracking-wider"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        {label}
      </label>
      {children}
      {error && (
        <span
          className="flex items-center gap-1 text-[0.75rem] text-[#E8622A]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
          role="alert"
        >
          <AlertCircle size={11} strokeWidth={2} aria-hidden="true" />
          {error}
        </span>
      )}
    </div>
  );
}
