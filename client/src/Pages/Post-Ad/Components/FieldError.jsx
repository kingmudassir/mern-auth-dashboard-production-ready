import { AlertCircle } from 'lucide-react';

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <span
      className="flex items-center gap-1 text-[0.72rem] mt-1"
      style={{ color: '#E8622A', fontFamily: "'DM Sans', sans-serif" }}
    >
      <AlertCircle size={10} strokeWidth={2} aria-hidden="true" />
      {msg}
    </span>
  );
}
export default FieldError;
